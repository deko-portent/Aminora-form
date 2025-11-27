"use client";
import React from "react";
import { useQuiz } from "@/context/QuizContext";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export default function Step4Graph() {
  const { nextStep } = useQuiz();

  const data = [
    { month: "Start", member: 0, diet: 0 },
    { month: "Mo 1", member: -8, diet: -1 },
    { month: "Mo 2", member: -18, diet: -2 },
    { month: "Mo 3", member: -26, diet: -3 },
    { month: "Mo 4", member: -35, diet: -4 },
    { month: "Mo 5", member: -42, diet: -3 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary-dark mb-2">Our GLP-1 plans are popular because they work!</h1>
        <p className="text-gray-500 text-sm">See how we compare to traditional methods.</p>
      </div>

      <div className="h-64 w-full bg-white rounded-xl p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 12, fill: '#9ca3af'}} 
              padding={{ left: 10, right: 10 }}
            />
            {/* <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} /> */}
            <Line 
              type="monotone" 
              dataKey="diet" 
              stroke="#9ca3af" 
              strokeWidth={2} 
              dot={false}
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="member" 
              stroke="#1e3a8a" 
              strokeWidth={3} 
              dot={{r: 4, fill: '#1e3a8a', strokeWidth: 0}}
              activeDot={{r: 6}}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-6 justify-center text-xs font-medium">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full opacity-50"></div>
          <span className="text-gray-500">Diet & Exercise</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-primary font-bold">Aminora Plan</span>
        </div>
      </div>

      <button 
        onClick={nextStep} 
        className="w-full bg-primary text-white font-bold py-4 rounded-full shadow-lg hover:bg-primary-dark transition-all mt-4"
      >
        Continue
      </button>
    </motion.div>
  )
}

