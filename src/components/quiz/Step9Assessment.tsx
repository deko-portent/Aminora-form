"use client";
import React, { useState } from "react";
import { useQuiz } from "@/context/QuizContext";
import { motion } from "framer-motion";
import { RadioCard } from "@/components/ui/RadioCard";

const COMORBIDITIES = [
  "High Blood Pressure",
  "High Cholesterol",
  "Type 2 Diabetes",
  "Prediabetes",
  "Sleep Apnea",
  "None of the above"
];

export default function Step9Assessment() {
  const { answers, updateAnswer, nextStep } = useQuiz();
  const [subStep, setSubStep] = useState(0);
  const [selectedComorbidities, setSelectedComorbidities] = useState<string[]>([]);

  const toggleComorbidity = (c: string) => {
    if (c === "None of the above") {
      setSelectedComorbidities(["None of the above"]);
    } else {
      let newC = selectedComorbidities.includes(c) 
        ? selectedComorbidities.filter(i => i !== c) 
        : [...selectedComorbidities.filter(i => i !== "None of the above"), c];
      setSelectedComorbidities(newC);
    }
  };

  const handleComorbiditiesSubmit = () => {
    updateAnswer("comorbidities", selectedComorbidities);
    nextStep();
  };

  const handleSimpleSelect = (key: string, val: string) => {
    updateAnswer(key as any, val);
    setSubStep(prev => prev + 1);
  };

  if (subStep === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-primary-dark">Are you willing to reduce your caloric intake?</h1>
        <div className="space-y-3">
           <RadioCard selected={false} onClick={() => handleSimpleSelect("caloricIntake", "Yes")}>Yes</RadioCard>
           <RadioCard selected={false} onClick={() => handleSimpleSelect("caloricIntake", "No")}>No</RadioCard>
        </div>
      </motion.div>
    )
  }

  if (subStep === 1) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-primary-dark">How has your weight changed in the last 12 months?</h1>
        <div className="space-y-3">
           <RadioCard selected={false} onClick={() => handleSimpleSelect("weightChange", "Gained Weight")}>Gained Weight</RadioCard>
           <RadioCard selected={false} onClick={() => handleSimpleSelect("weightChange", "Lost Weight")}>Lost Weight</RadioCard>
           <RadioCard selected={false} onClick={() => handleSimpleSelect("weightChange", "Stayed the Same")}>Stayed the Same</RadioCard>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-center text-primary-dark">Do you have any of the following conditions?</h1>
      <div className="space-y-3">
        {COMORBIDITIES.map(c => (
          <div 
            key={c} 
            onClick={() => toggleComorbidity(c)} 
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${selectedComorbidities.includes(c) ? 'border-button-outline bg-blue-50' : 'border-ui bg-white'}`}
          >
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedComorbidities.includes(c) ? 'bg-button-outline border-button-outline text-white' : 'border-gray-300'}`}>
              {selectedComorbidities.includes(c) && "✓"}
            </div>
            <span className="font-medium text-primary-dark">{c}</span>
          </div>
        ))}
      </div>
      <button 
        disabled={selectedComorbidities.length === 0}
        onClick={handleComorbiditiesSubmit}
        className={`w-full font-bold py-4 rounded-full shadow-lg transition-all ${selectedComorbidities.length > 0 ? 'bg-next-button text-white' : 'bg-gray-200 text-gray-400'}`}
      >
        Continue
      </button>
    </motion.div>
  );
}

