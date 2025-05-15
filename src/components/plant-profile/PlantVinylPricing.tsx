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


  const [vinylPricing, setVinylPricing] = React.useState<PriceTier[]>(null);
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
      if (tier.id == id) {
        if (tier.status !== 'new') {
          return { ...tier, status: 'deleted' };
        } else {
          return { ...tier, status: 'removeNow' };
        }

      } else {
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
    const newColorOptions: ColorOption[] = [...colorOptions, {
      id: Date.now().toString(),
      name: "solid-colour",
      additionalCost: 1.5,
      status: 'new'
    }];

    setColorOptions(newColorOptions);
  };

  const handleRemoveColorOption = (id: string) => {
    const newColorOptions = colorOptions.map((option) => {
      if (option.id == id) {
        if (option.status !== 'new') {
          return { ...option, status: 'deleted' };
        } else {
          return { ...option, status: 'removeNow' };
        }

      } else {
        return option;
      }
    })

    // filter out the removed option
    const filteredColorOptions = newColorOptions.filter((option) => option.status !== 'removeNow');

    setColorOptions(filteredColorOptions);

  };

  const handleColorOptionChange = (id: string, field: keyof ColorOption, value: any) => {
    const newColorOptions = colorOptions.map((option) => {
      if (option.id === id) {
        if (option.status == 'new') {
          return { ...option, [field]: value };
        } else if (option.status == 'same' || option.status == 'updated') {
          return { ...option, [field]: value, status: 'updated' };
        }
      }
      return option;
    });

    setColorOptions(newColorOptions);
  };

  const handleAddWeightOption = () => {
    const newWeightOptions: WeightOption[] = [...weightOptions, {
      id: Date.now().toString(),
      name: "180gm",
      additionalCost: 1,
      status: 'new'
    }];

    setWeightOptions(newWeightOptions);
  };

  const handleRemoveWeightOption = (id: string) => {
    const newWeightOptions = weightOptions.map((option) => {
      if (option.id == id) {
        if (option.status !== 'new') {
          return { ...option, status: 'deleted' };
        } else {
          return { ...option, status: 'removeNow' };
        }

      } else {
        return option;
      }
    })

    // filter out the removed option
    const filteredWeightOptions = newWeightOptions.filter((option) => option.status !== 'removeNow');

    setWeightOptions(filteredWeightOptions);
  };

  const handleWeightOptionChange = (id: string, field: keyof WeightOption, value: any) => {
    const newWeightOptions = weightOptions.map((option) => {
      if (option.id === id) {
        if (option.status == 'new') {
          return { ...option, [field]: value };
        } else if (option.status == 'same' || option.status == 'updated') {
          return { ...option, [field]: value, status: 'updated' };
        }
      }
      return option;
    });

    setWeightOptions(newWeightOptions);
  };


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

      if (vinylPricing.length === 0) {
        const defaultVinylPricing: PriceTier[] = [
          { id: Date.now().toString(), quantity: 50, size: '12"', type: '1LP', price: 0, status: 'new' }
        ];
        setVinylPricing(defaultVinylPricing);

      } else {

        // add a field to each vinyl pricing object
        const updatedVinylPricing = vinylPricing.map((pricing: any) => ({
          ...pricing,
          status: 'same',
        }));

        setVinylPricing(updatedVinylPricing);
      }
    }

    const getColorOptions = async () => {
      const { data: colorOptions, error } = await supabase
        .from('vinyl_color_options')
        .select('*')
        .eq('plant_id', plant.id);
      if (error) {
        console.error('Error fetching color options:', error);
        return [];
      }

      if (colorOptions.length === 0) {
        const defaultColor: ColorOption[] = [
          { name: "solid-colour", additionalCost: 1.5, status: 'new' },
          { name: "translucent-colour", additionalCost: 2, status: 'new' },
          { name: "marbled", additionalCost: 2.5, status: 'new' },
          { name: "splatter", additionalCost: 3, status: 'new' },
          { name: "picture-disc", additionalCost: 5, status: 'new' }
        ];
        setColorOptions(defaultColor);

      } else {

        const updatedColorOptions = colorOptions.map((option: any) => ({
          ...option,
          status: 'same',
        }));
        setColorOptions(updatedColorOptions);
      }
    }

    const getWeightOptions = async () => {
      const { data: weightOptions, error } = await supabase
        .from('vinyl_weight_options')
        .select('*')
        .eq('plant_id', plant.id);
      if (error) {
        console.error('Error fetching weight options:', error);
        return [];
      }

      if (weightOptions.length === 0) {
        const defaultWeight: WeightOption[] = [
          { name: "180gm", additionalCost: 1, status: 'new' }
        ];
        setWeightOptions(defaultWeight);

      } else {

        const updatedWeightOptions = weightOptions.map((option: any) => ({
          ...option,
          status: 'same',
        }));
        setWeightOptions(updatedWeightOptions);
      }

    }

    getVinylPricing();
    getColorOptions();
    getWeightOptions();

  }

  React.useEffect(() => {

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

      // VINYL PRICING

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

      // COLOR OPTIONS

      // filter out deleted color options
      const deletedColorOptions = colorOptions.filter(option => option.status == 'deleted');
      deletedColorOptions.forEach(async option => {
        const { data: deletedColorOptionsData, error: deletedColorOptionsError } = await supabase
          .from('vinyl_color_options')
          .delete()
          .eq('id', option.id)
          .eq('plant_id', plant.id);
        if (deletedColorOptionsError) {
          console.error('Error deleting color options:', deletedColorOptionsError);
          throw new Error(`Error deleting color options: ${deletedColorOptionsError.message}`);
        }
      });

      // filter out new color options
      const newColorOptions = colorOptions.filter(option => option.status == 'new');
      const newColorOptionsData = newColorOptions.forEach(async option => {
        const { data: newColorOptionsData, error: newColorOptionsError } = await supabase
          .from('vinyl_color_options')
          .insert({
            plant_id: plant.id,
            name: option.name,
            additionalCost: option.additionalCost
          })
          .select();
        if (newColorOptionsError) {
          console.error('Error saving color options:', newColorOptionsError);
          throw new Error(`Error saving color options: ${newColorOptionsError.message}`);
        }
      });

      // filter out updated color options
      const updatedColorOptions = colorOptions.filter(option => option.status == 'updated');
      const updatedColorOptionsData = updatedColorOptions.forEach(async option => {
        const { data: updatedColorOptionsData, error: updatedColorOptionsError } = await supabase
          .from('vinyl_color_options')
          .update({
            name: option.name,
            additionalCost: option.additionalCost
          })
          .eq('id', option.id)
          .eq('plant_id', plant.id)
          .select();
        if (updatedColorOptionsError) {
          console.error('Error saving color options:', updatedColorOptionsError);
          throw new Error(`Error saving color options: ${updatedColorOptionsError.message}`);
        }
      });


      // WEIGHT OPTIONS

      // filter out deleted weight options
      const deletedWeightOptions = weightOptions.filter(option => option.status == 'deleted');
      deletedWeightOptions.forEach(async option => {
        const { data: deletedWeightOptionsData, error: deletedWeightOptionsError } = await supabase
          .from('vinyl_weight_options')
          .delete()
          .eq('id', option.id)
          .eq('plant_id', plant.id);
        if (deletedWeightOptionsError) {
          console.error('Error deleting weight options:', deletedWeightOptionsError);
          throw new Error(`Error deleting weight options: ${deletedWeightOptionsError.message}`);
        }
      });

      // filter out new weight options
      const newWeightOptions = weightOptions.filter(option => option.status == 'new');
      const newWeightOptionsData = newWeightOptions.forEach(async option => {
        const { data: newWeightOptionsData, error: newWeightOptionsError } = await supabase
          .from('vinyl_weight_options')
          .insert({
            plant_id: plant.id,
            name: option.name,
            additionalCost: option.additionalCost
          })
          .select();
        if (newWeightOptionsError) {
          console.error('Error saving weight options:', newWeightOptionsError);
          throw new Error(`Error saving weight options: ${newWeightOptionsError.message}`);
        }
      });

      // filter out updated weight options
      const updatedWeightOptions = weightOptions.filter(option => option.status == 'updated');
      const updatedWeightOptionsData = updatedWeightOptions.forEach(async option => {
        const { data: updatedWeightOptionsData, error: updatedWeightOptionsError } = await supabase
          .from('vinyl_weight_options')
          .update({
            name: option.name,
            additionalCost: option.additionalCost
          })
          .eq('id', option.id)
          .eq('plant_id', plant.id)
          .select();
        if (updatedWeightOptionsError) {
          console.error('Error saving weight options:', updatedWeightOptionsError);
          throw new Error(`Error saving weight options: ${updatedWeightOptionsError.message}`);
        }
      });


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


  if (vinylPricing && colorOptions && weightOptions) {
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
              if (tier?.status == 'deleted') {
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
            {colorOptions?.map((option, index) => {
              if (option?.status == 'deleted') {
                return null;
              }
              return (
                <div key={index} className="mb-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <Label htmlFor={`color-${index}`}>Colour</Label>
                      <Select
                        disabled={disabled}
                        value={option.name}
                        onValueChange={(value) => handleColorOptionChange(option.id, 'name', value)}
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
                        onChange={(e) => handleColorOptionChange(option.id, 'additionalCost', parseFloat(e.target.value) || 0)}
                        disabled={disabled}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveColorOption(option.id)}
                      disabled={disabled || (colorOptions?.length || 0) <= 1}
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Remove Option
                    </Button>
                  </div>
                </div>
              )
            }
            )}

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
            {weightOptions?.map((option, index) => {
              if (option?.status == 'deleted') {
                return null;
              }
              return (
                <div key={index} className="mb-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <Label htmlFor={`weight-${index}`}>Weight</Label>
                      <Select
                        disabled={true}
                        value="180gm"
                        onValueChange={() => { }}
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
                        onChange={(e) => handleWeightOptionChange(option.id, 'additionalCost', parseFloat(e.target.value) || 0)}
                        disabled={disabled}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveWeightOption(option.id)}
                      disabled={disabled || (weightOptions?.length || 0) <= 1}
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Remove Option
                    </Button>
                  </div>
                </div>
              )
            }
            )}

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
  }else{
    return (
      <div className="flex items-center justify-center h-[300px]">
      <svg className="h-8 w-8 text-blue-500 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z"/>
      </svg>

      </div>
    );
  }

};

export default PlantVinylPricing;
