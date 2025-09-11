import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';

interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

interface CurrencyPopupSelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  currencies: CurrencyOption[];
  isLoading?: boolean;
}

export function CurrencyPopupSelector({
  selectedCurrency,
  onCurrencyChange,
  currencies,
  isLoading = false
}: CurrencyPopupSelectorProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filtered = currencies.filter(currency =>
    currency.code.toLowerCase().includes(search.toLowerCase()) ||
    currency.name.toLowerCase().includes(search.toLowerCase()) ||
    currency.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);
  const display = selectedCurrencyData ? `${selectedCurrencyData.symbol} ${selectedCurrencyData.code}` : "Select currency...";

  const handleCurrencySelect = (currency: CurrencyOption) => {
    onCurrencyChange(currency.code);
    setOpen(false);
    setSearch("");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between text-left"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={!selectedCurrencyData ? "text-muted-foreground" : ""}>{display}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[220px] max-h-80 p-1 flex flex-col" align="start" side="top">
        <Input
          ref={inputRef}
          placeholder="Search currencies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-2 flex-shrink-0"
        />
        
        <div className="flex-1 overflow-y-auto max-h-48 min-h-0">
          {filtered.map(currency => (
            <label key={currency.code} className="flex items-center gap-2 cursor-pointer select-none px-2 py-1 hover:bg-gray-50">
              <input
                type="radio"
                name="currency"
                checked={selectedCurrency === currency.code}
                onChange={() => handleCurrencySelect(currency)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div className="flex items-center gap-2">
                <span className="font-medium">{currency.symbol}</span>
                <span className="text-sm text-gray-900">{currency.code}</span>
                <span className="text-sm text-gray-500">{currency.name}</span>
              </div>
            </label>
          ))}
          {filtered.length === 0 && (
            <div className="text-gray-400 text-sm px-2">
              {isLoading ? 'Loading currencies...' : 'No currencies found'}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-2 pt-2 border-t border-gray-100 flex-shrink-0">
          <Button type="button" size="sm" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

