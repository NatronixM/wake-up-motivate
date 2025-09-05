import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Calendar, TrendingUp } from "lucide-react";

export const SleepTracker = () => {
  const [sleepMode, setSleepMode] = useState<'sleep' | 'wake'>('wake');
  const [bedtimeEnabled, setBedtimeEnabled] = useState(true);

  const currentDate = new Date();
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric', 
      weekday: 'short' 
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    for (let i = -2; i <= 3; i++) {
      const date = new Date();
      date.setDate(currentDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-6">
      {/* Date Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          {formatDate(currentDate)}
        </h2>
        <Calendar className="h-6 w-6 text-muted-foreground" />
      </div>

      {/* Calendar Strip */}
      <div className="flex gap-2 justify-center">
        {calendarDays.map((date, index) => {
          const isToday = index === 2;
          const dayNum = date.getDate();
          const hasData = index <= 2; // Show dots for past days
          
          return (
            <div key={index} className="text-center">
              <div className={`w-12 h-8 rounded-full flex items-center justify-center text-sm ${
                isToday 
                  ? 'bg-white text-black font-medium' 
                  : 'text-muted-foreground'
              }`}>
                {dayNum}
              </div>
              {hasData && (
                <div className="w-2 h-2 bg-yellow-500 rounded-full mx-auto mt-1"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sleep/Wake Toggle */}
      <Card className="bg-gradient-to-r from-indigo-500 to-blue-400 p-1 rounded-3xl">
        <div className="flex">
          <Button
            variant={sleepMode === 'sleep' ? 'default' : 'ghost'}
            onClick={() => setSleepMode('sleep')}
            className={`flex-1 rounded-3xl ${
              sleepMode === 'sleep' 
                ? 'bg-white text-black hover:bg-white/90' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Moon className="h-4 w-4 mr-2" />
            Sleep
          </Button>
          <Button
            variant={sleepMode === 'wake' ? 'default' : 'ghost'}
            onClick={() => setSleepMode('wake')}
            className={`flex-1 rounded-3xl ${
              sleepMode === 'wake' 
                ? 'bg-white text-black hover:bg-white/90' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Sun className="h-4 w-4 mr-2" />
            Wake up
          </Button>
        </div>
      </Card>

      {/* Sleep Quality Circle */}
      <div className="text-center space-y-4">
        <div className="relative w-48 h-48 mx-auto">
          <div className="w-full h-full border-8 border-gray-600 rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Quality</div>
              <div className="text-2xl font-bold text-white">?</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">No alarm record</h3>
          <p className="text-muted-foreground">
            Check your morning quality tomorrow!
          </p>
        </div>

        <Button className="bg-white text-black hover:bg-white/90 rounded-xl px-8 py-3">
          Set alarm
        </Button>
      </div>

      {/* Weekly Report */}
      <Card className="bg-gradient-card p-4 border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Weekly report</span>
              <Badge className="bg-orange-500 text-white text-xs">Update</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              How's my recent trend?
            </p>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            className="bg-muted text-foreground"
          >
            Analysis
          </Button>
        </div>
      </Card>

      {/* Bedtime Reminder */}
      <Card className="bg-gradient-card p-4 border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Bedtime reminder</h4>
            <p className="text-sm text-muted-foreground">11:30 PM</p>
          </div>
          <Switch
            checked={bedtimeEnabled}
            onCheckedChange={setBedtimeEnabled}
          />
        </div>
      </Card>

      {/* Sleep Metrics */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-2">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
            <Moon className="h-6 w-6 text-white" />
          </div>
          <div className="text-xs text-muted-foreground">Sleep time</div>
          <div className="text-xs text-muted-foreground">Today</div>
        </div>
        
        <div className="space-y-2">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white">--</span>
          </div>
          <div className="text-xs text-muted-foreground">Efficiency</div>
        </div>
        
        <div className="space-y-2">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white">--</span>
          </div>
          <div className="text-xs text-muted-foreground">Snoring</div>
        </div>
      </div>

      {/* Sleep Insights */}
      <Card className="bg-gradient-card p-4 border-border/50">
        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold">You're not taking</h3>
          <h3 className="text-lg font-semibold">as much sleep as you think</h3>
          <p className="text-sm text-muted-foreground">
            Is my actual sleep time enough?
          </p>
          
          <div className="w-16 h-16 bg-gradient-to-b from-blue-400 to-purple-400 rounded-lg mx-auto flex items-center justify-center">
            <span className="text-2xl">⏳</span>
          </div>
          
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3">
            Track my sleep
          </Button>
        </div>
      </Card>
    </div>
  );
};