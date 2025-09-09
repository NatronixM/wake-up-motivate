import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Moon, Sun, Calendar, TrendingUp, Settings, Clock, Activity } from "lucide-react";
import { BedtimeReminderDialog } from "./BedtimeReminderDialog";
import { SnoringDetector } from "./SnoringDetector";
import { DetailedMedicalReport } from "./DetailedMedicalReport";
import { analyzeSleep, generateMockSleepData, getExpandedSleepRecommendations, type SleepAnalysis } from "@/utils/sleepAnalysis";
import sleepExcellentImg from "@/assets/sleep-excellent.jpg";
import sleepGoodImg from "@/assets/sleep-good.jpg";
import sleepFairImg from "@/assets/sleep-fair.jpg";
import sleepPoorImg from "@/assets/sleep-poor.jpg";

interface BedtimeReminder {
  id: string;
  time: string;
  label: string;
  isActive: boolean;
  repeatDays: string[];
  soundName: string;
  volume: number;
  soundPowerUp?: number;
  snoozeEnabled?: boolean;
  snoozeDuration?: number;
  maxSnoozes?: number;
  wakeUpCheckEnabled?: boolean;
  wakeUpCheckType?: 'math' | 'memory' | 'shake' | 'photo';
  wallpaper?: {
    id: string;
    name: string;
    type: 'gradient' | 'image';
    value: string;
    preview?: string;
  };
}

interface SleepTrackerProps {
  onSetAlarm?: () => void;
}

export const SleepTracker = ({ onSetAlarm }: SleepTrackerProps) => {
  const [sleepMode, setSleepMode] = useState<'sleep' | 'wake'>('wake');
  const [bedtimeReminder, setBedtimeReminder] = useState<BedtimeReminder | null>({
    id: '1',
    time: '23:30',
    label: 'Bedtime reminder',
    isActive: true,
    repeatDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    soundName: 'Peaceful Dreams',
    volume: 70,
    soundPowerUp: 10,
    snoozeEnabled: true,
    snoozeDuration: 5,
    maxSnoozes: 3,
    wakeUpCheckEnabled: false,
    wakeUpCheckType: 'math'
  });
  const [showBedtimeDialog, setShowBedtimeDialog] = useState(false);
  const [sleepAnalysis, setSleepAnalysis] = useState<SleepAnalysis | null>(null);
  const [snoringActive, setSnoringActive] = useState(false);
  const [snoringData, setSnoringData] = useState<any>(null);
  const [showMedicalReport, setShowMedicalReport] = useState(false);
  const [showRecommendationsDialog, setShowRecommendationsDialog] = useState(false);

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

  useEffect(() => {
    // Generate mock analysis for demonstration
    const mockData = generateMockSleepData();
    const analysis = analyzeSleep(mockData);
    setSleepAnalysis(analysis);
  }, []);

  const handleBedtimeReminderSave = (reminder: Omit<BedtimeReminder, 'id'>) => {
    setBedtimeReminder({
      ...reminder,
      id: bedtimeReminder?.id || Date.now().toString()
    });
  };

  const getQualityColor = (quality: string) => {
    const colors = {
      excellent: 'from-green-400 to-emerald-500',
      good: 'from-blue-400 to-cyan-500',
      fair: 'from-yellow-400 to-orange-500',
      poor: 'from-red-400 to-rose-500'
    };
    return colors[quality as keyof typeof colors] || colors.fair;
  };

  const getQualityImage = (quality: string) => {
    const images = {
      excellent: sleepExcellentImg,
      good: sleepGoodImg,
      fair: sleepFairImg,
      poor: sleepPoorImg
    };
    return images[quality as keyof typeof images] || images.fair;
  };

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

      {/* Sleep Quality Analysis */}
      {sleepAnalysis && (
        <Card className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${getQualityImage(sleepAnalysis.quality)})` }}
          />
          <div className="relative p-6 space-y-4">
            <div className="text-center space-y-4">
              <div className="relative w-32 h-32 mx-auto">
                <div className={`w-full h-full bg-gradient-to-br ${getQualityColor(sleepAnalysis.quality)} rounded-full flex items-center justify-center shadow-2xl`}>
                  <div className="text-center">
                    <div className="text-sm text-white/80 mb-1">Quality</div>
                    <div className="text-2xl font-bold text-white capitalize">{sleepAnalysis.quality}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Sleep Analysis Complete</h3>
                <p className="text-muted-foreground text-sm">
                  {sleepAnalysis.duration.toFixed(1)} hours • {sleepAnalysis.efficiency}% efficiency
                </p>
              </div>

              <Button 
                onClick={onSetAlarm}
                className="bg-white text-black hover:bg-white/90 rounded-xl px-8 py-3"
              >
                <Clock className="h-4 w-4 mr-2" />
                Set alarm
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sleep Efficiency</span>
                <span className="text-sm text-muted-foreground">{sleepAnalysis.efficiency}%</span>
              </div>
              <Progress value={sleepAnalysis.efficiency} className="h-2" />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Medical Analysis</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {sleepAnalysis.analysis}
              </p>
            </div>
          </div>
        </Card>
      )}

      {!sleepAnalysis && (
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
            <h3 className="text-xl font-semibold">No sleep record</h3>
            <p className="text-muted-foreground">
              Start tracking to see your sleep quality!
            </p>
          </div>

          <Button 
            onClick={onSetAlarm}
            className="bg-white text-black hover:bg-white/90 rounded-xl px-8 py-3"
          >
            <Clock className="h-4 w-4 mr-2" />
            Set alarm
          </Button>
        </div>
      )}

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
            <TrendingUp className="h-4 w-4 mr-1" />
            Analysis
          </Button>
        </div>
      </Card>

      {/* Sleep Recommendations */}
      {sleepAnalysis && (
        <Card className="bg-gradient-card p-4 border-border/50">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Sleep Recommendations</h4>
            <div className="space-y-2">
              {sleepAnalysis.recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{rec}</span>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setShowRecommendationsDialog(true)}
            >
              View All Tips
            </Button>
          </div>
        </Card>
      )}

      {/* Bedtime Reminder */}
      <Card className="bg-gradient-card p-4 border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">Bedtime reminder</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBedtimeDialog(true)}
                className="h-6 w-6 p-0"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {bedtimeReminder?.time || '23:30'} • {bedtimeReminder?.soundName || 'Peaceful Dreams'}
            </p>
            {bedtimeReminder?.snoozeEnabled && (
              <p className="text-xs text-muted-foreground">
                Snooze: {bedtimeReminder.snoozeDuration}min × {bedtimeReminder.maxSnoozes === -1 ? '∞' : bedtimeReminder.maxSnoozes}
              </p>
            )}
          </div>
          <Switch
            checked={bedtimeReminder?.isActive ?? true}
            onCheckedChange={(enabled) =>
              setBedtimeReminder(prev => prev ? { ...prev, isActive: enabled } : null)
            }
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
          <div className="text-xs font-medium">
            {sleepAnalysis ? `${sleepAnalysis.duration.toFixed(1)}h` : '--'}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
            sleepAnalysis ? 'bg-green-500' : 'bg-gray-600'
          }`}>
            {sleepAnalysis ? (
              <Activity className="h-6 w-6 text-white" />
            ) : (
              <span className="text-white">--</span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">Efficiency</div>
          <div className="text-xs font-medium">
            {sleepAnalysis ? `${sleepAnalysis.efficiency}%` : '--'}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
            snoringData ? 'bg-red-500' : 'bg-gray-600'
          }`}>
            {snoringData ? (
              <Activity className="h-6 w-6 text-white" />
            ) : (
              <span className="text-white">--</span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">Snoring</div>
          <div className="text-xs font-medium">
            {snoringData ? `${snoringData.episodes}` : '--'}
          </div>
        </div>
      </div>

      {/* Medical Insights */}
      {sleepAnalysis && (
        <Card className="bg-gradient-card p-4 border-border/50">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Medical Insights</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {sleepAnalysis.medicalInsight}
            </p>
            
            <Button 
              onClick={() => setShowMedicalReport(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3 w-full"
            >
              <Activity className="h-4 w-4 mr-2" />
              View Detailed Report
            </Button>
          </div>
        </Card>
      )}

      {/* Snoring Detection */}
      <SnoringDetector
        isActive={snoringActive}
        onToggle={() => setSnoringActive(!snoringActive)}
        onSnoringDetected={setSnoringData}
      />

      <BedtimeReminderDialog
        open={showBedtimeDialog}
        onOpenChange={setShowBedtimeDialog}
        reminder={bedtimeReminder}
        onSave={handleBedtimeReminderSave}
      />

      {/* Detailed Medical Report Dialog */}
      <Dialog open={showMedicalReport} onOpenChange={setShowMedicalReport}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detailed Medical Report</DialogTitle>
          </DialogHeader>
          {sleepAnalysis && (
            <DetailedMedicalReport
              data={{
                sleepDuration: sleepAnalysis.duration,
                sleepQuality: sleepAnalysis.quality,
                wakeUpSpeed: 'Medium', // This would come from actual data
                snoring: snoringData,
                energyLevel: 7 // This would come from actual data
              }}
              onClose={() => setShowMedicalReport(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Sleep Recommendations Dialog */}
      <Dialog open={showRecommendationsDialog} onOpenChange={setShowRecommendationsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comprehensive Sleep Recommendations</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {Object.entries(getExpandedSleepRecommendations()).map(([key, category]) => (
              <Card key={key} className="bg-gradient-card border-border/50">
                <div className="p-4 space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                  <div className="space-y-3">
                    {category.tips.map((item, index) => (
                      <div key={index} className="space-y-2 border-l-2 border-primary/30 pl-4">
                        <p className="text-sm font-medium text-foreground">{item.tip}</p>
                        <p className="text-xs text-muted-foreground italic">
                          Clinical Evidence: {item.evidence}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
            <div className="text-center">
              <Button 
                onClick={() => setShowRecommendationsDialog(false)}
                className="bg-primary text-primary-foreground"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};