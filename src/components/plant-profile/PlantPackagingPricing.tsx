import React from 'react';
import { Plant } from '@/data/plants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PlantPackagingPricingProps {
  plant: Plant;
  disabled: boolean;
  selectedCurrency: string;
  setSelectedCurrency: React.Dispatch<React.SetStateAction<string>>;
}

const PlantPackagingPricing: React.FC<PlantPackagingPricingProps> = ({
  plant,
  disabled,
  selectedCurrency,
  setSelectedCurrency
}) => {

  // console.log("plant", plant);
  const { toast } = useToast();


  const [packagingPricing, setPackagingPricing] = React.useState<any[]>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const namingConvention = {
    "white-paper": "White Paper",
    "white-poly-lined": "White Poly-lined",
    "black-paper": "Black Paper",
    "black-poly-lined": "Black Poly-lined",
    "printed": "Printed",
    "single-pocket-3mm": "Single Pocket (3mm Spine)",
    "single-pocket-5mm": "Single Pocket (5mm Spine)",
    "gatefold": "Gatefold",
    "no-insert": "No Insert",
    "single-insert": "Single Insert",
    "yes": "Yes",
    "no": "No"
  }

  const addPriceTier = (type: 'innerSleeve' | 'jacket' | 'inserts' | 'shrinkWrap', option: string) => {

    const updatedPricing = [...packagingPricing];
    const priceItemIndex = updatedPricing.findIndex(p => p.type === type && p.option === option);

    if (priceItemIndex !== -1) {
      const highestQuantity = Math.max(...updatedPricing[priceItemIndex].prices.map(p => p.quantity));
      const lastPrice = updatedPricing[priceItemIndex].prices[updatedPricing[priceItemIndex].prices.length - 1].price;
      updatedPricing[priceItemIndex].prices.push({
        quantity: highestQuantity * 2,
        price: (lastPrice * 0.9).toFixed(2),
      });
      setPackagingPricing(updatedPricing);
    }

  };

  const updatePackagingPrice = (
    type: 'innerSleeve' | 'jacket' | 'inserts' | 'shrinkWrap',
    option: string,
    quantityIndex: number,
    field: 'quantity' | 'price',
    value: number
  ) => {
    const updatedPricing = [...packagingPricing];
    const priceItemIndex = updatedPricing.findIndex(p => p.type === type && p.option === option);

    // found
    if (priceItemIndex !== -1) {

      if ((type === 'inserts' && option.toLowerCase().includes('no')) || (type === 'shrinkWrap' && option.toLowerCase() === 'no')) {
        if (field === 'price') {
          value = 0; // Force price to be 0
        }
      }

      updatedPricing[priceItemIndex].prices[quantityIndex][field] = value;
      setPackagingPricing(updatedPricing);

    }
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
        .eq('plant_id', plant.id)
        .order('type, option, prices->quantity', { ascending: true });
      if (error) {
        console.error('Error fetching packaging pricing:', error);
        return [];
      }

      // add a field to each packaging pricing object
      const updatedPackagingPricing = packagingPricing.map((row: any) => {
        // const prices = JSON.parse(row.prices);
        const prices = row.prices.map((price: any) => ({
          quantity: price.quantity,
          price: price.price,
        }));

        return {
          ...row,
          prices: prices,
        };

      });

      if (updatedPackagingPricing.length > 0) {
        setPackagingPricing(updatedPackagingPricing);
      } else {
        setPackagingPricing([
          {
            type: 'innerSleeve',
            // option: 'White Paper',
            option: 'white-paper',
            prices: [{ quantity: 100, price: 0.5 }]
          },
          {
            type: 'innerSleeve',
            // option: 'White Poly-lined',
            option: 'white-poly-lined',
            prices: [{ quantity: 100, price: 0.75 }]
          },
          {
            type: 'innerSleeve',
            // option: 'Black Paper',
            option: 'black-paper',
            prices: [{ quantity: 100, price: 0.6 }]
          },
          {
            type: 'innerSleeve',
            // option: 'Black Poly-lined',
            option: 'black-poly-lined',
            prices: [{ quantity: 100, price: 0.85 }]
          },
          {
            type: 'innerSleeve',
            // option: 'Printed',
            option: 'printed',
            prices: [{ quantity: 100, price: 1.25 }]
          },
          {
            type: 'jacket',
            // option: 'Single Pocket (3mm Spine)',
            option: 'single-pocket-3mm',
            prices: [{ quantity: 100, price: 2.0 }]
          },
          {
            type: 'jacket',
            // option: 'Single Pocket (5mm Spine)',
            option: 'single-pocket-5mm',
            prices: [{ quantity: 100, price: 2.5 }]
          },
          {
            type: 'jacket',
            // option: 'Gatefold Jacket',
            option: 'gatefold',
            prices: [{ quantity: 100, price: 4.0 }]
          },
          {
            type: 'inserts',
            // option: 'No Insert',
            option: 'no-insert',
            prices: [{ quantity: 100, price: 0 }]
          },
          {
            type: 'inserts',
            // option: 'Single Insert',
            option: 'single-insert',
            prices: [{ quantity: 100, price: 0.75 }]
          },
          {
            type: 'shrinkWrap',
            // option: 'Yes',
            option: 'yes',
            prices: [{ quantity: 100, price: 0.25 }]
          },
          {
            type: 'shrinkWrap',
            // option: 'No',
            option: 'no',
            prices: [{ quantity: 100, price: 0 }]
          },
        ]
        );
      }
    }

    getPackagingPricing();

  }


  React.useEffect(() => {

    if (plant && plant.id && !packagingPricing) {
      // console.log("Loading packaging pricing from Supabase");
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

      // console.log("Saving packaging pricing to Supabase", packagingPricing);

      // upsert the row in the database

      const pricingUpdates = packagingPricing.map(async (obj) => {
        const { type, option, prices } = obj;

        const { data: existingData, error: existingError } = await supabase
          .from('packaging_pricing')
          .select('*')
          .eq('plant_id', plant.id)
          .eq('type', type)
          .eq('option', option);

        if (existingError) {
          console.error('Error fetching existing packaging pricing:', existingError);
          return;
        }

        if (existingData && existingData.length > 0) {
          // Update existing row

          const { data, error } = await supabase
            .from('packaging_pricing')
            .update({
              prices: prices
            })
            .eq('plant_id', plant.id)
            .eq('type', type)
            .eq('option', option)
            .select();

          if (error) {
            console.error('Error saving packaging pricing:', error);
          }

        }
        else {
          // Insert new row
          const { data, error } = await supabase
            .from('packaging_pricing')
            .insert({
              plant_id: plant.id,
              type,
              option,
              prices: prices
            })
            .select();

          if (error) {
            console.error('Error saving packaging pricing:', error);
          }
        }
      });


      await Promise.all(pricingUpdates);

      loadFromSupabase();

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
    const options = packagingPricing?.filter(p => p.type === type) || [];
    options.map(obj => {
      obj.prices.sort((a: any, b: any) => a.price - b.price);
      return obj;
    });

    return options;
  };

  if (packagingPricing) {

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
              {getPackagingOptions(type).map((obj, optionIndex) => {
                return (
                  <div key={optionIndex} className="mb-8 last:mb-0">
                    <h4 className="text-lg font-medium mb-4">
                      {namingConvention[obj.option] || obj.option}
                      {((type === 'inserts' && obj.option.toLowerCase().includes('no')) ||
                        (type === 'shrinkWrap' && obj.option.toLowerCase() === 'no')) && (
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
                          {obj?.prices?.map((price, priceIndex) => {

                            return <TableRow key={priceIndex}>
                              {/* quantity */}
                              <TableCell>
                                <Input
                                  type="number"
                                  value={price.quantity}
                                  onChange={(e) => updatePackagingPrice(
                                    type,
                                    obj.option,
                                    priceIndex,
                                    'quantity',
                                    parseInt(e.target.value) || 0
                                  )}
                                  disabled={disabled}
                                  className="w-full"
                                />
                              </TableCell>

                              {/* price */}
                              <TableCell>
                                <Input
                                  type="number"
                                  value={price.price}
                                  onChange={(e) => updatePackagingPrice(
                                    type,
                                    obj.option,
                                    priceIndex,
                                    'price',
                                    parseFloat(e.target.value) || 0
                                  )}
                                  disabled={disabled ||
                                    (type === 'inserts' && obj.option.toLowerCase().includes('no')) ||
                                    (type === 'shrinkWrap' && obj.option.toLowerCase() === 'no')}
                                  className="w-full"
                                  step="0.01"
                                />
                              </TableCell>

                              {/* actions */}
                              <TableCell>
                                {!disabled && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removePriceTier(type, obj.option, priceIndex)}
                                    disabled={obj.prices.length <= 1}
                                    className="w-full"
                                  >
                                    Remove
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    {!disabled && (
                      <Button
                        onClick={() => addPriceTier(type, obj.option)}
                        className="mt-4"
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Quantity Tier
                      </Button>
                    )}
                  </div>
                )
              }
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );

  } else {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <svg className="h-8 w-8 text-blue-500 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z" />
        </svg>

      </div>
    );
  }

};

export default PlantPackagingPricing;
