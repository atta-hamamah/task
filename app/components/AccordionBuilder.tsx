"use client";

import React from "react";
import { useBundleContext } from "@/app/context/BundleContext";
import ProductCard from "./ProductCard";
import StepIcon from "./StepIcon";

export default function AccordionBuilder() {
  const { steps, activeStep, setActiveStep, getStepSelectedCount } = useBundleContext();

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <div className="flex flex-col">
      {steps.map((step, idx) => {
        const isOpen = activeStep === idx;
        const selectedCount = getStepSelectedCount(idx);

        return (
          <div
            key={step.id}
            className={` ${activeStep === idx ? "bg-[#EDF4FF] rounded-[10px]" : " border-b"}  overflow-hidden `}
          >
            {/* STEP X OF 4 label */}
            <div className="text-[11px] border-b  pb-1 font-semibold tracking-wider text-muted uppercase px-6 pt-1">
              STEP {step.stepNumber} OF {steps.length}
            </div>

            {/* Header */}
            <button
              type="button"
              className="flex items-center justify-between w-full px-6 pt-3 pb-4 text-left cursor-pointer transition-colors hover:bg-black/1.5"
              onClick={() => setActiveStep(isOpen ? -1 : idx)}
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <StepIcon icon={step.icon} />
                <h2 className="text-[18px] min-[600px]:text-[24px] min-[1500px]:text-[28px] font-semibold leading-tight  text-[#1F1F1F]">
                  {step.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {selectedCount > 0 && step.id !== "plan" && (
                  <span className="text-sm font-medium text-primary">
                    {selectedCount} selected
                  </span>
                )}
                <span
                  className={`flex items-center text-primary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                >
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                    <path
                      d="M1 1L7 7L13 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </button>

            {/* Body */}
            {isOpen && (
              <div className="px-6 pb-6">
                <div className="grid  min-[600px]:grid-cols-2 min-[890px]:grid-cols-4  min-[1110px]:grid-cols-5 min-[1500px]:grid-cols-2  gap-3 min-[600px]:gap-4 ">
                  {step.products.map((product, index) => {
                    const isLast = index === step.products.length - 1;
                    const isOdd = step.products.length % 2 !== 0;
                    return (
                      <div
                        key={product.id}
                        className={`w-full ${
                          isLast && isOdd
                            ? "min-[1500px]:col-span-full min-[1500px]:max-w-[calc((100%-16px)/2)] min-[1500px]:mx-auto"
                            : ""
                        }`}
                      >
                        <ProductCard product={product} />
                      </div>
                    );
                  })}
                </div>

                {step.nextLabel && (
                  <div className="flex justify-center mt-5">
                    <button
                      type="button"
                      className="px-8 py-3 text-[15px] font-semibold border-2 border-primary rounded-full text-primary bg-transparent transition-colors hover:bg-primary hover:text-white"
                      onClick={handleNext}
                    >
                      Next: {step.nextLabel}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
