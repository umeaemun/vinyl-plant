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

const PlantReviews: React.FC<PlantVinylPricingProps> = ({
  plant,
  setPlant,
  disabled
}) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);
  const [clients, setClients] = React.useState<any[]>(null);

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

  const loadFromSupabase = async () => {

    try {

      const { data, error } = await supabase
        .from('plant_clients')
        .select('*')
        .eq('plant_id', plant.id);

      if (error) {
        throw new Error(`Error loading equipment data: ${error.message}`);
      }

      if (data && data.length > 0) {
        setClients(data);
      } else {
        setClients([
          {
            id: 1,
            name: "Indie Records",
            type: "Label",
            notable: "Various indie artists",
            status: "new"
          },
          {
            id: 2,
            name: "Classic Vinyl Co.",
            type: "Distributor",
            notable: "Reissues of classic albums",
            status: "new"
          },
          {
            id: 3,
            name: "The Soundwaves",
            type: "Artist",
            notable: "Debut album 'Ocean Currents'",
            status: "new"
          },
          {
            id: 4,
            name: "Harmony Productions",
            type: "Label",
            notable: "Jazz and classical recordings",
            status: "new"
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
  
       console.log("Saving equipment data to Supabase", clients);
  
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
  );
}

export default PlantReviews;
