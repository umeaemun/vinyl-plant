
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

interface RecordProjectFormProps {
  hideSubmitButton?: boolean;
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

const RecordProjectForm: React.FC<RecordProjectFormProps> = ({ hideSubmitButton = false }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      catalogueNumber: "",
      quantity: "1500",
      size: "12",
      type: "1LP",
      weight: "140gm",
      colour: "black",
      innerSleeve: "white-paper",
      jacket: "single-pocket-3mm",
      inserts: "single-insert",
      shrinkWrap: "yes"
    }
  });

  useEffect(() => {
    const plantId = localStorage.getItem('selectedPlantId');
    if (plantId) {
      setSelectedPlant(plantId);
    }
  }, [form]);

  useEffect(() => {
    if (selectedPlant && !hideSubmitButton) {
      const plant = plants.find(p => p.id === selectedPlant);
      if (plant) {
        toast({
          title: "Plant Selected",
          description: `You are requesting a quote from ${plant.name}. Fill in your project details below.`,
        });
      }
    }
  }, [selectedPlant, toast, hideSubmitButton]);

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

      // Fetch packaging pricing
      const { data: packagingPricingData, error: packagingError } = await supabase
        .from('packaging_pricing')
        .select('plant_id, type, option, id');
      
      if (packagingError) {
        console.error('Error fetching packaging pricing:', packagingError);
        throw new Error('Failed to fetch packaging pricing data');
      }

      // Fetch packaging price tiers
      const { data: packagingTierData, error: packagingTierError } = await supabase
        .from('packaging_price_tiers')
        .select('packaging_id, price, quantity');
      
      if (packagingTierError) {
        console.error('Error fetching packaging price tiers:', packagingTierError);
        throw new Error('Failed to fetch packaging price tiers');
      }

      // Get color/weight additional costs
      const { data: colorOptionsData, error: colorError } = await supabase
        .from('vinyl_color_options')
        .select('plant_id, name, additional_cost');
      
      if (colorError) {
        console.error('Error fetching color options:', colorError);
        throw new Error('Failed to fetch color options');
      }

      const { data: weightOptionsData, error: weightError } = await supabase
        .from('vinyl_weight_options')
        .select('plant_id, name, additional_cost');
      
      if (weightError) {
        console.error('Error fetching weight options:', weightError);
        throw new Error('Failed to fetch weight options');
      }

      // Map to plant data
      const pricingResults: PricingData[] = [];
      const numericQuantity = parseInt(values.quantity);
      
      // Group pricing data by plant
      const plantIds = new Set([
        ...vinylPricingData.map(item => item.plant_id),
        ...packagingPricingData.map(item => item.plant_id)
      ]);
      
      plantIds.forEach(plantId => {
        const plant = plants.find(p => p.id === plantId);
        if (!plant) return;
        
        // Find best matching vinyl price
        const matchingVinylPrices = vinylPricingData.filter(
          vp => vp.plant_id === plantId && 
               vp.size === values.size && 
               vp.type === values.type
        );
        
        // Sort by quantity (descending) and find the most appropriate tier
        matchingVinylPrices.sort((a, b) => b.quantity - a.quantity);
        const vinylPrice = matchingVinylPrices.find(vp => vp.quantity <= numericQuantity)?.price || 0;
        
        // Calculate additional costs for color
        const colorOption = colorOptionsData.find(
          co => co.plant_id === plantId && co.name.toLowerCase() === values.colour.toLowerCase()
        );
        const colorAdditionalCost = colorOption?.additional_cost || 0;
        
        // Calculate additional costs for weight
        const weightOption = weightOptionsData.find(
          wo => wo.plant_id === plantId && wo.name === values.weight
        );
        const weightAdditionalCost = weightOption?.additional_cost || 0;
        
        // Calculate packaging costs
        let packagingPrice = 0;
        
        // Process each packaging component (inner sleeve, jacket, inserts, shrink wrap)
        ['innerSleeve', 'jacket', 'inserts', 'shrinkWrap'].forEach((type) => {
          const option = values[type as keyof FormValues] as string;
          const packagingItem = packagingPricingData.find(
            pp => pp.plant_id === plantId && pp.type === type && pp.option === option
          );
          
          if (packagingItem) {
            // Find matching price tier for this packaging item
            const priceTiers = packagingTierData.filter(pt => pt.packaging_id === packagingItem.id);
            priceTiers.sort((a, b) => b.quantity - a.quantity);
            const packagePrice = priceTiers.find(pt => pt.quantity <= numericQuantity)?.price || 0;
            packagingPrice += packagePrice;
          }
        });
        
        // Calculate per unit price
        const totalVinylPrice = vinylPrice + colorAdditionalCost + weightAdditionalCost;
        const perUnit = totalVinylPrice + packagingPrice;
        
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
            valid: totalVinylPrice > 0
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
      
      console.log("Starting pricing calculation with quantity:", numericQuantity);
      
      // Save form data to localStorage
      localStorage.setItem('vinylFormData', JSON.stringify(values));
      console.log("Form data saved to localStorage");
      
      // Calculate pricing using Supabase data
      const plantPricingData = await calculatePricingFromSupabase(values);
      console.log("Calculated pricing data from Supabase:", plantPricingData);
      
      // Save pricing data to localStorage
      localStorage.setItem('calculatedPlantPricing', JSON.stringify(plantPricingData));
      console.log("Pricing data saved for all plants");
      
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
          
          <div className="w-full">
            <ProjectDetailsSection control={form.control} />
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <VinylDetailsSection control={form.control} />
            <PackagingSection control={form.control} />
          </div>
          
          {!hideSubmitButton && (
            <div className="flex justify-center">
              <Button 
                type="submit" 
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
