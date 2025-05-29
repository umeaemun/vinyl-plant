
import React, { useState } from 'react';
import { ArrowDown, ArrowUp, MoreHorizontal, Star } from 'lucide-react';
import { Plant } from '@/data/plants';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FormValues } from '@/components/record-form/FormSchema';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthContext';

interface PricingData {
  id: string;
  calculatedPricing: {
    vinylPrice: number;
    packagingPrice: number;
    perUnit: number;
    valid: boolean;
  };
}

interface ComparisonTableProps {
  plants: Plant[];
  formData?: FormValues | null;
  pricingData?: any[] | null;
}

type SortField = 'name' | 'costPerUnit' | 'turnaroundTime' | 'rating';
type SortDirection = 'asc' | 'desc';

const ComparisonTable: React.FC<ComparisonTableProps> = ({ plants, formData, pricingData }) => {

  const { user, userProfile } =  useAuth();

  const [sortField, setSortField] = useState<SortField>('costPerUnit');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const { convertPrice, formatPrice } = useCurrency();

  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-primary text-primary" />);
    }
    
    if (halfStar) {
      stars.push(
        <Star 
          key="half-star" 
          className="h-4 w-4 text-primary" 
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

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getPlantPricing = (plantId: string): PricingData['calculatedPricing'] | null => {
    if (!pricingData) return null;
    
    const plantWithPricing = pricingData.find((p: any) => p.id == plantId);
    if (!plantWithPricing || !plantWithPricing.calculatedPricing) return null;
    
    return plantWithPricing.calculatedPricing;
  };

  const getSortedPlants = () => {
    return [...plants].sort((a, b) => {
      const getComparableValue = (plant: Plant, field: SortField) => {
        const pricing = getPlantPricing(plant.id);
        
        switch (field) {
          case 'name':
            return plant.name.toLowerCase();
          case 'costPerUnit':
            return pricing?.perUnit || Number.MAX_VALUE;
          case 'turnaroundTime':
            return parseInt(plant.turnaround_time.split('-')[0]);
          case 'rating':
            return plant.rating;
          default:
            return 0;
        }
      };

      const valueA = getComparableValue(a, sortField);
      const valueB = getComparableValue(b, sortField);

      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  const sortedPlants = getSortedPlants();

  const renderSortIcon = (field: SortField) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? (
        <ArrowUp className="h-4 w-4" />
      ) : (
        <ArrowDown className="h-4 w-4" />
      );
    }
    return null;
  };

  const selectPlantForQuote = (plantId: string) => {
    localStorage.setItem('selectedPlantId', plantId);
  };

  // console.log("plants", plants);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-4 px-6 text-left font-medium">
              <button 
                className="flex items-center gap-1 font-medium hover:text-primary transition-colors"
                onClick={() => handleSort('name')}
              >
                Pressing Plant
                {renderSortIcon('name')}
              </button>
            </th>
            <th className="py-4 px-6 text-center font-medium">
              <button 
                className="flex items-center justify-center gap-1 font-medium hover:text-primary transition-colors"
                onClick={() => handleSort('costPerUnit')}
              >
                Cost/Unit
                {renderSortIcon('costPerUnit')}
              </button>
            </th>
            <th className="py-4 px-6 text-center font-medium">
              <button 
                className="flex items-center justify-center gap-1 font-medium hover:text-primary transition-colors"
                onClick={() => handleSort('turnaroundTime')}
              >
                Turnaround Time
                {renderSortIcon('turnaroundTime')}
              </button>
            </th>
            <th className="py-4 px-6 text-center font-medium">
              <button 
                className="flex items-center justify-center gap-1 font-medium hover:text-primary transition-colors"
                onClick={() => handleSort('rating')}
              >
                Reviews
                {renderSortIcon('rating')}
              </button>
            </th>
            <th className="py-4 px-6 text-left font-medium">Features</th>
            <th className="py-4 px-6 text-center font-medium">Details</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlants.length > 0 ? (
            sortedPlants.map((plant, index) => {
              const pricing = getPlantPricing(plant.id);
              const totalCostPerUnit = pricing?.perUnit || 0;
              const convertedPrice = convertPrice(totalCostPerUnit);
              
              return (
                <tr 
                  key={plant.id} 
                  className={`border-b hover:bg-muted/40 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4 w-[15rem]">
                      <Link to={`/plant/${plant.id}`} className="h-16 w-16 rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                        <img 
                          src={plant.image_url} 
                          alt={plant.name} 
                          className="h-full w-full object-cover"
                        />
                      </Link>
                      <div>
                        <Link to={`/plant/${plant.id}`} className="hover:text-primary transition-colors">
                          <h3 className="font-medium text-lg">{plant.name}</h3>
                        </Link>
                        <p className="text-muted-foreground text-sm">{plant.location}, {plant.country}</p>
                       {/* { user && userProfile && */}
                        <Link to="/order" onClick={() => selectPlantForQuote(plant.id)}>
                          <Button variant="default" className="bg-wwwax-green text-black hover:bg-wwwax-green/80 text-xs px-3 py-1 h-auto mt-2">
                            Order Now
                          </Button>
                        </Link>
                        {/* } */}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center font-semibold">{formatPrice(convertedPrice)}</td>
                  <td className="py-4 px-6 text-center">{plant.turnaround_time}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col items-center gap-1">
                      {renderRating(plant.rating)}
                      <span className="text-xs text-muted-foreground">({plant.review_count})</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1 justify-start">
                      {plant.features?.slice(0, 3).map((feature, i) => (
                        <div key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
                          {feature.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </div>
                      ))}
                      {plant.features?.length > 3 && (
                        <div className="text-xs bg-muted px-2 py-1 rounded-full">
                          +{plant.features.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center">
                      <Link to={`/plant/${plant.id}`}>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="py-8 text-center text-muted-foreground">
                No plants with matching pricing data found for your specifications.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
