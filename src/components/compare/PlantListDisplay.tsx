
import React from 'react';
import { Plant } from '@/data/plants';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import PlantCard from '@/components/PlantCard';
import ComparisonTable from '@/components/ComparisonTable';
import { Button } from '@/components/ui/button';
import { FormValues } from '@/components/record-form/FormSchema';

interface PlantListDisplayProps {
  viewMode: 'grid' | 'table';
  filteredPlants: Plant[];
  clearFilters: () => void;
  formData?: FormValues | null;
}

const PlantListDisplay: React.FC<PlantListDisplayProps> = ({ 
  viewMode, 
  filteredPlants,
  clearFilters,
  formData
}) => {
  // Get pricing data from localStorage
  const getPricingData = () => {
    const savedPricing = localStorage.getItem('calculatedPlantPricing');
    if (!savedPricing) return null;
    
    try {
      return JSON.parse(savedPricing);
    } catch (e) {
      console.error("Error parsing pricing data:", e);
      return null;
    }
  };
  
  const pricingData = getPricingData();
  
  // Filter out plants that don't have valid pricing data if we have form data
  const plantsToDisplay = formData && pricingData
    ? filteredPlants.filter(plant => {
        const plantWithPricing = pricingData.find((p: any) => p.id === plant.id);
        return plantWithPricing && 
               plantWithPricing.calculatedPricing && 
               plantWithPricing.calculatedPricing.valid;
      })
    : filteredPlants;

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-muted-foreground">
          {plantsToDisplay.length} 
          {plantsToDisplay.length === 1 ? ' plant' : ' plants'} found
        </p>
        {formData && (
          <p className="text-sm text-muted-foreground">
            Pricing shown is based on your specifications
          </p>
        )}
      </div>
      
      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
        <Tabs value={viewMode} className="w-full">
          <TabsContent value="grid" className="m-0 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {plantsToDisplay.map(plant => (
                <PlantCard key={plant.id} plant={plant} formData={formData} pricingData={pricingData} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="table" className="m-0">
            {plantsToDisplay.length > 0 ? (
              <ComparisonTable plants={plantsToDisplay} formData={formData} pricingData={pricingData} />
            ) : (
              <div className="text-center py-8">
                <p>No plants match your current filters.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {plantsToDisplay.length === 0 && (
        <div className="text-center py-12 border border-border rounded-lg mt-6">
          <h3 className="text-lg font-semibold mb-2">No matching plants found</h3>
          <p className="text-muted-foreground mb-4">
            {formData 
              ? "No plants have pricing data that matches your specifications. Try different specifications or contact plants directly."
              : "Try adjusting your search or filter criteria"
            }
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      )}
    </>
  );
};

export default PlantListDisplay;
