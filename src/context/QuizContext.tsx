"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import posthog from "@/lib/posthog";

interface Answers {
  goal: string;
  height: { feet: string; inches: string }; // Using string for inputs, convert to number for calc
  weight: string;
  gender: string;
  dob: string;
  state: string;
  motivation: string;
  medical: string[];
  meds: string; // "Yes" | "No"
  surgery: string;
  eatingDisorder: string;
  caloricIntake: string;
  weightChange: string;
  comorbidities: string[];
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

interface Computed {
  bmi: number;
  projectedWeight: number;
  projectedDate: string;
}

interface QuizContextType {
  step: number;
  answers: Answers;
  computed: Computed;
  patientId: string | null;
  authToken: string | null;
  setPatientId: (id: string | null) => void;
  setAuthToken: (token: string | null) => void;
  setStep: (step: number) => void;
  updateAnswer: (key: keyof Answers, value: any) => void;
  updateNestedAnswer: (parent: keyof Answers, key: string, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const defaultAnswers: Answers = {
  goal: "",
  height: { feet: "", inches: "" },
  weight: "",
  gender: "",
  dob: "",
  state: "",
  motivation: "",
  medical: [],
  meds: "",
  surgery: "",
  eatingDisorder: "",
  caloricIntake: "",
  weightChange: "",
  comorbidities: [],
  contact: { firstName: "", lastName: "", email: "", phone: "" },
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const captureSafe = (event: string, properties?: Record<string, any>) => {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

  try {
    posthog.capture(event, properties);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("PostHog capture failed", error);
    }
  }
};

export function QuizProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>(defaultAnswers);
  const [computed, setComputed] = useState<Computed>({
    bmi: 0,
    projectedWeight: 0,
    projectedDate: "",
  });
  const [patientId, setPatientId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Calculate Computed Values
  useEffect(() => {
    const ft = parseInt(answers.height.feet) || 0;
    const inch = parseInt(answers.height.inches) || 0;
    const w = parseInt(answers.weight) || 0;

    // BMI Calculation: (weight (lb) / [height (in)]^2) * 703
    let bmiVal = 0;
    if (ft > 0 && w > 0) {
      const totalInches = ft * 12 + inch;
      if (totalInches > 0) {
        bmiVal = (w / (totalInches * totalInches)) * 703;
      }
    }

    // Projected Weight: 15% reduction
    const projWeight = w > 0 ? w * 0.85 : 0;

    // Projected Date: 5 months from now
    const date = new Date();
    date.setMonth(date.getMonth() + 5);
    const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
    const projDate = date.toLocaleDateString("en-US", options);

    setComputed({
      bmi: parseFloat(bmiVal.toFixed(1)),
      projectedWeight: Math.round(projWeight),
      projectedDate: projDate,
    });
  }, [answers.height, answers.weight]);

  const updateAnswer = (key: keyof Answers, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const updateNestedAnswer = (parent: keyof Answers, key: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent] as any), [key]: value },
    }));
  };

  const nextStep = () =>
    setStep((prev) => {
      const next = prev + 1;
      captureSafe("quiz_step_advanced", { from_step: prev, to_step: next });
      return next;
    });

  const prevStep = () =>
    setStep((prev) => {
      const next = Math.max(1, prev - 1);
      captureSafe("quiz_step_reversed", { from_step: prev, to_step: next });
      return next;
    });

  return (
    <QuizContext.Provider
      value={{
        step,
        answers,
        computed,
        patientId,
        authToken,
        setPatientId,
        setAuthToken,
        setStep,
        updateAnswer,
        updateNestedAnswer,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
