
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { buyerRegisterSchema, manufacturerRegisterSchema, BuyerRegisterFormValues, ManufacturerRegisterFormValues } from "@/components/record-form/FormSchema";
import { UserPlus, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RegisterFormProps {
  onSubmit: (formData: BuyerRegisterFormValues | ManufacturerRegisterFormValues) => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<"buyer" | "manufacturer">("buyer");

  const form = useForm<BuyerRegisterFormValues | ManufacturerRegisterFormValues>({
    resolver: zodResolver(role === "buyer" ? buyerRegisterSchema : manufacturerRegisterSchema),
    defaultValues: role == "buyer" ?
      {
        role: "buyer",
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
      } : {
        role: "manufacturer",
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
        plantName: "",
        location: "",
        country: ""
      }
  });

  const handleSubmit = async (values: BuyerRegisterFormValues | ManufacturerRegisterFormValues) => {
    setError(null);

    try {
      await onSubmit(values);
      form.reset();
    } catch (error: any) {
      console.error("Error in registration form submission:", error);
      setError(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="buyer"
                      checked={field.value === "buyer"}
                      onChange={() => {
                        field.onChange("buyer")
                        setRole("buyer");
                      }}
                    />
                    <span>Buyer</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="manufacturer"
                      checked={field.value === "manufacturer"}
                      onChange={() => {
                        field.onChange("manufacturer")
                        setRole("manufacturer");
                      }}
                    />
                    <span>Manufacturer</span>
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Choose a username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        {form.watch("role") === "manufacturer" && (
          <div className="border-t border-gray-200 my-4 pt-4">
            <h3 className="text-sm font-medium mb-3">Plant Information</h3>

            <FormField
              control={form.control}
              name="plantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Pressing Plant Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (City)</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Create Profile
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
