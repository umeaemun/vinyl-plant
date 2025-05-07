
import React, { useState, useEffect } from 'react';
import { Plant } from '@/data/plants';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PlantCard from '@/components/PlantCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MapPin, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PlantDirectory = () => {
  const [allPlants, setAllPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
  const { user } = useAuth();

  // Load plants from data and local storage
  useEffect(() => {
    // Load custom plants from localStorage if any
    const customPlants = JSON.parse(localStorage.getItem('customPlants') || '[]');
    const combinedPlants = [...plants, ...customPlants];
    setAllPlants(combinedPlants);
    setFilteredPlants(combinedPlants);
  }, []);

  // Handle search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query === '') {
      setFilteredPlants(allPlants);
      return;
    }
    
    const filtered = allPlants.filter(plant => 
      plant.name.toLowerCase().includes(query) ||
      plant.location.toLowerCase().includes(query) ||
      plant.country.toLowerCase().includes(query) ||
      plant.description.toLowerCase().includes(query) ||
      plant.features.some(feature => feature.toLowerCase().includes(query))
    );
    
    setFilteredPlants(filtered);
  };

  // Filter by country
  const filterByCountry = (country: string | null) => {
    if (!country) {
      setFilteredPlants(allPlants);
      return;
    }
    
    const filtered = allPlants.filter(plant => 
      plant.country === country
    );
    
    setFilteredPlants(filtered);
  };

  // Get unique countries for filtering
  const countries = [...new Set(allPlants.map(plant => plant.country))];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-display text-3xl font-bold">Vinyl Pressing Plant Directory</h1>
            {user && (
              <Button asChild variant="outline">
                <Link to={`/plant-profile/${user.id}`}>
                  <User className="h-4 w-4 mr-2" />
                  My Plant Profile
                </Link>
              </Button>
            )}
          </div>
          
          <p className="text-muted-foreground mb-8">
            Browse our comprehensive directory of vinyl pressing plants around the world. Find the perfect partner for your next vinyl project.
          </p>
          
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, location, or features..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
              
              <Tabs defaultValue="all" className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => filterByCountry(null)}>All Countries</TabsTrigger>
                  {countries.map(country => (
                    <TabsTrigger key={country} value={country} onClick={() => filterByCountry(country)}>
                      {country}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {filteredPlants.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No plants found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlants.map(plant => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PlantDirectory;
