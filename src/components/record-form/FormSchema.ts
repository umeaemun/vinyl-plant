
import * as z from "zod";

export const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  catalogueNumber: z.string().optional(),
  quantity: z.string(),
  size: z.string(),
  type: z.string(),
  weight: z.string(),
  colour: z.string(),
  centreLabels: z.string(),
  innerSleeve: z.string(),
  jacket: z.string(),
  inserts: z.string(),
  shrinkWrap: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  plantName: z.string().min(2, { message: "Plant name is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  country: z.string().min(2, { message: "Country is required" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
