import React from 'react';
import { Plant, PackagingPrice } from '@/data/plants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Factory, Plus, Trash2, Save } from 'lucide-react';
import PlantProfilePricing from './PlantProfilePricing';
import PlantProfileFeatures from './PlantProfileFeatures';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
      setPlant({...plant, [field]: value});
    }
  };

  const [packagingPricing, setPackagingPricing] = React.useState<PackagingPrice[]>(
    plant.packagingPricing || [
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
    ]
  );

  React.useEffect(() => {
    if (plant) {
      const updatedPricing = packagingPricing.map(item => {
        if ((item.type === 'inserts' && item.option.toLowerCase().includes('no')) || 
            (item.type === 'shrinkWrap' && item.option.toLowerCase() === 'no')) {
          return {
            ...item,
            prices: item.prices.map(price => ({ ...price, price: 0 }))
          };
        }
        return item;
      });
      
      setPackagingPricing(updatedPricing);
      handleChange('packagingPricing', updatedPricing);
    }
  // }, [packagingPricing, plant]);
}, []);


  const [equipment, setEquipment] = React.useState([
    {
      name: "Record Press",
      model: "Neumann VMS-70",
      description: "Vintage pressing machine for precise vinyl cutting"
    },
    {
      name: "Plating System",
      model: "Custom Electroplating Unit",
      description: "In-house developed system for highest quality metal plates"
    },
    {
      name: "Steam Boiler",
      model: "Industrial Grade ST-2000",
      description: "Energy-efficient steam generation for consistent pressing"
    },
    {
      name: "Hydraulic Press",
      model: "HydraTech 5000",
      description: "Modern pressing technology for consistent results"
    }
  ]);

  const [clients, setClients] = React.useState([
    {
      name: "Indie Records",
      type: "Label",
      notable: "Various indie artists"
    },
    {
      name: "Classic Vinyl Co.",
      type: "Distributor",
      notable: "Reissues of classic albums"
    },
    {
      name: "The Soundwaves",
      type: "Artist",
      notable: "Debut album 'Ocean Currents'"
    },
    {
      name: "Harmony Productions",
      type: "Label",
      notable: "Jazz and classical recordings"
    }
  ]);

  const addEquipment = () => {
    setEquipment([...equipment, { name: "", model: "", description: "" }]);
  };

  const updateEquipment = (index: number, field: string, value: string) => {
    const updatedEquipment = [...equipment];
    updatedEquipment[index] = { ...updatedEquipment[index], [field]: value };
    setEquipment(updatedEquipment);
  };

  const removeEquipment = (index: number) => {
    setEquipment(equipment.filter((_, i) => i !== index));
  };

  const addClient = () => {
    setClients([...clients, { name: "", type: "", notable: "" }]);
  };

  const updateClient = (index: number, field: string, value: string) => {
    const updatedClients = [...clients];
    updatedClients[index] = { ...updatedClients[index], [field]: value };
    setClients(updatedClients);
  };

  const removeClient = (index: number) => {
    setClients(clients.filter((_, i) => i !== index));
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
    const updatedPricing = [...packagingPricing];
    const priceItemIndex = updatedPricing.findIndex(p => p.type === type && p.option === option);
    
    if (priceItemIndex !== -1) {
      const highestQuantity = Math.max(...updatedPricing[priceItemIndex].prices.map(p => p.quantity));
      const lastPrice = updatedPricing[priceItemIndex].prices[updatedPricing[priceItemIndex].prices.length - 1].price;
      updatedPricing[priceItemIndex].prices.push({
        quantity: highestQuantity * 2,
        price: lastPrice * 0.9
      });
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

  const getPackagingOptions = (type: 'innerSleeve' | 'jacket' | 'inserts' | 'shrinkWrap') => {
    return packagingPricing.filter(p => p.type === type);
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

  const savePlantDetails = async () => {
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
      const { error: profileError } = await supabase
        .from('plants')
        .update({
          name: plant.name,
          location: plant.location,
          country: plant.country
        });
      
      if (profileError) {
        throw new Error(`Error saving plant profile: ${profileError.message}`);
      }
      
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
                    onClick={savePlantDetails} 
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
                  <Input 
                    id="turnaroundTime" 
                    value={plant.turnaround_time} 
                    onChange={(e) => handleChange('turnaround_time', e.target.value)}
                    disabled={disabled}
                  />
                </div>
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
                  <PlantProfilePricing 
                    plant={plant} 
                    setPlant={setPlant} 
                    disabled={disabled} 
                  />
                </TabsContent>
                
                <TabsContent value="packaging">
                  <div className="space-y-8">
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
                  </div>
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
          <Card>
            <CardHeader>
              <CardTitle>Manufacturing Equipment</CardTitle>
              <CardDescription>Manage the equipment used in your vinyl manufacturing process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {equipment.map((item, index) => (
                  <div key={index} className="p-4 border rounded-md bg-card">
                    <div className="flex items-center mb-4">
                      <Factory className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-semibold text-lg">Equipment #{index + 1}</h3>
                      {!disabled && (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => removeEquipment(index)}
                          className="ml-auto"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Equipment Name</Label>
                        <Input 
                          value={item.name} 
                          onChange={(e) => updateEquipment(index, 'name', e.target.value)}
                          disabled={disabled}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Model</Label>
                        <Input 
                          value={item.model} 
                          onChange={(e) => updateEquipment(index, 'model', e.target.value)}
                          disabled={disabled}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Description</Label>
                        <Textarea 
                          value={item.description} 
                          onChange={(e) => updateEquipment(index, 'description', e.target.value)}
                          disabled={disabled}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {!disabled && (
                  <Button onClick={addEquipment} className="mt-4">
                    Add Equipment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Notable Clients & Projects</CardTitle>
              <CardDescription>Manage the clients and projects your plant has worked with</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Notable Work</TableHead>
                      {!disabled && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input 
                            value={client.name} 
                            onChange={(e) => updateClient(index, 'name', e.target.value)}
                            disabled={disabled}
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            value={client.type} 
                            onChange={(e) => updateClient(index, 'type', e.target.value)}
                            disabled={disabled}
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            value={client.notable} 
                            onChange={(e) => updateClient(index, 'notable', e.target.value)}
                            disabled={disabled}
                          />
                        </TableCell>
                        {!disabled && (
                          <TableCell>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => removeClient(index)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {!disabled && (
                <Button onClick={addClient} className="mt-4">
                  Add Client
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlantProfileTabs;
