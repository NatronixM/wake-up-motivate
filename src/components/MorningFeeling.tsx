import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronDown, Cloud, Thermometer, Droplets, Wind, Eye, Calendar, Sparkles, TrendingUp, Brain, Heart } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { useHoroscope } from "@/hooks/useHoroscope";
import { AdBanner, PremiumAdBanner } from "@/components/AdBanner";
import MorningAnalysisService, { SleepMetrics } from "@/utils/morningAnalysis";
import HoroscopeService from "@/utils/horoscopeService";

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
  const [showBirthdateDialog, setShowBirthdateDialog] = useState(false);
  const [tempBirthDate, setTempBirthDate] = useState("");
  const [sleepMetrics, setSleepMetrics] = useState<SleepMetrics>({
    hoursSlept: 7.5,
    bedtime: "23:00",
    wakeTime: "06:30",
    timeToWakeUp: 10,
    mood: selectedMood || "Refreshed"
  });

  const { weather, loading: weatherLoading } = useWeather();
  const { horoscope, zodiacSign, loading: horoscopeLoading, setBirthDate } = useHoroscope();

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

  useEffect(() => {
    if (selectedMood) {
      setSleepMetrics(prev => ({ ...prev, mood: selectedMood }));
    }
  }, [selectedMood]);

  const handleSave = () => {
    if (selectedMood) {
      // In a real app, this would save to database
      console.log('Saving mood:', selectedMood);
      console.log('Sleep metrics:', sleepMetrics);
      alert('Morning feeling saved!');
    }
  };

  const handleSetBirthDate = () => {
    if (tempBirthDate) {
      const date = new Date(tempBirthDate);
      setBirthDate(date);
      setShowBirthdateDialog(false);
      setTempBirthDate("");
    }
  };

  const morningAnalysis = selectedMood ? MorningAnalysisService.analyzeMorning(sleepMetrics) : null;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <ChevronLeft className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-xl font-semibold text-foreground">Morning Dashboard</h1>
        <div></div>
      </div>

      {/* Ad Banner - Top Placement */}
      <AdBanner placement="top" />

      {/* Weather Widget */}
      <Card className="bg-gradient-card p-4 border-border/50">
        <div className="flex items-center gap-3 mb-3">
          <Cloud className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Current Weather</h3>
        </div>
        {weatherLoading ? (
          <div className="text-sm text-muted-foreground">Loading weather...</div>
        ) : weather ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{weather.icon}</span>
                <div>
                  <div className="text-2xl font-bold text-foreground">{weather.temperature}°C</div>
                  <div className="text-sm text-muted-foreground">{weather.condition}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Feels like</div>
                <div className="text-lg font-semibold text-foreground">{weather.feelsLike}°C</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="flex flex-col items-center gap-1">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-muted-foreground">{weather.humidity}%</span>
                <span className="text-xs text-muted-foreground">Humidity</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Wind className="h-4 w-4 text-gray-500" />
                <span className="text-muted-foreground">{weather.windSpeed} km/h</span>
                <span className="text-xs text-muted-foreground">Wind</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Eye className="h-4 w-4 text-yellow-500" />
                <span className="text-muted-foreground">UV {weather.uvIndex}</span>
                <span className="text-xs text-muted-foreground">UV Index</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Weather unavailable</div>
        )}
      </Card>

      {/* Horoscope Widget */}
      <Card className="bg-gradient-card p-4 border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Daily Horoscope</h3>
          </div>
          <Dialog open={showBirthdateDialog} onOpenChange={setShowBirthdateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-1" />
                Set DOB
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Your Birth Date</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="birthdate">Birth Date</Label>
                  <Input
                    id="birthdate"
                    type="date"
                    value={tempBirthDate}
                    onChange={(e) => setTempBirthDate(e.target.value)}
                  />
                </div>
                <Button onClick={handleSetBirthDate} className="w-full">
                  Set Birth Date
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {horoscopeLoading ? (
          <div className="text-sm text-muted-foreground">Loading horoscope...</div>
        ) : horoscope && zodiacSign ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{HoroscopeService.getSignEmoji(zodiacSign)}</span>
              <div>
                <div className="font-semibold text-foreground">{horoscope.sign}</div>
                <div className="text-xs text-muted-foreground">{horoscope.date}</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {horoscope.horoscope}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Lucky Number: </span>
                <span className="font-semibold text-foreground">{horoscope.luckyNumber}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Lucky Color: </span>
                <span className="font-semibold text-foreground">{horoscope.luckyColor}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Set your birth date to see your horoscope</div>
        )}
      </Card>

      {/* Premium Ad Banner */}
      <PremiumAdBanner />

      {/* Morning Analysis */}
      {morningAnalysis && (
        <Card className="bg-gradient-card p-4 border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Morning Analysis</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Wake-up Speed</div>
                <div className="font-semibold text-foreground">{morningAnalysis.wakeUpSpeed}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Sleep Quality</div>
                <div className="font-semibold text-foreground">{morningAnalysis.sleepQuality}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Energy Level</div>
                <div className="font-semibold text-foreground">{morningAnalysis.energyLevel}/10</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {morningAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Health Insights
                </h4>
                <ul className="space-y-1">
                  {morningAnalysis.healthInsights.map((insight, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Scientific Facts
                </h4>
                <ul className="space-y-1">
                  {morningAnalysis.scientificFacts.map((fact, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}

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
        Save Morning Data
      </Button>

      {/* Bottom Ad Banner */}
      <AdBanner placement="bottom" className="mt-4" />
    </div>
  );
};