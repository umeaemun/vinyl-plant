
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plant } from '@/data/plants';
import PlantProfile from '@/components/PlantProfile';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// just a static screen to show any plants info for buyer
const PlantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [plantFound, setPlantFound] = useState(null);
  const { user } = useAuth();
  // const isOwner = user && id === user.id;
  const [isOwner, setIsOwner] = useState(null);


  useEffect(() => {

    // First check standard plants
    const fetchPlantsIds = async () => {
      try {
        const { data: plantData, error } = await supabase
          .from('plants')
          .select('*')
          .eq('id', id)

        if (error) {
          throw new Error(`Error fetching plants: ${error.message}`);
        }

        // Check if the plant exists
        if( plantData && plantData.length > 0){
          setPlant(plantData[0]);
          setPlantFound(true);
          setIsOwner(user && plantData[0].owner === user.id);
        }else{
          setPlant(null);
          setPlantFound(false);
          setIsOwner(false);
        }

      } catch (error) {
        console.error('Error fetching plants:', error);
      }
    };

    fetchPlantsIds();

  }, [user, id]);


  if (plantFound == null) {
    // still fetching so show loading screen
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">
          <div className="container mx-auto px-4 py-8 text-center content-center min-h-screen">
            <h1 className="font-display text-3xl font-bold mb-4">Loading...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
    
  } else {
    // fetching complete
    if (plantFound === false) {
      return (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-20 container mx-auto px-4 py-12 text-center content-center min-h-screen">
            <h1 className="font-display text-3xl font-bold mb-4">Plant Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The pressing plant you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/compare')}>
              Browse All Plants
            </Button>
          </main>
          <Footer />
        </div>
      )
    } else if (plant) {
      return (
        <div className="flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-grow pt-20">
            <div className="container mx-auto px-4 py-8">
              <div className="flex justify-between items-center mb-6">
                <Button
                  variant="ghost"
                  className="pl-2"
                  onClick={() => navigate(-1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back to results
                </Button>

                {isOwner && (
                  <Link to={`/plant-profile/${id}`}>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Plant Profile
                    </Button>
                  </Link>
                )}
              </div>

              <PlantProfile plant={plant} />
            </div>
          </main>

          <Footer />
        </div>
      );
    }
  }
};

export default PlantDetails;
