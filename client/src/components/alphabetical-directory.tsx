/**
 * Alphabetical Directory Component
 * Displays items in alphabetical sections with search functionality
 * Used for regions and cities directory listings
 */
import React, { useState, useMemo, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

interface DirectoryItem {
  name: string;
  slug: string;
  count: number;
  href: string;
}

interface AlphabeticalDirectoryProps {
  title: string;
  description: string;
  items: DirectoryItem[];
  searchPlaceholder?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  className?: string;
}

export default function AlphabeticalDirectory({
  title,
  description,
  items,
  searchPlaceholder = "Search...",
  emptyStateTitle = "No items found",
  emptyStateDescription = "Try adjusting your search terms.",
  className = ""
}: AlphabeticalDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  // Get available letters
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    filteredItems.forEach(item => {
      const firstLetter = item.name.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstLetter)) {
        letters.add(firstLetter);
      }
    });
    return Array.from(letters).sort();
  }, [filteredItems]);

  // Auto-select first available letter if none selected
  useEffect(() => {
    if (!selectedLetter && availableLetters.length > 0) {
      setSelectedLetter(availableLetters[0]);
    } else if (selectedLetter && !availableLetters.includes(selectedLetter)) {
      // If selected letter is no longer available, select first available
      setSelectedLetter(availableLetters[0] || null);
    }
  }, [availableLetters, selectedLetter]);

  // Get items for selected letter
  const itemsByLetter = useMemo(() => {
    if (!selectedLetter) return [];
    
    return filteredItems
      .filter(item => {
        const firstLetter = item.name.charAt(0).toUpperCase();
        return firstLetter === selectedLetter;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredItems, selectedLetter]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const totalCount = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          {description}
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
          <div className="flex items-center space-x-4">
            <Badge className="bg-blue-500 text-white">
              {items.length} {items.length === 1 ? 'location' : 'locations'}
            </Badge>
            <span className="text-blue-700">•</span>
            <Badge className="bg-green-500 text-white">
              {totalCount} {totalCount === 1 ? 'manager' : 'managers'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Search */}
      {items.length > 0 && (
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-3"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 🔤 ALPHABETICAL FRIEZE */}
      {availableLetters.length > 0 && (
        <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
          <div className="flex flex-wrap justify-center gap-2">
            {availableLetters.map((letter) => (
              <Button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                variant={selectedLetter === letter ? "default" : "outline"}
                size="sm"
                className="min-w-[40px] h-10 font-semibold"
              >
                {letter}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Directory Content */}
      {itemsByLetter.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2">{emptyStateTitle}</h3>
            <p className="mb-4">{emptyStateDescription}</p>
            {searchQuery && (
              <Button variant="outline" onClick={clearSearch} className="mt-4">
                Clear search
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {itemsByLetter.map((item) => (
            <div key={item.slug} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <Link href={item.href} className="block p-4 text-center hover:bg-gray-50 transition-colors">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {item.count} {item.count === 1 ? 'manager' : 'managers'}
                  </Badge>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="text-center mt-12 pt-8 border-t border-gray-200">
        <p className="text-gray-600 mb-4">
          Can't find your location?
        </p>
        <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
          <Link href="/submit">
            List Your Management Company
          </Link>
        </Button>
      </div>
    </div>
  );
}
