import * as z from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().min(6, "Postal code must be at least 6 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

export type AddressFormData = z.infer<typeof addressSchema>;
