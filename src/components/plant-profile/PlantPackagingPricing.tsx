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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';

interface PlantPackagingPricingProps {
  plant: Plant;
  setPlant: React.Dispatch<React.SetStateAction<Plant | null>>;
  disabled: boolean;
}

const PlantPackagingPricing: React.FC<PlantPackagingPricingProps> = ({
  plant,
  setPlant,
  disabled
}) => {

  // console.log("plant", plant);
  const { toast } = useToast();


  const [packagingPricing, setPackagingPricing] = React.useState<any[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  // const handleAddPriceTier = () => {
  //   const newVinylPricing = [...vinylPricing, {
  //     id: Date.now().toString(),
  //     quantity: 50,
  //     size: '12"',
  //     type: '1LP',
  //     price: 0,
  //     status: 'new'
  //   }];
  //   setVinylPricing(newVinylPricing);

  // };

  // const handleRemovePriceTier = (id: string) => {

  //   const newVinylPricing = vinylPricing.map((tier) => {
  //     return tier.id == id ? { ...tier, status: 'deleted' } : tier;
  //   })

  //   setVinylPricing(newVinylPricing);
  // };

  // const handlePriceTierChange = (id: string, field: keyof PriceTier, value: any) => {

  //   // update the vinyl pricing state
  //   const newVinylPricing = vinylPricing.map((tier) => {
  //     if (tier.id === id) {
  //       if (tier.status == 'new') {
  //         return { ...tier, [field]: value };
  //       } else if (tier.status == 'same' || tier.status == 'updated') {
  //         return { ...tier, [field]: value, status: 'updated' };
  //       }
  //     }
  //     return tier;
  //   });

  //   setVinylPricing(newVinylPricing);
  // };

  const updatePackagingPrice = (
    type: 'innerSleeve' | 'jacket' | 'inserts' | 'shrinkWrap',
    option: string,
    quantityIndex: number,
    field: 'quantity' | 'price',
    value: number
  ) => {
    const updatedPricing = [...packagingPricing];
    const priceItemIndex = updatedPricing.findIndex(p => p.type === type && p.option === option);

    if (priceItemIndex !== -1) {
      if ((type === 'inserts' && option.toLowerCase().includes('no')) ||
        (type === 'shrinkWrap' && option.toLowerCase() === 'no')) {
        if (field === 'price') {
          value = 0; // Force price to be 0
        }
      }

      updatedPricing[priceItemIndex].prices[quantityIndex][field] = value;
      setPackagingPricing(updatedPricing);
    }
  };

  const addPriceTier = (type: 'innerSleeve' | 'jacket' | 'inserts' | 'shrinkWrap', option: string) => {
    // const updatedPricing = [...packagingPricing];
    // const priceItemIndex = updatedPricing.findIndex(p => p.type === type && p.option === option);

    // if (priceItemIndex !== -1) {
    //   const highestQuantity = Math.max(...updatedPricing[priceItemIndex].prices.map(p => p.quantity));
    //   const lastPrice = updatedPricing[priceItemIndex].prices[updatedPricing[priceItemIndex].prices.length - 1].price;
    //   updatedPricing[priceItemIndex].prices.push({
    //     quantity: highestQuantity * 2,
    //     price: lastPrice * 0.9
    //   });
    //   setPackagingPricing(updatedPricing);
    // }
  };

  const removePriceTier = (type: 'innerSleeve' | 'jacket' | 'inserts' | 'shrinkWrap', option: string, quantityIndex: number) => {
    const updatedPricing = [...packagingPricing];
    const priceItemIndex = updatedPricing.findIndex(p => p.type === type && p.option === option);

    if (priceItemIndex !== -1 && updatedPricing[priceItemIndex].prices.length > 1) {
      updatedPricing[priceItemIndex].prices.splice(quantityIndex, 1);
      setPackagingPricing(updatedPricing);
    }
  };

  const loadFromSupabase = async () => {

    const getPackagingPricing = async () => {
      const { data: packagingPricing, error } = await supabase
        .from('packaging_pricing')
        .select('*')
        .eq('plant_id', plant.id);
      if (error) {
        console.error('Error fetching packaging pricing:', error);
        return [];
      }
      // add a field to each packaging pricing object
      const updatedPackagingPricing = packagingPricing.map((pricing: any) => ({
        ...pricing,
        status: 'same',
      }));


      if (updatedPackagingPricing.length > 0) {
        setPackagingPricing(updatedPackagingPricing);
      } else {
        setPackagingPricing([
          {
            type: 'innerSleeve',
            option: 'White Paper',
            prices: [{ quantity: 100, price: 0.5 }]
          },
          {
            type: 'innerSleeve',
            option: 'White Poly-lined',
            prices: [{ quantity: 100, price: 0.75 }]
          },
          {
            type: 'innerSleeve',
            option: 'Black Paper',
            prices: [{ quantity: 100, price: 0.6 }]
          },
          {
            type: 'innerSleeve',
            option: 'Black Poly-lined',
            prices: [{ quantity: 100, price: 0.85 }]
          },
          {
            type: 'innerSleeve',
            option: 'Printed',
            prices: [{ quantity: 100, price: 1.25 }]
          },
          {
            type: 'jacket',
            option: 'Single Pocket (3mm Spine)',
            prices: [{ quantity: 100, price: 2.0 }]
          },
          {
            type: 'jacket',
            option: 'Single Pocket (5mm Spine)',
            prices: [{ quantity: 100, price: 2.5 }]
          },
          {
            type: 'jacket',
            option: 'Gatefold Jacket',
            prices: [{ quantity: 100, price: 4.0 }]
          },
          {
            type: 'inserts',
            option: 'No Insert',
            prices: [{ quantity: 100, price: 0 }]
          },
          {
            type: 'inserts',
            option: 'Single Insert',
            prices: [{ quantity: 100, price: 0.75 }]
          },
          {
            type: 'shrinkWrap',
            option: 'Yes',
            prices: [{ quantity: 100, price: 0.25 }]
          },
          {
            type: 'shrinkWrap',
            option: 'No',
            prices: [{ quantity: 100, price: 0 }]
          },
        ]);
      }
    }

    getPackagingPricing();

  }

  console.log("packagingPricing", packagingPricing);

  React.useEffect(() => {

    if (plant && plant.id) {
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

      // // filter out deleted tiers
      // const deletedVinylPricing = vinylPricing.filter(tier => tier.status == 'deleted');
      // deletedVinylPricing.forEach(async tier => {
      //   const { data: deletedVinylPricingData, error: deletedVinylPricingError } = await supabase
      //     .from('vinyl_pricing')
      //     .delete()
      //     .eq('id', tier.id)
      //     .eq('plant_id', plant.id);

      //   if (deletedVinylPricingError) {
      //     console.error('Error deleting vinyl pricing:', deletedVinylPricingError);
      //     throw new Error(`Error deleting vinyl pricing: ${deletedVinylPricingError.message}`);
      //   }
      // })

      // // filter out new tiers
      // const newVinylPricing = vinylPricing.filter(tier => tier.status == 'new');
      // const newVinylPricingData = newVinylPricing.forEach(async tier => {
      //   const { data: newVinylPricingData, error: newVinylPricingError } = await supabase
      //     .from('vinyl_pricing')
      //     .insert({
      //       plant_id: plant.id,
      //       quantity: tier.quantity,
      //       size: tier.size,
      //       type: tier.type,
      //       price: tier.price
      //     })
      //     .select();

      //   if (newVinylPricingError) {
      //     console.error('Error saving vinyl pricing:', newVinylPricingError);
      //     throw new Error(`Error saving vinyl pricing: ${newVinylPricingError.message}`);
      //   }
      // });


      // // filter out updated tiers
      // const updatedVinylPricing = vinylPricing.filter(tier => tier.status == 'updated');
      // const updatedVinylPricingData = updatedVinylPricing.forEach(async tier => {
      //   const { data: updatedVinylPricingData, error: updatedVinylPricingError } = await supabase
      //     .from('vinyl_pricing')
      //     .update({
      //       quantity: tier.quantity,
      //       size: tier.size,
      //       type: tier.type,
      //       price: tier.price
      //     })
      //     .eq('id', tier.id)
      //     .eq('plant_id', plant.id)
      //     .select();

      //   if (updatedVinylPricingError) {
      //     console.error('Error saving vinyl pricing:', updatedVinylPricingError);
      //     throw new Error(`Error saving vinyl pricing: ${updatedVinylPricingError.message}`);
      //   }
      // });


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



  const getTypeName = (type: 'innerSleeve' | 'jacket' | 'inserts' | 'shrinkWrap') => {
    switch (type) {
      case 'innerSleeve': return 'Inner Sleeve';
      case 'jacket': return 'Jacket';
      case 'inserts': return 'Inserts';
      case 'shrinkWrap': return 'Shrink Wrap';
      default: return type;
    }
  };

  const getPackagingOptions = (type: 'innerSleeve' | 'jacket' | 'inserts' | 'shrinkWrap') => {
    return packagingPricing.filter(p => p.type === type);
  };


  return (
    <div className="space-y-8">
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

      {(['innerSleeve', 'jacket', 'inserts', 'shrinkWrap'] as const).map(type => (
        <Card key={type}>
          <CardHeader>
            <CardTitle>{getTypeName(type)}</CardTitle>
            <CardDescription>
              Set pricing for different {getTypeName(type).toLowerCase()} options
            </CardDescription>
          </CardHeader>
          <CardContent>
            {getPackagingOptions(type).map((option, optionIndex) => (
              <div key={optionIndex} className="mb-8 last:mb-0">
                <h4 className="text-lg font-medium mb-4">
                  {option.option}
                  {((type === 'inserts' && option.option.toLowerCase().includes('no')) ||
                    (type === 'shrinkWrap' && option.option.toLowerCase() === 'no')) && (
                      <span className="text-sm text-muted-foreground ml-2">(Always $0)</span>
                    )}
                </h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">Quantity</TableHead>
                        <TableHead className="w-1/3">Price Per Unit ($)</TableHead>
                        <TableHead className="w-1/3">
                          {!disabled && <span>Actions</span>}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {option.prices.map((price, priceIndex) => (
                        <TableRow key={priceIndex}>
                          <TableCell>
                            <Input
                              type="number"
                              value={price.quantity}
                              onChange={(e) => updatePackagingPrice(
                                type,
                                option.option,
                                priceIndex,
                                'quantity',
                                parseInt(e.target.value) || 0
                              )}
                              disabled={disabled}
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={price.price}
                              onChange={(e) => updatePackagingPrice(
                                type,
                                option.option,
                                priceIndex,
                                'price',
                                parseFloat(e.target.value) || 0
                              )}
                              disabled={disabled ||
                                (type === 'inserts' && option.option.toLowerCase().includes('no')) ||
                                (type === 'shrinkWrap' && option.option.toLowerCase() === 'no')}
                              className="w-full"
                              step="0.01"
                            />
                          </TableCell>
                          <TableCell>
                            {!disabled && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removePriceTier(type, option.option, priceIndex)}
                                disabled={option.prices.length <= 1}
                                className="w-full"
                              >
                                Remove
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>

                      ))}
                      {!disabled && (
                        <Button
                          onClick={() => addPriceTier(type, option.option)}
                          className="mt-4"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Quantity Tier
                        </Button>
                      )}
                    </TableBody>
                  </Table>
                </div>

              </div>
            ))}


          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlantPackagingPricing;
