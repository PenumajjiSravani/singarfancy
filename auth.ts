import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "singar-fancy-premium-nextauth-secret-key-12345",
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // Default role is user. We can simulate roles for custom workflows
        token.role = user.email?.startsWith("admin") ? "ADMIN" : "CUSTOMER";
      }
      return token;
    },
    session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
});
