"use client";
import React from "react";
import { useQuiz } from "@/context/QuizContext";
import { RadioCard } from "@/components/ui/RadioCard";
import { motion } from "framer-motion";

const MOTIVATIONS = [
  "I want to feel confident again",
  "I want to have more energy",
  "I want to live a longer, healthier life",
  "I want to fit into my old clothes",
  "I want to keep up with my family"
];

export default function Step6Motivation() {
  const { answers, updateAnswer, nextStep } = useQuiz();

  const handleSelect = (m: string) => {
    updateAnswer("motivation", m);
    setTimeout(nextStep, 250);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-center text-primary-dark">What is your main motivation?</h1>
      <div className="space-y-3">
        {MOTIVATIONS.map((m) => (
          <RadioCard 
            key={m} 
            selected={answers.motivation === m} 
            onClick={() => handleSelect(m)}
          >
            {m}
          </RadioCard>
        ))}
      </div>
    </motion.div>
  );
}

