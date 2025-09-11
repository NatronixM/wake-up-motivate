import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap } from "lucide-react";

export const ProBanner = () => {
  const handleUpgrade = () => {
    // In a real app, this would navigate to payment/subscription
    alert("Upgrade to Pro - Payment integration coming soon!");
  };

  return (
    <Card className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30 p-4">
      <div className="flex items-center gap-3">
        <div className="bg-red-500 p-2 rounded-full">
          <Crown className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500 text-white text-xs">PRO</Badge>
            <span className="text-sm font-medium">Free Trial</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Unlock 43 premium tracks & exclusive alarm features for $4.99/month
          </p>
        </div>
        <Button 
          size="sm" 
          onClick={handleUpgrade}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Zap className="h-3 w-3 mr-1" />
          Upgrade
        </Button>
      </div>
    </Card>
  );
};