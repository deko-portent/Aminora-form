"use client";
import { ArrowLeft } from "lucide-react";
import { useQuiz } from "@/context/QuizContext";

export default function Header() {
  const { step, prevStep } = useQuiz();
  const isResults = step > 11; 

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between relative">
        {!isResults && step > 1 && step <= 10 && (
           <button onClick={prevStep} className="p-2 -ml-2 text-gray-600 hover:text-primary transition-colors">
             <ArrowLeft size={24} />
           </button>
        )}
        
        <div className="absolute left-1/2 -translate-x-1/2">
           <img src="/images/logo.png" alt="Aminora" className="h-8" />
        </div>

        <div className="w-8" /> 
      </div>
    </header>
  );
}

