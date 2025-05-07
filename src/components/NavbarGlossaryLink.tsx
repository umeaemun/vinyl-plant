
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Info } from 'lucide-react';

const NavbarGlossaryLink = () => {
  // This component is meant to be added to the Navbar
  // Since we can't modify Navbar directly, this is provided as a reference
  return (
    <NavLink 
      to="/vinyl-glossary"
      className={({isActive}) => 
        `flex items-center gap-1 px-3 py-2 hover:text-foreground transition-colors ${
          isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
        }`
      }
    >
      <Info className="h-4 w-4" />
      <span>Glossary</span>
    </NavLink>
  );
};

export default NavbarGlossaryLink;
