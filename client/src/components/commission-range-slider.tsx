import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

interface CommissionRangeSliderProps {
  minValue?: number | null;
  maxValue?: number | null;
  onRangeChange: (min: number | null, max: number | null) => void;
  className?: string;
}

const MIN_COMMISSION = 10;
const MAX_COMMISSION = 50;

export default function CommissionRangeSlider({
  minValue = null,
  maxValue = null,
  onRangeChange,
  className = ""
}: CommissionRangeSliderProps) {
  const [minCommission, setMinCommission] = useState(minValue || MIN_COMMISSION);
  const [maxCommission, setMaxCommission] = useState(maxValue || MAX_COMMISSION);

  useEffect(() => {
    setMinCommission(minValue || MIN_COMMISSION);
    setMaxCommission(maxValue || MAX_COMMISSION);
  }, [minValue, maxValue]);

  const handleRangeChange = (value: number[]) => {
    const [newMin, newMax] = value;
    setMinCommission(newMin);
    setMaxCommission(newMax);
    onRangeChange(newMin, newMax);
  };

  return (
    <Card className={`border-gray-200 ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Commission Range</h4>
            <div className="text-sm text-gray-600">
              {minCommission}% - {maxCommission >= MAX_COMMISSION ? `${maxCommission}%+` : `${maxCommission}%`}
            </div>
          </div>
          
          <div className="px-2">
            <Slider
              value={[minCommission, maxCommission]}
              onValueChange={handleRangeChange}
              max={MAX_COMMISSION}
              min={MIN_COMMISSION}
              step={1}
              className="w-full [&_[role=slider]]:!bg-green-500 [&_[role=slider]]:!border-green-600 [&_[data-state=active]]:!bg-green-500 [&_span]:!bg-green-500 [&>span>span]:!bg-green-500"
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>{MIN_COMMISSION}%</span>
            <span>{MAX_COMMISSION}%+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
