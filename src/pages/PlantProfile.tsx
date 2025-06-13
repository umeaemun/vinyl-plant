
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
  const { id } = useParams<{ id: string }>();     // id can be userId in case of manufacturer or plantId in case of admin
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const [plant, setPlant] = useState(null);


  // Check if user is authenticated and accessing their own profile
  useEffect(() => {
    if (!user) {
      // If not authenticated, redirect to login
      navigate('/auth');
      return;
    }

    if(userProfile && userProfile.role == 'buyer') {
        // if user is a buyer, redirect to their profile
        navigate(`/buyer-profile`);

    }else if (userProfile && userProfile?.role == 'manufacturer' && (id && user.id !== id)) {
      // If trying to access another user's profile, redirect to their own
      navigate(`/plant-profile/${user.id}`);
    }
  }, [user, userProfile, id, navigate]);

  // Check if data exists in Supabase for this plant ID
  useEffect(() => {
    
    const getPlantByOwnerId = async () => {
      try {

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
            name: plant.name || '',
            location: plant.location || '',
            country: plant.country || '',
            owner: plant.owner || '',
            description: plant.description || '',
            features: plant.features || [],
            rating: plant.rating || 0,
            review_count: plant.review_count || 0,
            minimum_order: plant.minimum_order || 0,
            turnaround_time: plant.turnaround_time || '8-10',
            website: plant.website || '',
            image_url: plant.image_url || '',
            reviews: plant.reviews || [],
            split_manufacturing_capable: plant.split_manufacturing_capable || false,
          });

          // Check if the user has any pricing data
          const { data: vinylPricing, error: vinylError } = await supabase
            .from('vinyl_pricing')
            .select('id')
            .eq('plant_id', plant?.id || '')

          if (vinylError) {
            throw new Error(`Error checking vinyl pricing: ${vinylError.message}`);
          }

        } else if (plantData && plantData.length === 0) {
          setPlant({
            id: id,
            name: '',
            location: '',
            country: '',
            owner: '',
            description: '',
            features: [],
            rating: 0,
            review_count: 0,
            minimum_order: 0,
            turnaround_time: '8-10',
            website: '',
            image_url: '',
            specialties: [],
            reviews: [],
            split_manufacturing_capable: false,
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

    const getPlantByPlantId = async () => {
      try {

        const { data: plant, error: plantError } = await supabase
          .from('plants')
          .select('*')
          .eq('id', id)
          .single();

        if (plantError) {
          throw new Error(`Error checking plant data: ${plantError.message}`);
        }

        console.log('plantData', plant);

        if (plant) {
          // Add default values for fields not in the profile table

          setPlant({
            id: plant.id,
            name: plant.name || '',
            location: plant.location || '',
            country: plant.country || '',
            owner: plant.owner || '',
            description: plant.description || '',
            features: plant.features || [],
            rating: plant.rating || 0,
            review_count: plant.review_count || 0,
            minimum_order: plant.minimum_order || 0,
            turnaround_time: plant.turnaround_time || '8-10',
            website: plant.website || '',
            image_url: plant.image_url || '',
            reviews: plant.reviews || [],
            split_manufacturing_capable: plant.split_manufacturing_capable || false,
          });

          // Check if the user has any pricing data
          const { data: vinylPricing, error: vinylError } = await supabase
            .from('vinyl_pricing')
            .select('id')
            .eq('plant_id', plant?.id || '')

          if (vinylError) {
            throw new Error(`Error checking vinyl pricing: ${vinylError.message}`);
          }

        } else if (!plant) {
          setPlant({
            id: id,
            name: '',
            location: '',
            country: '',
            owner: '',
            description: '',
            features: [],
            rating: 0,
            review_count: 0,
            minimum_order: 0,
            turnaround_time: '8-10',
            website: '',
            image_url: '',
            specialties: [],
            reviews: [],
            split_manufacturing_capable: false,
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
    if (user && id && userProfile) {
        if (user.id === id ) {
          // If the user is authenticated and accessing their own profile
          getPlantByOwnerId();
        }else if ( userProfile?.role === 'admin'){
          getPlantByPlantId();
        }
        else {
          // If the user is authenticated but accessing another user's profile then Redirect to their own profile
          navigate(`/plant-profile/${user.id}`);
        }
    }
    
  }, [id, user, userProfile]);

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
