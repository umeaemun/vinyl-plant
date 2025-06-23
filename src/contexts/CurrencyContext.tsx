
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to USD
};

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 1 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 1 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 1 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1 },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', rate: 1 },
];

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (price: number, fromCurrencyCode: string) => number;
  formatPrice: (price: number) => string;
  convertCodeToSymbol: (code: string) => string;
  isLoading: boolean;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: currencies[0],
  setCurrency: () => {},
  convertPrice: (price: number, fromCurrencyCode?: string) => price,
  formatPrice: (price: number) => `$${price.toFixed(2)}`,
  convertCodeToSymbol: (code: string) => {
  const foundCurrency = currencies.find(c => c.code === code);
  return foundCurrency ? foundCurrency.symbol : '';
},

  isLoading: false,
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(currencies[0]);
  const [currenciesWithRates, setCurrenciesWithRates] = useState<Currency[]>(currencies);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch currency rates from API
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://open.er-api.com/v6/latest/USD`);
        const data = await response.json();
        
        if (data && data.rates) {
          // Update currencies with live rates
          const updatedCurrencies = currencies.map(curr => ({
            ...curr,
            rate: data.rates[curr.code] || curr.rate
          }));
          
          setCurrenciesWithRates(updatedCurrencies);
          
          // Update current currency with new rate
          const updatedCurrentCurrency = updatedCurrencies.find(c => c.code === currency.code);
          if (updatedCurrentCurrency) {
            setCurrency(updatedCurrentCurrency);
          }
          
          console.log('Currency rates updated:', data.rates);
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchangeRates();
    
    // Refresh rates every 12 hours
    const intervalId = setInterval(fetchExchangeRates, 12 * 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Load saved currency from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
      try {
        const currencyObject = JSON.parse(savedCurrency);
        if (currencyObject && currencyObject.code) {
          const foundCurrency = currenciesWithRates.find(c => c.code === currencyObject.code);
          if (foundCurrency) {
            setCurrency(foundCurrency);
          }
        }
      } catch (e) {
        console.error('Error parsing saved currency:', e);
      }
    }
  }, [currenciesWithRates]);

  const handleSetCurrency = (newCurrency: Currency) => {
    const currencyWithRate = currenciesWithRates.find(c => c.code === newCurrency.code);
    if (currencyWithRate) {
      setCurrency(currencyWithRate);
      localStorage.setItem('currency', JSON.stringify(currencyWithRate));
    }
  };

  // const convertPrice = (priceInUSD: number): number => {
  //   return priceInUSD * currency.rate;
  // };

  const convertPrice = (price: number, fromCurrencyCode: string ): number => {
  const fromCurrency = currenciesWithRates.find(c => c.code === fromCurrencyCode);
  if (!fromCurrency) return price; // fallback: return original

  // Convert from source currency to USD first, then to selected
  const priceInUSD = price / fromCurrency.rate;
  const convertedPrice = priceInUSD * currency.rate;

  return convertedPrice;
};


  const formatPrice = (price: number): string => {
    return `${currency.symbol} ${price.toFixed(2)}`;
  };

  const convertCodeToSymbol = (code: string): string => {
    const foundCurrency = currenciesWithRates.find(c => c.code === code);
    return foundCurrency ? foundCurrency.symbol : '';
  };

  return (
    <CurrencyContext.Provider 
      value={{ 
        currency, 
        setCurrency: handleSetCurrency, 
        convertPrice, 
        formatPrice,
        convertCodeToSymbol,
        isLoading
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
