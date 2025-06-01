
import * as z from "zod";

export const formSchema = z.object({
  name: z.string({ message: "Name is required" }).min(2, "Name must be at least 2 characters"),
  email: z.string().email({ message: "Please enter a valid email address" }),
  quantity: z.string(),
  size: z.string(),
  type: z.string(),
  weight: z.string(),
  colour: z.string(),
  innerSleeve: z.string(),
  jacket: z.string(),
  inserts: z.string(),
  shrinkWrap: z.string(),
  splitManufacturing: z.boolean().optional(),
  location1: z.string().optional(),
  quantity1: z.number().optional(),
  location2: z.string().optional(),
  quantity2: z.number().optional(),
  location3: z.string().optional(),
  quantity3: z.number().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const buyerRegisterSchema = z.object({
  role: z.enum(["buyer"]),    
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  username: z.string().min(2, "Username is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const manufacturerRegisterSchema = z.object({
  role: z.enum(["manufacturer"]),    
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  username: z.string().min(2, "Username is required"),
  plantName: z.string().min(2, { message: "Plant name is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  country: z.string().min(2, { message: "Country is required" }),

}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type BuyerRegisterFormValues = z.infer<typeof buyerRegisterSchema>;
export type ManufacturerRegisterFormValues = z.infer<typeof manufacturerRegisterSchema>;
