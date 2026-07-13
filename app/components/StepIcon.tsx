"use client";

import React from "react";

interface StepIconProps {
  icon: string;
}

export default function StepIcon({ icon }: StepIconProps) {
  switch (icon) {
    case "camera":
      return (
        <svg className="step-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );
    case "plan":
      return (
        <svg className="step-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    case "sensor":
      return (
        <svg className="step-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h2M20 12h2M6.34 6.34l1.42 1.42M16.24 16.24l1.42 1.42M12 2v2M12 20v2M6.34 17.66l1.42-1.42M16.24 7.76l1.42-1.42" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
    case "extras":
      return (
        <svg className="step-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    default:
      return null;
  }
}
