"use client";
import React from "react";
import { useQuiz } from "@/context/QuizContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const GENDERS = ["Male", "Female"];
const STATES = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

export default function Step5Demographics() {
  const { answers, updateAnswer, nextStep } = useQuiz();

  const isValid = answers.gender && answers.dob && answers.state;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-center text-primary-dark">Tell us about yourself</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Biological Sex</label>
          <div className="grid grid-cols-2 gap-3">
            {GENDERS.map((g) => (
              <div
                key={g}
                onClick={() => updateAnswer('gender', g)}
                className={cn(
                  "border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 text-center font-semibold",
                  answers.gender === g ? "border-button-outline bg-blue-50 text-primary" : "border-ui hover:border-blue-200 bg-white text-gray-600"
                )}
              >
                {g}
              </div>
            ))}
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium mb-2 text-gray-700">Date of Birth</label>
           <input 
              type="date" 
              className="w-full p-3 border border-ui rounded-xl bg-white outline-none focus:border-button-outline transition-colors"
              value={answers.dob} 
              onChange={(e) => updateAnswer('dob', e.target.value)}
           />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">State</label>
          <select 
             className="w-full p-3 border border-ui rounded-xl bg-white outline-none focus:border-primary transition-colors"
             value={answers.state}
             onChange={(e) => updateAnswer('state', e.target.value)}
          >
             <option value="">Select State</option>
             {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <button 
        onClick={nextStep} 
        disabled={!isValid} 
         className={`w-full font-bold py-4 rounded-full shadow-lg transition-all ${isValid ? 'bg-next-button text-white hover:opacity-90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
      >
        Continue
      </button>
    </motion.div>
  )
}

