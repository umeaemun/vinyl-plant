import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Factory, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Plant } from '@/data/plants';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';

interface PlantVinylPricingProps {
  plant: Plant;
  setPlant: React.Dispatch<React.SetStateAction<Plant | null>>;
  disabled: boolean;
}

const PlantClients: React.FC<PlantVinylPricingProps> = ({
  plant,
  setPlant,
  disabled
}) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);
  const [clients, setClients] = React.useState<any[]>(null);

  const addClient = () => {
    setClients([...clients, { id: Date.now(), name: "", type: "", notable_work: "", status: 'new' }]);
  };

  const updateClient = (id: string, field: any, value: any) => {

    const updatedClients = clients.map((item) => {
      if (item.id === id) {
        if (item.status === 'new') {
          return { ...item, [field]: value };
        } else if (item.status === 'same' || item.status === 'updated') {
          return { ...item, [field]: value, status: 'updated' };
        }
      }
      return item;
    });
    setClients(updatedClients);

  };

  const removeClient = (id: string) => {

    const updatedClients = clients.map((item) => {
      if (item.id === id) {
        if (item.status !== 'new') {
          return { ...item, status: 'deleted' };
        } else {
          return { ...item, status: 'removeNow' };
        }
      }
      return item;
    });

    const filteredClients = updatedClients.filter((item) => item.status !== 'removeNow');
    setClients(filteredClients);
  };

  const loadFromSupabase = async () => {

    try {

      const { data, error } = await supabase
        .from('plant_clients')
        .select('*')
        .eq('plant_id', plant.id);

      if (error) {
        throw new Error(`Error loading clients data: ${error.message}`);
      }

      if (data && data.length > 0) {

        const formattedData = data.map((item: any) => ({
          ...item,
          status: 'same',
        }));
        setClients(formattedData);

      } else {
        setClients([
          {
            id: 1,
            name: "Indie Records",
            type: "Label",
            notable_work: "Various indie artists",
            status: "new"
          },
          {
            id: 2,
            name: "Classic Vinyl Co.",
            type: "Distributor",
            notable_work: "Reissues of classic albums",
            status: "new"
          },
          {
            id: 3,
            name: "The Soundwaves",
            type: "Artist",
            notable_work: "Debut album 'Ocean Currents'",
            status: "new"
          },
          {
            id: 4,
            name: "Harmony Productions",
            type: "Label",
            notable_work: "Jazz and classical recordings",
            status: "new"
          }
        ]);
      }

    } catch (error) {
      console.error('Error loading clients data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while loading clients data",
        variant: "destructive"
      });

    }
  }

  React.useEffect(() => {

    if (plant && plant.id && !clients) {
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

      console.log("Saving clients data to Supabase", clients);

      // Filter out items with status 'deleted'
      const deletedClients = clients.filter((item) => item.status == 'deleted');
      const a = deletedClients.map(async (item) => {
        const { error } = await supabase
          .from('plant_clients')
          .delete()
          .eq('id', item.id)
          .eq('plant_id', plant.id);
        if (error) {
          throw new Error(`Error deleting clients data: ${error.message}`);
        }
      });

      // Filter out items with status 'new'
      const newClients = clients.filter((item) => item.status == 'new');
      const b = newClients.map(async (item) => {
        const { error } = await supabase
          .from('plant_clients')
          .insert({
            plant_id: plant.id,
            name: item.name,
            type: item.type,
            notable_work: item.notable_work,
          });
        if (error) {
          throw new Error(`Error inserting clients data: ${error.message}`);
        }
      });

      // Filter out items with status 'updated'
      const updatedClients = clients.filter((item) => item.status == 'updated');
      const c = updatedClients.map(async (item) => {
        const { error } = await supabase
          .from('plant_clients')
          .update({
            name: item.name,
            type: item.type,
            notable_work: item.notable_work,
          })
          .eq('id', item.id)
          .eq('plant_id', plant.id);
        if (error) {
          throw new Error(`Error updating clients data: ${error.message}`);
        }
      });

      await Promise.all([...a, ...b, ...c]);

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
        <CardTitle>Notable Clients & Projects</CardTitle>
        <div className="flex items-center justify-between">
          <CardDescription>Manage the clients and projects your plant has worked with</CardDescription>
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
              {clients?.map((client, index) => {
                if (client?.status === 'deleted' || client?.status === 'removeNow') {
                  return null;
                }
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={client.name}
                        onChange={(e) => updateClient(client.id, 'name', e.target.value)}
                        disabled={disabled}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={client.type}
                        onChange={(e) => updateClient(client.id, 'type', e.target.value)}
                        disabled={disabled}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={client.notable_work}
                        onChange={(e) => updateClient(client.id, 'notable_work', e.target.value)}
                        disabled={disabled}
                      />
                    </TableCell>
                    {!disabled && (
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeClient(client.id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                )
              }
              )}
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
  );
}

export default PlantClients;
