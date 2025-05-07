
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-display text-4xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl">
            We connect artists and labels with the world's finest vinyl pressing plants, 
            ensuring your music gets the quality production it deserves.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
            <div>
              <h2 className="text-2xl font-display font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-6">
                At WorldWideWax, our mission is to simplify the vinyl production process by providing transparent, 
                reliable information about pressing plants around the globe. We believe in supporting both established 
                and emerging artists by helping them find the right manufacturing partner for their unique projects.
              </p>
              <p className="text-muted-foreground">
                We're passionate about vinyl as a medium and committed to helping sustain and grow the vinyl ecosystem 
                through better connections between artists and manufacturers.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-display font-semibold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-6">
                Founded in 2023 by a group of music industry professionals and vinyl enthusiasts, WorldWideWax 
                emerged from the frustration of navigating the opaque world of vinyl production. After experiencing 
                firsthand the challenges of finding reliable pressing plants with transparent pricing and capabilities, 
                we decided to build the solution ourselves.
              </p>
              <p className="text-muted-foreground">
                Today, we maintain relationships with pressing plants across six continents, constantly updating 
                our database to provide you with the most current information possible.
              </p>
            </div>
          </div>
          
          <div className="bg-secondary p-8 rounded-lg mb-16">
            <h2 className="text-2xl font-display font-semibold mb-4 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <h3 className="text-xl font-medium mb-2">Transparency</h3>
                <p className="text-muted-foreground">
                  We believe in providing clear, honest information about pricing, capabilities, and turnaround times.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-medium mb-2">Quality</h3>
                <p className="text-muted-foreground">
                  We only partner with pressing plants that demonstrate consistent quality and reliability.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-medium mb-2">Community</h3>
                <p className="text-muted-foreground">
                  We're dedicated to strengthening the global vinyl community through better connections and information sharing.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-display font-semibold mb-6 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((member) => (
                <div key={member} className="text-center">
                  <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium">Team Member {member}</h3>
                  <p className="text-muted-foreground">Role / Position</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
