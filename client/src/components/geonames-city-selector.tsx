/**
 * GeoNames City Selector Component
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Check, ChevronsUpDown, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { searchCities, ProcessedCity } from '@/lib/geonames';

interface GeonamesCitySelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxSelections?: number;
}

export function GeonamesCitySelector({
  value = [],
  onChange,
  placeholder = "Search for cities...",
  maxSelections = 15
}: GeonamesCitySelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState<ProcessedCity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setCities([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchCities(searchQuery, 15);
        setCities(results);
      } catch (error) {
        console.error('Error searching cities:', error);
        setCities([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Filter out already selected cities
  const availableCities = useMemo(() => {
    return cities.filter(city => !value.includes(city.fullName));
  }, [cities, value]);

  const handleSelect = (cityFullName: string) => {
    if (value.length >= maxSelections) return;
    
    const newValue = [...value, cityFullName];
    onChange(newValue);
    setSearchQuery('');
    setOpen(false);
  };

  const handleRemove = (cityToRemove: string) => {
    const newValue = value.filter(city => city !== cityToRemove);
    onChange(newValue);
  };

  const getCityDisplayName = (fullName: string) => {
    // Extract just the city name from "City, Region, Country"
    return fullName.split(',')[0].trim();
  };

  return (
    <div className="space-y-3">
      {/* Selected Cities */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((city) => (
            <Badge
              key={city}
              variant="secondary"
              className="pl-3 pr-1 py-1 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
            >
              <MapPin className="w-3 h-3 mr-1" />
              {getCityDisplayName(city)}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-4 w-4 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-200"
                onClick={() => handleRemove(city)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* City Selector */}
      {value.length < maxSelections && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              <span className="text-left">
                {value.length === 0 ? placeholder : `${value.length} cities selected`}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Type to search cities..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandEmpty>
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-gray-600">Searching cities...</span>
                  </div>
                ) : searchQuery.length < 2 ? (
                  <div className="py-6 text-center text-sm text-gray-500">
                    Type at least 2 characters to search
                  </div>
                ) : (
                  <div className="py-6 text-center text-sm text-gray-500">
                    No cities found
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup>
                {availableCities.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={city.fullName}
                    onSelect={() => handleSelect(city.fullName)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {city.city}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {city.region && `${city.region}, `}{city.country}
                        </div>
                      </div>
                      {city.population > 0 && (
                        <div className="text-xs text-gray-400 flex-shrink-0">
                          {city.population.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {/* Selection Info */}
      {value.length > 0 && (
        <div className="text-xs text-gray-500">
          {value.length} of {maxSelections} cities selected
        </div>
      )}
    </div>
  );
}
