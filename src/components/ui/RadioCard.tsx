import { cn } from "@/lib/utils";
import React from "react";

interface RadioCardProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export function RadioCard({ selected, onClick, children, className }: RadioCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 flex items-center gap-3 shadow-sm",
        selected ? "border-button-outline bg-blue-50 shadow-md" : "border-ui hover:border-blue-200 bg-white",
        className
      )}
    >
      <div className={cn(
        "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
        selected ? "border-button-outline" : "border-gray-300"
      )}>
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-button-outline" />}
      </div>
      <div className="flex-1 font-medium text-primary-dark">{children}</div>
    </div>
  )
}

