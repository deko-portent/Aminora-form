"use client";
import React, { useState } from "react";
import { useQuiz } from "@/context/QuizContext";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Heart } from "lucide-react";

export default function Step7Education() {
  const { nextStep } = useQuiz();
  const [slide, setSlide] = useState(0);

  const handleNext = () => {
    if (slide === 0) setSlide(1);
    else nextStep();
  };

  return (
    <div className="space-y-8 text-center pt-8">
      <AnimatePresence mode="wait">
        {slide === 0 ? (
          <motion.div 
             key="slide1"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             className="space-y-6"
          >
             <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-primary shadow-sm">
               <Zap size={48} />
             </div>
             <div className="space-y-2">
                <h2 className="text-2xl font-bold text-primary-dark">Better metabolism supports lasting weight loss</h2>
                <p className="text-gray-600 leading-relaxed">GLP-1 medication targets the root cause of weight gain by regulating your digestion and appetite, helping you feel full sooner.</p>
             </div>
          </motion.div>
        ) : (
          <motion.div 
             key="slide2"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             className="space-y-6"
          >
             <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500 shadow-sm">
               <Heart size={48} />
             </div>
             <div className="space-y-2">
                <h2 className="text-2xl font-bold text-primary-dark">Research has shown significant health benefits</h2>
                <p className="text-gray-600 leading-relaxed">Studies show that reaching a healthy weight can improve cardiovascular health, reduce inflammation, and increase lifespan.</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={handleNext}
        className="w-full bg-next-button text-white font-bold py-4 rounded-full shadow-lg hover:opacity-90 transition-all"
      >
        {slide === 0 ? "Next" : "Continue"}
      </button>
    </div>
  )
}

