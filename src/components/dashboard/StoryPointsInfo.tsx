
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfoTooltip from '@/components/ui/InfoTooltip';
import { Star } from 'lucide-react';

const StoryPointsInfo: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>Story Points</span>
          <InfoTooltip 
            content={
              <div>
                <p className="font-medium mb-1">What are Story Points?</p>
                <p>Story points are a unit of measure for expressing an estimate of the overall effort required to fully implement a product backlog item or any other piece of work.</p>
                <p className="mt-2 font-medium">How they're calculated:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Complexity: How complex the work is</li>
                  <li>Uncertainty: How much is unknown</li>
                  <li>Effort: Amount of work required</li>
                </ul>
                <p className="mt-2">Common point values follow the Fibonacci sequence: 1, 2, 3, 5, 8, 13, etc.</p>
              </div>
            } 
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Story points help teams estimate the difficulty of implementing a user story, relative to other stories.
        </p>
        
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="border rounded-md p-3">
            <div className="text-sm text-gray-500">Common values:</div>
            <div className="flex flex-wrap gap-2 mt-1">
              {[1, 2, 3, 5, 8, 13, 21].map(point => (
                <div 
                  key={point} 
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-medium"
                >
                  {point}
                </div>
              ))}
            </div>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="text-sm text-gray-500">Simple guideline:</div>
            <div className="mt-1 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>1-2 points:</span>
                <span className="font-medium">Simple task</span>
              </div>
              <div className="flex justify-between">
                <span>3-5 points:</span>
                <span className="font-medium">Moderate</span>
              </div>
              <div className="flex justify-between">
                <span>8+ points:</span>
                <span className="font-medium">Complex</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoryPointsInfo;
