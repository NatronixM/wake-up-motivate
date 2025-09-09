import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ExternalLink, Zap, Target, TrendingUp } from "lucide-react";

export const BannerAd = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Sample ads - in a real app, these would come from an ad network
  const ads = [
    {
      id: 1,
      title: "Boost Your Productivity",
      subtitle: "Get 50% off premium task management tools",
      ctaText: "Start Free Trial",
      brand: "ProductivityPro",
      image: "🚀",
      backgroundColor: "from-blue-500/20 to-purple-500/20",
      borderColor: "border-blue-500/30",
      url: "#"
    },
    {
      id: 2,
      title: "Master Your Goals",
      subtitle: "Join millions achieving their dreams with MindsetMax",
      ctaText: "Learn More",
      brand: "MindsetMax",
      image: "🎯",
      backgroundColor: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      url: "#"
    },
    {
      id: 3,
      title: "Time Management Mastery",
      subtitle: "Transform your schedule, transform your life",
      ctaText: "Get Started",
      brand: "TimeWise",
      image: "⏰",
      backgroundColor: "from-orange-500/20 to-red-500/20",
      borderColor: "border-orange-500/30",
      url: "#"
    }
  ];

  // Rotate through ads (in a real app, this would be managed by ad network)
  const currentAd = ads[Math.floor(Math.random() * ads.length)];

  if (!isVisible) return null;

  const handleAdClick = () => {
    // In a real app, this would track the click and redirect
    console.log("Ad clicked:", currentAd.brand);
    // window.open(currentAd.url, '_blank');
  };

  const handleClose = () => {
    setIsVisible(false);
    // In a real app, you might want to show the next ad after some time
    setTimeout(() => setIsVisible(true), 30000); // Show next ad after 30 seconds
  };

  return (
    <div className="w-full px-4 py-2">
      <Card className={`relative overflow-hidden bg-gradient-to-r ${currentAd.backgroundColor} border ${currentAd.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}>
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-xs bg-background/80 text-muted-foreground">
            Ad
          </Badge>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-background/20 text-muted-foreground hover:text-foreground z-10"
        >
          <X className="h-3 w-3" />
        </Button>

        <div 
          onClick={handleAdClick}
          className="flex items-center gap-4 p-4 pt-8"
        >
          <div className="text-4xl flex-shrink-0 bg-background/20 rounded-2xl w-16 h-16 flex items-center justify-center backdrop-blur-sm">
            {currentAd.image}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-foreground truncate">
                {currentAd.title}
              </h3>
              <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {currentAd.subtitle}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                by {currentAd.brand}
              </span>
              
              <Button 
                size="sm" 
                className="bg-background/80 text-foreground hover:bg-background/90 shadow-sm group-hover:shadow-md transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdClick();
                }}
              >
                {currentAd.ctaText}
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
      </Card>
    </div>
  );
};