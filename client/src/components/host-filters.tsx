import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import BudgetRangeSlider from "@/components/budget-range-slider";
import CommissionRangeSlider from "@/components/commission-range-slider";
import { Separator } from "@/components/ui/separator";
import { SearchableMultiSelect } from "@/components/searchable-multi-select";
import { Filter, X, Info, Search } from "lucide-react";

// Filter options based on submission form data
const PROPERTY_TYPES = [
  "Apartments", "Bungalows", "Cabins", "Campervans", "Chalets", "Condos", "Domes", "Guesthouses", "Hostels", "Hotels", "Houses", "Rooms", "Tents", "Villas"
];

const IDEAL_FOR = [
  "Companies", "Couples", "Digital Nomads", "Families", "Groups", "Retreats", "Seniors/Elderly", "Solo travelers"
];

const PROPERTIES_FEATURES = [
  "Air Conditioning", "Balcony/Terrace", "BBQ/Grill", "Dedicated workspace", "Dishwasher", 
  "Dryer", "EV Charging", "Fireplace", "Garage", "Garden/Outdoor Space", "Hair dryer", "Heating", 
  "Hot Tub/Jacuzzi", "Iron", "Kitchen/Kitchenette", "Parking", "Pool", "Washer", "WiFi"
];

const SERVICES_CONVENIENCE = [
  "24/7 Support", "Airport transfer", "Bike rental", "Breakfast included", "Car rental", "Concierge", 
  "Early check-in", "Grocery delivery", "Late check-out", "Luggage storage", "Mid-stay cleaning", 
  "Room service", "Self check-in"
];

const LIFESTYLE_VALUES = [
  "Adults only", "Budget-friendly", "Eco-friendly", "Family-friendly", "LGBTQ+ friendly", "Luxury amenities", 
  "Party-friendly", "Pet-friendly", "Quiet/Peaceful", "Remote-work friendly", "Smoking friendly", 
  "Sustainable practices", "Wheelchair accessible"
];

const DESIGN_STYLE = [
  "Art Deco", "Design-led/Contemporary", "Industrial", "Mid-century Modern", "Minimalist", "Modern", 
  "Scandinavian", "Traditional/Classic"
];

const ATMOSPHERES = [
  "Artistic/Creative", "Boho/Bohemian", "Bright/Airy", "Cozy/Intimate", "Luxury/Upscale", "Romantic", 
  "Rustic/Countryside", "Zen/Peaceful"
];

const SETTINGS_LOCATIONS = [
  "Beach/Coastal", "Countryside/Rural", "Desert/Unique Landscape", "Forest/Nature", "Historic/Heritage", 
  "Mountain/Alpine", "Urban/City", "Wine Country"
];

interface HostFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  propertyTypes: string[];
  idealFor: string[];
  propertiesFeatures: string[];
  servicesConvenience: string[];
  lifestyleValues: string[];
  designStyle: string[];
  atmospheres: string[];
  settingsLocations: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minCommission: number | null;
  maxCommission: number | null;
}

export default function HostFilters({ onFiltersChange }: HostFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    propertyTypes: [],
    idealFor: [],
    propertiesFeatures: [],
    servicesConvenience: [],
    lifestyleValues: [],
    designStyle: [],
    atmospheres: [],
    settingsLocations: [],
    minPrice: null,
    maxPrice: null,
    minCommission: null,
    maxCommission: null
  });



  const updateFilter = (category: keyof FilterState, value: string, checked: boolean) => {
    const newFilters = { ...filters };
    
    if (category === 'search') {
      newFilters.search = value;
    } else {
      if (checked) {
        (newFilters[category] as string[]) = [...(newFilters[category] as string[]), value];
      } else {
        (newFilters[category] as string[]) = (newFilters[category] as string[]).filter(item => item !== value);
      }
    }
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const updatePriceRange = (min: number | null, max: number | null) => {
    const newFilters = { ...filters };
    newFilters.minPrice = min;
    newFilters.maxPrice = max;
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const updateCommissionRange = (min: number | null, max: number | null) => {
    const newFilters = { ...filters };
    newFilters.minCommission = min;
    newFilters.maxCommission = max;
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      search: "",
      propertyTypes: [],
      idealFor: [],
      propertiesFeatures: [],
      servicesConvenience: [],
      lifestyleValues: [],
      designStyle: [],
      atmospheres: [],
      settingsLocations: [],
      minPrice: null,
      maxPrice: null,
      minCommission: null,
      maxCommission: null
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const removeFilter = (category: keyof FilterState, value: string) => {
    updateFilter(category, value, false);
  };

  const clearSearch = () => {
    updateFilter('search', '', false);
  };

  const totalActiveFilters = 
    filters.propertyTypes.length + 
    filters.idealFor.length + 
    filters.propertiesFeatures.length + 
    filters.servicesConvenience.length + 
    filters.lifestyleValues.length + 
    filters.designStyle.length + 
    filters.atmospheres.length + 
    filters.settingsLocations.length + 
    (filters.search ? 1 : 0) +
    (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0) +
    (filters.minCommission !== null || filters.maxCommission !== null ? 1 : 0);

  const renderFilterDropdown = (
    title: string,
    options: string[],
    category: keyof FilterState
  ) => (
    <div className="space-y-1">
      <SearchableMultiSelect
        options={options}
        selected={filters[category] as string[]}
        onSelect={(values) => {
          const newFilters = { ...filters, [category]: values };
          setFilters(newFilters);
          onFiltersChange(newFilters);
        }}
        placeholder={title}
        showSelectAll={true}
      />
    </div>
  );

  return (
    <Card className="mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Managers
            {totalActiveFilters > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {totalActiveFilters}
              </Badge>
            )}
          </CardTitle>
          {totalActiveFilters > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search managers by name, description, amenities..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value, false)}
            className="pl-10 pr-10"
          />
          {filters.search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Budget Range Slider */}
        <BudgetRangeSlider
          minValue={filters.minPrice}
          maxValue={filters.maxPrice}
          onRangeChange={updatePriceRange}
          className="px-2"
        />

        {/* Commission Range Slider */}
        <CommissionRangeSlider
          minValue={filters.minCommission}
          maxValue={filters.maxCommission}
          onRangeChange={updateCommissionRange}
          className="px-2"
        />

        {/* Filter Dropdowns with Search */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {renderFilterDropdown("Property Types", PROPERTY_TYPES, "propertyTypes")}
          {renderFilterDropdown("Ideal For", IDEAL_FOR, "idealFor")}
          {renderFilterDropdown("Properties Features", PROPERTIES_FEATURES, "propertiesFeatures")}
          {renderFilterDropdown("Services & Convenience", SERVICES_CONVENIENCE, "servicesConvenience")}
          {renderFilterDropdown("Lifestyle & Values", LIFESTYLE_VALUES, "lifestyleValues")}
          {renderFilterDropdown("Design Styles", DESIGN_STYLE, "designStyle")}
          {renderFilterDropdown("Atmospheres", ATMOSPHERES, "atmospheres")}
          {renderFilterDropdown("Settings/Locations", SETTINGS_LOCATIONS, "settingsLocations")}
        </div>

        {/* Active Filters */}
        {totalActiveFilters > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Active Filters:</div>
              <div className="flex flex-wrap gap-2">
                {/* Search filter */}
                {filters.search && (
                  <Badge 
                    variant="secondary" 
                    className="bg-green-100 text-green-800 flex items-center gap-1"
                  >
                    <Search className="h-3 w-3" />
                    "{filters.search}"
                    <button
                      onClick={clearSearch}
                      className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {/* Price range filter */}
                {(filters.minPrice !== null || filters.maxPrice !== null) && (
                  <Badge 
                    variant="secondary" 
                    className="bg-blue-100 text-blue-800 flex items-center gap-1"
                  >
                    💰 {filters.minPrice || 0}€ - {filters.maxPrice || '∞'}€
                    <button
                      onClick={() => updatePriceRange(null, null)}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {/* Commission range filter */}
                {(filters.minCommission !== null || filters.maxCommission !== null) && (
                  <Badge 
                    variant="secondary" 
                    className="bg-green-100 text-green-800 flex items-center gap-1"
                  >
                    💼 {filters.minCommission || 0}% - {filters.maxCommission || '∞'}%
                    <button
                      onClick={() => updateCommissionRange(null, null)}
                      className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                {/* Category filters */}
                {Object.entries(filters).map(([category, values]) => {
                  if (category === 'search' || !Array.isArray(values)) return null;
                  return values.map((value: string) => (
                    <Badge 
                      key={`${category}-${value}`} 
                      variant="secondary" 
                      className="bg-blue-100 text-blue-800 flex items-center gap-1"
                    >
                      {value}
                      <button
                        onClick={() => removeFilter(category as keyof FilterState, value)}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                })}
              </div>
            </div>
          </>
        )}

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Important Note:</p>
              <p>
                Features shown apply to some listings offered by each host (not all). 
                For exact details, visit the host's website.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 