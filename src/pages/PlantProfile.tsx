
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlantProfileContainer from '@/components/plant-profile/PlantProfileContainer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// screen to edit personal and plants information
const PlantProfile = () => {
  const { id } = useParams<{ id: string }>();     // id is userId
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [plant, setPlant] = useState(null);

  // Check if user is authenticated and accessing their own profile
  useEffect(() => {
    if (!user) {
      // If not authenticated, redirect to login
      navigate('/auth');
      return;
    }

    if (id && user.id !== id) {
      // If trying to access another user's profile, redirect to their own
      navigate(`/plant-profile/${user.id}`);
    }
  }, [user, id, navigate]);

  // Check if data exists in Supabase for this plant ID
  useEffect(() => {
    
    const checkPlantData = async () => {
      try {
        // First check if this is a new user
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', id)
          .single();

        if (profileError) {
          throw new Error(`Error checking profile: ${profileError.message}`);
        }

        const { data: plantData, error: plantError } = await supabase
          .from('plants')
          .select('*')
          .eq('owner', id)

        if (plantError) {
          throw new Error(`Error checking plant data: ${plantError.message}`);
        }

        // console.log('plantData', plantData);

        if (plantData && plantData.length > 0 ) {
          // Add default values for fields not in the profile table
          const plant = plantData[0];
          setPlant({
            id: plant.id,
            name: plant.name || 'My Pressing Plant',
            location: plant.location || 'Unknown Location',
            country: plant.country || 'Unknown Country',
            owner: plant.owner || '',
            description: plant.description || 'N/A',
            features: plant.features || [],
            rating: plant.rating || 0,
            review_count: plant.review_count || 0,
            minimum_order: plant.minimum_order || 100,
            turnaround_time: plant.turnaround_time || '8-12',
            website: plant.website || '#',
            image_url: plant.image_url || '',
            specialties: plant.specialties || [],
            reviews: plant.reviews || []
          });

          // Check if the user has any pricing data
          const { data: vinylPricing, error: vinylError } = await supabase
            .from('vinyl_pricing')
            .select('id')
            .eq('plant_id', plant?.id || '')

          if (vinylError) {
            throw new Error(`Error checking vinyl pricing: ${vinylError.message}`);
          }

          // If no pricing data exists for this plant in Supabase yet
          if (!vinylPricing || vinylPricing.length === 0) {
            // If it's a newly created profile, show a welcome message
            if (profile && user && user.id === id) {
              // toast({
              //   title: "Welcome to Your Plant Profile",
              //   description: "Start building your plant profile by adding your information, features, and pricing data.",
              //   duration: 8000
              // });
            } else {
              toast({
                title: "Data Not Found in Database",
                description: "This plant's pricing data hasn't been saved to the database yet. You can save it from the Pricing tab.",
                duration: 5000
              });
            }
          }

        } else if (plantData && plantData.length === 0) {
          setPlant({
            id: id,
            name: 'My Pressing Plant',
            location: 'Unknown Location',
            country: 'Unknown Country',
            owner: '',
            description: 'Your personal pressing plant profile',
            features: [],
            rating: 0,
            review_count: 0,
            minimum_order: 100,
            turnaround_time: '8-12',
            website: '#',
            image_url: '',
            specialties: [],
            reviews: []
          });

          toast({
            title: "No Plant Data Found",
            description: "This plant's data hasn't been saved to the database yet. You can save it from the Profile tab.",
            duration: 5000
          });
        } else {
          // Not a valid plant and not the user's own profile
          navigate('/not-found');
        }

      } catch (error) {
        console.error('Error checking plant data:', error);
      }
    };

    // Only run if we have a user and an ID
    if (user && id) {
      if (user.id === id){
        // If the user is authenticated and accessing their own profile
        checkPlantData();
      }else {
        // If the user is authenticated but accessing another user's profile then Redirect to their own profile
        navigate(`/plant-profile/${user.id}`);
      }
      
    }
  }, [id, user]);

  // Don't render anything until user is authenticated
  if (!user) {
    return null;
  }

  if (!plant) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-4">Loading...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  return <PlantProfileContainer plant={plant} setPlant={setPlant}/>;
};

export default PlantProfile;
