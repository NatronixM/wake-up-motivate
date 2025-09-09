export interface MorningAnalysisData {
  wakeUpSpeed: 'Fast' | 'Medium' | 'Slow';
  sleepQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  energyLevel: number; // 1-10
  recommendations: string[];
  healthInsights: string[];
  scientificFacts: string[];
}

export interface SleepMetrics {
  hoursSlept: number;
  bedtime: string;
  wakeTime: string;
  timeToWakeUp: number; // minutes to fully wake up
  mood: string;
}

class MorningAnalysisService {
  static analyzeMorning(metrics: SleepMetrics): MorningAnalysisData {
    const wakeUpSpeed = this.analyzeWakeUpSpeed(metrics.timeToWakeUp);
    const sleepQuality = this.analyzeSleepQuality(metrics.hoursSlept, metrics.mood);
    const energyLevel = this.calculateEnergyLevel(metrics);
    
    return {
      wakeUpSpeed,
      sleepQuality,
      energyLevel,
      recommendations: this.generateRecommendations(metrics, wakeUpSpeed, sleepQuality),
      healthInsights: this.generateHealthInsights(metrics),
      scientificFacts: this.getScientificFacts(sleepQuality, wakeUpSpeed)
    };
  }

  private static analyzeWakeUpSpeed(timeToWakeUp: number): 'Fast' | 'Medium' | 'Slow' {
    if (timeToWakeUp <= 5) return 'Fast';
    if (timeToWakeUp <= 15) return 'Medium';
    return 'Slow';
  }

  private static analyzeSleepQuality(hoursSlept: number, mood: string): 'Excellent' | 'Good' | 'Fair' | 'Poor' {
    const moodScore = this.getMoodScore(mood);
    const sleepScore = this.getSleepDurationScore(hoursSlept);
    const totalScore = (moodScore + sleepScore) / 2;

    if (totalScore >= 8) return 'Excellent';
    if (totalScore >= 6) return 'Good';
    if (totalScore >= 4) return 'Fair';
    return 'Poor';
  }

  private static getMoodScore(mood: string): number {
    const moodScores: { [key: string]: number } = {
      'Refreshed': 10,
      'Calm': 8,
      'No feeling': 5,
      'Tired': 3,
      'Annoyed': 1
    };
    return moodScores[mood] || 5;
  }

  private static getSleepDurationScore(hours: number): number {
    // Optimal sleep is 7-9 hours according to NSF guidelines
    if (hours >= 7 && hours <= 9) return 10;
    if (hours >= 6 && hours < 7) return 7;
    if (hours >= 5 && hours < 6) return 5;
    if (hours >= 9 && hours <= 10) return 8;
    return 3; // Less than 5 or more than 10 hours
  }

  private static calculateEnergyLevel(metrics: SleepMetrics): number {
    const sleepScore = this.getSleepDurationScore(metrics.hoursSlept);
    const moodScore = this.getMoodScore(metrics.mood);
    const wakeUpScore = metrics.timeToWakeUp <= 5 ? 10 : metrics.timeToWakeUp <= 15 ? 7 : 4;
    
    return Math.round((sleepScore + moodScore + wakeUpScore) / 3);
  }

  private static generateRecommendations(
    metrics: SleepMetrics,
    wakeUpSpeed: string,
    sleepQuality: string
  ): string[] {
    const recommendations: string[] = [];

    if (metrics.hoursSlept < 7) {
      recommendations.push("Aim for 7-9 hours of sleep for optimal health");
    }

    if (wakeUpSpeed === 'Slow') {
      recommendations.push("Try exposure to bright light immediately upon waking");
      recommendations.push("Consider a consistent sleep schedule to improve circadian rhythm");
    }

    if (sleepQuality === 'Poor' || sleepQuality === 'Fair') {
      recommendations.push("Avoid screens 1 hour before bedtime");
      recommendations.push("Keep your bedroom cool (60-67°F) for better sleep quality");
    }

    if (metrics.mood === 'Tired') {
      recommendations.push("Light exercise or stretching can boost morning energy");
      recommendations.push("Stay hydrated - dehydration affects energy levels");
    }

    return recommendations.slice(0, 3); // Limit to top 3 recommendations
  }

  private static generateHealthInsights(metrics: SleepMetrics): string[] {
    const insights: string[] = [];

    if (metrics.hoursSlept >= 7 && metrics.hoursSlept <= 9) {
      insights.push("Excellent sleep duration supports immune function and cognitive performance");
    }

    if (metrics.timeToWakeUp <= 5) {
      insights.push("Quick wake-up indicates good sleep efficiency and circadian alignment");
    }

    insights.push("Consistent sleep patterns help regulate hormones like cortisol and melatonin");
    
    if (metrics.mood === 'Refreshed' || metrics.mood === 'Calm') {
      insights.push("Positive morning mood correlates with better stress resilience throughout the day");
    }

    return insights.slice(0, 2);
  }

  private static getScientificFacts(sleepQuality: string, wakeUpSpeed: string): string[] {
    const facts = [
      "The brain clears toxins during deep sleep through the glymphatic system",
      "REM sleep is crucial for memory consolidation and emotional processing",
      "Core body temperature drops 1-2°F during optimal sleep",
      "Growth hormone is primarily released during slow-wave sleep",
      "Sleep deprivation impairs glucose metabolism and increases diabetes risk",
      "The suprachiasmatic nucleus regulates your circadian rhythm",
      "Adenosine buildup during wakefulness creates sleep pressure"
    ];

    const qualityFacts = [
      "Quality sleep enhances neuroplasticity and learning capacity",
      "Deep sleep supports immune system T-cell function",
      "Sleep fragmentation increases inflammation markers"
    ];

    const wakeUpFacts = [
      "Cortisol awakening response peaks 30-45 minutes after waking",
      "Morning light exposure helps maintain circadian rhythm stability",
      "Sleep inertia can last 15-60 minutes depending on sleep stage awakening"
    ];

    let selectedFacts = [...facts];
    if (sleepQuality === 'Excellent' || sleepQuality === 'Good') {
      selectedFacts.push(...qualityFacts);
    }
    if (wakeUpSpeed === 'Fast') {
      selectedFacts.push(...wakeUpFacts);
    }

    // Return 2-3 random facts
    const shuffled = selectedFacts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }
}

export default MorningAnalysisService;