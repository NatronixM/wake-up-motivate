import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";

interface MathMissionProps {
  onComplete: () => void;
  isCompleted: boolean;
}

export const MathMission = ({ onComplete, isCompleted }: MathMissionProps) => {
  const [problem, setProblem] = useState({ a: 0, b: 0, answer: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    generateProblem();
  }, []);

  const generateProblem = () => {
    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * 50) + 10;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let answer = 0;
    switch (operation) {
      case '+':
        answer = a + b;
        break;
      case '-':
        answer = a - b;
        break;
      case '*':
        answer = a * b;
        break;
    }
    
    setProblem({ a, b: operation === '*' ? Math.floor(Math.random() * 12) + 1 : b, answer });
    setUserAnswer("");
    setIsCorrect(false);
  };

  const checkAnswer = () => {
    const correct = parseInt(userAnswer) === problem.answer;
    setIsCorrect(correct);
    if (correct) {
      onComplete();
    } else {
      generateProblem();
    }
  };

  if (isCompleted) {
    return (
      <Card className="p-6 text-center bg-green-50 border-green-200">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800">Math Problem Solved! 🧮</h3>
      </Card>
    );
  }

  return (
    <Card className="p-6 text-center">
      <div className="text-4xl mb-2">🧮</div>
      <h3 className="text-lg font-semibold mb-4">Solve the Math Problem</h3>
      <div className="text-2xl font-mono mb-4">
        {problem.a} {problem.b > 10 ? '+' : problem.b < 0 ? '+' : '*'} {Math.abs(problem.b)} = ?
      </div>
      <div className="flex gap-2 justify-center items-center">
        <Input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Your answer"
          className="w-32 text-center text-lg"
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
        />
        <Button onClick={checkAnswer} disabled={!userAnswer}>
          Check
        </Button>
      </div>
      {isCorrect === false && userAnswer && (
        <p className="text-red-500 text-sm mt-2">Try again!</p>
      )}
    </Card>
  );
};