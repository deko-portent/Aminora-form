"use client";
import React, { useState } from "react";
import { useQuiz } from "@/context/QuizContext";
import { motion } from "framer-motion";
import { RadioCard } from "@/components/ui/RadioCard";

const CONDITIONS = [
  "Pregnant or breastfeeding",
  "Active cancer diagnosis",
  "Kidney disease",
  "Heart failure",
  "None of the above"
];

export default function Step8Medical() {
  const { answers, updateAnswer, nextStep } = useQuiz();
  const [subStep, setSubStep] = useState(0);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const toggleCondition = (c: string) => {
    if (c === "None of the above") {
      setSelectedConditions(["None of the above"]);
    } else {
      let newC = selectedConditions.includes(c) 
        ? selectedConditions.filter(i => i !== c) 
        : [...selectedConditions.filter(i => i !== "None of the above"), c];
      setSelectedConditions(newC);
    }
  };

  const handleConditionsSubmit = () => {
    updateAnswer("medical", selectedConditions);
    setSubStep(1);
  };

  const handleYesNo = (key: string, val: string) => {
    updateAnswer(key as any, val);
    if (subStep < 3) setSubStep(prev => prev + 1);
    else nextStep();
  };

  if (subStep === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-primary-dark">Do any of the following apply to you?</h1>
        <div className="space-y-3">
          {CONDITIONS.map(c => (
            <div 
              key={c} 
              onClick={() => toggleCondition(c)} 
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${selectedConditions.includes(c) ? 'border-primary bg-blue-50' : 'border-ui bg-white'}`}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedConditions.includes(c) ? 'bg-primary border-primary text-white' : 'border-gray-300'}`}>
                {selectedConditions.includes(c) && "✓"}
              </div>
              <span className="font-medium text-primary-dark">{c}</span>
            </div>
          ))}
        </div>
        <button 
          disabled={selectedConditions.length === 0}
          onClick={handleConditionsSubmit}
          className={`w-full font-bold py-4 rounded-full shadow-lg transition-all ${selectedConditions.length > 0 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}
        >
          Continue
        </button>
      </motion.div>
    );
  }

  const questions = [
    { key: "meds", text: "Are you currently taking any weight loss medications?" },
    { key: "surgery", text: "Do you have a history of bariatric surgery?" },
    { key: "eatingDisorder", text: "Do you have a history of eating disorders?" }
  ];

  const q = questions[subStep - 1];

  return (
    <motion.div 
      key={subStep}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-center text-primary-dark">{q.text}</h1>
      <div className="space-y-3">
        <RadioCard selected={false} onClick={() => handleYesNo(q.key, "Yes")}>Yes</RadioCard>
        <RadioCard selected={false} onClick={() => handleYesNo(q.key, "No")}>No</RadioCard>
      </div>
    </motion.div>
  );
}

