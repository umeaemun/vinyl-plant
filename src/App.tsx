import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import Index from "./pages/Index";
import Compare from "./pages/Compare";
import PlantDetails from "./pages/PlantDetails";
import PlantProfile from "./pages/PlantProfile";
import PlantProfiles from "./pages/PlantProfiles";
import PlantDirectory from "./pages/PlantDirectory";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Order from "./pages/Order";
import Auth from "./pages/Auth";
import VinylGlossary from "./pages/VinylGlossary";
import NotFound from "./pages/NotFound";
import BuyerProfile from "./pages/BuyerProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CurrencyProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />

              {/* Auth */}
              <Route path="/auth" element={<Auth />} />                                 {/*  DONE */}

              {/* Buyer */}
              <Route path="/buyer-profile" element={<BuyerProfile />} />
              <Route path="/order" element={<Order />} />
              <Route path="/compare" element={<Compare />} />                          {/*  Form wala remaining */}
              <Route path="/plant/:id" element={<PlantDetails />} />                   {/*  working, this screen comes after clicking a plant from compare screen */}


              {/* Manufacturer */}
              <Route path="/plant-profile/:id" element={<PlantProfile />} />           {/*here id is userId,  edit plant details */}

              {/* not discussed in scope */}
              <Route path="/plant-profiles" element={<PlantProfiles />} />             {/* for admin */}
              <Route path="/plant-directory" element={<PlantDirectory />} />
              <Route path="/vinyl-glossary" element={<VinylGlossary />} />


              {/* No work */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />

              
            </Routes>
          </BrowserRouter>
        </CurrencyProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
