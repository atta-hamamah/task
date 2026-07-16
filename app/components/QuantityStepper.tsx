"use client";

import React from "react";

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  compact?: boolean;
  locked?: boolean;
}

export default function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  compact = false,
  locked = false,
}: QuantityStepperProps) {
  const isZero = quantity <= 0;
  const btnSize = "w-5 h-5";
  const valueSz = compact ? "text-xs min-w-4" : "text-[14px] min-w-5";

  let decClass = `${btnSize} box-border rounded-sm flex items-center justify-center text-gray-800 transition-colors `;
  let incClass = `${btnSize} box-border rounded-sm flex items-center justify-center text-gray-800 transition-colors `;

  if (locked) {
    decClass += "bg-[#F1F1F2] border-2 border-[#CED6DE] cursor-not-allowed opacity-50";
    incClass += "bg-[#F1F1F2] border-2 border-[#CED6DE] cursor-not-allowed opacity-50";
  } else if (compact) {
    decClass += isZero ? "bg-white opacity-35 cursor-not-allowed" : "bg-white hover:bg-gray-100";
    incClass += "bg-white hover:bg-gray-100";
  } else {
    decClass += `border-2 border-[#E6EBF0] ${isZero ? "bg-white opacity-35 cursor-not-allowed" : "bg-white hover:border-primary hover:bg-primary-light"}`;
    incClass += "border-2 border-[#F0F4F7] bg-[#F0F4F7] hover:border-primary hover:bg-primary-light";
  }

  return (
    <div className="inline-flex items-center gap-2.5">
      <button
        className={decClass}
        onClick={onDecrement}
        disabled={isZero || locked}
        aria-label="Decrease quantity"
        type="button"
      >
        <svg width="10" height="2" viewBox="0 0 12 2" fill="none" className="shrink-0">
          <path d="M1 1H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <span className={`${valueSz} text-center font-semibold leading-none`}>{quantity}</span>
      <button
        className={incClass}
        onClick={onIncrement}
        disabled={locked}
        aria-label="Increase quantity"
        type="button"
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="shrink-0">
          <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
