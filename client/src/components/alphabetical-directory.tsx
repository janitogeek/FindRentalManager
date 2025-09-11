/**
 * Alphabetical Directory Component
 * Displays items in alphabetical sections with search functionality
 * Used for regions and cities directory listings
 */
import React, { useState, useMemo } from 'react';
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

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  // Group items alphabetically
  const groupedItems = useMemo(() => {
    const groups: Record<string, DirectoryItem[]> = {};
    filteredItems.forEach(item => {
      const firstLetter = item.name.charAt(0).toUpperCase();
      const key = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });

    // Sort items within each group
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => a.name.localeCompare(b.name));
    });

    return groups;
  }, [filteredItems]);

  const alphabetKeys = Object.keys(groupedItems).sort((a, b) => {
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b);
  });

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

      {/* Directory Content */}
      {alphabetKeys.length === 0 ? (
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
        <div className="space-y-8">
          {alphabetKeys.map(letter => (
            <div key={letter} className="space-y-4">
              {/* Letter Header */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                  {letter}
                </div>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {groupedItems[letter].map((item) => (
                  <Card key={item.slug} className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <Link href={item.href} className="block">
                        <div className="text-center">
                          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                            {item.name}
                          </h3>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {item.count} {item.count === 1 ? 'manager' : 'managers'}
                          </Badge>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
