
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-display text-4xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
            Have questions about vinyl pressing or need help finding the right plant for your project? Get in touch with our team.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-display font-semibold mb-6">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-wwwax-green mt-1" />
                  <div>
                    <h3 className="text-lg font-medium">Email</h3>
                    <p className="text-muted-foreground">info@worldwidewax.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-wwwax-green mt-1" />
                  <div>
                    <h3 className="text-lg font-medium">Phone</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-wwwax-green mt-1" />
                  <div>
                    <h3 className="text-lg font-medium">Location</h3>
                    <p className="text-muted-foreground">123 Vinyl Street, Music City, MC 12345</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary p-8 rounded-lg">
              <h2 className="text-2xl font-display font-semibold mb-6">Send us a message</h2>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block font-medium">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full p-3 border border-border rounded-md bg-background"
                    placeholder="Your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block font-medium">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full p-3 border border-border rounded-md bg-background"
                    placeholder="Your email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="block font-medium">Message</label>
                  <textarea 
                    id="message" 
                    rows={6} 
                    className="w-full p-3 border border-border rounded-md bg-background resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="bg-wwwax-green hover:bg-wwwax-green/90 text-black font-medium px-6 py-3 rounded-md transition-colors w-full"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
