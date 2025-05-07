
import { FormValues } from '@/components/record-form/FormSchema';
import { Plant } from '@/data/plants';

// This is the URL for your Google Sheets web app
// Replace this with your actual Google Sheets API endpoint from your Google Apps Script
const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/YOUR_DEPLOYED_WEB_APP_ID/exec";

export const submitToGoogleSheets = async (formData: FormValues): Promise<boolean> => {
  console.log("Attempting to submit data to Google Sheets");
  
  try {
    // Using a mock submission since the actual URL is a placeholder
    console.log("Form data that would be sent:", formData);
    
    // In production, uncomment this code to actually submit to Google Sheets
    // const response = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
    //   method: "POST",
    //   mode: "no-cors", // Required for Google Apps Script web apps
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(formData),
    // });
    
    // Mock submission instead of actual HTTP request to avoid blocking
    console.log("Form data sent to Google Sheets (simulated)");
    return true;
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error);
    return false;
  }
};

// Define a consistent return type for plant pricing
export interface PlantPricingResult {
  vinylPrice: number;
  packagingPrice: number;
  perUnit: number;
  quantityBreakdown: Array<{quantity: number; price: number}>;
  valid: boolean; // Field to track if pricing is valid for the specifications
}

// Helper function to determine if a plant has applicable pricing for the requested specifications
const hasApplicablePricing = (plant: Plant, formData: FormValues): boolean => {
  if (!formData || !formData.quantity) {
    return false;
  }
  
  const quantity = parseInt(formData.quantity);
  if (isNaN(quantity) || quantity <= 0 || plant.prices.length === 0) {
    return false;
  }
  
  // Find the lowest quantity tier available
  const lowestTier = [...plant.prices].sort((a, b) => a.quantity - b.quantity)[0];
  
  // Check if we have any pricing tier that is applicable
  // We'll consider a plant applicable if we have any pricing tier,
  // since we'll use the lowest tier if no exact match
  return lowestTier && lowestTier.quantity > 0;
};

// Get the appropriate pricing tier based on requested quantity
const getApplicablePricingTier = (plant: Plant, quantity: number) => {
  // Sort by quantity in descending order
  const sortedPrices = [...plant.prices].sort((a, b) => b.quantity - a.quantity);
  
  // Find the largest tier that's <= requested quantity (exact or next lowest)
  const applicableTier = sortedPrices.find(p => p.quantity <= quantity);
  
  // If no applicable tier is found, use the lowest quantity tier available
  if (!applicableTier && plant.prices.length > 0) {
    return [...plant.prices].sort((a, b) => a.quantity - b.quantity)[0];
  }
  
  return applicableTier;
};

// Helper function to calculate pricing for each plant based on form data
export const calculatePricingForPlants = (plants: Plant[], formData: FormValues) => {
  console.log("Calculating pricing for plants with form data:", formData);
  
  if (!formData || !formData.quantity) {
    console.error("Missing form data or quantity in calculatePricingForPlants");
    return [];
  }
  
  try {
    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      console.error("Invalid quantity value:", formData.quantity);
      return [];
    }
    
    console.log(`Processing ${plants.length} plants with quantity: ${quantity}`);
    
    // Filter plants that have applicable pricing data
    const plantsWithApplicablePricing = plants.filter(plant => 
      hasApplicablePricing(plant, formData)
    );
    
    console.log(`Found ${plantsWithApplicablePricing.length} plants with applicable pricing out of ${plants.length} total plants`);
    
    const plantsWithCalculatedPricing = plantsWithApplicablePricing.map(plant => {
      console.log(`Processing plant: ${plant.name}, with quantity: ${quantity}`);
      
      // Get the applicable pricing tier
      const baseTier = getApplicablePricingTier(plant, quantity);
      
      if (!baseTier) {
        console.log(`No applicable pricing tier found for ${plant.name}`);
        return {
          ...plant,
          calculatedPricing: {
            vinylPrice: 0,
            packagingPrice: 0,
            perUnit: 0,
            quantityBreakdown: [],
            valid: false
          }
        };
      }
      
      const baseVinylPrice = baseTier.price || 0;
      console.log(`Base vinyl price for ${plant.name}: ${baseVinylPrice} (using ${baseTier ? baseTier.quantity : 'unknown'} quantity tier)`);
      
      // Calculate additional costs for color options
      let vinylPrice = baseVinylPrice;
      if (formData.colour !== 'black' && plant.colorOptions) {
        const colorOption = plant.colorOptions.find(c => c.name.toLowerCase() === formData.colour.toLowerCase());
        if (colorOption) {
          vinylPrice += colorOption.additionalCost;
          console.log(`Adding color cost for ${plant.name}: ${colorOption.additionalCost}`);
        }
      }
      
      // Calculate packaging price
      let packagingPrice = 0;
      if (plant.packagingPricing) {
        // Inner sleeve pricing
        const innerSleevePackaging = plant.packagingPricing.find(p => 
          p.type === 'innerSleeve' && p.option === formData.innerSleeve
        );
        if (innerSleevePackaging) {
          const applicableSleevePrice = getApplicablePricingTier(
            { ...plant, prices: innerSleevePackaging.prices },
            quantity
          );
          if (applicableSleevePrice) {
            packagingPrice += applicableSleevePrice.price || 0;
            console.log(`Added inner sleeve price for ${plant.name}: ${applicableSleevePrice.price || 0}`);
          }
        }
        
        // Jacket pricing
        const jacketPackaging = plant.packagingPricing.find(p => 
          p.type === 'jacket' && p.option === formData.jacket
        );
        if (jacketPackaging) {
          const applicableJacketPrice = getApplicablePricingTier(
            { ...plant, prices: jacketPackaging.prices },
            quantity
          );
          if (applicableJacketPrice) {
            packagingPrice += applicableJacketPrice.price || 0;
            console.log(`Added jacket price for ${plant.name}: ${applicableJacketPrice.price || 0}`);
          }
        }
        
        // If no packaging prices found, use default
        if (packagingPrice === 0) {
          packagingPrice = 0.75; // Default placeholder
          console.log(`Using default packaging price for ${plant.name}: 0.75`);
        }
      } else {
        packagingPrice = 0.75; // Default if no packaging pricing available
        console.log(`No packaging pricing available for ${plant.name}, using default: 0.75`);
      }
      
      // Calculate per unit cost
      const perUnit = vinylPrice + packagingPrice;
      
      console.log(`Final calculation for ${plant.name}: Vinyl=${vinylPrice}, Packaging=${packagingPrice}, PerUnit=${perUnit}`);
      
      // Return plant with added calculated pricing
      return {
        ...plant,
        calculatedPricing: {
          vinylPrice,
          packagingPrice,
          perUnit,
          quantityBreakdown: plant.prices,
          valid: true
        }
      };
    });
    
    // Only return plants with valid pricing
    return plantsWithCalculatedPricing.filter(plant => 
      plant.calculatedPricing && plant.calculatedPricing.valid
    );
  } catch (error) {
    console.error("Error calculating pricing:", error);
    return []; // Return empty array in case of error instead of original plants
  }
};
