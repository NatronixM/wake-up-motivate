import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronDown } from "lucide-react";

interface MoodOption {
  emoji: string;
  label: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  { emoji: "😊", label: "Refreshed", color: "bg-orange-500" },
  { emoji: "😌", label: "Calm", color: "bg-green-500" },
  { emoji: "😐", label: "No feeling", color: "bg-blue-500" },
  { emoji: "😴", label: "Tired", color: "bg-purple-500" },
  { emoji: "😠", label: "Annoyed", color: "bg-purple-600" },
];

export const MorningFeeling = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [currentDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const handleSave = () => {
    if (selectedMood) {
      // In a real app, this would save to database
      console.log('Saving mood:', selectedMood);
      alert('Morning feeling saved!');
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <ChevronLeft className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-xl font-semibold text-foreground">Morning feeling</h1>
        <div></div>
      </div>

      {/* Month Selector */}
      <div className="text-center">
        <Button variant="ghost" className="text-lg font-medium">
          {formatDate(currentDate)} <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Previous Entries */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="w-8 h-8 border-2 border-dashed border-muted-foreground/30 rounded-full flex items-center justify-center">
            <span className="text-xs">😊</span>
          </div>
          <div>
            <div>Sep 4</div>
            <div className="text-xs">How did you feel this morning?</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="w-8 h-8 border-2 border-dashed border-muted-foreground/30 rounded-full flex items-center justify-center">
            <span className="text-xs">😊</span>
          </div>
          <div>
            <div>Sep 3</div>
            <div className="text-xs">No record</div>
          </div>
        </div>
      </div>

      {/* Today's Entry */}
      <Card className="bg-gradient-card p-6 border-border/50">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            {formatDay(currentDate)}
          </h2>
        </div>
      </Card>

      {/* Mood Options */}
      <div className="space-y-3">
        {moodOptions.map((mood) => (
          <Button
            key={mood.label}
            variant="outline"
            onClick={() => setSelectedMood(mood.label)}
            className={`w-full p-4 h-auto border-2 rounded-2xl transition-all ${
              selectedMood === mood.label
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${mood.color}`}>
                <span className="text-xl">{mood.emoji}</span>
              </div>
              <span className="text-lg font-medium text-foreground">
                {mood.label}
              </span>
            </div>
          </Button>
        ))}
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={!selectedMood}
        className="w-full bg-gradient-primary hover:opacity-90 text-white py-6 text-lg rounded-xl"
      >
        Save
      </Button>
    </div>
  );
};