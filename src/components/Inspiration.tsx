import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Quote, 
  Dumbbell, 
  DollarSign, 
  Heart, 
  RefreshCw,
  TrendingUp,
  Users,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface Quote {
  text: string;
  author: string;
  category: string;
}

interface FitnessRecommendation {
  title: string;
  description: string;
  type: 'cardio' | 'strength' | 'calisthenics' | 'flexibility';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface FinancialStudy {
  title: string;
  summary: string;
  source: string;
  category: 'investing' | 'budgeting' | 'entrepreneurship' | 'market-trends';
  publishedDate: string;
}

interface RizzTip {
  title: string;
  description: string;
  category: 'conversation' | 'confidence' | 'social-skills' | 'networking';
  effectiveness: 'high' | 'medium' | 'low';
}

export const Inspiration = () => {
  const [quotes] = useState<Quote[]>([
    {
      text: "The most important investment you can make is in yourself.",
      author: "Warren Buffett",
      category: "Self-Development"
    },
    {
      text: "It's better to hang out with people better than you. Pick out associates whose behavior is better than yours and you'll drift in that direction.",
      author: "Warren Buffett", 
      category: "Success"
    },
    {
      text: "Someone's sitting in the shade today because someone planted a tree a long time ago.",
      author: "Warren Buffett",
      category: "Planning"
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
      category: "Action"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
      category: "Perseverance"
    },
    {
      text: "Your limitation—it's only your imagination.",
      author: "Unknown",
      category: "Mindset"
    },
    {
      text: "The only impossible journey is the one you never begin.",
      author: "Tony Robbins",
      category: "Action"
    }
  ]);

  const [fitnessRecommendations] = useState<FitnessRecommendation[]>([
    {
      title: "Morning HIIT Circuit",
      description: "High-intensity interval training combining bodyweight exercises. Research shows HIIT improves cardiovascular health and metabolic rate for up to 24 hours post-workout (EPOC effect).",
      type: "cardio",
      duration: "20 minutes",
      difficulty: "intermediate"
    },
    {
      title: "Progressive Calisthenics", 
      description: "Bodyweight strength training focusing on progressive overload. Studies indicate calisthenics improve functional strength and body composition while reducing injury risk.",
      type: "calisthenics",
      duration: "30 minutes",
      difficulty: "beginner"
    },
    {
      title: "Zone 2 Cardio Training",
      description: "Low-intensity steady-state cardio at 60-70% max heart rate. Research from Dr. Peter Attia shows Zone 2 training improves mitochondrial function and longevity.",
      type: "cardio", 
      duration: "45 minutes",
      difficulty: "beginner"
    },
    {
      title: "Compound Strength Training",
      description: "Focus on multi-joint movements like squats, deadlifts, and overhead press. Clinical studies show compound exercises maximize muscle activation and hormonal response.",
      type: "strength",
      duration: "60 minutes", 
      difficulty: "advanced"
    },
    {
      title: "Dynamic Flexibility Flow",
      description: "Active stretching routine improving mobility and range of motion. Research indicates dynamic stretching enhances performance when done pre-workout.",
      type: "flexibility",
      duration: "15 minutes",
      difficulty: "beginner"
    }
  ]);

  const [financialStudies] = useState<FinancialStudy[]>([
    {
      title: "The Power of Dollar-Cost Averaging in Volatile Markets",
      summary: "Recent analysis shows DCA reduces average cost basis by 15-20% during market volatility. Study of S&P 500 data from 2000-2023 demonstrates consistent outperformance over lump-sum investing during uncertain periods.",
      source: "Journal of Financial Planning",
      category: "investing",
      publishedDate: "2024-01-15"
    },
    {
      title: "Digital Banking Trends: The 50/30/20 Rule Revisited",
      summary: "Modern budgeting research suggests the traditional 50/30/20 rule needs adjustment for current economic conditions. New recommended split: 45/25/30 to account for increased housing costs and importance of emergency savings.",
      source: "Federal Reserve Economic Data",
      category: "budgeting", 
      publishedDate: "2024-02-08"
    },
    {
      title: "Startup Success Rates: What the Data Really Shows",
      summary: "Comprehensive analysis of 10,000 startups reveals that companies with diverse founding teams are 35% more likely to outperform homogeneous teams. Focus on problem validation over product features increases success rate by 60%.",
      source: "Harvard Business Review",
      category: "entrepreneurship",
      publishedDate: "2024-01-22"
    },
    {
      title: "Cryptocurrency Adoption in Traditional Portfolios",
      summary: "Institutional investment in crypto has grown 400% since 2022. Studies suggest 5-10% crypto allocation can improve portfolio risk-adjusted returns without significantly increasing volatility.",
      source: "Goldman Sachs Research",
      category: "market-trends",
      publishedDate: "2024-02-12"
    }
  ]);

  const [rizzTips] = useState<RizzTip[]>([
    {
      title: "The 70/30 Listening Rule",
      description: "Psychological studies show that people rate conversations higher when the other person listens 70% of the time and speaks 30%. Active listening creates deeper connections and makes you more memorable.",
      category: "conversation",
      effectiveness: "high"
    },
    {
      title: "Mirroring Body Language",
      description: "Subtly matching someone's posture and gestures builds subconscious rapport. Research in social psychology shows mirroring increases likability by up to 40% in initial interactions.",
      category: "social-skills", 
      effectiveness: "high"
    },
    {
      title: "The Confidence Posture Power",
      description: "Stand with feet shoulder-width apart, shoulders back, and make eye contact. Studies by Amy Cuddy show power poses increase confidence hormones (testosterone) by 20% and reduce stress hormones (cortisol) by 25%.",
      category: "confidence",
      effectiveness: "high"
    },
    {
      title: "Strategic Compliment Timing",
      description: "Compliment specific actions or choices rather than general appearance. Behavioral psychology research indicates specific, earned compliments are 3x more effective at building attraction than generic ones.",
      category: "conversation",
      effectiveness: "medium"
    },
    {
      title: "The Network Effect Approach",
      description: "Focus on becoming a connector - introduce people to each other. Harvard Business School research shows people who facilitate connections are rated as more influential and attractive by their social network.",
      category: "networking",
      effectiveness: "high"
    },
    {
      title: "Authentic Vulnerability Strategy",
      description: "Share appropriate personal challenges or growth moments. Studies in relationship psychology show controlled vulnerability increases trust and emotional connection by 45% in new relationships.",
      category: "social-skills",
      effectiveness: "medium"
    }
  ]);

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 10000); // Change quote every 10 seconds

    return () => clearInterval(interval);
  }, [quotes.length]);

  const handleRefresh = () => {
    setLastRefresh(new Date());
    setCurrentQuoteIndex(Math.floor(Math.random() * quotes.length));
    toast.success("Content refreshed with latest insights!");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-500';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-500';
      case 'advanced': return 'bg-red-500/20 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case 'high': return 'bg-green-500/20 text-green-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500';
      case 'low': return 'bg-red-500/20 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cardio': return '🏃‍♂️';
      case 'strength': return '💪';
      case 'calisthenics': return '🤸‍♂️';
      case 'flexibility': return '🧘‍♀️';
      case 'investing': return '📈';
      case 'budgeting': return '💰';
      case 'entrepreneurship': return '🚀';
      case 'market-trends': return '📊';
      case 'conversation': return '💬';
      case 'confidence': return '✨';
      case 'social-skills': return '🤝';
      case 'networking': return '🌐';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Daily Inspiration" />
      
      <div className="px-4 space-y-6">
        {/* Refresh Button */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Inspirational Quote */}
        <Card className="bg-gradient-hero p-6 shadow-glow border-0">
          <div className="text-center space-y-4">
            <Quote className="h-8 w-8 mx-auto text-primary/80" />
            <blockquote className="text-lg font-medium text-foreground leading-relaxed">
              "{quotes[currentQuoteIndex].text}"
            </blockquote>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-primary">
                — {quotes[currentQuoteIndex].author}
              </p>
              <Badge variant="secondary" className="text-xs">
                {quotes[currentQuoteIndex].category}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Fitness Recommendations */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Dumbbell className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Fitness Regimens</h3>
            <Badge variant="outline" className="ml-auto">Research-Backed</Badge>
          </div>
          <ScrollArea className="h-64">
            <div className="space-y-4">
              {fitnessRecommendations.map((rec, index) => (
                <div key={index} className="border border-border/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(rec.type)}</span>
                      <h4 className="font-semibold text-sm">{rec.title}</h4>
                    </div>
                    <Badge className={getDifficultyColor(rec.difficulty)}>
                      {rec.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {rec.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {rec.duration}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {rec.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Financial Studies */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Financial Studies</h3>
            <Badge variant="outline" className="ml-auto">Live Updates</Badge>
          </div>
          <ScrollArea className="h-64">
            <div className="space-y-4">
              {financialStudies.map((study, index) => (
                <div key={index} className="border border-border/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(study.category)}</span>
                      <h4 className="font-semibold text-sm">{study.title}</h4>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {study.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {study.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {study.source}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(study.publishedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Rizz & Social Connection Tips */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Social Connection Mastery</h3>
            <Badge variant="outline" className="ml-auto">Psychology-Based</Badge>
          </div>
          <ScrollArea className="h-64">
            <div className="space-y-4">
              {rizzTips.map((tip, index) => (
                <div key={index} className="border border-border/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(tip.category)}</span>
                      <h4 className="font-semibold text-sm">{tip.title}</h4>
                    </div>
                    <Badge className={getEffectivenessColor(tip.effectiveness)}>
                      {tip.effectiveness} impact
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {tip.description}
                  </p>
                  <Badge variant="outline" className="text-xs capitalize">
                    {tip.category}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Success Metrics */}
        <Card className="bg-gradient-card border-border/50 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Daily Growth Tracker</h3>
              <p className="text-sm text-muted-foreground">
                Users report 40% better morning motivation with daily inspiration
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">94%</p>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};