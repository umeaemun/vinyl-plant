
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecordProjectForm from '@/components/RecordProjectForm';
import PersonalDetailsForm from '@/components/PersonalDetailsForm';
import { Plant } from '@/data/plants';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/contexts/CurrencyContext';
import { OrderSummary } from '@/data/plants';


const Order = () => {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [foundPlant, setFoundPlant] = useState<boolean | null>(null);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currency } = useCurrency();

  useEffect(() => {
    // Get plant information
    const plantId = localStorage.getItem('selectedPlantId');

    if (plantId) {
      const fetchPlantDetails = async () => {
        const { data: plant, error } = await supabase
          .from('plants')
          .select('*')
          .eq('id', plantId)
          .single();
        if (error) {
          console.error('Error fetching plant:', error);
        }
        if (plant) {
          setFoundPlant(true);
          setSelectedPlant(plant);
        }else {
          setFoundPlant(false);
        }
      }
      fetchPlantDetails();
    }else{
      setFoundPlant(false);
    }

    // Get vinyl specifications and pricing
    const vinylData = localStorage.getItem('vinylFormData');
    const pricingData = localStorage.getItem('calculatedPlantPricing');

    // console.log("Vinyl Data:", vinylData);
    // console.log("Pricing Data:", pricingData);

    if (vinylData && pricingData) {
      try {
        const specs = JSON.parse(vinylData);      // form data ( user's requirements )
        const pricing = JSON.parse(pricingData);  // pricing data ( price / unit )

        // console.log("Specs:", specs);
        // console.log("Pricing:", pricing);

        const plantPricing = pricing.find((p: any) => p.id == plantId);  // find the pricing for the selected plant

        // console.log("Plant Pricing:", plantPricing);

        if (specs && plantPricing) {
          
          setOrderSummary({
            ...specs,
            perUnit: plantPricing.calculatedPricing.perUnit
          });
        }
      } catch (error) {
        console.error("Error parsing stored data:", error);
      }
    }

    setIsLoading(false);

    // Only show warning if there's no plant selected at all
    if (foundPlant === false) {
      toast({
        title: "Missing plant selection",
        description: "Please select a manufacturer and complete your quote form first.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    const calculateUpdatedPicing = () => {

    }
   calculateUpdatedPicing(); 
  }, [selectedPlant, orderSummary]);

  // Don't redirect automatically, let user interact with the page
  if (isLoading || foundPlant === null) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20 pb-12">
          <div className="container mx-auto px-4">
            <p className="text-center py-12">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBackToQuote = () => {
    navigate('/');
  };

  // console.log('Selected Plant:', selectedPlant);
  console.log('Order Summary:', orderSummary);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <Button
              variant="ghost"
              className="group mb-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back
            </Button>
          </div>

          <h1 className="font-display text-3xl font-bold mb-2">Complete Your Order</h1>

          {!selectedPlant || !orderSummary ? (
            <Card className="p-6 mb-8 border-destructive">
              <div className="flex items-center gap-3 mb-4">
                <Info className="h-6 w-6 text-destructive" />
                <h2 className="font-semibold text-lg">Missing Order Information</h2>
              </div>
              <p className="mb-4">
                To complete your order, you need to first select a manufacturer and specify your vinyl details.
              </p>
              <Button
                onClick={handleBackToQuote}
                className="bg-wwwax-green text-black hover:bg-wwwax-green/80"
              >
                Start Your Quote
              </Button>
            </Card>
          ) : (
            <Card className="p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="font-semibold text-lg mb-4">Selected Manufacturer</h2>
                  <div className="flex items-start gap-4">
                    {selectedPlant.image_url && (
                      <img
                        src={selectedPlant.image_url}
                        alt={selectedPlant.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-lg">{selectedPlant.name}</h3>
                      <p className="text-muted-foreground">{selectedPlant.location}</p>
                      <p className="text-muted-foreground">{selectedPlant.country}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-semibold text-lg mb-4">Order Specifications</h2>
                  <div className="grid grid-cols-2 gap-y-2">
                    <p className="text-muted-foreground">Quantity:</p>
                    <p>{orderSummary.quantity}</p>
                    <p className="text-muted-foreground">Size:</p>
                    <p>{orderSummary.size}"</p>
                    <p className="text-muted-foreground">Type:</p>
                    <p>{orderSummary.type}</p>
                    <p className="text-muted-foreground">Weight:</p>
                    <p>{orderSummary.weight}</p>
                    <p className="text-muted-foreground">Colour:</p>
                    <p className="capitalize">{orderSummary.colour}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between mb-1">
                      <p className="font-medium">Price per unit:</p>
                      <p className="font-medium">{currency.symbol} {orderSummary.perUnit.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Total price:</p>
                      <p className="font-semibold">{currency.symbol} {(Number(orderSummary.quantity) * orderSummary.perUnit).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">1. Vinyl Project Specifications</h2>
              <div className="bg-white rounded-lg shadow-sm">
                <RecordProjectForm hideSubmitButton={true} setOrderSummary={setOrderSummary}/>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">2. Personal Details</h2>
              <div className="bg-white rounded-lg shadow-sm">
                <PersonalDetailsForm selectedPlant={selectedPlant} orderSummary={orderSummary}/>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Order;
