import React from 'react';
import { Plant } from '@/data/plants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Save } from 'lucide-react';
import PlantVinylPricing from './PlantVinylPricing';
import PlantPackagingPricing from './PlantPackagingPricing';
import PlantProfileFeatures from './PlantProfileFeatures';
import PlantEquipments from './PlantEquipments';
import PlantClients from './PlantClients';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PlantProfileTabsProps {
  plant: Plant;
  setPlant: React.Dispatch<React.SetStateAction<Plant | null>>;
  disabled: boolean;
}

const PlantProfileTabs: React.FC<PlantProfileTabsProps> = ({
  plant,
  setPlant,
  disabled
}) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleChange = (field: keyof Plant, value: any) => {
    if (plant) {
      setPlant({ ...plant, [field]: value });
    }
  };

  const savePlantDescription = async () => {
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
      console.log('Saving plant details:', plant);

      const { data, error: profileError } = await supabase
        .from('plants')
        .update({
          image_url: plant.image_url,
          name: plant.name,
          location: plant.location,
          country: plant.country,
          website: plant.website,
          description: plant.description,
          minimum_order: plant.minimum_order,
          turnaround_time: plant.turnaround_time,
          split_manufacturing_capable: plant.split_manufacturing_capable,
        })
        .eq('id', plant.id)
        .select()
        .single();

      if (profileError) {
        throw new Error(`Error saving plant profile: ${profileError.message}`);
      }

      console.log('Plant profile updated successfully', data);
      toast({
        title: "Success",
        description: "Plant details saved successfully"
      });
    } catch (error) {
      console.error('Error saving plant details:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while saving plant details",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="md:col-span-2">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-6 grid grid-cols-5 gap-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="features">Specialties</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plant Details</CardTitle>
              <CardDescription>Manage your plant's description and key metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!disabled && (
                <div className="flex justify-end mb-4">
                  <Button
                    onClick={savePlantDescription}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? "Saving..." : "Save Details"}
                    {!isSaving && <Save className="h-4 w-4" />}
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={plant.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  disabled={disabled}
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minimumOrder">Minimum Order</Label>
                  <Input
                    id="minimumOrder"
                    type="number"
                    value={plant.minimum_order}
                    onChange={(e) => handleChange('minimum_order', parseInt(e.target.value) || 0)}
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="turnaroundTime">Turnaround Time</Label>
                  {/* <Input 
                    id="turnaroundTime" 
                    value={plant.turnaround_time} 
                    onChange={(e) => handleChange('turnaround_time', e.target.value)}
                    disabled={disabled}
                  /> */}
                  <Select
                    value={plant.turnaround_time}
                    onValueChange={(value) => { handleChange('turnaround_time', value) }}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under8">Under 8 weeks</SelectItem>
                      <SelectItem value="8to12">8-12 weeks</SelectItem>
                      <SelectItem value="over12">Over 12 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex">
                <Checkbox
                  className='mt-5'
                  checked={plant.split_manufacturing_capable}
                  onCheckedChange={(value) => { handleChange('split_manufacturing_capable', value) }}
                  disabled={disabled}
                />
                <p className="flex ml-4 mt-4">Split manufacturing capable across different locations</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Management</CardTitle>
              <CardDescription>Configure your vinyl and packaging pricing options</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="vinyl" className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-6">
                  <TabsTrigger value="vinyl">Vinyl Pricing</TabsTrigger>
                  <TabsTrigger value="packaging">Packaging Pricing</TabsTrigger>
                </TabsList>

                <TabsContent value="vinyl">
                  <PlantVinylPricing
                    plant={plant}
                    setPlant={setPlant}
                    disabled={disabled}
                  />
                </TabsContent>

                <TabsContent value="packaging">
                  {/* <div className="space-y-8">
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
                                  </TableBody>
                                </Table>
                              </div>
                              {!disabled && (
                                <Button 
                                  onClick={() => addPriceTier(type, option.option)} 
                                  className="mt-4"
                                  variant="outline"
                                >
                                  <Plus className="h-4 w-4 mr-2" /> Add Quantity Tier
                                </Button>
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div> */}
                  <PlantPackagingPricing
                    plant={plant}
                    setPlant={setPlant}
                    disabled={disabled}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <PlantProfileFeatures
            plant={plant}
            setPlant={setPlant}
            disabled={disabled}
          />
        </TabsContent>

        <TabsContent value="equipment">
          <PlantEquipments
            plant={plant}
            setPlant={setPlant}
            disabled={disabled}
          />
        </TabsContent>

        <TabsContent value="clients">
          <PlantClients
            plant={plant}
            setPlant={setPlant}
            disabled={disabled}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlantProfileTabs;
