"use client";
import React, { useState } from "react";
import { useQuiz } from "@/context/QuizContext";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import posthog from "@/lib/posthog";
import { proxyFetch } from "@/lib/apiClient";

export default function Step10Contact() {
  const { answers, updateNestedAnswer, nextStep, setPatientId, setAuthToken } = useQuiz();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isValid = 
    answers.contact.firstName.length > 0 && 
    answers.contact.lastName.length > 0 && 
    answers.contact.email.includes('@') && 
    answers.contact.phone.length === 14;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = raw;

    if (raw.length > 0) {
      if (raw.length <= 3) {
        formatted = `(${raw}`;
      } else if (raw.length <= 6) {
        formatted = `(${raw.slice(0, 3)}) ${raw.slice(3)}`;
      } else {
        formatted = `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6, 10)}`;
      }
    }
    
    updateNestedAnswer('contact', 'phone', formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // Format phone to E.164 (+1XXXXXXXXXX)
      const rawPhone = answers.contact.phone.replace(/\D/g, '');
      const e164Phone = rawPhone.startsWith('1') ? `+${rawPhone}` : `+1${rawPhone}`;

      const signupPayload = {
        firstName: answers.contact.firstName,
        lastName: answers.contact.lastName,
        email: answers.contact.email,
        phoneNumber: e164Phone,
        testModeEnabled: true,
        // Extra fields for context if allowed, otherwise handled in intake
        state: answers.state,
        gender: answers.gender,
        dob: answers.dob,
        goal: answers.goal,
      };

      const signupResponse = await proxyFetch("/api/proxy/signup", {
        method: "POST",
        body: JSON.stringify(signupPayload),
      });

      if (!signupResponse.ok) {
        let errorMsg = "Signup failed. Please try again.";
        try {
          const errData = await signupResponse.json();
          console.error("Signup Error Detail:", errData);
          errorMsg = errData.details || errData.error || errData.message || errorMsg;
          // If details is a JSON string, parse it
          if (typeof errorMsg === 'string' && errorMsg.startsWith('{')) {
             try { errorMsg = JSON.parse(errorMsg).message || errorMsg; } catch {}
          }
        } catch (e) {
          const text = await signupResponse.text();
          console.error("Signup Error Text:", text);
          if (text) errorMsg = `Server Error: ${text.substring(0, 100)}`;
        }
        throw new Error(errorMsg);
      }

      const signupData = await signupResponse.json();
      
      // Extract Patient ID
      const baskPatientId =
        signupData?.id ??
        signupData?.patientId ??
        signupData?.patient_id ??
        signupData?.data?.id;

      // Extract Auth Token (JWT)
      const baskToken = 
        signupData?.token ?? 
        signupData?.data?.token;

      if (!baskPatientId) {
        throw new Error("Missing patient ID from Bask response.");
      }

      setPatientId(baskPatientId);
      
      if (baskToken) {
        setAuthToken(baskToken);
      }

      const intakePayload = {
        patientId: baskPatientId,
        authToken: baskToken, // Pass token for authenticated update
        intake: {
          goal: answers.goal,
          weight: answers.weight,
          height_feet: answers.height.feet,
          height_inches: answers.height.inches,
          gender: answers.gender,
          dob: answers.dob,
          state: answers.state,
          motivation: answers.motivation,
          medical_conditions: answers.medical,
          medications: answers.meds,
          surgery_history: answers.surgery,
          eating_disorder_history: answers.eatingDisorder,
          caloric_intake: answers.caloricIntake,
          weight_change: answers.weightChange,
          comorbidities: answers.comorbidities,
        },
      };

      const intakeResponse = await proxyFetch(
        "/api/proxy/medical-intake",
        {
          method: "POST",
          body: JSON.stringify(intakePayload),
        }
      );

      if (!intakeResponse.ok) {
        throw new Error("Unable to save medical intake. Please try again.");
      }

      try {
        if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
          posthog.capture("contact_step_submitted", {
            contact_collected: true,
            contact_state: answers.state || undefined,
          });
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("PostHog contact capture failed", error);
        }
      }

      nextStep();
    } catch (error) {
      console.error(error);
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
         <h1 className="text-2xl font-bold text-primary-dark mb-2">See if you qualify</h1>
         <p className="text-gray-600">Enter your contact info to see your results.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
             <label className="block text-sm font-medium mb-1 text-gray-700">First Name</label>
             <input 
               type="text" 
               required
               className="w-full p-3 border border-ui rounded-xl outline-none focus:border-primary transition-colors"
               value={answers.contact.firstName}
               onChange={(e) => updateNestedAnswer('contact', 'firstName', e.target.value)}
             />
          </div>
          <div>
             <label className="block text-sm font-medium mb-1 text-gray-700">Last Name</label>
             <input 
               type="text" 
               required
               className="w-full p-3 border border-ui rounded-xl outline-none focus:border-primary transition-colors"
               value={answers.contact.lastName}
               onChange={(e) => updateNestedAnswer('contact', 'lastName', e.target.value)}
             />
          </div>
        </div>
        
        <div>
             <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
             <input 
               type="email" 
               required
               className="w-full p-3 border border-ui rounded-xl outline-none focus:border-primary transition-colors"
               value={answers.contact.email}
               onChange={(e) => updateNestedAnswer('contact', 'email', e.target.value)}
             />
        </div>
        
        <div>
             <label className="block text-sm font-medium mb-1 text-gray-700">Phone Number</label>
             <input 
               type="tel" 
               required
               placeholder="(555) 555-5555"
               maxLength={14}
               className="w-full p-3 border border-ui rounded-xl outline-none focus:border-primary transition-colors"
               value={answers.contact.phone}
               onChange={handlePhoneChange}
             />
        </div>

      <button 
        type="submit"
        disabled={!isValid || isSubmitting}
        className={`w-full font-bold py-4 rounded-full shadow-lg transition-all mt-4 ${
          isValid && !isSubmitting
            ? 'bg-primary text-white hover:bg-primary-dark'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? "Submitting..." : "See My Results"}
      </button>
      {submitError && (
        <p className="text-red-500 text-center text-sm mt-2">{submitError}</p>
      )}
        
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
           <Lock size={12} />
           <span>Your information is secure and encrypted.</span>
        </div>
      </form>
    </motion.div>
  )
}
