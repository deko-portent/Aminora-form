"use client";
import React from "react";
import { useQuiz } from "@/context/QuizContext";
import { motion } from "framer-motion";

export default function Step3BMI() {
  const { answers, updateNestedAnswer, updateAnswer, computed, nextStep } = useQuiz();

  const isValid = answers.height.feet && answers.height.inches && answers.weight;
  
  // Gauge Position: Map BMI 15-45 to 0-100%
  // Clamped between 0 and 100
  const bmiPos = Math.min(100, Math.max(0, ((computed.bmi - 15) / (45 - 15)) * 100));

  let bmiLabel = "";
  let bmiColor = "";

  if (computed.bmi < 18.5) {
    bmiLabel = "Underweight";
    bmiColor = "text-blue-500";
  } else if (computed.bmi < 25) {
    bmiLabel = "Healthy Weight";
    bmiColor = "text-green-500";
  } else if (computed.bmi < 30) {
    bmiLabel = "Overweight";
    bmiColor = "text-yellow-500";
  } else {
    bmiLabel = "Obese";
    bmiColor = "text-red-500";
  }

  return (
     <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
     >
       <h1 className="text-2xl font-bold text-center text-primary-dark">Let's calculate your BMI</h1>
       
       <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Feet</label>
            <select 
              className="w-full p-3 border border-ui rounded-xl bg-white text-lg font-semibold outline-none focus:border-button-outline transition-colors"
              value={answers.height.feet}
              onChange={(e) => updateNestedAnswer("height", "feet", e.target.value)}
            >
              <option value="">-</option>
              {[4,5,6,7].map(f => <option key={f} value={f}>{f}'</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Inches</label>
            <select 
              className="w-full p-3 border border-ui rounded-xl bg-white text-lg font-semibold outline-none focus:border-button-outline transition-colors"
              value={answers.height.inches}
              onChange={(e) => updateNestedAnswer("height", "inches", e.target.value)}
            >
               <option value="">-</option>
               {Array.from({length: 12}).map((_, i) => <option key={i} value={i}>{i}"</option>)}
            </select>
          </div>
       </div>

       <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Weight (lbs)</label>
            <input 
              type="number" 
              placeholder="180"
              className="w-full p-3 border border-ui rounded-xl text-center text-lg font-semibold outline-none focus:border-primary transition-colors"
              value={answers.weight}
              onChange={(e) => updateAnswer("weight", e.target.value)}
            />
       </div>

       {/* BMI Visual */}
       <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="flex justify-between text-sm text-gray-500 mb-3 items-center">
             <span>Your BMI: <strong className={`text-2xl ml-1 ${bmiColor}`}>{computed.bmi > 0 ? computed.bmi : "--"}</strong></span>
             <span className={`font-medium ${bmiColor}`}>{computed.bmi > 0 ? bmiLabel : ""}</span>
          </div>
          <div className="relative h-3 rounded-full w-full bg-gradient-to-r from-blue-300 via-green-400 via-yellow-400 to-red-500">
             {computed.bmi > 0 && (
               <div 
                 className="absolute top-[-5px] w-5 h-5 bg-white border-4 border-button-outline rounded-full shadow-md transition-all duration-500 ease-out"
                 style={{ left: `calc(${bmiPos}% - 10px)` }}
               />
             )}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-2 uppercase tracking-wider font-semibold">
             <span>Low</span>
             <span>Healthy</span>
             <span>High</span>
          </div>
       </div>

       <button 
         disabled={!isValid}
         onClick={nextStep}
         className={`w-full font-bold py-4 rounded-full shadow-lg transition-all ${isValid ? 'bg-next-button text-white hover:opacity-90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
       >
         Continue
       </button>
     </motion.div>
  )
}

