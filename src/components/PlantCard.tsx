
import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plant } from '@/data/plants';
import { Link } from 'react-router-dom';
import { FormValues } from '@/components/record-form/FormSchema';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Skeleton } from '@/components/ui/skeleton';

interface PlantCardProps {
  plant: Plant;
  formData?: FormValues | null;
  pricingData?: any[] | null;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, formData, pricingData }) => {
  const { convertPrice, formatPrice, isLoading } = useCurrency();
  
  // Get pricing for this specific plant
  const getPlantPricing = () => {
    if (!pricingData) return null;
    
    const plantWithPricing = pricingData.find((p: any) => p.id == plant.id);
    if (!plantWithPricing || !plantWithPricing.calculatedPricing) return null;
    
    return plantWithPricing.calculatedPricing;
  };
  
  const pricing = getPlantPricing();
  const costPerUnit = pricing?.perUnit || 0;
  const convertedPrice = convertPrice(costPerUnit);
  
  const selectPlantForQuote = () => {
    localStorage.setItem('selectedPlantId', plant.id);
  };

  // Render star ratings
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (halfStar) {
      stars.push(
        <Star 
          key="half-star" 
          className="h-4 w-4 text-yellow-400" 
          style={{ clipPath: 'inset(0 50% 0 0)', fill: 'currentColor' }}
        />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground/30" />);
    }
    
    return <div className="flex">{stars}</div>;
  };

  // console.log('Plant Card:', plant);
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Link to={`/plant/${plant.id}`}>
          <img 
            src={plant.image_url || '/public/no-img.jpg'} 
            alt={plant.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" 
          />
        </Link>
      </div>
      
      <CardContent className="flex-grow p-4">
        <div className="space-y-3">
          <div>
            <Link to={`/plant/${plant.id}`} className="hover:text-primary transition-colors">
              <h3 className="font-medium text-lg">{plant.name}</h3>
            </Link>
            <p className="text-muted-foreground text-sm">{plant.location}, {plant.country}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {renderRating(plant.rating)}
              <span className="text-xs text-muted-foreground ml-1">({plant.review_count})</span>
            </div>
            
            <div>
              <Badge variant="outline" className="text-xs">
                {plant.minimum_order}+ units
              </Badge>
            </div>
          </div>
          
          {formData && pricing && (
            <div className="mt-4 pt-3 border-t border-border">
              {isLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <p className="font-semibold text-lg">{formatPrice(convertedPrice)}<span className="text-xs text-muted-foreground ml-1">/unit</span></p>
              )}
              <p className="text-sm text-muted-foreground">
                Based on {formData.quantity} units of {formData.size}" {formData.colour} vinyl
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-1 mt-2">
            {plant.features?.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
            ))}
            {plant.features?.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{plant.features.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button 
          asChild 
          variant="outline" 
          className="flex-1"
        >
          <Link to={`/plant/${plant.id}`}>
            View Details
          </Link>
        </Button>
        
        <Button 
          asChild
          className="flex-1 bg-wwwax-green text-black hover:bg-wwwax-green/80"
          onClick={selectPlantForQuote}
        >
          <Link to="/order">
            Order Now
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlantCard;
