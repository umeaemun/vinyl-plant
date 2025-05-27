
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Menu, Mail, Check, LogOut, User, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency, currencies } from '@/contexts/CurrencyContext';
import Logo from './Logo';

const languages = [
  { name: 'English', code: 'en' },
  { name: '日本語', code: 'ja' },
  { name: '中文', code: 'zh' },
  { name: 'Français', code: 'fr' },
  { name: 'Español', code: 'es' },
  { name: 'हिन्दी', code: 'hi' },
];

const Navbar = () => {
  const isMobile = useIsMobile();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const { user, userProfile, signOut } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();

  console.log('Current user:', userProfile);
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('language', langCode);
    document.documentElement.lang = langCode;

    console.log(`Language changed to: ${langCode}`);
  };

  const handleCurrencyChange = (currencyCode: string) => {
    const selectedCurrency = currencies.find(c => c.code === currencyCode);
    if (selectedCurrency) {
      setCurrency(selectedCurrency);
      console.log(`Currency changed to: ${currencyCode}`);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Compare Plants', path: '/compare' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const NavLinks = () => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className="text-foreground hover:text-wwwax-green transition-colors"
        >
          {link.name}
        </Link>
      ))}
    </>
  );

  return (
    <header className="w-full py-4 bg-white fixed top-0 z-50 border-b border-black">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {!isMobile && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex items-center">
                    <DollarSign className="h-9 w-9" strokeWidth={2.5} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {currencies.map((curr) => (
                    <DropdownMenuItem
                      key={curr.code}
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => handleCurrencyChange(curr.code)}
                    >
                      <span>{curr.symbol} {curr.name}</span>
                      {currency.code === curr.code && (
                        <Check className="h-4 w-4 ml-2" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex items-center">
                    <Globe className="h-9 w-9" strokeWidth={2.5} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      {lang.name}
                      {currentLanguage === lang.code && (
                        <Check className="h-4 w-4 ml-2" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          <div className="flex items-center">
            {user && userProfile ? (
              <DropdownMenu>

                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">Account</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  {userProfile.role == 'admin' &&
                    <DropdownMenuItem asChild>
                      <Link to="/plant-profiles">All Plants</Link>
                    </DropdownMenuItem>
                  }
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>

              </DropdownMenu>
            ) : (
              <Link to="/auth" className="flex items-center gap-2 font-medium text-lg">
                <span>Log In</span>
              </Link>
            )}
          </div>

          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Menu className="h-9 w-9" strokeWidth={2.5} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-6 mt-8">
                  <NavLinks />
                  <Link to="/plant-directory" className="flex items-center gap-2 font-medium">
                    Plant Directory
                  </Link>
                  {user && userProfile? (
                    <>
                      {userProfile.role == 'admin' &&
                        <Link to="/plant-profiles" className="flex items-center gap-2 font-medium">
                          My Plants
                        </Link>
                      }
                      <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link to="/auth" className="flex items-center gap-2 font-medium">
                      Log In
                    </Link>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2 w-full justify-start">
                        <DollarSign className="h-5 w-5" strokeWidth={2.5} />
                        <span>Change Currency</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-full">
                      {currencies.map((curr) => (
                        <DropdownMenuItem
                          key={curr.code}
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => handleCurrencyChange(curr.code)}
                        >
                          <span>{curr.symbol} {curr.name}</span>
                          {currency.code === curr.code && (
                            <Check className="h-4 w-4 ml-2" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2 w-full justify-start">
                        <Globe className="h-5 w-5" strokeWidth={2.5} />
                        <span>Change Language</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-full">
                      {languages.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => handleLanguageChange(lang.code)}
                        >
                          {lang.name}
                          {currentLanguage === lang.code && (
                            <Check className="h-4 w-4 ml-2" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2 flex items-center">
                  <Menu className="h-9 w-9" strokeWidth={2.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white w-48">
                <DropdownMenuItem asChild>
                  <Link to="/plant-directory" className="flex items-center w-full">
                    Plant Directory
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/about" className="flex items-center w-full">
                    About
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="flex items-center w-full">
                    Contact
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
