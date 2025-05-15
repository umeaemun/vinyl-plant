
import React, { useEffect } from 'react';
import { Plant, features as featuresList, getFeatureName, getFeatureDescription } from '@/data/plants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';


interface PlantProfileFeaturesProps {
  plant: Plant;
  setPlant: React.Dispatch<React.SetStateAction<Plant | null>>;
  disabled: boolean;
}

const PlantProfileFeatures: React.FC<PlantProfileFeaturesProps> = ({
  plant,
  setPlant,
  disabled
}) => {

  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);  
  const [features, setFeatures] = React.useState<any[]>(plant.features || []); // Initialize with plant features


  const handleFeatureToggle = (featureId: string, checked: boolean) => {

    if (checked) {
      // Add feature
      setFeatures([...features, featureId]);
    } else {
      // Remove feature
      setFeatures(features.filter(id => id !== featureId));
    }
  };


  // Filter features based on search query
  const filteredFeatures = featuresList.filter(feature =>
    feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const savePlantFeatures = async () => {
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
          const { data, error: featureError } = await supabase
            .from('plants')
            .update({
              features: features
            })
            .eq('id', plant.id)
            .select()
            .single();
       
          if (featureError) {
            throw new Error(`Error saving plant features: ${featureError.message}`);
          }
          
          // console.log('Plant features updated successfully', data);
          toast({
            title: "Success",
            description: "Plant features saved successfully"
          });
        } catch (error) {
          console.error('Error saving plant features:', error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "An error occurred while saving plant features",
            variant: "destructive"
          });
        } finally {
          setIsSaving(false);
        }

  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Specialties & Capabilities</CardTitle>
        <div className="flex items-center justify-between">
        <CardDescription>Select the specialties that your plant offers</CardDescription>
        {!disabled && (
          <div className="flex justify-end mb-4">
            <Button
              onClick={savePlantFeatures}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? "Saving..." : "Save Details"}
              {!isSaving && <Save className="h-4 w-4" />}
            </Button>
          </div>
        )}
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search specialties..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFeatures.map((feature) => (
            <div key={feature.id} className="flex items-start space-x-3 border p-4 rounded-md">
              <Checkbox
                id={`feature-${feature.id}`}
                checked={features.includes(feature.id)}
                onCheckedChange={(checked) => {
                  if (disabled) return;
                  handleFeatureToggle(feature.id, checked === true);
                }}
                disabled={disabled}
              />
              <div className="space-y-1">
                <Label
                  htmlFor={`feature-${feature.id}`}
                  className="font-medium text-base cursor-pointer"
                >
                  {feature.name}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantProfileFeatures;
