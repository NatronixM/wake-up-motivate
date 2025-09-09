interface SleepData {
  sleepTime: Date;
  wakeTime: Date;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  efficiency?: number;
  interruptions?: number;
}

export interface SleepAnalysis {
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  duration: number;
  efficiency: number;
  analysis: string;
  recommendations: string[];
  medicalInsight: string;
  imageUrl: string;
}

export const analyzeSleep = (data: SleepData): SleepAnalysis => {
  const duration = (data.wakeTime.getTime() - data.sleepTime.getTime()) / (1000 * 60 * 60);
  const efficiency = data.efficiency || calculateEfficiency(duration, data.interruptions || 0);

  const analysis = generateAnalysis(data.quality, duration, efficiency);
  const recommendations = generateRecommendations(data.quality, duration);
  const medicalInsight = generateMedicalInsight(data.quality, duration, efficiency);
  const imageUrl = getSleepQualityImage(data.quality);

  return {
    quality: data.quality,
    duration,
    efficiency,
    analysis,
    recommendations,
    medicalInsight,
    imageUrl
  };
};

const calculateEfficiency = (duration: number, interruptions: number): number => {
  // Sleep efficiency calculation based on duration and interruptions
  let baseEfficiency = 85;
  
  if (duration < 6) baseEfficiency -= 15;
  else if (duration > 9) baseEfficiency -= 10;
  
  baseEfficiency -= interruptions * 5;
  
  return Math.max(50, Math.min(100, baseEfficiency));
};

const generateAnalysis = (quality: string, duration: number, efficiency: number): string => {
  switch (quality) {
    case 'excellent':
      return `Outstanding sleep quality! Your ${duration.toFixed(1)} hours of sleep with ${efficiency}% efficiency indicates optimal rest. Your body completed full sleep cycles, allowing for proper physical recovery and memory consolidation.`;
    
    case 'good':
      return `Good sleep quality achieved! Your ${duration.toFixed(1)} hours provided adequate rest with ${efficiency}% efficiency. Your sleep patterns support healthy brain function and physical restoration.`;
    
    case 'fair':
      return `Moderate sleep quality recorded. While you got ${duration.toFixed(1)} hours of sleep, the ${efficiency}% efficiency suggests some disturbances. Your body received partial restoration but could benefit from improvements.`;
    
    case 'poor':
      return `Suboptimal sleep quality detected. Your ${duration.toFixed(1)} hours at ${efficiency}% efficiency indicates significant sleep disruption. This may impact cognitive function, mood, and physical health.`;
    
    default:
      return 'Sleep analysis unavailable.';
  }
};

const generateRecommendations = (quality: string, duration: number): string[] => {
  const recommendations: string[] = [];
  
  if (duration < 7) {
    recommendations.push('Aim for 7-9 hours of sleep per night for optimal health');
    recommendations.push('Establish a consistent bedtime routine 30 minutes before sleep');
  }
  
  if (duration > 9) {
    recommendations.push('Consider if oversleeping indicates sleep debt or underlying issues');
  }

  switch (quality) {
    case 'poor':
      recommendations.push(
        'Avoid caffeine 6 hours before bedtime',
        'Keep bedroom temperature cool (60-67°F)',
        'Practice relaxation techniques like deep breathing',
        'Consider consulting a sleep specialist if poor sleep persists'
      );
      break;
    
    case 'fair':
      recommendations.push(
        'Limit screen time 1 hour before bed',
        'Try progressive muscle relaxation',
        'Ensure your mattress and pillows are comfortable'
      );
      break;
    
    case 'good':
      recommendations.push(
        'Maintain current sleep schedule consistency',
        'Continue healthy bedtime habits'
      );
      break;
    
    case 'excellent':
      recommendations.push(
        'Keep up your excellent sleep hygiene!',
        'Your current routine is working perfectly'
      );
      break;
  }
  
  return recommendations;
};

const generateMedicalInsight = (quality: string, duration: number, efficiency: number): string => {
  let insight = '';
  
  // Medical facts about sleep stages and health
  if (quality === 'excellent' || quality === 'good') {
    insight = 'Research shows quality sleep strengthens immune function, consolidates memories, and regulates hormones like growth hormone and cortisol. Your sleep supports optimal brain glymphatic system function, which clears metabolic waste.';
  } else if (quality === 'fair') {
    insight = 'Moderate sleep quality may affect REM sleep stages crucial for emotional regulation and learning. Studies indicate sleep efficiency below 85% can impact insulin sensitivity and stress hormone balance.';
  } else {
    insight = 'Poor sleep quality disrupts circadian rhythms and can elevate cortisol levels. Medical research links chronic sleep deprivation to increased risk of cardiovascular disease, diabetes, and cognitive decline. Sleep fragmentation prevents proper memory consolidation.';
  }
  
  // Duration-specific insights
  if (duration < 6) {
    insight += ' Sleep duration under 6 hours is associated with 30% higher risk of obesity and impaired glucose metabolism according to sleep medicine studies.';
  } else if (duration > 9) {
    insight += ' Consistently sleeping over 9 hours may indicate underlying health conditions or excessive sleep debt recovery, as noted in longitudinal sleep studies.';
  }
  
  return insight;
};

const getSleepQualityImage = (quality: string): string => {
  const imageMap = {
    excellent: '/src/assets/sleep-excellent.jpg',
    good: '/src/assets/sleep-good.jpg',
    fair: '/src/assets/sleep-fair.jpg',
    poor: '/src/assets/sleep-poor.jpg'
  };
  
  return imageMap[quality as keyof typeof imageMap] || imageMap.fair;
};

export const generateMockSleepData = (): SleepData => {
  const qualities: ('poor' | 'fair' | 'good' | 'excellent')[] = ['poor', 'fair', 'good', 'excellent'];
  const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
  
  const sleepTime = new Date();
  sleepTime.setHours(23, 30, 0, 0);
  
  const wakeTime = new Date();
  wakeTime.setHours(7, 15, 0, 0);
  wakeTime.setDate(wakeTime.getDate() + 1);
  
  return {
    sleepTime,
    wakeTime,
    quality: randomQuality,
    efficiency: Math.floor(Math.random() * 30) + 70, // 70-100%
    interruptions: Math.floor(Math.random() * 4) // 0-3 interruptions
  };
};