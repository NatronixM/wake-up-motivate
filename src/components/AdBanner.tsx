import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Clock, Smartphone, Zap } from 'lucide-react';

interface AdData {
  id: string;
  title: string;
  description: string;
  cta: string;
  icon: React.ReactNode;
  color: string;
  targetUrl: string;
}

// Targeted ads for alarm clock app users - health, productivity, sleep-related
const adDatabase: AdData[] = [
  {
    id: 'sleep-tracker-pro',
    title: 'Sleep Tracker Pro',
    description: 'Advanced sleep analytics & insights',
    cta: 'Try Free',
    icon: <Clock className="h-5 w-5" />,
    color: 'from-blue-500 to-purple-600',
    targetUrl: '#'
  },
  {
    id: 'meditation-app',
    title: 'Daily Meditation',
    description: 'Start your morning mindfully',
    cta: 'Download',
    icon: <Zap className="h-5 w-5" />,
    color: 'from-green-500 to-teal-600',
    targetUrl: '#'
  },
  {
    id: 'productivity-suite',
    title: 'Focus Flow',
    description: 'Boost your morning productivity',
    cta: 'Start Free',
    icon: <Smartphone className="h-5 w-5" />,
    color: 'from-orange-500 to-red-600',
    targetUrl: '#'
  },
  {
    id: 'fitness-app',
    title: 'Morning Workout',
    description: '5-minute energizing routines',
    cta: 'Join Now',
    icon: <Zap className="h-5 w-5" />,
    color: 'from-purple-500 to-pink-600',
    targetUrl: '#'
  }
];

interface AdBannerProps {
  placement: 'top' | 'middle' | 'bottom';
  className?: string;
}

export const AdBanner = ({ placement, className = '' }: AdBannerProps) => {
  const [currentAd, setCurrentAd] = useState<AdData | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Rotate ads every 30 seconds
    const rotateAds = () => {
      const randomAd = adDatabase[Math.floor(Math.random() * adDatabase.length)];
      setCurrentAd(randomAd);
    };

    rotateAds(); // Initial ad
    const interval = setInterval(rotateAds, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleAdClick = () => {
    if (currentAd) {
      // In production, track ad clicks for analytics/revenue
      console.log('Ad clicked:', currentAd.id);
      // window.open(currentAd.targetUrl, '_blank');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    // In production, respect user's ad preferences
    setTimeout(() => setIsVisible(true), 300000); // Show again after 5 minutes
  };

  if (!currentAd || !isVisible) {
    return null;
  }

  return (
    <Card className={`relative overflow-hidden border-border/50 ${className}`}>
      <div className={`bg-gradient-to-r ${currentAd.color} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
              {currentAd.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">{currentAd.title}</h4>
              <p className="text-xs opacity-90 truncate">{currentAd.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAdClick}
              className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1 h-auto"
            >
              {currentAd.cta}
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClose}
              className="text-white hover:bg-white/20 p-1 h-auto w-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Sponsored indicator */}
      <div className="absolute top-1 left-1">
        <span className="bg-black/20 text-white text-xs px-2 py-0.5 rounded text-[10px]">
          Sponsored
        </span>
      </div>
    </Card>
  );
};

// Premium ad component for higher-value placements
export const PremiumAdBanner = ({ className = '' }: { className?: string }) => {
  const [isVisible, setIsVisible] = useState(true);

  const premiumAd = {
    title: 'Sleep Better Tonight',
    description: 'Clinically proven sleep improvement program',
    price: 'Free 7-day trial',
    features: ['Sleep tracking', 'Personalized tips', 'Expert guidance'],
    image: '🌙'
  };

  if (!isVisible) return null;

  return (
    <Card className={`bg-gradient-card border-border/50 overflow-hidden ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            Sponsored
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsVisible(false)}
            className="p-1 h-auto w-auto"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl">{premiumAd.image}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{premiumAd.title}</h3>
            <p className="text-sm text-muted-foreground">{premiumAd.description}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {premiumAd.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <Button className="w-full bg-gradient-primary hover:opacity-90">
          Start {premiumAd.price}
        </Button>
      </div>
    </Card>
  );
};