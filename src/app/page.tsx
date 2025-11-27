"use client";
import { useQuiz } from "@/context/QuizContext";
import Step1Goal from "@/components/quiz/Step1Goal";
import Step2SocialProof from "@/components/quiz/Step2SocialProof";
import Step3BMI from "@/components/quiz/Step3BMI";
import Step4Graph from "@/components/quiz/Step4Graph";
import Step5Demographics from "@/components/quiz/Step5Demographics";
import Step6Motivation from "@/components/quiz/Step6Motivation";
import Step7Education from "@/components/quiz/Step7Education";
import Step8Medical from "@/components/quiz/Step8Medical";
import Step9Assessment from "@/components/quiz/Step9Assessment";
import Step10Contact from "@/components/quiz/Step10Contact";
import PhaseB_Loading from "@/components/PhaseB_Loading";
import PhaseC_Results from "@/components/PhaseC_Results";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const { step } = useQuiz();

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Goal />;
      case 2: return <Step2SocialProof />;
      case 3: return <Step3BMI />;
      case 4: return <Step4Graph />;
      case 5: return <Step5Demographics />;
      case 6: return <Step6Motivation />;
      case 7: return <Step7Education />;
      case 8: return <Step8Medical />;
      case 9: return <Step9Assessment />;
      case 10: return <Step10Contact />;
      case 11: return <PhaseB_Loading />;
      case 12: return <PhaseC_Results />;
      default: return <PhaseC_Results />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  );
}

