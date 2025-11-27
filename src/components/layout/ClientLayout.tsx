"use client";

import { usePathname } from "next/navigation";
import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import ProgressBar from "@/components/layout/ProgressBar";
import { cn } from "@/lib/utils";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isApprovedPage = pathname === "/approved";
  const isCheckoutPage = pathname === "/checkout";
  const isFullWidthPage = isApprovedPage || isCheckoutPage;

  return (
    <>
      {!isFullWidthPage && (
        <>
          <TopBanner />
          <Header />
          <ProgressBar />
        </>
      )}
      <main 
        className={cn(
          "flex-1 flex flex-col relative w-full mx-auto",
          !isFullWidthPage ? "max-w-md px-4 py-6" : "px-0 py-0"
        )}
      >
        {children}
      </main>
    </>
  );
}
