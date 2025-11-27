"use client";
import { useQuiz } from "@/context/QuizContext";

export default function ProgressBar() {
  const { step } = useQuiz();
  const totalSteps = 10;
  
  if (step > totalSteps) return null;

  return (
    <div className="w-full bg-white pt-2 pb-3 border-b border-gray-50">
      <div className="max-w-md mx-auto px-4 flex gap-1.5">
        {Array.from({length: totalSteps}).map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i < step ? 'bg-primary' : 'bg-ui'
              }`} 
            />
        ))}
      </div>
    </div>
  );
}

