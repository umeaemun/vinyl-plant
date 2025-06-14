
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plant } from '@/data/plants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import emailjs from 'emailjs-com';
import { useCurrency } from '@/contexts/CurrencyContext';
import { OrderSummary } from '@/data/plants';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


interface PersonalDetailsFormProps {
  selectedPlant: Plant | null;
  orderSummary: OrderSummary;
  allOptionsValid?: any;
}

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  // lastName: z.string(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(5, { message: "Please enter a valid phone number." }),
  companyLabel: z.string().optional(),
  address1: z.string().min(3, { message: "Address is required." }),
  address2: z.string().optional(),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State/Province is required." }),
  postalCode: z.string().min(3, { message: "Postal/Zip code is required." }),
  country: z.string().min(2, { message: "Country is required." }),
  comments: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PersonalDetailsForm = ({ selectedPlant, orderSummary, allOptionsValid }: PersonalDetailsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, session, userProfile } = useAuth();
  const { currency } = useCurrency();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyLabel: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      comments: "",
    },
  });

  useEffect(() => {
    // Pre-fill the form with user profile data if available
    if (userProfile) {
      const firstName = userProfile.username?.split(" ")[0] || "";
      const lastName = userProfile.username?.split(" ")[1] || "";
      const address = `${userProfile.address_street} ${userProfile.address_city || ""}`.trim();

      form.reset({
        firstName: firstName,
        lastName: lastName,
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        companyLabel: userProfile.company || "",
        address1: address || "",
        address2: userProfile.address2 || "",
        city: userProfile.city || "",
        state: userProfile.address_state || "",
        postalCode: userProfile.address_postal_code || "",
        country: userProfile.country || "",
        comments: userProfile.comments || "",
      });
    }
  }, [userProfile, form]);

  function sendEmailToAdmin(orderData) {

    const templateParams = {
      image_url: orderData.image_url,
      plant_name: orderData.plant_name,
      units: orderData.quantity,
      price: orderData.perUnit,
      total: orderData.total,
      email: "joelwoodsnz@gmail.com",
    };

    // console.log("Sending email with params:", templateParams);


    // emailjs.send("service_ub4n5aj", "template_dp8pbcf",
    emailjs.send("service_squbmun", "template_qzrl81q",
      templateParams,
      "FZ2o2qSKeDHybPLnz"
    )
      .then((response) => {
        console.log('Admin Email sent successfully:', response.text);
      })
      .catch((err) => {
        console.error('Admin Email sending failed:', err);
      });
  }

  function sendEmailToBuyer(orderData) {

    const templateParams = {
      image_url: orderData.image_url,
      plant_name: orderData.plant_name,
      units: orderData.quantity,
      price: orderData.perUnit,
      total: orderData.total,
      email: orderData.email,
    };

    // console.log("Sending buyer email with params:", templateParams);


    // emailjs.send("service_ub4n5aj", "template_q1x90oa",
    emailjs.send("service_squbmun", "template_e3p5old",
      templateParams,
      "FZ2o2qSKeDHybPLnz"
    )
      .then((response) => {
        console.log('Buyer Email sent successfully:', response.text);
      })
      .catch((err) => {
        console.error('Buyer Email sending failed:', err);
      });
  }


  const onSubmit = async (values: FormValues) => {

    if (!user || !userProfile || !session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your order.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // console.log("personal details Form values:", values);

      // Get the vinyl specs from localStorage
      const vinylFormData = localStorage.getItem('vinylFormData');
      const vinylSpecs = vinylFormData ? JSON.parse(vinylFormData) : null;
      if (!vinylSpecs) {
        toast({
          title: "No Vinyl Specs Found",
          description: "Please fill out the vinyl specifications before submitting your order.",
          variant: "destructive",
        });
        return;
      }

      const personalDetails = values;
      const selectedPlantId = selectedPlant?.id || localStorage.getItem('selectedPlantId');


      // submit the order data to supabase
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            plant_id: selectedPlantId,
            user_id: userProfile?.id,
            status: 'pending',
            plant_name: selectedPlant?.name || "",
            currency: currency.code || "USD",
            per_unit: orderSummary.perUnit || "",
            total: vinylSpecs.quantity * (orderSummary.perUnit || 0) || "",
            quantity: parseInt(vinylSpecs.quantity),
            size: vinylSpecs.size,
            type: vinylSpecs.type,
            weight: vinylSpecs.weight,
            colour: vinylSpecs.colour,
            inner_sleeve: vinylSpecs.innerSleeve,
            jacket: vinylSpecs.jacket,
            inserts: vinylSpecs.inserts,
            shrink_wrap: vinylSpecs.shrinkWrap,
            split_manufacturing: orderSummary.splitManufacturing,
            split_manufacturing_details: orderSummary.splitManufacturingDetails,
            first_name: personalDetails.firstName,
            last_name: personalDetails.lastName,
            company: personalDetails.companyLabel,
            email: userProfile?.email,
            phone: personalDetails.phone,
            address_1: personalDetails.address1,
            address_2: personalDetails.address2,
            city: personalDetails.city,
            state: personalDetails.state,
            postal_code: personalDetails.postalCode,
            country: personalDetails.country,
            comments: personalDetails.comments,
          },
        ])
        .select('*')
        .single();

      if (error) {
        console.error("Error submitting order:", error);
        toast({
          title: "Submission failed",
          description: "There was a problem submitting your order. Please try again.",
          variant: "destructive",
        });
        return;
      }
      console.log("Order submitted successfully:", data);

      // send email to admin
      await sendEmailToAdmin({
        plant_name: selectedPlant?.name || "",
        image_url: selectedPlant?.image_url || "",
        quantity: vinylSpecs.quantity,
        perUnit: data.per_unit,
        total: data.total,
      });

      // send email to buyer
      await sendEmailToBuyer({
        plant_name: selectedPlant?.name || "",
        image_url: selectedPlant?.image_url || "",
        quantity: vinylSpecs.quantity,
        perUnit: data.per_unit,
        total: data.total,
        email: personalDetails.email,
      });

      toast({
        title: "Order submitted successfully!",
        description: "We've received your order and will be in touch soon.",
      });

      // Clear localStorage data that's no longer needed
      localStorage.removeItem('selectedPlantId');
      localStorage.removeItem('vinylFormData');

      // Redirect to home or a thank you page
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error("Order submission error:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveForLater = async () => {

    if (!user || !userProfile || !session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your order for later.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    const vinylFormData = localStorage.getItem('vinylFormData');

    if (!vinylFormData) {
      toast({
        title: "No Vinyl Specs Found",
        description: "Please fill out the vinyl specifications before saving.",
        variant: "destructive",
      });
      return;
    }
    const data = JSON.parse(vinylFormData);
    // console.log("Saving form data for later:", data);

    // save form data to Supabase
    const { data: formData, error: formError } = await supabase
      .from('requirements_form_details')
      .upsert(
        [{
          plant_id: selectedPlant?.id || localStorage.getItem('selectedPlantId'),
          user_id: userProfile?.id,
          name: data?.name || "",
          email: data?.email || "",
          currency: currency.code || "USD",
          quantity: parseInt(data.quantity) || 0,
          size: data.size,
          type: data.type,
          weight: data.weight,
          colour: data.colour,
          inner_sleeve: data.innerSleeve,
          jacket: data.jacket,
          inserts: data.inserts,
          shrink_wrap: data.shrinkWrap,
          split_manufacturing: orderSummary.splitManufacturing,
          split_manufacturing_details: orderSummary.splitManufacturingDetails,
        }],
        {
          onConflict: 'user_id',
          ignoreDuplicates: false,
        }
      )
      .select('*')
      .single();


    if (formError) {
      console.error('Error saving form data:', formError);
      throw new Error('Failed to save form data');
    }
    // console.log("Form data saved to Supabase:", formData);

    toast({
      title: "Order saved for later",
      description: "Your order details have been saved. You can complete it later.",
    });
    setIsSubmitting(false);

    // Clear localStorage data
    localStorage.removeItem('selectedPlantId');
    localStorage.removeItem('vinylFormData');
    // Redirect to home or a thank you page
    setTimeout(() => {
      navigate('/');
    }
      , 2000);

  }

  return (
    <div className="p-6 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Contact Information</h3>
            <Separator className="mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="companyLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company/Label (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Company or Label name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <PhoneInput
                        country={'us'}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        inputStyle={{
                          width: '100%',
                          height: '38px',
                          borderRadius: '6px',
                          borderColor: '#d1d5db',
                        }}
                        inputClass="text-sm"
                        buttonStyle={{ border: 'none', background: 'transparent' }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Shipping Address</h3>
            <Separator className="mb-4" />

            <FormField
              control={form.control}
              name="address1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Street Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Apt, Suite, Unit, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input placeholder="State/Province" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal/Zip Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Postal/Zip Code" {...field} />
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

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Additional Information</h3>
            <Separator className="mb-4" />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments or Special Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requirements or information we should know about your order"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex pt-4 justify-between">
            <Button
              type="submit"
              size="lg"
              className="w-[47%] text-black bg-[#08fc04] hover:bg-[#2ae627]"
              disabled={isSubmitting || !allOptionsValid || allOptionsValid.vinyl === false || allOptionsValid.packaging === false}
            >
              {isSubmitting ? "Submitting..." : "Complete Order"}
            </Button>

            <Button
              type="button"
              size="lg"
              className="w-[47%] text-black bg-[#08fc04] hover:bg-[#2ae627]"
              onClick={handleSaveForLater}
              disabled={isSubmitting || !allOptionsValid || allOptionsValid.vinyl === false || allOptionsValid.packaging === false}
            >
              Save My Order For Later
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PersonalDetailsForm;
