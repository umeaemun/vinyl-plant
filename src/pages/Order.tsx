
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
  const [allOptionsValid, setAllOptionsValid] = useState<any>({ vinyl: true, packaging: true });
  const [isLoading, setIsLoading] = useState(true);
  const [perUnit, setPerUnit] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
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
        } else {
          setFoundPlant(false);
        }
      }
      fetchPlantDetails();
    } else {
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
          const perUnit = specs?.perUnit || plantPricing.calculatedPricing.perUnit;
          const total = (Number(specs.quantity) * perUnit).toFixed(2);

          setOrderSummary({
            ...specs,
            perUnit: perUnit,
            totalPrice: total,
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

 
 const updateVinylFormData = () => {
    // Update local storage with the current order summary
    if (orderSummary) {
      const formData = {
        name: orderSummary.name || "",
        email: orderSummary.email || "",
        quantity: orderSummary.quantity || 0,
        size: orderSummary.size || "",
        type: orderSummary.type || "",
        weight: orderSummary.weight || "",
        colour: orderSummary.colour || "",
        innerSleeve: orderSummary.innerSleeve || "",
        jacket: orderSummary.jacket || "",
        inserts: orderSummary.inserts || "",
        shrinkWrap: orderSummary.shrinkWrap || "",
        splitManufacturing: orderSummary.splitManufacturing || false,
        splitManufacturingDetails: orderSummary.splitManufacturingDetails || [],
        perUnit: orderSummary.perUnit || 0,
      }
      localStorage.setItem('vinylFormData', JSON.stringify(formData));
    }
  }

useEffect(() => {
  const calculateUpdatedPicing = async () => {
    let vinylPrice = 0;
    let colorPrice = 0;
    let weightPrice = 0;
    let packagingPrice = 0;

    const { data: vinylPricingData, error } = await supabase
      .from('vinyl_pricing')
      .select('*')
      .eq('size', orderSummary?.size)
      .eq('type', orderSummary?.type)
      .eq('plant_id', selectedPlant?.id);

    if (error) {
      console.error('Error fetching vinyl pricing:', error);
      return;
    }

    if (vinylPricingData.length > 0) {
      vinylPricingData.sort((a, b) => b.quantity - a.quantity);
      vinylPrice = vinylPricingData.find(vp => vp.quantity <= orderSummary?.quantity)?.price;
    }

    console.log('Vinyl Price:', vinylPrice);

    const { data: colorOptionsData, error: colorError } = await supabase
      .from('vinyl_color_options')
      .select('*')
      .eq('color', orderSummary?.colour)
      .eq('plant_id', selectedPlant?.id)

    if (colorError) {
      console.error('Error fetching color options:', colorError);
      throw new Error('Failed to fetch color options');
    }

    if (colorOptionsData.length > 0) {
      colorPrice = colorOptionsData[0].additional_cost;
    }

    console.log('Color Price:', colorPrice);

    const { data: weightOptionsData, error: weightError } = await supabase
      .from('vinyl_weight_options')
      .select('*')
      .eq('weight', orderSummary?.weight)
      .eq('plant_id', selectedPlant?.id)

    if (weightError) {
      console.error('Error fetching weight options:', weightError);
      throw new Error('Failed to fetch weight options');
    }

    if (weightOptionsData.length > 0) {
      weightPrice = weightOptionsData[0].additional_cost;
    }

    console.log('Weight Price:', weightPrice);

    const { data: packagingOptionsData, error: packagingError } = await supabase
      .from('packaging_pricing')
      .select('*')
      .eq('plant_id', selectedPlant?.id);

    if (packagingError) {
      console.error('Error fetching packaging options:', packagingError);
    }

    if (packagingOptionsData.length > 0) {
      // console.log('*:', packagingOptionsData);

      ['innerSleeve', 'jacket', 'inserts', 'shrinkWrap'].forEach((type) => {

        const optionRow = packagingOptionsData.find(option => option.type === type && option.option === orderSummary[type]);
        if (optionRow) {
          const priceTiers = optionRow.prices?.sort((a, b) => b.quantity - a.quantity) || [];
          const price = priceTiers.find(price => price.quantity <= orderSummary.quantity)?.price || 0;
          // console.log(`${type} option price:`, price);
          packagingPrice += parseFloat(price);
        }

      });

      console.log('Packaging Price:', packagingPrice);
    }

    const perUnit = vinylPrice + colorPrice + weightPrice + packagingPrice;
    console.log('Per Unit Price:', perUnit);
    setPerUnit(perUnit);
    let total = perUnit * (parseInt(orderSummary?.quantity) || 0);
    total = parseFloat(total.toFixed(2)); // Ensure total is a number with 2 decimal places
    console.log('Total Price:', total);
    setTotalPrice(total);

  }

  if (orderSummary && selectedPlant) {
    updateVinylFormData();
    calculateUpdatedPicing();
  }
}, [orderSummary]);

useEffect(() => {
  // Update order summary with perUnit and totalPrice
  if (orderSummary && !isNaN(perUnit) && !isNaN(totalPrice)) {
    setOrderSummary(prev => ({
      ...prev,
      perUnit: perUnit,
      totalPrice: totalPrice // Ensure totalPrice is a string with 2 decimal places
    }));
  }
}
  , [perUnit, totalPrice]);

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
// console.log('Order Summary:', orderSummary);
// console.log('All Options Valid:', allOptionsValid);

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
                    <p className="font-semibold">{currency.symbol} {orderSummary.totalPrice}</p>
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
              <RecordProjectForm hideSubmitButton={true} orderSummary={orderSummary} setOrderSummary={setOrderSummary} setAllOptionsValid={setAllOptionsValid} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">2. Personal Details</h2>
            <div className="bg-white rounded-lg shadow-sm">
              <PersonalDetailsForm selectedPlant={selectedPlant} orderSummary={orderSummary} allOptionsValid={allOptionsValid}/>
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
