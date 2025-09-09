import { Clock, Moon, Sun, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: 'alarm', icon: Clock, label: 'Alarm' },
    { id: 'sleep', icon: Moon, label: 'Sleep' },
    { id: 'morning', icon: Sun, label: 'Morning' },
    { id: 'inspiration', icon: BarChart3, label: 'Inspiration' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border/50">
      <div className="flex items-center justify-around px-4 py-2 max-w-md mx-auto">
        {tabs.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center gap-1 h-auto py-3 px-2 ${
              activeTab === id 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};