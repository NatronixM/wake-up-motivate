import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  Trash2, 
  Play, 
  SkipForward, 
  Copy, 
  Edit,
  Volume2,
  Calendar
} from "lucide-react";

interface AlarmContextMenuProps {
  onDelete: () => void;
  onEdit: () => void;
  onPreview: () => void;
  onSkipOnce: () => void;
  onDuplicate: () => void;
}

export const AlarmContextMenu = ({
  onDelete,
  onEdit,
  onPreview,
  onSkipOnce,
  onDuplicate,
}: AlarmContextMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border w-56">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="h-4 w-4 mr-3" />
          Edit alarm
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onPreview}>
          <Play className="h-4 w-4 mr-3" />
          Preview alarm
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onSkipOnce}>
          <SkipForward className="h-4 w-4 mr-3" />
          Skip once
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onDuplicate}>
          <Copy className="h-4 w-4 mr-3" />
          Duplicate alarm
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-3" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};