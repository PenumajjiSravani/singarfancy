import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                await connectDB();
                const user = await User.findOne({ email: credentials.email.toLowerCase() });
                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],

    callbacks: {
        async signIn({ user, account }) {
            // For Google sign-in, upsert user into MongoDB
            if (account?.provider === "google") {
                await connectDB();
                const existing = await User.findOne({ email: user.email! });
                if (!existing) {
                    await User.create({
                        name: user.name,
                        email: user.email,
                        provider: "google",
                        role: "user",
                    });
                }
            }
            return true;
        },

        async jwt({ token, user, account }) {
            if (user) {
                // On initial sign-in, fetch from DB to get role
                await connectDB();
                const dbUser = await User.findOne({ email: token.email });
                token.id = dbUser?._id.toString() ?? token.sub;
                token.role = dbUser?.role ?? "user";
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as "user" | "admin";
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
