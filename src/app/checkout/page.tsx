"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  ShieldCheck, 
  CreditCard, 
  Check, 
  Lock, 
  Truck, 
  Clock, 
  Phone, 
  Users, 
  RefreshCw,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types & Mock Data ---

type CheckoutFormData = {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  billingSameAsShipping: boolean;
};

const BENEFITS = [
  { icon: Phone, text: "Unlimited Video Calls With Clinicians", price: "$129", free: true },
  { icon: Users, text: "100% U.S. Based Aminora Care Agents", price: "$69", free: true },
  { icon: RefreshCw, text: "On-Time Refills Guaranteed", price: "$49", free: true },
];

// --- Components ---

const InputField = ({ 
  label, 
  register, 
  name, 
  required = false, 
  placeholder = "",
  half = false 
}: { 
  label: string; 
  register: any; 
  name: string; 
  required?: boolean; 
  placeholder?: string;
  half?: boolean;
}) => (
  <div className={cn("flex flex-col gap-1.5", half ? "col-span-1" : "col-span-2")}>
    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...register(name, { required })}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all text-gray-900 bg-white"
    />
  </div>
);

export default function CheckoutPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    alert("Order Placed!");
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans text-gray-900">
      {/* Minimal Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-center sticky top-0 z-50">
        <img src="/images/logo.png" alt="Aminora" className="h-8" />
      </div>

      {/* Mobile Summary Toggle */}
      <div className="lg:hidden bg-gray-50 border-b border-gray-200 p-4">
        <button 
          onClick={() => setShowMobileSummary(!showMobileSummary)}
          className="flex items-center justify-between w-full text-[#1e3a8a] font-bold"
        >
          <span className="flex items-center gap-2">
            <Clock size={18} /> Order Summary
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl">$224</span>
            {showMobileSummary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
        
        {showMobileSummary && (
           <div className="mt-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2">
             <OrderSummary />
           </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Form */}
          <div className="flex-1 space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Section A: Shipping */}
              <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-[#1e3a8a] mb-6 flex items-center gap-2">
                  <Truck className="text-[#22c55e]" /> Shipping Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="First Name" name="firstName" register={register} required half />
                  <InputField label="Last Name" name="lastName" register={register} required half />
                  <InputField label="Address Line 1" name="address1" register={register} required />
                  <InputField label="Address Line 2 (Optional)" name="address2" register={register} />
                  <InputField label="City" name="city" register={register} required half />
                  <InputField label="State" name="state" register={register} required half />
                  <InputField label="Zip Code" name="zip" register={register} required half />
                  <div className="col-span-2 mt-2">
                     <InputField label="Email Address" name="email" register={register} required />
                  </div>
                </div>
              </section>

              {/* Section B: Payment */}
              <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#1e3a8a] flex items-center gap-2">
                    <CreditCard className="text-[#22c55e]" /> Payment Method
                  </h2>
                  <div className="flex gap-2 opacity-60">
                    {/* Generic Icons */}
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        {...register("cardNumber", { required: true })}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all"
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                  </div>
                  
                  <InputField label="Expiry (MM/YY)" name="expiry" register={register} required half placeholder="MM/YY" />
                  <InputField label="CVC" name="cvc" register={register} required half placeholder="123" />
                  
                  <div className="col-span-2 mt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        {...register("billingSameAsShipping")} 
                        defaultChecked
                        className="w-5 h-5 text-[#1e3a8a] border-gray-300 rounded focus:ring-[#1e3a8a]"
                      />
                      <span className="text-gray-700 group-hover:text-gray-900">Billing address is the same as shipping</span>
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <Lock size={14} />
                  Your payment information is encrypted and secure.
                </div>
              </section>

              {/* Section C: Submit */}
              <div className="space-y-4 pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold text-xl py-5 rounded-xl shadow-xl hover:shadow-2xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Complete Purchase"
                  )}
                </button>
                <p className="text-center text-sm text-gray-500 font-medium">
                  Backed by Aminora Weight Loss Warranty
                </p>

                {/* Trust Badge */}
                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex gap-4 items-start mt-6">
                  <div className="bg-yellow-100 p-2 rounded-full shrink-0">
                    <ShieldCheck className="text-yellow-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Aminora Care+ Warranty</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      We are confident you&apos;ll reach your weight loss goal with us. If you don&apos;t, we&apos;ll refund you every penny.
                    </p>
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:w-[400px] hidden lg:block">
             <div className="sticky top-24">
               <OrderSummary />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Sub-Component: Order Summary ---

function OrderSummary() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-900">Order Summary</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Product Card */}
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-white rounded-lg shrink-0 border border-gray-100 p-1 flex items-center justify-center">
            <img src="/images/semaglutide.png" alt="Semaglutide" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-gray-900">Semaglutide Plan</h4>
              <span className="bg-blue-100 text-[#1e3a8a] text-[10px] font-bold px-1.5 py-0.5 rounded">Most Affordable</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">As low as $7.23/day</p>
            <ul className="space-y-1">
              {["Cheaper than lunch", "1 simple injection weekly", "100% Money-back Guarantee"].map((item, i) => (
                <li key={i} className="text-[10px] text-gray-600 flex items-center gap-1">
                  <Check size={10} className="text-[#22c55e]" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Discount Banner */}
        <div className="bg-green-50 border border-dashed border-[#22c55e] p-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold text-[#22c55e]">
           <span className="text-lg">🏷️</span> Welcome Discount Applied: Saving $75
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 text-sm pt-2">
          <div className="flex justify-between text-gray-600">
            <span>Standard Monthly Plan</span>
            <span>$299.00</span>
          </div>
          <div className="flex justify-between text-[#22c55e] font-bold">
            <span>Welcome Discount</span>
            <span>-$75.00</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Online Clinician Visit</span>
            <span className="flex gap-2">
              <span className="line-through text-gray-400">$49.00</span> 
              <span className="text-[#22c55e] font-bold">FREE</span>
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Overnight Shipping</span>
            <span className="flex gap-2">
              <span className="line-through text-gray-400">$10.00</span> 
              <span className="text-[#22c55e] font-bold">FREE</span>
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200"></div>

        {/* Total */}
        <div className="flex justify-between items-end">
          <div>
            <div className="text-sm text-gray-500 font-medium">Your Exclusive Price Today</div>
            <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
               <Truck size={10} /> Est. Delivery: Within 48 Hours
            </div>
          </div>
          <div className="text-3xl font-bold text-[#1e3a8a]">$224</div>
        </div>

        {/* Value Props List */}
        <div className="bg-gray-50 -mx-6 -mb-6 p-6 mt-4 border-t border-gray-100">
          <h5 className="font-bold text-xs text-gray-700 mb-4">
             <span className="text-[#1e3a8a]">Guest</span>, your all-inclusive plan includes upgraded benefits:
          </h5>
          <div className="space-y-3">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-700">
                  <b.icon size={14} className="text-[#1e3a8a]" />
                  <span>{b.text}</span>
                </div>
                <div className="flex gap-1">
                  <span className="line-through text-gray-400">{b.price}</span>
                  <span className="text-[#22c55e] font-bold">FREE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

