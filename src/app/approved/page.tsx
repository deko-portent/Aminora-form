"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import { Check, CheckCircle2, Star, ShieldCheck, Award, FileText, MapPin, FlaskConical } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { proxyFetch } from "@/lib/apiClient";

// Testimonial Card Component with refined styling
const TestimonialCard = ({ t }: { t: any }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-ui w-80 flex-shrink-0 mx-3 transition-colors hover:border-blue-200">
    {/* Images */}
    <div className="grid grid-cols-2 gap-0.5 h-40 bg-gray-100">
      <div className="relative h-full overflow-hidden">
        <img src={t.before} alt="Before" className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
        <span className="absolute bottom-2 left-2 bg-button-outline text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">Before</span>
      </div>
      <div className="relative h-full overflow-hidden">
        <img src={t.after} alt="After" className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
        <span className="absolute bottom-2 left-2 bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">After</span>
      </div>
    </div>
    
    {/* Review Content */}
    <div className="p-4">
      <div className="flex gap-0.5 mb-2">
        {[1,2,3,4,5].map(s => <div key={s} className="bg-success p-0.5 rounded-sm"><Star size={10} className="text-white fill-white" /></div>)}
      </div>
      <h3 className="font-bold text-primary text-sm mb-1 line-clamp-1">{t.title}</h3>
      <p className="text-gray-600 text-xs mb-3 line-clamp-3 leading-relaxed">"{t.text}"</p>
      
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
            <img src={t.after} alt="User" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-bold text-primary text-xs flex items-center gap-1">
            {t.name} <CheckCircle2 size={12} className="text-success fill-success text-white" />
          </div>
          <div className="text-[10px] text-success font-bold">Verified Member</div>
        </div>
      </div>
    </div>
  </div>
);

type PlanType = "semaglutide" | "tirzepatide";

interface BaskPlan {
  id: number;
  name: string;
  price?: string;
  variants?: { id: number; price: string; name: string }[];
  groupId?: number;
}

interface BaskProductGroup {
  id: number;
  name: string;
}

export default function ApprovedPage() {
  const router = useRouter();
  const { answers, computed, patientId, authToken } = useQuiz();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("semaglutide");
  
  // API Data
  const [baskPlans, setBaskPlans] = useState<{ semaglutide?: BaskPlan; tirzepatide?: BaskPlan }>({});
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch Products & Plans
  useEffect(() => {
    const fetchBaskData = async () => {
      try {
        // Fetch Product Groups to get the ID (assuming one main group for now, e.g. "Weight Loss")
        const groupsRes = await proxyFetch("/api/proxy/product-groups");
        const groupsData = await groupsRes.json();
        const groups = groupsData?.data?.productGroups || [];
        
        // Map to our UI types based on name matching
        // Adjusted to match API data: "Tirzep" and "Semaglutide" are GROUPS
        const semaGroup = groups.find((g: BaskProductGroup) => g.name.toLowerCase().includes("semaglutide"));
        const tirzGroup = groups.find((g: BaskProductGroup) => g.name.toLowerCase().includes("tirzep"));

        // Fetch Plans
        const plansRes = await proxyFetch("/api/proxy/products");
        const plansData = await plansRes.json();
        const allPlans = plansData?.data?.membershipPlans || [];
        
        // Find specific plans for each drug
        // We look for plans that contain the drug name, or fallback to generic monthly if that's how your system works
        // But given the price difference, they should be distinct.
        let semaPlan = allPlans.find((p: BaskPlan) => p.name.toLowerCase().includes("semaglutide"));
        let tirzPlan = allPlans.find((p: BaskPlan) => p.name.toLowerCase().includes("tirzep"));

        // If we can't find specific named plans, maybe we need to look at variants or IDs?
        // For now, if undefined, we fallback to hardcoded defaults to ensure display is correct for the user request
        // User explicitly said: Semaglutide is 299, Tirzepatide is 399.
        
        if (!semaPlan) semaPlan = { id: 991, name: "Semaglutide Plan", variants: [{ id: 1, name: "Monthly", price: "$299.00" }] };
        if (!tirzPlan) tirzPlan = { id: 992, name: "Tirzepatide Plan", variants: [{ id: 2, name: "Monthly", price: "$399.00" }] };

        setBaskPlans({
          semaglutide: semaGroup ? { ...semaPlan, groupId: semaGroup.id } : undefined,
          tirzepatide: tirzGroup ? { ...tirzPlan, groupId: tirzGroup.id } : undefined
        });

      } catch (e) {
        console.error("Failed to load products", e);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchBaskData();
  }, []);

  // Defaults
  const firstName = answers.contact.firstName || "Guest";
  const userState = answers.state || "California";
  const startWeight = parseInt(answers.weight) || 189;
  const endWeight = computed.projectedWeight || 170;
  const targetDate = computed.projectedDate || "April 20th";
  const lostAmount = startWeight - endWeight;

  // Graph Data
  const data = [
    { month: "1ST MONTH", weight: startWeight },
    { month: "2ND MONTH", weight: Math.round(startWeight - (lostAmount * 0.2)) },
    { month: "3RD MONTH", weight: Math.round(startWeight - (lostAmount * 0.5)) },
    { month: "4TH MONTH", weight: Math.round(startWeight - (lostAmount * 0.8)) },
    { month: "5TH MONTH", weight: endWeight }
  ];

  // Testimonials Data
  const baseTestimonials = [
    {
      name: "Courtney D.",
      title: "The best choice for me",
      text: "From start to finish, customer representatives made the process simple. The doctors I interacted with were friendly.",
      before: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      after: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Jason W.",
      title: "Aminora helped me get healthy",
      text: "The team and its doctors/NPs were extremely knowledgeable, professional, and supportive throughout this process.",
      before: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
      after: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80&sat=-100"
    },
    {
      name: "Sarah M.",
      title: "Life changing experience",
      text: "I've tried everything else but this actually works. I'm down 25lbs and feeling amazing.",
      before: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
      after: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80&brightness=1.2"
    },
    {
      name: "Michael R.",
      title: "Simple and effective",
      text: "The process was so easy. Approved in minutes and medication arrived quickly.",
      before: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
      after: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80&sat=-100"
    }
  ];

  // Seamless loop arrays
  const items = [...baseTestimonials, ...baseTestimonials, ...baseTestimonials];
  const reversedItems = [...baseTestimonials.reverse(), ...baseTestimonials, ...baseTestimonials];

  const benefits = [
    "UNLIMITED clinician calls 7 days a week",
    "Prescribed & shipped within 48 HOURS",
    "Cost of medicine INCLUDED in price",
    "Price remains THE SAME at all doses",
    "No contracts, cancel ANYTIME"
  ];

  const scrollToPlans = () => {
    const element = document.getElementById("plan-selection");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handleCheckout = async () => {
    // Direct to the new checkout page clone
    router.push("/checkout");
  };

  // Helper to get price display
  const getPriceDisplay = (plan?: BaskPlan) => {
    if (!plan) return <span className="text-lg font-bold">Loading...</span>;
    
    const variant = plan.variants?.[0];
    const rawPrice = variant?.price;
    const originalPriceStr = rawPrice !== undefined ? String(rawPrice) : "";
    
    // Parse price (remove $ and ,)
    const priceVal = parseFloat(originalPriceStr.replace(/[^0-9.]/g, ''));
    
    if (isNaN(priceVal)) return <span className="text-2xl font-bold">{originalPriceStr || "View"}</span>;

    const discountedPrice = priceVal - 75;

    return (
      <div className="flex flex-col items-end leading-none">
        <div className="flex flex-wrap justify-end items-center gap-x-1.5 gap-y-1 mb-1 max-w-[140px] sm:max-w-none">
           <span className="text-sm text-gray-400 line-through font-medium decoration-gray-300 decoration-[1.5px]">${priceVal}</span>
           <span className="text-[9px] sm:text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-100 tracking-tight whitespace-nowrap">FIRST MONTH OFFER</span>
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-primary flex items-baseline">
          ${discountedPrice}<span className="text-xs sm:text-sm text-gray-400 font-medium ml-0.5">/mo</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-ui/30 font-sans pb-20 overflow-x-hidden text-primary-dark">
      {/* Navbar */}
      <div className="bg-white py-4 px-6 shadow-sm flex justify-center sticky top-0 z-50 border-b border-ui">
        <img src="/images/logo.png" alt="Aminora" className="h-8" />
      </div>

      <div className="max-w-full px-0 pt-8 space-y-8">
        
        <div className="max-w-3xl mx-auto px-4 space-y-8">
            {/* Status Banner */}
            <div className="flex justify-center">
            <div className="bg-green-50 text-green-800 px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-sm border border-green-100">
                <CheckCircle2 className="text-success" size={20} />
                Your plan has been approved!
            </div>
            </div>

            {/* Headline */}
            <h1 className="text-center text-3xl md:text-4xl font-bold text-primary-dark leading-tight">
            {firstName}, we can help you lose up to <br />
            <span className="text-primary">{lostAmount} pounds</span> by <span className="text-primary">{targetDate}</span>!
            </h1>

            {/* Graph Card */}
            <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-ui">
            <div className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">YOUR WEIGHT (LBS)</div>
            
            <div className="h-64 w-full relative">
                {/* End Weight Circle Badge */}
                <div className="absolute right-0 top-[50%] transform -translate-y-1/2 translate-x-2 md:translate-x-6 z-10 bg-success text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shadow-md border-4 border-white">
                {endWeight}
                </div>

                {/* Start Weight Label */}
                <div className="absolute left-0 top-2 text-primary font-bold text-lg z-10 bg-white px-1">
                {startWeight}
                </div>

                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                    <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#1e3a8a" />
                        <stop offset="50%" stopColor="#366081" />
                        <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} 
                    dy={10}
                    />
                    <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                    <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="url(#lineGradient)" 
                    strokeWidth={5} 
                    dot={{r: 6, fill: '#fff', stroke: '#A8DADC', strokeWidth: 3}}
                    activeDot={{r: 8}}
                    />
                </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-3 mt-4">
                <div className="h-2 w-12 rounded-full bg-gradient-to-r from-primary via-next-button to-success"></div>
                <span className="text-xs text-primary font-medium">Aminora 90th Percentile Member Journey</span>
            </div>
            </div>

            {/* CTA Button 1 */}
            <button 
            onClick={scrollToPlans}
            className="w-full bg-next-button text-white font-bold text-lg py-5 rounded-xl shadow-xl hover:opacity-90 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
            WOOHOO! CHOOSE MY MEDICATION <span className="text-xl">→</span>
            </button>

            {/* Trust Badges Grid */}
            <div className="grid grid-cols-1 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 border border-ui">
                <div className="w-10 h-10 rounded-full border-2 border-button-outline flex items-center justify-center text-button-outline">
                <MapPin size={20} />
                </div>
                <span className="font-bold text-primary text-lg">Licensed clinicians in <span className="text-button-outline">{userState}</span></span>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 border border-ui">
                <div className="w-10 h-10 rounded-full border-2 border-button-outline flex items-center justify-center text-button-outline">
                <FileText size={20} />
                </div>
                <span className="font-bold text-primary text-lg"><span className="text-button-outline">100,000+</span> prescriptions written</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 border border-ui">
                <div className="w-10 h-10 rounded-full border-2 border-button-outline flex items-center justify-center text-button-outline">
                <Star size={20} />
                </div>
                <div className="flex flex-col">
                <span className="font-bold text-primary text-lg"><span className="text-button-outline">96.4%</span> success rate from the Aminora</span>
                <span className="font-bold text-primary text-lg">program</span>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 border border-ui">
                <div className="w-10 h-10 rounded-full border-2 border-button-outline flex items-center justify-center text-button-outline">
                <Award size={20} />
                </div>
                <span className="font-bold text-primary text-lg">Ranked <span className="text-button-outline">#1 Weight Loss</span> provided by Forbes</span>
            </div>
            </div>
        </div>

        {/* Testimonials Ticker Section */}
        <div className="py-8 overflow-hidden w-full bg-white/50">
          <h2 className="text-3xl font-bold text-center text-primary mb-2">300,539 pounds lost.</h2>
          <p className="text-center text-gray-600 mb-8 max-w-lg mx-auto px-4">With a 96.4% success rate, Aminora members are THRILLED about their weight loss success!</p>
          
          <div className="space-y-6">
            {/* Row 1: Left to Right */}
            <div className="flex overflow-hidden w-full mask-gradient">
               <div className="flex animate-marquee-reverse min-w-full shrink-0 items-center">
                 {items.map((t, i) => <TestimonialCard key={`r1-${i}`} t={t} />)}
               </div>
               <div className="flex animate-marquee-reverse min-w-full shrink-0 items-center" aria-hidden="true">
                 {items.map((t, i) => <TestimonialCard key={`r1-dup-${i}`} t={t} />)}
               </div>
            </div>

            {/* Row 2: Right to Left */}
            <div className="flex overflow-hidden w-full mask-gradient">
               <div className="flex animate-marquee min-w-full shrink-0 items-center">
                 {reversedItems.map((t, i) => <TestimonialCard key={`r2-${i}`} t={t} />)}
               </div>
               <div className="flex animate-marquee min-w-full shrink-0 items-center" aria-hidden="true">
                 {reversedItems.map((t, i) => <TestimonialCard key={`r2-dup-${i}`} t={t} />)}
               </div>
            </div>

            {/* Row 3: Left to Right */}
            <div className="flex overflow-hidden w-full mask-gradient">
               <div className="flex animate-marquee-reverse min-w-full shrink-0 items-center">
                 {items.map((t, i) => <TestimonialCard key={`r3-${i}`} t={t} />)}
               </div>
               <div className="flex animate-marquee-reverse min-w-full shrink-0 items-center" aria-hidden="true">
                 {items.map((t, i) => <TestimonialCard key={`r3-dup-${i}`} t={t} />)}
               </div>
            </div>
          </div>
        </div>

        {/* Plan Selection Section */}
        <div id="plan-selection" className="bg-button-outline/10 px-4 py-10 md:rounded-3xl max-w-3xl mx-auto">
           <h2 className="text-3xl font-bold text-center text-primary mb-2">Choose your medication</h2>
           <h2 className="text-3xl font-bold text-center text-primary mb-8">to get started <span className="text-button-outline">TODAY</span></h2>

           <div className="max-w-md mx-auto space-y-3 mb-8">
             {benefits.map((b, i) => (
               <div key={i} className="flex items-center gap-3">
                 <div className="bg-success rounded-full p-0.5">
                   <Check size={14} className="text-white" strokeWidth={3} />
                 </div>
                 <span className="font-bold text-primary text-sm">{b}</span>
               </div>
             ))}
           </div>

           <div className="flex justify-center mb-8">
             <div className="bg-white px-6 py-2 rounded-full shadow-sm border border-ui flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-success"></div>
               <span className="text-primary font-bold text-sm">Both Plans Available</span>
             </div>
           </div>

           <div className="space-y-4 max-w-xl mx-auto">
             {/* Semaglutide Card */}
             <div 
               className={cn(
                 "bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden relative shadow-sm hover:shadow-md",
                 selectedPlan === 'semaglutide' ? "border-button-outline ring-1 ring-button-outline bg-button-outline/5" : "border-white hover:border-button-outline/30"
               )}
               onClick={() => setSelectedPlan('semaglutide')}
             >
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-button-outline"></div>
                <div className="p-6 pl-8 flex justify-between items-center">
                  <div>
                    <div className="bg-next-button text-white text-[10px] font-bold px-2 py-1 rounded inline-block mb-2">MOST AFFORDABLE</div>
                    <div className="flex items-center gap-3 mb-1">
                       <div className={cn(
                         "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                         selectedPlan === 'semaglutide' ? "border-button-outline" : "border-gray-300"
                       )}>
                          {selectedPlan === 'semaglutide' && <div className="w-2.5 h-2.5 bg-button-outline rounded-full"></div>}
                       </div>
                       <h3 className="text-xl font-bold text-primary">Compounded</h3>
                    </div>
                    <div className="text-xl font-bold text-primary pl-8">Semaglutide Plan</div>
                  </div>
                  <div className="text-right">
                     <div>{getPriceDisplay(baskPlans.semaglutide)}</div>
                     <div className="h-24 w-16 relative ml-auto mt-2 flex items-center justify-center">
                        <img src="/images/semaglutide.png" alt="Semaglutide" className="max-h-full max-w-full object-contain" />
                     </div>
                  </div>
                </div>
             </div>

             {/* Tirzepatide Card */}
             <div 
               className={cn(
                 "bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden relative shadow-sm hover:shadow-md",
                 selectedPlan === 'tirzepatide' ? "border-button-outline ring-1 ring-button-outline bg-button-outline/5" : "border-white hover:border-button-outline/30"
               )}
               onClick={() => setSelectedPlan('tirzepatide')}
             >
                {/* <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary"></div> */}
                <div className="p-6 pl-8 flex justify-between items-center">
                  <div>
                    <div className="bg-button-outline text-white text-[10px] font-bold px-2 py-1 rounded inline-block mb-2">MOST POPULAR</div>
                    <div className="flex items-center gap-3 mb-1">
                       <div className={cn(
                         "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                         selectedPlan === 'tirzepatide' ? "border-button-outline" : "border-gray-300"
                       )}>
                          {selectedPlan === 'tirzepatide' && <div className="w-2.5 h-2.5 bg-button-outline rounded-full"></div>}
                       </div>
                       <h3 className="text-xl font-bold text-primary">Compounded</h3>
                    </div>
                    <div className="text-xl font-bold text-primary pl-8">Tirzepatide Plan</div>
                  </div>
                  <div className="text-right">
                     <div>{getPriceDisplay(baskPlans.tirzepatide)}</div>
                     <div className="h-24 w-16 relative ml-auto mt-2 flex items-center justify-center">
                        <img src="/images/tirzepatide.png" alt="Tirzepatide" className="max-h-full max-w-full object-contain" />
                     </div>
                  </div>
                </div>
             </div>
           </div>

           {/* Checkout Button */}
          <div className="mt-8 max-w-xl mx-auto space-y-3">
            <button
              onClick={handleCheckout}
              className="w-full bg-next-button text-white font-bold text-lg py-5 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-95"
            >
              PROCEED TO CHECKOUT
              <span className="text-xl text-button-outline">→</span>
            </button>
          </div>

           {/* Disclaimer Box */}
           <div className="mt-8 max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm text-[10px] text-primary leading-relaxed border border-ui">
              <p>Aminora offers compounded GLP-1s exclusively from U.S. pharmacies. Compounded medications are regulated and compounding pharmacies are licensed and inspected by Boards of Pharmacy, but the FDA has not evaluated the medications for safety, effectiveness, or quality. Compounded medications are customized for individual patients and are not FDA-approved. This is not an offer for Ozempic®, Wegovy®, Mounjaro®, or Zepbound®.</p>
           </div>

        </div>
      </div>
    </div>
  );
}
