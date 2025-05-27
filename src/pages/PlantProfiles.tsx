import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plant } from '@/data/plants';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Settings, ExternalLink, UserPlus, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PlantProfiles = () => {
  const [allPlants, setAllPlants] = useState<Plant[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  // const [isAdmin, setIsAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      
      // how to check if user is admin
      setIsAdmin(false);
      
      if (!isAdmin) {
        toast({
          title: "Redirecting",
          description: "You've been redirected to your plant profile."
        });
        navigate(`/plant-profile/${user.id}`);
      }
      
      setLoading(false);
    };
    
    // checkAuth();
    setLoading(false);
  }, [user, navigate, toast]);
  
  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      const loadPlants = async () => {
        let dbPlants: Plant[] = [];
        
          try {
            const { data: plantsData, error: plantsError } = await supabase
              .from('plants')
              .select('*')
              .order('name', { ascending: true });

            if (plantsData && plantsData.length > 0 && !plantsError) {

              dbPlants = plantsData.map((plant) => {

                const userPlant: Plant = {
                  id: plant.id || '',
                  name: plant.name || 'N/A',
                  location: plant.location || 'Unknown Location',
                  country: plant.country || 'Unknown Country',
                  owner: plant.owner || '',
                  description: plant.description || 'N/A',
                  features: plant.features || [],
                  rating: plant.rating || 0,
                  review_count: plant.review_count || 0,
                  minimum_order: plant.minimum_order || 0,
                  turnaround_time: plant.turnaround_time || '8-12',
                  website: plant.website || '#',
                  image_url: plant.image_url || '',
                };
                
                return userPlant;
              });

            
            }

          } catch (error) {
            console.error('Error fetching user profile:', error);
          }


        setAllPlants(dbPlants);
        setLoading(false);
      };
      
      loadPlants();
    }
  }, [user, isAdmin]);
  
  if (loading) {
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
  
  if (!isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldAlert className="h-5 w-5 mr-2 text-destructive" />
                Access Restricted
              </CardTitle>
              <CardDescription>
                You don't have permission to view all plant profiles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Please access your own plant profile instead.</p>
              <Button asChild className="w-full">
                <Link to={`/plant-profile/${user?.id}`}>
                  Go to My Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
     <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-display text-3xl font-bold">Plant Profiles Management</h1>
            <Button asChild>
              <Link to="/auth">
                <UserPlus className="h-4 w-4 mr-2" />
                Register New Plant
              </Link>
            </Button>
          </div>
          
          <p className="text-muted-foreground mb-8">
            Access and manage all pressing plant profiles from this central dashboard
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPlants.map((plant) => (
              <Card key={plant.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-2 mb-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{plant.location}, {plant.country}</span>
                  </div>
                  <CardTitle>{plant.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {plant.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {plant.features.slice(0, 3).map(feature => (
                      <span key={feature} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                        {feature.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    ))}
                    {plant.features.length > 3 && (
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                        +{plant.features.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/plant/${plant.id}`}>
                        <ExternalLink className="h-4 w-4 mr-2" /> View Profile
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1">
                      <Link to={`/plant-profile/${plant.id}`}>
                        <Settings className="h-4 w-4 mr-2" /> Manage
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PlantProfiles;
