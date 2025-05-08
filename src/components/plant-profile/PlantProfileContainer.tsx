
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plant } from '@/data/plants';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import PlantProfileEditor from './PlantProfileEditor';
import PlantProfileTabs from './PlantProfileTabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const PlantProfileContainer = ({ plant, setPlant }: { plant: Plant , setPlant: React.Dispatch<any> }) => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();


  // State for plant data
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {

      // New users should be in edit mode by default
      if (plant && (!plant.name || plant.name === 'My Pressing Plant')) {
        setIsEditing(true);

    };

  }, [id, plant, user]);

  if (!plant) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-20">
        <div className="container mx-auto p-4 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-display">Plant Profile Management</h1>
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                {/* <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button> */}
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Image and Basic Info */}
            <PlantProfileEditor
              plant={plant}
              setPlant={setPlant}
              disabled={!isEditing}
            />

            {/* Tabs for different sections */}
            <PlantProfileTabs
              plant={plant}
              setPlant={setPlant}
              disabled={!isEditing}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlantProfileContainer;
