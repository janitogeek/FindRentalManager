import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyCode, CURRENCY_OPTIONS } from '@/lib/currency-utils';
import { COMPREHENSIVE_CURRENCY_LIST } from '@/lib/comprehensive-currency-list';

interface CurrencyContextType {
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  currencyOptions: Array<{ code: string; symbol: string; name: string }>;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('EUR');
  const [currencyOptions, setCurrencyOptions] = useState<Array<{ code: string; symbol: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load currencies from comprehensive list
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Loading comprehensive currency list...');
        
        // Use the comprehensive currency list from user's Airtable options
        const allCurrencies = [...COMPREHENSIVE_CURRENCY_LIST];
        
        // Sort by currency code
        allCurrencies.sort((a, b) => a.code.localeCompare(b.code));
        
        console.log('✅ Total currencies available:', allCurrencies.length, allCurrencies);
        setCurrencyOptions(allCurrencies);
        
        // Load saved currency from localStorage
        const savedCurrency = localStorage.getItem('selectedCurrency');
        if (savedCurrency && allCurrencies.some(option => option.code === savedCurrency)) {
          setSelectedCurrency(savedCurrency);
        } else if (allCurrencies.length > 0) {
          // Set first currency as default if no saved currency
          setSelectedCurrency(allCurrencies[0].code);
        }
      } catch (error) {
        console.error('❌ Failed to load currencies:', error);
        // Fallback to CURRENCY_OPTIONS from commit 9bab664
        console.log('🔄 Using CURRENCY_OPTIONS fallback:', CURRENCY_OPTIONS.length);
        setCurrencyOptions(CURRENCY_OPTIONS);
        setSelectedCurrency('EUR'); // Set default currency
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrencies();
  }, []);

  // Save currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency);
  }, [selectedCurrency]);

  return (
    <CurrencyContext.Provider value={{ 
      selectedCurrency, 
      setSelectedCurrency, 
      currencyOptions,
      isLoading
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
