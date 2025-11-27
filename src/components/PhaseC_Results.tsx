"use client";
import React from "react";
import { useQuiz } from "@/context/QuizContext";
import { CheckCircle2, ShieldCheck, Star, Award } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function PhaseC_Results() {
  const { answers, computed } = useQuiz();

  // Generate Graph Data
  const startWeight = parseInt(answers.weight) || 200;
  const endWeight = computed.projectedWeight || 170;
  const diff = startWeight - endWeight;
  
  const data = Array.from({length: 7}).map((_, i) => ({
    month: i === 0 ? 'Now' : `Mo ${i}`,
    weight: Math.round(startWeight - (diff * (i/6)))
  }));

  const handleSelectPlan = () => {
    alert("Proceed to Checkout");
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="text-center space-y-4 bg-green-50 p-6 rounded-2xl border border-green-100 animate-fade-in">
        <div className="flex items-center justify-center gap-2 text-success font-bold text-lg">
           <CheckCircle2 size={24} />
           <span>Success! You are approved.</span>
        </div>
        <h1 className="text-3xl font-bold text-primary-dark">
          {answers.contact.firstName}, we can help you lose up to {Math.round(diff)} lbs by {computed.projectedDate}!
        </h1>
      </div>

      {/* Graph */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
         <div className="text-sm font-bold text-gray-500 mb-4 text-center">Your Projected Progress</div>
         <div className="h-64 w-full -ml-2">
           <ResponsiveContainer>
             <LineChart data={data} margin={{top: 20, right: 20, bottom: 0, left: 0}}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
               <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
               <YAxis hide domain={['auto', 'auto']} />
               <Tooltip 
                 contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                 formatter={(val: any) => [`${val} lbs`]}
               />
               <Line 
                 type="monotone" 
                 dataKey="weight" 
                 stroke="#22c55e" 
                 strokeWidth={4} 
                 dot={{r: 6, fill: '#22c55e', stroke: '#fff', strokeWidth: 2}}
                 activeDot={{r: 8}}
               />
             </LineChart>
           </ResponsiveContainer>
         </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-gray-500 font-medium">
         <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
           <ShieldCheck className="text-primary" size={20} />
           <span>Licensed Clinicians in {answers.state || "your state"}</span>
         </div>
         <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
           <Star className="text-yellow-400" size={20} fill="currentColor" />
           <span>Ranked #1 Weight Loss</span>
         </div>
         <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
           <Award className="text-primary" size={20} />
           <span>100k+ Prescriptions</span>
         </div>
      </div>

      {/* Plan Selection */}
      <div className="space-y-4">
        {/* Semaglutide */}
        <div className="border-2 border-gray-200 rounded-2xl p-6 relative overflow-hidden bg-white">
           <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-bl-xl">
             Most Affordable
           </div>
           <div className="mb-4">
             <h3 className="text-xl font-bold text-primary-dark">Semaglutide</h3>
             <p className="text-gray-500 text-sm mt-1">Same active ingredient as Ozempic® & Wegovy®</p>
           </div>
           <div className="flex items-baseline gap-1 mb-6">
             <span className="text-3xl font-bold">$224</span>
             <span className="text-gray-500">/mo</span>
           </div>
           <button onClick={handleSelectPlan} className="w-full py-3 rounded-xl border-2 border-button-outline text-primary font-bold hover:bg-blue-50 transition-colors">
             Select Plan
           </button>
        </div>

        {/* Tirzepatide */}
        <div className="border-2 border-button-outline rounded-2xl p-6 relative overflow-hidden bg-blue-50/30 shadow-md">
           <div className="absolute top-0 right-0 bg-banner text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
             Most Popular
           </div>
           <div className="mb-4">
             <h3 className="text-xl font-bold text-primary-dark">Tirzepatide</h3>
             <p className="text-gray-500 text-sm mt-1">Same active ingredient as Mounjaro® & Zepbound®</p>
           </div>
           <div className="flex items-baseline gap-1 mb-6">
             <span className="text-3xl font-bold">$324</span>
             <span className="text-gray-500">/mo</span>
           </div>
           <button onClick={handleSelectPlan} className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-lg">
             Select Plan
           </button>
        </div>
      </div>
    </div>
  )
}

