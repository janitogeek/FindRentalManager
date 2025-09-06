import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyCode, CURRENCY_OPTIONS } from '@/lib/currency-utils';

interface CurrencyContextType {
  selectedCurrency: CurrencyCode;
  setSelectedCurrency: (currency: CurrencyCode) => void;
  currencyOptions: Array<{ code: CurrencyCode; symbol: string; name: string }>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('EUR');

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency') as CurrencyCode;
    if (savedCurrency && CURRENCY_OPTIONS.some(option => option.code === savedCurrency)) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  // Save currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency);
  }, [selectedCurrency]);

  return (
    <CurrencyContext.Provider value={{ 
      selectedCurrency, 
      setSelectedCurrency, 
      currencyOptions: CURRENCY_OPTIONS 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
