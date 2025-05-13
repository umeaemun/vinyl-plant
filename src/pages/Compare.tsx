
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FormValues } from '@/components/record-form/FormSchema';
import SearchBar from '@/components/compare/SearchBar';
import ViewToggle from '@/components/compare/ViewToggle';
import FilterSection from '@/components/compare/FilterSection';
import PlantListDisplay from '@/components/compare/PlantListDisplay';
import ProjectSpecificationsCard from '@/components/compare/ProjectSpecificationsCard';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Compare = () => {
  const [plants, setPlants] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [minOrderRange, setMinOrderRange] = useState('any');
  const [minRating, setMinRating] = useState('any');
  const [turnaroundTime, setTurnaroundTime] = useState('any');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [formData, setFormData] = useState<FormValues | null>(null);
  const { toast } = useToast();
  const { isLoading: currencyLoading } = useCurrency();

  // Get all unique countries
  const countries: string[] = Array.from(new Set(plants ? plants.map(plant => plant.country) : []));

  // Get all unique features
  const allFeatures: string [] = plants ? plants.flatMap(plant => plant.features) : [];
  const availableFeatures : string[] = Array.from(new Set(allFeatures)).sort();

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const { data: plantsData, error } = await supabase
          .from('plants')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          throw new Error(`Error fetching plants: ${error.message}`);
        }

        setPlants(plantsData);
      } catch (error) {
        console.error('Error fetching plants:', error);
      }
    };

    fetchPlants();
  }, []);


  // Load form data from localStorage on component mount
  useEffect(() => {
    console.log("Compare page mounted, checking for form data");
    const savedFormData = localStorage.getItem('vinylFormData');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);

        // Show a toast to indicate comparison is ready
        toast({
          title: "Quote Comparison Ready",
          description: `Showing pricing for ${parsedData.quantity} units of ${parsedData.size}" ${parsedData.colour} vinyl records.`,
        });

        console.log("Form data loaded successfully in Compare page:", parsedData);
      } catch (error) {
        console.error('Error parsing form data from localStorage:', error);
      }
    } else {
      console.log("No form data found in localStorage");
    }
  }, [toast]);

  // Filter plants based on filters
  const filteredPlants = plants?.filter((plant) => {
    console.log("Filtering plants with the following criteria:", plant);
    const matchesSearch = plant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCountry = selectedCountry === 'all' || plant.country === selectedCountry;

    const matchesOrder = minOrderRange === 'any' ||
      (minOrderRange === 'under500' && plant.minimum_order < 500) ||
      (minOrderRange === '500to1000' && plant.minimum_order >= 500 && plant.minimum_order <= 1000) ||
      (minOrderRange === 'over1000' && plant.minimum_order > 1000);

    const matchesRating = minRating === 'any' ||
      (minRating === '4plus' && plant.rating >= 4.0) ||
      (minRating === '3plus' && plant.rating >= 3.0) ||
      (minRating === 'below3' && plant.rating < 3.0);

    const matchesTurnaround = turnaroundTime === 'any' ||
      (turnaroundTime === 'under8' && parseInt(plant.turnaround_time.split('-')[0]) < 8) ||
      (turnaroundTime === '8to12' &&
        parseInt(plant.turnaround_time.split('-')[0]) >= 8 &&
        parseInt(plant.turnaround_time.split('-')[1]) <= 12) ||
      (turnaroundTime === 'over12' && parseInt(plant.turnaround_time.split('-')[1]) > 12);

    const matchesFeatures = selectedFeatures.length === 0 ||
      selectedFeatures.every(feature => plant.features.includes(feature));

    return matchesSearch && matchesCountry && matchesOrder && matchesRating && matchesTurnaround && matchesFeatures;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCountry('all');
    setMinOrderRange('any');
    setMinRating('any');
    setTurnaroundTime('any');
    setSelectedFeatures([]);
  };

  return (
    plants && (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-display text-3xl font-bold mb-3">Compare Vinyl Pressing Plants</h1>
          <p className="text-muted-foreground mb-8">
            Look at what we found! Check out and compare all the best pressing options from around the planet below
          </p>

          {currencyLoading && (
            <Alert variant="default" className="mb-4 bg-muted/50">
              <AlertDescription className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading current exchange rates...
              </AlertDescription>
            </Alert>
          )}

          {formData && <ProjectSpecificationsCard formData={formData} />}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>

            <div className="flex justify-between space-x-4">
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 order-2 lg:order-1">
              <FilterSection
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                minOrderRange={minOrderRange}
                setMinOrderRange={setMinOrderRange}
                minRating={minRating}
                setMinRating={setMinRating}
                turnaroundTime={turnaroundTime}
                setTurnaroundTime={setTurnaroundTime}
                selectedFeatures={selectedFeatures}
                setSelectedFeatures={setSelectedFeatures}
                clearFilters={clearFilters}
                countries={countries}
                availableFeatures={availableFeatures}
              />
            </div>

            <div className="lg:col-span-3 order-1 lg:order-2">
              <PlantListDisplay
                viewMode={viewMode}
                filteredPlants={filteredPlants}
                clearFilters={clearFilters}
                formData={formData}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
  );
};

export default Compare;
