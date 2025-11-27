"use client";
import React from "react";
import { useQuiz } from "@/context/QuizContext";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Step2SocialProof() {
  const { nextStep } = useQuiz();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-primary-dark">We've helped over 200,000+ members reach their goals.</h1>
        <p className="text-gray-600">Join the community that's changing the way the world loses weight.</p>
      </div>
      
      {/* Simple Horizontal Scroll Container */}
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory no-scrollbar -mx-4 px-4">
         {[1, 2, 3].map(i => (
            <div key={i} className="snap-center shrink-0 w-72 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
               <div className="flex items-center gap-1 text-yellow-400 mb-2">
                 <Star size={16} fill="currentColor" />
                 <Star size={16} fill="currentColor" />
                 <Star size={16} fill="currentColor" />
                 <Star size={16} fill="currentColor" />
                 <Star size={16} fill="currentColor" />
               </div>
               <p className="text-sm text-gray-700 italic mb-4">"I never thought I could lose the weight until I found this program. It's been a game changer!"</p>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">Photo</div>
                 <div className="text-xs">
                    <div className="font-bold">Member {i}</div>
                    <div className="text-green-600">Lost {20 + i*10} lbs</div>
                 </div>
               </div>
            </div>
         ))}
      </div>

      <button 
        onClick={nextStep}
        className="w-full bg-next-button text-white font-bold py-4 rounded-full shadow-lg hover:opacity-90 transition-all"
      >
        Continue
      </button>
    </motion.div>
  );
}

