import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plant, getFeatureName, getFeatureDescription, PlantReview } from '@/data/plants';
import { MapPin, Globe, Factory, Info, Star, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

interface VinylSpecs {
  size: string;
  type: string;
  weight: string;
  colour: string;
}

interface PackagingOptions {
  innerSleeve: string;
  jacket: string;
  inserts: string;
  shrinkWrap: string;
}

interface PlantProfileProps {
  plant: Plant;
}

// just a part of a static screen to show any plants info for buyer
const PlantProfile: React.FC<PlantProfileProps> = ({ plant }) => {

  const navigate = useNavigate();
  const initials = plant.name
    .split(' ')?.map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const [equipments, setEquipments] = React.useState<any[]>(null);
  const [clients, setClients] = React.useState<any[]>(null);
  const [reviews, setReviews] = React.useState<PlantReview[]>(null);

  useEffect(() => {
    if (!plant) return;

    const fetchEquipments = async () => {
      try {
        const { data: equipmentData, error } = await supabase
          .from('plant_equipments')
          .select('*')
          .eq('plant_id', plant.id);

        if (error) {
          throw new Error(`Error fetching equipment: ${error.message}`);
        }

        setEquipments(equipmentData || []);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      }
    }
    const fetchClients = async () => {
      try {
        const { data: clientData, error } = await supabase
          .from('plant_clients')
          .select('*')
          .eq('plant_id', plant.id);

        if (error) {
          throw new Error(`Error fetching clients: ${error.message}`);
        }

        setClients(clientData || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    }

    const fetchReviews = async () => {
      try {
        const { data: reviewData, error } = await supabase
          .from('plant_reviews')
          .select('*')
          .eq('plant_id', plant.id);

        if (error) {
          throw new Error(`Error fetching reviews: ${error.message}`);
        }

        setReviews(reviewData || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }

    fetchEquipments();
    fetchClients();
    fetchReviews();

  }, [plant]);

  const handleRequestQuote = () => {
    localStorage.setItem('selectedPlantId', plant.id);
    navigate('/');
  };

  const packaging: PackagingOptions = {
    innerSleeve: "white-paper",
    jacket: "single-pocket-3mm",
    inserts: "single-insert",
    shrinkWrap: "yes"
  };

  const selectPlantForQuote = (plantId: string) => {
    localStorage.setItem('selectedPlantId', plantId);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center mb-4">
            <Avatar className="h-24 w-24 mr-4">
              <AvatarImage src={plant.image_url} alt={plant.name} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center space-x-2 mb-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{plant.location}, {plant.country}</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold">{plant.name}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 font-medium">{plant.rating}</span>
              <span className="text-sm text-muted-foreground ml-1">({plant.review_count} reviews)</span>
            </div>

            <Separator orientation="vertical" className="h-5" />

            <div className="flex items-center text-sm">
              <span className="font-medium">Min. Order:</span>
              <span className="ml-1">{plant.minimum_order} units</span>
            </div>

            <Separator orientation="vertical" className="h-5" />

            <div className="flex items-center text-sm">
              <span className="font-medium">Turnaround:</span>
              <span className="ml-1">{plant.turnaround_time}</span>
            </div>
          </div>

          <p className="text-muted-foreground mb-6">
            {plant.description}
          </p>

          <h2 className="font-display text-xl font-semibold mb-3">Specialties</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {plant?.features && plant.features.length > 0 ?
              plant.features?.map(feature => (
                <Badge key={feature} variant="outline" className="bg-secondary">
                  {getFeatureName(feature)}
                </Badge>
              )) : <p className="text-muted-foreground">No specialties listed.</p>
            }
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="rounded-lg overflow-hidden border border-border bg-card p-5">
            <h3 className="font-display text-lg font-semibold mb-4">Contact Information</h3>

            <a
              href={plant.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center mb-4 text-primary hover:underline"
            >
              <Globe className="h-5 w-5 mr-2" />
              Visit Website
            </a>

            <Link to="/order" onClick={() => selectPlantForQuote(plant.id)}>
              <Button variant="default" className="bg-wwwax-green text-black hover:bg-wwwax-green/80 text-xs px-3 py-1 h-auto mt-2">
                Order Now
              </Button>
            </Link>

            <Button className="w-full mb-3" onClick={handleRequestQuote}>
              <FileText className="h-4 w-4 mr-2" />
              Request a Quote
            </Button>
            <Button variant="outline" className="w-full">Add to Comparison</Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="features" className="mt-10">
        <TabsList className="w-full grid grid-cols-4 max-w-md mb-8">
          {/* <TabsTrigger value="pricing">Pricing</TabsTrigger> */}
          <TabsTrigger value="features">Specialties</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* <TabsContent value="pricing">
          <h2 className="font-display text-2xl font-semibold mb-4">Pricing Information</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-3">Vinyl Specifications</h3>
              {vinylPricing?.map((specs, index) => (
                <div className="bg-card rounded-lg border border-border p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Size</p>
                      <p>{specs.size}"</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Type</p>
                      <p>{specs.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Weight</p>
                      <p>{specs?.weight || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Color</p>
                      <p>{specs?.colour || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))
              }

            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Packaging Options</h3>
              <div className="bg-card rounded-lg border border-border p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Inner Sleeve</p>
                    <p>{packaging.innerSleeve.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Jacket</p>
                    <p>{packaging.jacket === 'gatefold' ? 'Gatefold' :
                      packaging.jacket === 'single-pocket-3mm' ? 'Single Pocket (3mm)' :
                        'Single Pocket (5mm)'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Inserts</p>
                    <p>{packaging.inserts === 'single-insert' ? 'Single Insert' : 'No Insert'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Shrink Wrap</p>
                    <p>{packaging.shrinkWrap === 'yes' ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3">Price Estimates</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-secondary">
                    <th className="p-4 text-left">Quantity</th>
                    <th className="p-4 text-left">Price Per Unit</th>
                    <th className="p-4 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {prices?.map((price, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                      <td className="p-4 border-t">{price.quantity} units</td>
                      <td className="p-4 border-t">${price.price.toFixed(2)}</td>
                      <td className="p-4 border-t">${(price.quantity * price.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              * Prices are estimates based on standard options. Contact the plant for an exact quote with your custom specifications.
            </p>
          </div>
        </TabsContent> */}

        <TabsContent value="features">
          <h2 className="font-display text-2xl font-semibold mb-4">Specialties & Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plant?.features && plant.features.length > 0 ?
              plant.features?.map(featureId => (
                <div key={featureId} className="bg-card p-5 rounded-lg border border-border">
                  <h3 className="font-semibold text-lg mb-2">{getFeatureName(featureId)}</h3>
                  <p className="text-muted-foreground">{getFeatureDescription(featureId)}</p>
                </div>
              ))
              : <p className="text-muted-foreground">No specialties listed.</p>
            }
          </div>
        </TabsContent>

        <TabsContent value="equipment">
          <h2 className="font-display text-2xl font-semibold mb-4">Manufacturing Equipment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {equipments && equipments.length > 0 ?
              equipments?.map((item, index) => (
                <div key={index} className="bg-card p-5 rounded-lg border border-border">
                  <div className="flex items-center mb-2">
                    <Factory className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Model: {item.model}</p>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))
              : <p className="text-muted-foreground">No equipment information available.</p>
            }
          </div>
          {equipments && equipments.length > 0 &&
            <p className="text-sm text-muted-foreground mt-6">
              * Equipment specifications are subject to change as the plant upgrades its manufacturing capabilities.
            </p>}
        </TabsContent>

        <TabsContent value="clients">
          <h2 className="font-display text-2xl font-semibold mb-4">Notable Clients & Projects</h2>
          <div className="overflow-x-auto">
            {
              clients && clients.length > 0 ?
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="p-4 text-left">Name</th>
                      <th className="p-4 text-left">Type</th>
                      <th className="p-4 text-left">Notable Work</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients?.map((client, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                        <td className="p-4 border-t font-medium">{client.name}</td>
                        <td className="p-4 border-t">{client.type}</td>
                        <td className="p-4 border-t">{client.notable_work}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                : <p className="text-muted-foreground">No client information available.</p>
            }
          </div>
          {clients && clients.length > 0 &&
            <p className="text-sm text-muted-foreground mt-6">
              * This is a partial list of clients. Confidential projects may not be listed.
            </p>}
        </TabsContent>

        <TabsContent value="reviews">
          <h2 className="font-display text-2xl font-semibold mb-4">Customer Reviews</h2>
          <div className="space-y-6">
            {reviews && reviews.length > 0 ? (
              reviews?.map(review => (
                <div key={review.id} className="bg-card p-5 rounded-lg border border-border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{review.username}</h3>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{review.created_at}</span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No reviews yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlantProfile;
