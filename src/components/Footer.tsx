
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="w-full py-12 bg-black text-white mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo withText={true} />
            <p className="mt-4 text-gray-400 text-sm">
              Helping artists and labels find the perfect vinyl pressing plant for their music.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-wwwax-green transition-colors">Home</Link></li>
              <li><Link to="/compare" className="text-gray-400 hover:text-wwwax-green transition-colors">Compare Plants</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-wwwax-green transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/vinyl-glossary" className="text-gray-400 hover:text-wwwax-green transition-colors">Vinyl Glossary</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-wwwax-green transition-colors">Production Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-wwwax-green transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">info@worldwidewax.com</li>
              <li className="text-gray-400">Submit a Pressing Plant</li>
              <li className="text-gray-400">Report an Issue</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} World Wide Wax. All rights reserved.</p>
          <p className="mt-2">This is a prototype. Plant information is for demonstration purposes only.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
