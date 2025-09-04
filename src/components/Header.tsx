import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";

interface HeaderProps {
  title: string;
  showProBadge?: boolean;
}

export const Header = ({ title, showProBadge = false }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 pt-12">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {showProBadge && (
          <Badge className="bg-gradient-primary text-primary-foreground px-3 py-1 rounded-full">
            🚀 PRO Free Trial
          </Badge>
        )}
      </div>
      
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-6 w-6" />
      </Button>
    </div>
  );
};