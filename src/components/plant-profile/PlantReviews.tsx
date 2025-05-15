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
  const [reviews, setReviews] = React.useState<any[]>(null);

  const addReview = () => {
    setReviews([...reviews, { id: Date.now(), name: "", type: "", notable: "", status: 'new' }]);
  };

  const updateReview = (id: string, field: any, value: any) => {

    const updatedReviews = reviews.map((item) => {
      if (item.id === id) {
        if (item.status === 'new') {
          return { ...item, [field]: value };
        } else if (item.status === 'same' || item.status === 'updated') {
          return { ...item, [field]: value, status: 'updated' };
        }
      }
      return item;
    });
    setReviews(updatedReviews);

  };

  const removeReview = (id: string) => {

    const updatedReviews = reviews.map((item) => {
      if (item.id === id) {
        if (item.status !== 'new') {
          return { ...item, status: 'deleted' };
        } else {
          return { ...item, status: 'removeNow' };
        }
      }
      return item;
    });

    const filteredReviews = updatedReviews.filter((item) => item.status !== 'removeNow');
    setReviews(filteredReviews);
  };

  const loadFromSupabase = async () => {

    try {

      const { data, error } = await supabase
        .from('plant_reviews')
        .select('*')
        .eq('plant_id', plant.id);

      if (error) {
        throw new Error(`Error loading reviews data: ${error.message}`);
      }

      if (data && data.length > 0) {

        const formattedData = data.map((item: any) => ({
          ...item,
          status: 'same',
        }));
        setReviews(formattedData);

      } else {
        setReviews([
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
      console.error('Error loading reviews data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while loading reviews data",
        variant: "destructive"
      });

    }
  }

  React.useEffect(() => {

    if (plant && plant.id && !reviews) {
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

      console.log("Saving reviews data to Supabase", reviews);

      // Filter out items with status 'deleted'
      const deletedReviews = reviews.filter((item) => item.status == 'deleted');
      deletedReviews.forEach(async (item) => {
        const { error } = await supabase
          .from('plant_reviews')
          .delete()
          .eq('id', item.id)
          .eq('plant_id', plant.id);
        if (error) {
          throw new Error(`Error deleting reviews data: ${error.message}`);
        }
      });

      // Filter out items with status 'new'
      const newReviews = reviews.filter((item) => item.status == 'new');
      newReviews.forEach(async (item) => {
        const { error } = await supabase
          .from('plant_reviews')
          .insert({
            plant_id: plant.id,
            name: item.name,
            type: item.type,
            notable_work: item.notable,
          });
        if (error) {
          throw new Error(`Error inserting reviews data: ${error.message}`);
        }
      });

      // Filter out items with status 'updated'
      const updatedReviews = reviews.filter((item) => item.status == 'updated');
      updatedReviews.forEach(async (item) => {
        const { error } = await supabase
          .from('plant_reviews')
          .update({
            name: item.name,
            type: item.type,
            notable_work: item.notable,
          })
          .eq('id', item.id)
          .eq('plant_id', plant.id);
        if (error) {
          throw new Error(`Error updating reviews data: ${error.message}`);
        }
      });

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
              {reviews.map((review, index) => {
                if (review?.status === 'deleted' || review?.status === 'removeNow') {
                  return null;
                }
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={review.name}
                        onChange={(e) => updateReview(review.id, 'name', e.target.value)}
                        disabled={disabled}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={review.type}
                        onChange={(e) => updateReview(review.id, 'type', e.target.value)}
                        disabled={disabled}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={review.notable}
                        onChange={(e) => updateReview(review.id, 'notable', e.target.value)}
                        disabled={disabled}
                      />
                    </TableCell>
                    {!disabled && (
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeReview(review.id)}
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
          <Button onClick={addReview} className="mt-4">
            Add Client
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default PlantReviews;
