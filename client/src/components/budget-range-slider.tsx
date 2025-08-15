import React, { useState, useRef, useCallback, useEffect } from 'react';

interface BudgetRangeSliderProps {
  minValue?: number | null;
  maxValue?: number | null;
  onRangeChange: (min: number | null, max: number | null) => void;
  className?: string;
}

export default function BudgetRangeSlider({ 
  minValue = null, 
  maxValue = null, 
  onRangeChange,
  className = ""
}: BudgetRangeSliderProps) {
  const [minPrice, setMinPrice] = useState(minValue || 20);
  const [maxPrice, setMaxPrice] = useState(maxValue || 300);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const MIN_RANGE = 20;
  const MAX_RANGE = 300;
  const GAP = 10;

  // Histogram data
  const histogramData = [
    { range: 20, height: 15 }, { range: 30, height: 25 }, { range: 40, height: 35 },
    { range: 50, height: 45 }, { range: 60, height: 55 }, { range: 70, height: 65 },
    { range: 80, height: 70 }, { range: 90, height: 75 }, { range: 100, height: 80 },
    { range: 110, height: 75 }, { range: 120, height: 70 }, { range: 130, height: 65 },
    { range: 140, height: 60 }, { range: 150, height: 55 }, { range: 160, height: 50 },
    { range: 170, height: 45 }, { range: 180, height: 40 }, { range: 190, height: 35 },
    { range: 200, height: 30 }, { range: 220, height: 25 }, { range: 240, height: 20 },
    { range: 260, height: 15 }, { range: 280, height: 10 }, { range: 300, height: 8 }
  ];

  // Convert mouse position to value
  const getValueFromPosition = useCallback((clientX: number): number => {
    if (!sliderRef.current) return MIN_RANGE;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(MIN_RANGE + percentage * (MAX_RANGE - MIN_RANGE));
  }, []);

  // Handle mouse down on handles
  const handleMouseDown = useCallback((handle: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(handle);
  }, []);

  // Handle mouse move during drag
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newValue = getValueFromPosition(e.clientX);
    
    if (isDragging === 'min') {
      const constrainedValue = Math.min(newValue, maxPrice - GAP);
      const finalValue = Math.max(MIN_RANGE, constrainedValue);
      if (finalValue !== minPrice) {
        setMinPrice(finalValue);
      }
    } else if (isDragging === 'max') {
      const constrainedValue = Math.max(newValue, minPrice + GAP);
      const finalValue = Math.min(MAX_RANGE, constrainedValue);
      if (finalValue !== maxPrice) {
        setMaxPrice(finalValue);
      }
    }
  }, [isDragging, minPrice, maxPrice, getValueFromPosition]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Handle click on track
  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    if (isDragging) return;
    
    const newValue = getValueFromPosition(e.clientX);
    const distanceToMin = Math.abs(newValue - minPrice);
    const distanceToMax = Math.abs(newValue - maxPrice);
    
    if (distanceToMin < distanceToMax) {
      const constrainedValue = Math.min(newValue, maxPrice - GAP);
      const finalValue = Math.max(MIN_RANGE, constrainedValue);
      setMinPrice(finalValue);
    } else {
      const constrainedValue = Math.max(newValue, minPrice + GAP);
      const finalValue = Math.min(MAX_RANGE, constrainedValue);
      setMaxPrice(finalValue);
    }
  }, [minPrice, maxPrice, isDragging, getValueFromPosition]);

  // Add global event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Update parent component
  useEffect(() => {
    onRangeChange(minPrice, maxPrice >= MAX_RANGE ? null : maxPrice);
  }, [minPrice, maxPrice, onRangeChange]);

  // Calculate positions
  const minPercent = ((minPrice - MIN_RANGE) / (MAX_RANGE - MIN_RANGE)) * 100;
  const maxPercent = ((maxPrice - MIN_RANGE) / (MAX_RANGE - MIN_RANGE)) * 100;

  return (
    <div className={`w-full ${className}`}>
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Properties Average Daily Rate
      </h3>
      
      {/* Selected Range Display */}
      <div className="text-sm text-gray-600 mb-4">
        From € {minPrice} to € {maxPrice >= MAX_RANGE ? `${maxPrice}+` : maxPrice}
      </div>

      {/* Slider Container */}
      <div className="relative w-full h-20 mb-4">
        {/* Histogram Background */}
        <div className="absolute inset-x-0 bottom-8 flex items-end justify-between h-12">
          {histogramData.map((bar, index) => (
            <div
              key={index}
              className="bg-gray-300 transition-all duration-200"
              style={{ 
                height: `${(bar.height / 80) * 100}%`,
                width: `${100 / histogramData.length}%`,
                marginRight: index < histogramData.length - 1 ? '1px' : '0'
              }}
            />
          ))}
        </div>

        {/* Slider Track */}
        <div 
          ref={sliderRef}
          className="absolute bottom-2 w-full h-6 cursor-pointer"
          onClick={handleTrackClick}
        >
          {/* Background Track */}
          <div className="absolute top-1/2 w-full h-2 bg-gray-200 rounded-full transform -translate-y-1/2" />
          
          {/* Active Track */}
          <div 
            className="absolute top-1/2 h-2 bg-blue-500 rounded-full transform -translate-y-1/2 transition-all duration-100"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`
            }}
          />

          {/* Min Handle */}
          <div
            className={`absolute top-1/2 w-5 h-5 bg-blue-500 border-2 border-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 cursor-grab transition-all duration-100 ${
              isDragging === 'min' ? 'scale-110 cursor-grabbing' : 'hover:scale-105'
            }`}
            style={{ left: `${minPercent}%`, zIndex: isDragging === 'min' ? 10 : 5 }}
            onMouseDown={handleMouseDown('min')}
          />

          {/* Max Handle */}
          <div
            className={`absolute top-1/2 w-5 h-5 bg-blue-500 border-2 border-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 cursor-grab transition-all duration-100 ${
              isDragging === 'max' ? 'scale-110 cursor-grabbing' : 'hover:scale-105'
            }`}
            style={{ left: `${maxPercent}%`, zIndex: isDragging === 'max' ? 10 : 5 }}
            onMouseDown={handleMouseDown('max')}
          />
        </div>
      </div>
    </div>
  );
}