import React from 'react';
import { Plant, PriceTier, ColorOption, WeightOption } from '@/data/plants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PlantVinylPricingProps {
  plant: Plant;
  setPlant: React.Dispatch<React.SetStateAction<Plant | null>>;
  disabled: boolean;
}

const PlantVinylPricing: React.FC<PlantVinylPricingProps> = ({
  plant,
  setPlant,
  disabled
}) => {

  // console.log("plant", plant);
  const { toast } = useToast();


  const [vinylPricing, setVinylPricing] = React.useState<any[]>(null);
  const [colorOptions, setColorOptions] = React.useState<ColorOption[]>([]);
  const [weightOptions, setWeightOptions] = React.useState<WeightOption[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleAddPriceTier = () => {
    const newVinylPricing = [...vinylPricing, {
      id: Date.now().toString(),
      quantity: 50,
      size: '12"',
      type: '1LP',
      price: 0,
      status: 'new'
    }];
    setVinylPricing(newVinylPricing);

  };

  const handleRemovePriceTier = (id: string) => {

    const newVinylPricing = vinylPricing.map((tier) => {
      // return tier.id == id ? { ...tier, status: 'deleted' } : tier;
      if (tier.id == id) {
          if (tier.status !== 'new') {
            return { ...tier, status: 'deleted' };
          }else{
            return { ...tier, status: 'removeNow' };
          }
         
      }else {
        return tier;
      }
    })

    // filter out the removed tier
    const filteredVinylPricing = newVinylPricing.filter((tier) => tier.status !== 'removeNow');

    setVinylPricing(filteredVinylPricing);
  };

  const handlePriceTierChange = (id: string, field: keyof PriceTier, value: any) => {

    // update the vinyl pricing state
    const newVinylPricing = vinylPricing.map((tier) => {
      if (tier.id === id) {
        if (tier.status == 'new') {
          return { ...tier, [field]: value };
        } else if (tier.status == 'same' || tier.status == 'updated') {
          return { ...tier, [field]: value, status: 'updated' };
        }
      }
      return tier;
    });

    setVinylPricing(newVinylPricing);
  };

  const handleAddColorOption = () => {
    // const newPlant = {...plant};
    // if (!newPlant.colorOptions) {
    //   newPlant.colorOptions = [];
    // }

    // const defaultColor: ColorOption = {
    //   name: "solid-colour",
    //   additionalCost: 1.5
    // };

    // newPlant.colorOptions = [...(newPlant.colorOptions || []), defaultColor];
    // setPlant(newPlant);
  };

  const handleRemoveColorOption = (index: number) => {
    // const newPlant = {...plant};
    // if (newPlant.colorOptions) {
    //   newPlant.colorOptions = newPlant.colorOptions.filter((_, i) => i !== index);
    //   setPlant(newPlant);
    // }
  };

  const handleColorOptionChange = (index: number, field: keyof ColorOption, value: any) => {
    // const newPlant = {...plant};
    // if (!newPlant.colorOptions) {
    //   newPlant.colorOptions = [];
    // }

    // newPlant.colorOptions = [...(newPlant.colorOptions || [])];
    // newPlant.colorOptions[index] = {
    //   name: newPlant.colorOptions[index]?.name || "solid-colour",
    //   additionalCost: newPlant.colorOptions[index]?.additionalCost || 1.5,
    //   [field]: value
    // };
    // setPlant(newPlant);
  };

  const handleAddWeightOption = () => {
    // const newPlant = {...plant};
    // if (!newPlant.weightOptions) {
    //   newPlant.weightOptions = [];
    // }

    // if (!newPlant.weightOptions.some(option => option.name === "180gm")) {
    //   const defaultWeight: WeightOption = {
    //     name: "180gm",
    //     additionalCost: 1
    //   };

    //   newPlant.weightOptions = [...(newPlant.weightOptions || []), defaultWeight];
    //   setPlant(newPlant);
    // } else {
    //   toast({
    //     title: "Option already exists",
    //     description: "180gm weight option already exists",
    //     variant: "destructive"
    //   });
    // }
  };

  const handleRemoveWeightOption = (index: number) => {
    // const newPlant = {...plant};
    // if (newPlant.weightOptions) {
    //   newPlant.weightOptions = newPlant.weightOptions.filter((_, i) => i !== index);
    //   setPlant(newPlant);
    // }
  };

  const handleWeightOptionChange = (index: number, field: keyof WeightOption, value: any) => {
    // const newPlant = {...plant};
    // if (!newPlant.weightOptions) {
    //   newPlant.weightOptions = [];
    // }

    // newPlant.weightOptions = [...(newPlant.weightOptions || [])];
    // newPlant.weightOptions[index] = {
    //   name: "180gm",
    //   additionalCost: newPlant.weightOptions[index]?.additionalCost || 0,
    //   [field]: value
    // };
    // setPlant(newPlant);
  };

  React.useEffect(() => {
    // if (!newPlant.colorOptions) {
    //   newPlant.colorOptions = [
    //     { name: "solid-colour", additionalCost: 1.5 },
    //     { name: "translucent-colour", additionalCost: 2 },
    //     { name: "marbled", additionalCost: 2.5 },
    //     { name: "splatter", additionalCost: 3 },
    //     { name: "picture-disc", additionalCost: 5 }
    //   ];
    //   needsUpdate = true;
    // }

    // if (!newPlant.weightOptions || newPlant.weightOptions.length === 0) {
    //   newPlant.weightOptions = [
    //     { name: "180gm", additionalCost: 1 }
    //   ];
    //   needsUpdate = true;
    // } else {
    //   newPlant.weightOptions = newPlant.weightOptions.filter(
    //     option => option.name === "180gm"
    //   );

    //   if (newPlant.weightOptions.length === 0) {
    //     newPlant.weightOptions = [
    //       { name: "180gm", additionalCost: 1 }
    //     ];
    //   }
    //   needsUpdate = true;
    // }

    if (plant && plant.id && !vinylPricing) {
      // console.log("Loading vinyl pricing from Supabase");
      loadFromSupabase();
    }

  }, [plant]);

  const saveToSupabase = async () => {
    if (!plant.id) {
      toast({
        title: "Error",
        description: "Plant ID is missing",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {

      // filter out deleted tiers
      const deletedVinylPricing = vinylPricing.filter(tier => tier.status == 'deleted');
      deletedVinylPricing.forEach(async tier => {
        const { data: deletedVinylPricingData, error: deletedVinylPricingError } = await supabase
          .from('vinyl_pricing')
          .delete()
          .eq('id', tier.id)
          .eq('plant_id', plant.id);

        if (deletedVinylPricingError) {
          console.error('Error deleting vinyl pricing:', deletedVinylPricingError);
          throw new Error(`Error deleting vinyl pricing: ${deletedVinylPricingError.message}`);
        }
      })

      // filter out new tiers
      const newVinylPricing = vinylPricing.filter(tier => tier.status == 'new');
      const newVinylPricingData = newVinylPricing.forEach(async tier => {
        const { data: newVinylPricingData, error: newVinylPricingError } = await supabase
          .from('vinyl_pricing')
          .insert({
            plant_id: plant.id,
            quantity: tier.quantity,
            size: tier.size,
            type: tier.type,
            price: tier.price
          })
          .select();

        if (newVinylPricingError) {
          console.error('Error saving vinyl pricing:', newVinylPricingError);
          throw new Error(`Error saving vinyl pricing: ${newVinylPricingError.message}`);
        }
      });


      // filter out updated tiers
      const updatedVinylPricing = vinylPricing.filter(tier => tier.status == 'updated');
      const updatedVinylPricingData = updatedVinylPricing.forEach(async tier => {
        const { data: updatedVinylPricingData, error: updatedVinylPricingError } = await supabase
          .from('vinyl_pricing')
          .update({
            quantity: tier.quantity,
            size: tier.size,
            type: tier.type,
            price: tier.price
          })
          .eq('id', tier.id)
          .eq('plant_id', plant.id)
          .select();

        if (updatedVinylPricingError) {
          console.error('Error saving vinyl pricing:', updatedVinylPricingError);
          throw new Error(`Error saving vinyl pricing: ${updatedVinylPricingError.message}`);
        }
      });


      // if (plant.packagingPricing && plant.packagingPricing.length > 0) {
      //   for (const packaging of plant.packagingPricing) {
      //     const { data: packagingData, error: packagingError } = await supabase
      //       .from('packaging_pricing')
      //       .insert({
      //         plant_id: plant.id,
      //         type: packaging.type,
      //         option: packaging.option
      //       })
      //       .select();

      //     if (packagingError) {
      //       console.error('Error saving packaging pricing:', packagingError);
      //       throw new Error(`Error saving packaging pricing: ${packagingError.message}`);
      //     }

      //     if (packagingData && packagingData.length > 0 && packaging.prices.length > 0) {
      //       const packagingId = packagingData[0].id;

      //       const priceTiersData = packaging.prices.map(price => ({
      //         packaging_id: packagingId,
      //         quantity: price.quantity,
      //         price: price.price
      //       }));

      //       const { error: tierError } = await supabase
      //         .from('packaging_price_tiers')
      //         .insert(priceTiersData);

      //       if (tierError) {
      //         console.error('Error saving packaging price tiers:', tierError);
      //         throw new Error(`Error saving packaging price tiers: ${tierError.message}`);
      //       }
      //     }
      //   }
      // }


      // if (plant.colorOptions && plant.colorOptions.length > 0) {
      //   const colorOptionsData = plant.colorOptions.map(option => ({
      //     plant_id: plant.id,
      //     name: option.name,
      //     additional_cost: option.additionalCost
      //   }));

      //   const { error: colorError } = await supabase.from('vinyl_color_options').insert(colorOptionsData);

      //   if (colorError) {
      //     console.error('Error saving color options:', colorError);
      //     throw new Error(`Error saving color options: ${colorError.message}`);
      //   }
      // }

      // if (plant.weightOptions && plant.weightOptions.length > 0) {
      //   const weightOptionsData = plant.weightOptions.map(option => ({
      //     plant_id: plant.id,
      //     name: option.name,
      //     additional_cost: option.additionalCost
      //   }));

      //   const { error: weightError } = await supabase.from('vinyl_weight_options').insert(weightOptionsData);

      //   if (weightError) {
      //     console.error('Error saving weight options:', weightError);
      //     throw new Error(`Error saving weight options: ${weightError.message}`);
      //   }
      // }


      toast({
        title: "Success",
        description: "Pricing data saved successfully"
      });
    } catch (error) {
      console.error('Error saving pricing data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while saving pricing data",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // const loadFromSupabase = async () => {
  //   if (!plant.id) {
  //     toast({
  //       title: "Error",
  //       description: "Plant ID is missing",
  //       variant: "destructive"
  //     });
  //     return;
  //   }

  //   setIsSaving(true);

  //   try {
  //     const { data: vinylPricingData, error: vinylError } = await supabase
  //       .from('vinyl_pricing')
  //       .select('*')
  //       .eq('plant_id', plant.id);

  //     if (vinylError) {
  //       throw new Error(`Error loading vinyl pricing: ${vinylError.message}`);
  //     }

  //     const { data: colorOptionsData, error: colorError } = await supabase
  //       .from('vinyl_color_options')
  //       .select('*')
  //       .eq('plant_id', plant.id);

  //     if (colorError) {
  //       throw new Error(`Error loading color options: ${colorError.message}`);
  //     }

  //     const { data: weightOptionsData, error: weightError } = await supabase
  //       .from('vinyl_weight_options')
  //       .select('*')
  //       .eq('plant_id', plant.id);

  //     if (weightError) {
  //       throw new Error(`Error loading weight options: ${weightError.message}`);
  //     }

  //     const { data: packagingData, error: packagingError } = await supabase
  //       .from('packaging_pricing')
  //       .select('*')
  //       .eq('plant_id', plant.id);

  //     if (packagingError) {
  //       throw new Error(`Error loading packaging pricing: ${packagingError.message}`);
  //     }

  //     const packagingPricing = [];

  //     if (packagingData && packagingData.length > 0) {
  //       for (const packaging of packagingData) {
  //         const { data: tiersData, error: tiersError } = await supabase
  //           .from('packaging_price_tiers')
  //           .select('*')
  //           .eq('packaging_id', packaging.id);

  //         if (tiersError) {
  //           throw new Error(`Error loading packaging price tiers: ${tiersError.message}`);
  //         }

  //         packagingPricing.push({
  //           type: packaging.type,
  //           option: packaging.option,
  //           prices: tiersData?.map(tier => ({
  //             quantity: tier.quantity,
  //             price: tier.price
  //           })) || []
  //         });
  //       }
  //     }

  //     const updatedPlant = { ...plant };

  //     if (vinylPricingData && vinylPricingData.length > 0) {
  //       updatedPlant.priceTiers = vinylPricingData.map(pricing => ({
  //         quantity: pricing.quantity,
  //         size: pricing.size,
  //         type: pricing.type,
  //         price: pricing.price
  //       }));
  //     }

  //     if (colorOptionsData && colorOptionsData.length > 0) {
  //       updatedPlant.colorOptions = colorOptionsData.map(option => ({
  //         name: option.name,
  //         additionalCost: option.additional_cost
  //       }));
  //     }

  //     if (weightOptionsData && weightOptionsData.length > 0) {
  //       updatedPlant.weightOptions = weightOptionsData.map(option => ({
  //         name: option.name,
  //         additionalCost: option.additional_cost
  //       }));
  //     }

  //     if (packagingPricing.length > 0) {
  //       updatedPlant.packagingPricing = packagingPricing;
  //     }

  //     setPlant(updatedPlant);

  //     // toast({
  //     //   title: "Success",
  //     //   description: "Pricing data loaded successfully"
  //     // });
  //   } catch (error) {
  //     console.error('Error loading pricing data:', error);
  //     toast({
  //       title: "Error",
  //       description: error instanceof Error ? error.message : "An error occurred while loading pricing data",
  //       variant: "destructive"
  //     });
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  // React.useEffect(() => {
  //   if (plant.id) {
  //     loadFromSupabase();
  //   }
  // }, [plant.id]);

  const loadFromSupabase = async () => {

    const getVinylPricing = async () => {
      const { data: vinylPricing, error } = await supabase
        .from('vinyl_pricing')
        .select('*')
        .eq('plant_id', plant.id);
      if (error) {
        console.error('Error fetching vinyl pricing:', error);
        return [];
      }

      // add a field to each vinyl pricing object
      const updatedVinylPricing = vinylPricing.map((pricing: any) => ({
        ...pricing,
        status: 'same',
      }));

      setVinylPricing(updatedVinylPricing);
    }

    getVinylPricing();

  }

  if (vinylPricing) {
    return (
      <div className="space-y-6">
        {!disabled && (
          <div className="flex justify-end gap-2 mb-6">
            <Button
              variant="outline"
              onClick={loadFromSupabase}
              disabled={isSaving || !plant.id}
            >
              Reload from Database
            </Button>
            <Button
              onClick={saveToSupabase}
              disabled={isSaving || !plant.id}
              className="flex items-center gap-2"
            >
              {isSaving ? "Saving..." : "Save to Database"}
              {!isSaving && <Save className="h-4 w-4" />}
            </Button>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Base Vinyl Pricing</CardTitle>
            <CardDescription>
              Add custom pricing tiers based on quantity, size, and type. This price should include all fixed cost pricing like any set-up fees, lacquer/DMM cutting and/or electroplating, and centre labels. This base pricing is for black 140gm vinyl.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {vinylPricing?.map((tier, index) => {
              if (tier.status == 'deleted') {
                return null;
              }
              return (
                <div key={index} className="mb-6 pb-6 border-b border-border last:border-0 last:pb-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                      <Select
                        disabled={disabled}
                        value={tier.quantity.toString()}
                        onValueChange={(value) => handlePriceTierChange(tier.id, 'quantity', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select quantity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                          <SelectItem value="150">150</SelectItem>
                          <SelectItem value="200">200</SelectItem>
                          <SelectItem value="300">300</SelectItem>
                          <SelectItem value="500">500</SelectItem>
                          <SelectItem value="700">700</SelectItem>
                          <SelectItem value="1000">1000</SelectItem>
                          <SelectItem value="1500">1500</SelectItem>
                          <SelectItem value="2000">2000</SelectItem>
                          <SelectItem value="3000">3000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`size-${index}`}>Size</Label>
                      <Select
                        disabled={disabled}
                        value={tier.size}
                        onValueChange={(value) => handlePriceTierChange(tier.id, 'size', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={`12"`}>12"</SelectItem>
                          <SelectItem disabled value={`10"`}>10" (Coming soon)</SelectItem>
                          <SelectItem disabled value={`7"`}>7" (Coming soon)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`type-${index}`}>Type</Label>
                      <Select
                        disabled={disabled}
                        value={tier.type}
                        onValueChange={(value) => handlePriceTierChange(tier.id, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1LP">1LP</SelectItem>
                          <SelectItem disabled value="2LP">2LP (Coming soon)</SelectItem>
                          <SelectItem disabled value="3LP">3LP (Coming soon)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`price-${index}`}>Price per unit ($)</Label>
                      <Input
                        id={`price-${index}`}
                        type="number"
                        step="0.01"
                        value={tier.price}
                        onChange={(e) => handlePriceTierChange(tier.id, 'price', parseFloat(e.target.value) || 0)}
                        disabled={disabled}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemovePriceTier(tier.id)}
                      disabled={disabled || (vinylPricing?.length || 0) <= 1}
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Remove Tier
                    </Button>
                  </div>
                </div>
              )
            }
            )}

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={handleAddPriceTier}
              disabled={disabled}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Price Tier
            </Button>
          </CardContent>
        </Card>

        <Card>
        <CardHeader>
          <CardTitle>Colour Options</CardTitle>
          <CardDescription>
            Set additional costs for different colour options beyond the standard black vinyl
          </CardDescription>
        </CardHeader>
        <CardContent>
          {colorOptions?.map((option, index) => (
            <div key={index} className="mb-4 pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <Label htmlFor={`color-${index}`}>Colour</Label>
                  <Select
                    disabled={disabled}
                    value={option.name}
                    onValueChange={(value) => handleColorOptionChange(index, 'name', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select colour" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid-colour">Solid Colour</SelectItem>
                      <SelectItem value="translucent-colour">Translucent Colour</SelectItem>
                      <SelectItem value="marbled">Marbled</SelectItem>
                      <SelectItem value="splatter">Splatter</SelectItem>
                      <SelectItem value="picture-disc">Picture Disc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`color-cost-${index}`}>Additional Cost ($)</Label>
                  <Input
                    id={`color-cost-${index}`}
                    type="number"
                    step="0.01"
                    value={option.additionalCost}
                    onChange={(e) => handleColorOptionChange(index, 'additionalCost', parseFloat(e.target.value) || 0)}
                    disabled={disabled}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleRemoveColorOption(index)}
                  disabled={disabled || (colorOptions?.length || 0) <= 1}
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Remove Option
                </Button>
              </div>
            </div>
          ))}
          
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={handleAddColorOption}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Colour Option
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weight Options</CardTitle>
          <CardDescription>
            Set additional costs for different weight options
          </CardDescription>
        </CardHeader>
        <CardContent>
          {weightOptions?.map((option, index) => (
            <div key={index} className="mb-4 pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <Label htmlFor={`weight-${index}`}>Weight</Label>
                  <Select
                    disabled={true}
                    value="180gm"
                    onValueChange={() => {}}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="180gm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="180gm">180gm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`weight-cost-${index}`}>Additional Cost ($)</Label>
                  <Input
                    id={`weight-cost-${index}`}
                    type="number"
                    step="0.01"
                    value={option.additionalCost}
                    onChange={(e) => handleWeightOptionChange(index, 'additionalCost', parseFloat(e.target.value) || 0)}
                    disabled={disabled}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleRemoveWeightOption(index)}
                  disabled={disabled || (weightOptions?.length || 0) <= 1}
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Remove Option
                </Button>
              </div>
            </div>
          ))}
          
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={handleAddWeightOption}
            disabled={disabled || (weightOptions?.length || 0) >= 1}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Weight Option
          </Button>
        </CardContent>
      </Card>
      </div>
    );
  }

};

export default PlantVinylPricing;
