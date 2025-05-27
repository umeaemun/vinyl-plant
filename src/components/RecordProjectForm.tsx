
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form } from "@/components/ui/form";
import { Separator } from '@/components/ui/separator';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema, FormValues } from './record-form/FormSchema';
import ProjectDetailsSection from './record-form/ProjectDetailsSection';
import VinylDetailsSection from './record-form/VinylDetailsSection';
import PackagingSection from './record-form/PackagingSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface RecordProjectFormProps {
  hideSubmitButton?: boolean;
  selectedPlantDetails?: {}
}

interface PricingData {
  id: string;
  name: string;
  location: string;
  country: string;
  calculatedPricing: {
    vinylPrice: number;
    packagingPrice: number;
    perUnit: number;
    valid: boolean;
  };
}

const RecordProjectForm: React.FC<RecordProjectFormProps> = ({ hideSubmitButton = false, selectedPlantDetails = {} }) => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userProfile } = useAuth();

  const [plants, setPlants] = useState<any[]>(null);
  const vinylFormData = localStorage.getItem('vinylFormData');
  const parsedData = JSON.parse(vinylFormData);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      quantity: parsedData?.quantity || "1500",
      size: parsedData?.size || "12",
      type: parsedData?.type || "1LP",
      weight: parsedData?.weight || "140gm",
      colour: parsedData?.colour || "black",
      innerSleeve: parsedData?.innerSleeve || "white-paper",
      jacket: parsedData?.jacket || "single-pocket-3mm",
      inserts: parsedData?.inserts || "single-insert",
      shrinkWrap: parsedData?.shrinkWrap || "yes",
    }
  });


  // useEffect(() => {
  //   if (user && userProfile) {
  //     form.setValue("email", user.email);
  //     form.setValue("username", userProfile.username || "");
  //   }
  // }, [user, userProfile, form]);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const { data: plantsData, error } = await supabase
          .from('plants')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          throw new Error(`Error fetching plants: ${error.message}`);
        }

        setPlants(plantsData || []);
      } catch (error) {
        console.error('Error fetching plants:', error);
      }
    };

    fetchPlants();

  }, []);



  useEffect(() => {
    const plantId = localStorage.getItem('selectedPlantId');
    if (plantId) {
      setSelectedPlant(plantId);
    }
  }, [form]);

  useEffect(() => {
    // if coming from plant details page. it means user is requesting a quote from a specific plant
    if (selectedPlant && !hideSubmitButton && plants) {
      const plant = plants.find(p => p.id == selectedPlant);
      if (plant) {
        toast({
          title: "Plant Selected",
          description: `You are requesting a quote from ${plant.name}. Fill in your project details below.`,
        });
      }
    }
  }, [selectedPlant, toast, hideSubmitButton, plants]);

  const calculatePricingFromSupabase = async (values: FormValues) => {
    try {
      // Fetch vinyl pricing
      const { data: vinylPricingData, error: vinylError } = await supabase
        .from('vinyl_pricing')
        .select('plant_id, price, quantity, size, type');

      if (vinylError) {
        console.error('Error fetching vinyl pricing:', vinylError);
        throw new Error('Failed to fetch vinyl pricing data');
      }

      // console.log("1:", vinylPricingData);

      // Fetch packaging pricing
      const { data: packagingPricingData, error: packagingError } = await supabase
        .from('packaging_pricing')
        .select('plant_id, type, option, id, prices');

      if (packagingError) {
        console.error('Error fetching packaging pricing:', packagingError);
        throw new Error('Failed to fetch packaging pricing data');
      }

      // console.log("2:", packagingPricingData);

      // Get color/weight additional costs
      const { data: colorOptionsData, error: colorError } = await supabase
        .from('vinyl_color_options')
        .select('plant_id, color, additional_cost');

      if (colorError) {
        console.error('Error fetching color options:', colorError);
        throw new Error('Failed to fetch color options');
      }

      // console.log("3:", colorOptionsData);

      const { data: weightOptionsData, error: weightError } = await supabase
        .from('vinyl_weight_options')
        .select('plant_id, weight, additional_cost');

      if (weightError) {
        console.error('Error fetching weight options:', weightError);
        throw new Error('Failed to fetch weight options');
      }

      // console.log("4:", weightOptionsData);

      // Map to plant data
      const pricingResults: PricingData[] = [];
      const numericQuantity = parseInt(values.quantity);

      // console.log("5 user req:", numericQuantity);

      // Group pricing data by plant
      const plantIds = new Set([
        ...vinylPricingData.map(item => item.plant_id),
        ...packagingPricingData.map(item => item.plant_id)
      ]);

      console.log("* plantIds:", plantIds);

      const invalidPlantIds = [];

      plantIds.forEach((plantId, index) => {
        const plant = plants.find(p => p.id == plantId);
        if (!plant) return;

        // Find best matching vinyl price
        const matchingVinylPrices = vinylPricingData.filter((vp) => {
          return vp.plant_id == plantId && vp.size == values.size && vp.type == values.type
        });

        // console.log(index,"AllVinylPrice:", vinylPricingData);

        // console.log(index,"1 matchingVinylPrices:", matchingVinylPrices);

        // Sort by quantity (descending) and find the most appropriate tier
        matchingVinylPrices.sort((a, b) => b.quantity - a.quantity);
        const vinylPrice = matchingVinylPrices.find(vp => vp.quantity <= numericQuantity)?.price;


        if (vinylPrice === undefined || vinylPrice === null) {
          console.log(index, vinylPrice);
          console.error(`No vinyl price found for plant ID ${plantId} with size ${values.size} and type ${values.type}`);
          invalidPlantIds.push(plantId);
          return;
        }

        console.log(index, "2 BestvinylPrice:", vinylPrice);


        // Calculate additional costs for color

        // console.log(index,"AllColorOption:", colorOptionsData);

        const colorOption = colorOptionsData.find(
          co => co.plant_id == plantId && co.color.toLowerCase().trim() === values.colour.toLowerCase().trim()
        );

        // console.log(index,"3 colorOption:", colorOption);
        let colorAdditionalCost = colorOption?.additional_cost || 0;


        if ((colorOption === undefined || colorOption === null) && values.colour.toLowerCase().trim() !== "black") {
          console.error(`No color option found for plant ID ${plantId} with color ${values.colour}`);
          invalidPlantIds.push(plantId);
          return;
        } else if ((colorOption === undefined || colorOption === null) && values.colour.toLowerCase().trim() === "black") {
          colorAdditionalCost = 0;
        }

        console.log(index, "4 finalColorAdditionalCost:", colorAdditionalCost);



        // Calculate additional costs for weight
        const weightOption = weightOptionsData.find(
          wo => wo.plant_id == plantId && wo.weight == values.weight
        );

        // console.log(index,"AllWeightOption:", weightOptionsData);

        // console.log(index,"5 weightOption:", weightOption);
        let weightAdditionalCost = weightOption?.additional_cost || 0;


        if ((weightOption === undefined || weightOption === null) && values.weight !== '140gm') {
          console.log(values.weight);
          console.error(`No weight option found for plant ID ${plantId} with weight ${values.weight}`);
          invalidPlantIds.push(plantId);
          return;
        } else if ((weightOption === undefined || weightOption === null) && values.weight === '140gm') {
          weightAdditionalCost = 0;
        }

        console.log(index, "6 finalWeightAdditionalCost:", weightAdditionalCost);

        // Calculate packaging costs
        let packagingPrice = 0;

        // console.log(index,"AllpackagingPricingData:", packagingPricingData);

        // Process each packaging component (inner sleeve, jacket, inserts, shrink wrap)
        ['innerSleeve', 'jacket', 'inserts', 'shrinkWrap'].forEach((type) => {

          // console.log(index,"7 packaging type:", type, "users choice", values[type as keyof FormValues]);
          const option = values[type as keyof FormValues] as string;      // buyer's choice

          const packagingItem = packagingPricingData.find(
            pp => pp.plant_id == plantId && pp.type === type && pp.option === option
          );


          if (packagingItem === undefined || packagingItem === null) {
            console.error(`No packaging item found for plant ID ${plantId} with type ${type} and option ${option}`);
            invalidPlantIds.push(plantId);
            return;
          }

          // console.log(index,"8 packagingItem:", packagingItem);


          const priceTiers = packagingItem.prices ?? [];
          priceTiers.sort((a, b) => b.quantity - a.quantity);

          // console.log(index,"9 priceTiers:", priceTiers);
          let packagePrice = priceTiers.find(pt => pt.quantity <= numericQuantity)?.price || 0;
          packagePrice = parseFloat(packagePrice); // Ensure two decimal places

          // console.log(index,"10 Best price:", packagePrice);
          packagingPrice += packagePrice;

        });

        // Calculate per unit price
        const totalVinylPrice = vinylPrice + colorAdditionalCost + weightAdditionalCost;
        // console.log(index,"11 totalVinylPrice:", totalVinylPrice);
        // console.log(index,"12 packagingPrice:", packagingPrice);
        const perUnit = totalVinylPrice + packagingPrice;
        // console.log(index,"13 perUnit:", perUnit);

        // Add to results
        pricingResults.push({
          id: plantId,
          name: plant.name,
          location: plant.location,
          country: plant.country,
          calculatedPricing: {
            vinylPrice: totalVinylPrice,
            packagingPrice,
            perUnit,
            valid: !invalidPlantIds?.includes(plantId)
          }
        });
      });

      return pricingResults;
    } catch (error) {
      console.error('Error calculating pricing:', error);
      throw error;
    }
  };

  const handleSubmit = async (values: FormValues) => {

    if (!user || !userProfile) {
      console.error("User not authenticated");
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your project details.",
        variant: "destructive",
      });
      return;
    }

    console.log("Form submit triggered with values:", values);

    if (isSubmitting) {
      console.log("Already submitting, preventing duplicate submission");
      return;
    }

    setIsSubmitting(true);

    try {
      const numericQuantity = parseInt(values.quantity);
      if (isNaN(numericQuantity)) {
        throw new Error("Invalid quantity value");
      }

      // console.log("Starting pricing calculation with quantity:", numericQuantity);

      // Save form data to localStorage
      localStorage.setItem('vinylFormData', JSON.stringify(values));
      // console.log("Form data saved to localStorage");

      // Calculate pricing using Supabase data
      const plantPricingData = await calculatePricingFromSupabase(values);
      // console.log("Calculated pricing data from Supabase:", plantPricingData);

      // Save pricing data to localStorage
      localStorage.setItem('calculatedPlantPricing', JSON.stringify(plantPricingData));
      // console.log("Pricing data saved for all plants");

      if (selectedPlant) {
        localStorage.setItem('selectedPlantForQuote', selectedPlant);
        console.log("Selected plant saved:", selectedPlant);
      }

      toast({
        title: "Form submitted successfully",
        description: "Redirecting to comparison page...",
      });

      // Navigate to the compare page
      navigate('/compare');
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission error",
        description: "There was a problem submitting your form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);
    }
  };

  const handleResetPlant = () => {
    localStorage.removeItem('selectedPlantId');
    setSelectedPlant(null);

    toast({
      title: "Selection cleared",
      description: "You're now comparing all pressing plants. Fill in your project details.",
    });
  };

  return (
    <div className={hideSubmitButton ? "w-full" : "bg-white p-6 rounded-lg w-full max-w-4xl mx-auto border-4 border-wwwax-green"}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {selectedPlant && !hideSubmitButton && (
            <div className="bg-secondary/30 p-4 rounded-md mb-4 flex justify-between items-center">
              <p className="font-medium">
                You're requesting a quote from a specific pressing plant.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetPlant}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" /> Reset Selection
              </Button>
            </div>
          )}

          {!hideSubmitButton && 
          <>
            <div className="w-full">
              <ProjectDetailsSection control={form.control} disabled={hideSubmitButton} />
            </div>
            <Separator className="my-6" />
          </>
          }

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <VinylDetailsSection control={form.control} disabled={hideSubmitButton} />
            <PackagingSection control={form.control} disabled={hideSubmitButton} />
          </div>

          {!hideSubmitButton && (
            <div className="flex justify-center">
              <Button
                type="submit"
                onClick={() => { handleSubmit(form.getValues()) }}
                size="lg"
                className="bg-wwwax-green text-black hover:bg-wwwax-green/80 text-center w-full max-w-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : selectedPlant ? "Request Quote" : "Get Pricing Comparison"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default RecordProjectForm;
