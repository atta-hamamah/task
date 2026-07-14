"use client";

import React from "react";

interface StepIconProps {
  icon: string;
}

export default function StepIcon({ icon }: StepIconProps) {
  return (
    <img
      src={icon}
      alt=""
      width={28}
      height={28}
      className="step-icon w-7 h-7 object-contain"
    />
  );
}
