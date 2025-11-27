"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge, Dna, ClipboardCheck } from "lucide-react";

const STAGES = [
  { text: "Recalibrating metabolism...", icon: Gauge },
  { text: "Analyzing genetic factors...", icon: Dna },
  { text: "Reviewing medical history...", icon: ClipboardCheck }
];

export default function PhaseB_Loading() {
  const router = useRouter();
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    // Cycle through stages every 3s
    const interval = setInterval(() => {
      setStageIndex(prev => {
        if (prev < STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 3000);

    // End after 10s
    const timeout = setTimeout(() => {
      router.push("/approved");
    }, 9500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  const CurrentIcon = STAGES[stageIndex].icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full border-4 border-gray-100 border-t-primary"
        />
        <div className="absolute inset-0 flex items-center justify-center text-primary">
           <CurrentIcon size={40} />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary-dark">Checking if you qualify...</h2>
        
        <div className="h-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={stageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-2 text-gray-600 font-medium"
            >
               <span>{STAGES[stageIndex].text}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

