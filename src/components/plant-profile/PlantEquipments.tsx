import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Factory, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Plant } from '@/data/plants';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';


interface PlantVinylPricingProps {
  plant: Plant;
  setPlant: React.Dispatch<React.SetStateAction<Plant | null>>;
  disabled: boolean;
}

const PlantEquipments: React.FC<PlantVinylPricingProps> = ({
  plant,
  setPlant,
  disabled
}) => {
  const { toast } = useToast();
  const [equipments, setEquipments] = React.useState<any[]>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const addEquipment = () => {
    setEquipments([...equipments, { id: Date.now(), name: "", model: "", description: "", status: 'new' }]);
  };

  const updateEquipment = (id: string, field: any, value: any) => {

    const updatedEquipments = equipments.map((item) => {
      if (item.id === id) {
        if (item.status === 'new') {
          return { ...item, [field]: value };
        } else if (item.status === 'same' || item.status === 'updated') {
          return { ...item, [field]: value, status: 'updated' };
        }
      }
      return item;
    });

    setEquipments(updatedEquipments);
  };

  const removeEquipment = (id: string) => {
    const updatedEquipments = equipments.map((item) => {
      if (item.id === id) {
        if (item.status !== 'new') {
          return { ...item, status: 'deleted' };
        }else {
          return { ...item, status: 'removeNow' };
        }

      }
      return item;
    });

    const filteredEquipments = updatedEquipments.filter((item) => item.status !== 'removeNow');
    setEquipments(filteredEquipments);
  }

  const loadFromSupabase = async () => {

    try {

      const { data, error } = await supabase
        .from('plant_equipments')
        .select('*')
        .eq('plant_id', plant.id);

      if (error) {
        throw new Error(`Error loading equipment data: ${error.message}`);
      }

      if (data && data.length > 0) {
        const formattedData = data.map((item: any) => ({
          ...item,
          status: 'same',
        }));
        setEquipments(formattedData);
      } else {
        setEquipments([
          {
            id: 1,
            name: "Record Press",
            model: "Neumann VMS-70",
            description: "Vintage pressing machine for precise vinyl cutting",
            status: 'new'
          },
          {
            id: 2,
            name: "Plating System",
            model: "Custom Electroplating Unit",
            description: "In-house developed system for highest quality metal plates",
            status: 'new'

          },
          {
            id: 3,
            name: "Steam Boiler",
            model: "Industrial Grade ST-2000",
            description: "Energy-efficient steam generation for consistent pressing",
            status: 'new'
          },
          {
            id: 4,
            name: "Hydraulic Press",
            model: "HydraTech 5000",
            description: "Modern pressing technology for consistent results",
            status: 'new'
          }
        ]);
      }

    } catch (error) {
      console.error('Error loading equipment data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while loading equipment data",
        variant: "destructive"
      });

    }
  }

  React.useEffect(() => {

    if (plant && plant.id && !equipments) {
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

      console.log("Saving equipment data to Supabase", equipments);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manufacturing Equipment</CardTitle>
        <div className="flex items-center justify-between">
          <CardDescription>Manage the equipments used in your vinyl manufacturing process</CardDescription>
          {!disabled && (
            <div className="flex justify-end mb-4">
              <Button
                onClick={saveToSupabase}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? "Saving..." : "Save Details"}
                {!isSaving && <Save className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {equipments?.map((item, index) => (
            <div key={index} className="p-4 border rounded-md bg-card">
              <div className="flex items-center mb-4">
                <Factory className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-semibold text-lg">Equipment #{index + 1}</h3>
                {!disabled && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeEquipment(item.id)}
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
                    onChange={(e) => updateEquipment(item.id, 'name', e.target.value)}
                    disabled={disabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input
                    value={item.model}
                    onChange={(e) => updateEquipment(item.id, 'model', e.target.value)}
                    disabled={disabled}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) => updateEquipment(item.id, 'description', e.target.value)}
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
  );
}
export default PlantEquipments;