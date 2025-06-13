
import React from 'react';
import { SlidersHorizontal, MapPin, Package, Star, Clock, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterSectionProps {
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  minOrderRange: string;
  setMinOrderRange: (value: string) => void;
  minRating: string;
  setMinRating: (value: string) => void;
  turnaroundTime: string;
  setTurnaroundTime: (value: string) => void;
  selectedFeatures: string[];
  setSelectedFeatures: (features: string[]) => void;
  clearFilters: () => void;
  countries: string[];
  availableFeatures: string[];
}

const FilterSection: React.FC<FilterSectionProps> = ({
  selectedCountry,
  setSelectedCountry,
  minOrderRange,
  setMinOrderRange,
  minRating,
  setMinRating,
  turnaroundTime,
  setTurnaroundTime,
  selectedFeatures,
  setSelectedFeatures,
  clearFilters,
  countries,
  availableFeatures,
}) => {
  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(
      selectedFeatures.includes(feature)
        ? selectedFeatures.filter(f => f !== feature)
        : [...selectedFeatures, feature]
    );
  };

  return (
    <div className="sticky top-24 bg-card p-6 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <SlidersHorizontal className="mr-2 h-5 w-5" /> Filters
        </h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="location">
          <AccordionTrigger>
            <span className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" /> Location
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="order-size">
          <AccordionTrigger>
            <span className="flex items-center">
              <Package className="mr-2 h-4 w-4" /> Minimum Order
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <Select value={minOrderRange} onValueChange={setMinOrderRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Order Size</SelectItem>
                <SelectItem value="under500">Under 500 units</SelectItem>
                <SelectItem value="500to1000">500 - 1000 units</SelectItem>
                <SelectItem value="over1000">Over 1000 units</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="rating">
          <AccordionTrigger>
            <span className="flex items-center">
              <Star className="mr-2 h-4 w-4" /> Rating
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <Select value={minRating} onValueChange={setMinRating}>
              <SelectTrigger>
                <SelectValue placeholder="Select Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Rating</SelectItem>
                <SelectItem value="4plus">4+ Stars</SelectItem>
                <SelectItem value="3plus">3+ Stars</SelectItem>
                <SelectItem value="below3">Below 3 Stars</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="turnaround">
          <AccordionTrigger>
            <span className="flex items-center">
              <Clock className="mr-2 h-4 w-4" /> Turnaround Time
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <Select value={turnaroundTime} onValueChange={setTurnaroundTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Timeframe</SelectItem>
                <SelectItem value="under4">under 4 weeks</SelectItem>
                <SelectItem value="4to6">4-6 weeks</SelectItem>
                <SelectItem value="6to8">6-8 weeks</SelectItem>
                <SelectItem value="8to10">8-10 weeks</SelectItem>
                <SelectItem value="10to12">10-12 weeks</SelectItem>
                <SelectItem value="over16">16+ weeks</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="features">
          <AccordionTrigger>
            <span className="flex items-center">
              <Palette className="mr-2 h-4 w-4" /> Features
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {availableFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`feature-${feature}`} 
                    checked={selectedFeatures.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <label 
                    htmlFor={`feature-${feature}`}
                    className="text-sm cursor-pointer"
                  >
                    {feature?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-6 p-4 bg-secondary rounded-lg">
        <h3 className="font-medium mb-2">Need help choosing?</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Get personalized recommendations based on your project needs.
        </p>
        <Button variant="default" size="sm" className="w-full">
          Get Recommendations
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;
