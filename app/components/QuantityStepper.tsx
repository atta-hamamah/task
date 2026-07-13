"use client";

import React from "react";

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  compact?: boolean;
}

export default function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  compact = false,
}: QuantityStepperProps) {
  const isZero = quantity <= 0;
  const btnSize = compact ? "w-6 h-6" : "w-7 h-7";
  const valueSz = compact ? "text-sm min-w-5" : "text-[15px] min-w-6";

  return (
    <div className="inline-flex items-center gap-1">
      <button
        className={`${btnSize} rounded-full border-[1.5px] border-gray-200 flex items-center justify-center text-gray-800 bg-white transition-colors
          ${isZero ? "opacity-35 cursor-not-allowed" : "hover:border-primary hover:bg-primary-light"}`}
        onClick={onDecrement}
        disabled={isZero}
        aria-label="Decrease quantity"
        type="button"
      >
        <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
          <path d="M1 1H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <span className={`${valueSz} text-center font-semibold leading-none`}>{quantity}</span>
      <button
        className={`${btnSize} rounded-full border-[1.5px] border-gray-200 flex items-center justify-center text-gray-800 bg-white transition-colors hover:border-primary hover:bg-primary-light`}
        onClick={onIncrement}
        aria-label="Increase quantity"
        type="button"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
