
import React from 'react';
import { Plant } from '@/data/plants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PlantProfileImageUploader from '@/components/plant-profile/PlantProfileImageUploader';

interface PlantProfileEditorProps {
  plant: Plant;
  setPlant: React.Dispatch<React.SetStateAction<Plant | null>>;
  disabled: boolean;
}

const PlantProfileEditor: React.FC<PlantProfileEditorProps> = ({ 
  plant, 
  setPlant, 
  disabled 
}) => {
  // Need to handle null plant here to satisfy TypeScript
  const handleChange = (field: keyof Plant, value: string) => {
    if (plant) {
      setPlant({...plant, [field]: value});
    }
  };
  
  return (
    <div className="md:col-span-1">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your plant details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 mb-4">
          <PlantProfileImageUploader 
            plant={plant} 
            setPlant={setPlant} 
            disabled={disabled} 
          />
          
          <div className="space-y-2">
            <Label htmlFor="name">Plant Name</Label>
            <Input 
              id="name" 
              value={plant.name} 
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={disabled}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              value={plant.location} 
              onChange={(e) => handleChange('location', e.target.value)}
              disabled={disabled}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input 
              id="country" 
              value={plant.country} 
              onChange={(e) => handleChange('country', e.target.value)}
              disabled={disabled}
            />
          </div>
          
          {/* <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input 
              id="website" 
              value={plant.website} 
              onChange={(e) => handleChange('website', e.target.value)}
              disabled={disabled}
            />
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantProfileEditor;
