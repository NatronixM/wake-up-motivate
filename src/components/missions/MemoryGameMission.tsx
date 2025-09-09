import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface MemoryGameMissionProps {
  onComplete: () => void;
  isCompleted: boolean;
}

export const MemoryGameMission = ({ onComplete, isCompleted }: MemoryGameMissionProps) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
  const colorNames = ['Red', 'Blue', 'Green', 'Yellow'];

  useEffect(() => {
    if (!gameStarted) return;
    
    // Generate sequence of 4 numbers
    const newSequence = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4));
    setSequence(newSequence);
    setUserSequence([]);
    setCurrentStep(0);
    
    // Show sequence to user
    setShowingSequence(true);
    setTimeout(() => {
      setShowingSequence(false);
    }, 3000);
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
  };

  const handleColorClick = (colorIndex: number) => {
    if (showingSequence || isCompleted) return;
    
    const newUserSequence = [...userSequence, colorIndex];
    setUserSequence(newUserSequence);
    
    // Check if correct so far
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      // Wrong - restart
      setGameStarted(false);
      return;
    }
    
    // Check if completed
    if (newUserSequence.length === sequence.length) {
      onComplete();
    }
  };

  if (isCompleted) {
    return (
      <Card className="p-6 text-center bg-green-50 border-green-200">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800">Memory Game Completed! 🧠</h3>
      </Card>
    );
  }

  if (!gameStarted) {
    return (
      <Card className="p-6 text-center">
        <div className="text-4xl mb-2">🧠</div>
        <h3 className="text-lg font-semibold mb-4">Memory Challenge</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Watch the sequence, then repeat it by tapping the colors in order
        </p>
        <Button onClick={startGame}>Start Memory Game</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 text-center">
      <div className="text-4xl mb-2">🧠</div>
      <h3 className="text-lg font-semibold mb-4">
        {showingSequence ? "Watch the sequence..." : "Repeat the sequence"}
      </h3>
      
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {colors.map((color, index) => (
          <Button
            key={index}
            className={`h-16 w-16 ${color} hover:opacity-80 ${
              showingSequence && sequence[currentStep] === index ? 'ring-4 ring-white' : ''
            }`}
            onClick={() => handleColorClick(index)}
            disabled={showingSequence}
          >
            {showingSequence ? '' : colorNames[index]}
          </Button>
        ))}
      </div>
      
      <div className="mt-4">
        <p className="text-sm">
          Progress: {userSequence.length} / {sequence.length}
        </p>
      </div>
    </Card>
  );
};