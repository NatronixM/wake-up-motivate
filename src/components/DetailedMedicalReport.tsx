import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Brain, 
  Heart, 
  Activity, 
  Moon, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";

interface MedicalReportData {
  sleepDuration: number;
  sleepQuality: string;
  wakeUpSpeed: string;
  snoring?: {
    duration: number;
    episodes: number;
    intensity: 'Low' | 'Medium' | 'High';
  };
  energyLevel: number;
}

interface DetailedMedicalReportProps {
  data: MedicalReportData;
  onClose?: () => void;
}

export const DetailedMedicalReport = ({ data, onClose }: DetailedMedicalReportProps) => {
  const generateSleepScore = () => {
    let score = 0;
    
    // Sleep duration score (0-30 points)
    if (data.sleepDuration >= 7 && data.sleepDuration <= 9) score += 30;
    else if (data.sleepDuration >= 6 && data.sleepDuration < 7) score += 20;
    else if (data.sleepDuration >= 5 && data.sleepDuration < 6) score += 10;
    else score += 5;
    
    // Sleep quality score (0-25 points)
    const qualityScores = { 'Excellent': 25, 'Good': 20, 'Fair': 12, 'Poor': 5 };
    score += qualityScores[data.sleepQuality as keyof typeof qualityScores] || 10;
    
    // Wake up speed score (0-20 points)
    const wakeScores = { 'Fast': 20, 'Medium': 15, 'Slow': 8 };
    score += wakeScores[data.wakeUpSpeed as keyof typeof wakeScores] || 10;
    
    // Energy level score (0-15 points)
    score += Math.round((data.energyLevel / 10) * 15);
    
    // Snoring penalty (0-10 points deduction)
    if (data.snoring) {
      const penalties = { 'Low': 2, 'Medium': 5, 'High': 10 };
      score -= penalties[data.snoring.intensity];
    }
    
    return Math.max(0, Math.min(100, score));
  };

  const sleepScore = generateSleepScore();

  const getScoreCategory = (score: number) => {
    if (score >= 85) return { category: 'Excellent', color: 'text-green-500', bgColor: 'bg-green-500' };
    if (score >= 70) return { category: 'Good', color: 'text-blue-500', bgColor: 'bg-blue-500' };
    if (score >= 55) return { category: 'Fair', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    return { category: 'Needs Improvement', color: 'text-red-500', bgColor: 'bg-red-500' };
  };

  const scoreInfo = getScoreCategory(sleepScore);

  const getResearchInsights = () => {
    const insights = [];
    
    if (data.sleepDuration < 7) {
      insights.push({
        type: 'warning',
        title: 'Sleep Deprivation Risk',
        content: 'Research by Walker et al. (2017) shows that sleep durations under 7 hours increase risk of cardiovascular disease by 13% and mortality risk by 12%.',
        citation: 'Nature Reviews Disease Primers, 2017'
      });
    }
    
    if (data.sleepDuration >= 7 && data.sleepDuration <= 9) {
      insights.push({
        type: 'positive',
        title: 'Optimal Sleep Duration',
        content: 'Your sleep duration aligns with NSF guidelines. Studies show 7-9 hours optimize cognitive performance, immune function, and cellular repair processes.',
        citation: 'Sleep Health Foundation, 2020'
      });
    }
    
    if (data.wakeUpSpeed === 'Slow') {
      insights.push({
        type: 'info',
        title: 'Sleep Inertia',
        content: 'Slow wake-up indicates sleep inertia, which can last 15-60 minutes. Research by Hilditch & McHill (2019) links this to awakening during slow-wave sleep.',
        citation: 'Sleep Medicine Reviews, 2019'
      });
    }
    
    if (data.snoring && data.snoring.intensity !== 'Low') {
      insights.push({
        type: 'warning',
        title: 'Sleep-Disordered Breathing',
        content: 'Moderate to severe snoring may indicate sleep apnea. Research shows untreated sleep apnea increases hypertension risk by 37% (Peppard et al., 2013).',
        citation: 'American Journal of Epidemiology, 2013'
      });
    }
    
    if (data.energyLevel >= 8) {
      insights.push({
        type: 'positive',
        title: 'High Energy Levels',
        content: 'High morning energy correlates with optimal circadian rhythm alignment and REM sleep sufficiency, enhancing neuroplasticity (Diekelmann & Born, 2010).',
        citation: 'Nature Reviews Neuroscience, 2010'
      });
    }
    
    return insights;
  };

  const researchInsights = getResearchInsights();

  const getHealthRisks = () => {
    const risks = [];
    
    if (data.sleepDuration < 6) {
      risks.push({
        condition: 'Type 2 Diabetes',
        risk: 'High',
        percentage: '28% increased risk',
        source: 'Cappuccio et al., Diabetes Care 2010'
      });
      risks.push({
        condition: 'Obesity',
        risk: 'High',
        percentage: '55% increased risk',
        source: 'Patel & Hu, Obesity Reviews 2008'
      });
    }
    
    if (data.sleepQuality === 'Poor') {
      risks.push({
        condition: 'Depression',
        risk: 'Moderate',
        percentage: '2.6x higher risk',
        source: 'Baglioni et al., Sleep Medicine Reviews 2011'
      });
    }
    
    if (data.snoring && data.snoring.episodes > 10) {
      risks.push({
        condition: 'Cardiovascular Disease',
        risk: 'Moderate',
        percentage: '34% increased risk',
        source: 'Li et al., Sleep Medicine 2014'
      });
    }
    
    return risks;
  };

  const healthRisks = getHealthRisks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Medical Sleep Report</h2>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Overall Sleep Score */}
      <Card className="bg-gradient-card p-6 border-border/50">
        <div className="text-center space-y-4">
          <div className="relative w-32 h-32 mx-auto">
            <div className={`w-full h-full ${scoreInfo.bgColor} rounded-full flex items-center justify-center shadow-2xl`}>
              <div className="text-center text-white">
                <div className="text-3xl font-bold">{sleepScore}</div>
                <div className="text-sm opacity-80">Sleep Score</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${scoreInfo.color}`}>{scoreInfo.category}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Based on scientific sleep research and medical guidelines
            </p>
          </div>
        </div>
      </Card>

      {/* Sleep Metrics Breakdown */}
      <Card className="bg-gradient-card p-6 border-border/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Sleep Metrics Analysis
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Sleep Duration</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">{data.sleepDuration}h</div>
              <div className="text-xs text-muted-foreground">
                {data.sleepDuration >= 7 && data.sleepDuration <= 9 ? 'Optimal' : 
                 data.sleepDuration < 7 ? 'Too Short' : 'Too Long'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Sleep Quality</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">{data.sleepQuality}</div>
              <div className="text-xs text-muted-foreground">Subjective rating</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Wake-up Speed</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">{data.wakeUpSpeed}</div>
              <div className="text-xs text-muted-foreground">Sleep inertia level</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm">Energy Level</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">{data.energyLevel}/10</div>
              <Progress value={data.energyLevel * 10} className="w-16 h-2 mt-1" />
            </div>
          </div>
          
          {data.snoring && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-red-500" />
                <span className="text-sm">Snoring Analysis</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{data.snoring.episodes} episodes</div>
                <div className="text-xs text-muted-foreground">
                  {data.snoring.intensity} intensity
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Research Insights */}
      <Card className="bg-gradient-card p-6 border-border/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Research-Based Insights
        </h3>
        <div className="space-y-4">
          {researchInsights.map((insight, index) => (
            <div key={index} className="border border-border/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                {insight.type === 'positive' && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                {insight.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                {insight.type === 'info' && <Brain className="h-5 w-5 text-blue-500 mt-0.5" />}
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{insight.content}</p>
                  <Badge variant="outline" className="text-xs">
                    Source: {insight.citation}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Health Risk Assessment */}
      {healthRisks.length > 0 && (
        <Card className="bg-gradient-card p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Health Risk Assessment
          </h3>
          <div className="space-y-3">
            {healthRisks.map((risk, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border/30 rounded-lg">
                <div>
                  <div className="font-medium text-foreground">{risk.condition}</div>
                  <div className="text-xs text-muted-foreground">{risk.source}</div>
                </div>
                <div className="text-right">
                  <Badge variant={risk.risk === 'High' ? 'destructive' : 'secondary'}>
                    {risk.risk}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">{risk.percentage}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> This analysis is for informational purposes only. 
              Consult a healthcare professional for personalized medical advice.
            </p>
          </div>
        </Card>
      )}

      {/* Recommendations */}
      <Card className="bg-gradient-card p-6 border-border/50">
        <h3 className="text-lg font-semibold mb-4">Evidence-Based Recommendations</h3>
        <div className="space-y-3">
          {data.sleepDuration < 7 && (
            <div className="flex items-start gap-3 p-3 border border-border/30 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
              <div className="text-sm">
                <strong>Extend sleep duration:</strong> Gradually increase bedtime by 15 minutes weekly until reaching 7-9 hours (American Academy of Sleep Medicine, 2017).
              </div>
            </div>
          )}
          
          {data.wakeUpSpeed === 'Slow' && (
            <div className="flex items-start gap-3 p-3 border border-border/30 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
              <div className="text-sm">
                <strong>Bright light therapy:</strong> Exposure to 10,000 lux light for 30 minutes upon waking reduces sleep inertia (Reid et al., Sleep Medicine Reviews 2014).
              </div>
            </div>
          )}
          
          {data.snoring && data.snoring.intensity !== 'Low' && (
            <div className="flex items-start gap-3 p-3 border border-border/30 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
              <div className="text-sm">
                <strong>Sleep position optimization:</strong> Side sleeping reduces snoring intensity by 50-60% compared to supine position (Oksenberg et al., Sleep 1999).
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-3 p-3 border border-border/30 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
            <div className="text-sm">
              <strong>Sleep hygiene optimization:</strong> Maintain bedroom temperature at 18-19°C (65-67°F) for optimal sleep architecture (Okamoto-Mizuno & Mizuno, Journal of Physiological Anthropology 2012).
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};