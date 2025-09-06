import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CurrencyCode } from '@/lib/currency-utils';
import { useCurrency } from '@/contexts/currency-context';
import { ChevronDown } from 'lucide-react';

interface CurrencySelectorProps {
  selectedCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  className?: string;
}

export default function CurrencySelector({ 
  selectedCurrency, 
  onCurrencyChange, 
  className = '' 
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currencyOptions } = useCurrency();

  const selectedOption = currencyOptions.find(option => option.code === selectedCurrency);

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border-gray-300 hover:bg-gray-50"
      >
        <span className="text-lg">{selectedOption?.symbol}</span>
        <span className="text-sm font-medium">{selectedOption?.code}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              {currencyOptions.map((option) => (
                <button
                  key={option.code}
                  onClick={() => {
                    onCurrencyChange(option.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between ${
                    selectedCurrency === option.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{option.symbol}</span>
                    <span className="font-medium">{option.code}</span>
                    <span className="text-sm text-gray-500">{option.name}</span>
                  </div>
                  {selectedCurrency === option.code && (
                    <Badge variant="secondary" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
