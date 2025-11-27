"use client";
import React from "react";
import { useQuiz } from "@/context/QuizContext";
import { RadioCard } from "@/components/ui/RadioCard";
import { motion } from "framer-motion";

const GOALS = [
  "Lose 1-20 lbs",
  "Lose 21-50 lbs",
  "Lose 50+ lbs",
  "Maintain Weight"
];

export default function Step1Goal() {
  const { answers, updateAnswer, nextStep } = useQuiz();

  const handleSelect = (goal: string) => {
    updateAnswer("goal", goal);
    setTimeout(nextStep, 250);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-center text-primary-dark">What is your weight loss goal?</h1>
      <div className="space-y-3">
        {GOALS.map((g) => (
          <RadioCard 
            key={g} 
            selected={answers.goal === g} 
            onClick={() => handleSelect(g)}
          >
            {g}
          </RadioCard>
        ))}
      </div>
    </motion.div>
  );
}

