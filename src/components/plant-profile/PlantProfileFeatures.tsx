
import React from 'react';
import { Plant, features, getFeatureName, getFeatureDescription } from '@/data/plants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const handleFeatureToggle = (featureId: string, checked: boolean) => {
    if (!plant) return;
    
    if (checked) {
      // Add feature
      setPlant({
        ...plant,
        features: [...plant.features, featureId]
      });
    } else {
      // Remove feature
      setPlant({
        ...plant,
        features: plant.features.filter(id => id !== featureId)
      });
    }
  };
  
  // Filter features based on search query
  const filteredFeatures = features.filter(feature => 
    feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Specialties & Capabilities</CardTitle>
        <CardDescription>Select the specialties that your plant offers</CardDescription>
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
                checked={plant.features.includes(feature.id)}
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
