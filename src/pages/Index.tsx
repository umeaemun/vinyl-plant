import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecordProjectForm from '@/components/RecordProjectForm';
import { ArrowDown } from 'lucide-react';

const Index = () => {
  useEffect(() => {
    localStorage.removeItem('selectedPlantId');
  }, []);
  const scrollToForm = () => {
    document.getElementById('quote-form-section')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-[25px] relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">Explore the world's largest directory of the best vinyl record pressing plants with one simple search.</h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-thin">Compare price, turnaround time, reviews and more.</p>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-thin">Order vinyl from anywhere in world with one simple click.</p>
              </div>
              
              <div className="md:w-1/2 relative">
                <img alt="Vinyl Record" className="w-full max-w-[107%] mx-auto" src="/lovable-uploads/57d01c9f-793d-4efa-aef9-8ffc9d43140f.png" />
              </div>
            </div>
          </div>
          
          {/* Floating Arrow */}
          <button onClick={scrollToForm} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce text-wwwax-green hover:text-wwwax-green/80 transition-colors" aria-label="Scroll to quote form">
            <ArrowDown size={48} strokeWidth={2.5} />
          </button>
        </section>
        
        {/* Form Section */}
        <section className="py-16" id="quote-form-section">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">Instantly get quotes, compare options and order today.</h2>
            
            <RecordProjectForm />
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-[65px] pb-[85px]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background rounded-lg p-6 text-center shadow-md flex flex-col items-center">
                <div className="w-16 h-16 bg-wwwax-green/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Enter Your Specifications</h3>
                <p className="text-muted-foreground">
                  Tell us your vinyl record requirements including quantity, format, and packaging details.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6 text-center shadow-md flex flex-col items-center">
                <div className="w-16 h-16 bg-wwwax-green/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Compare Plants</h3>
                <p className="text-muted-foreground">
                  Review side-by-side comparisons of pressing plants matched to your specifications.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6 text-center shadow-md flex flex-col items-center">
                <div className="w-16 h-16 bg-wwwax-green/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Place Your Order</h3>
                <p className="text-muted-foreground">
                  Select your preferred pressing plant and submit your order directly through our platform.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};

export default Index;
