"use client";

import AccordionBuilder from "@/app/components/AccordionBuilder";
import ReviewPanel from "@/app/components/ReviewPanel";
import { BundleProvider } from "@/app/context/BundleContext";

export default function Home() {
  return (
    <BundleProvider>
      <main className=" px-6 py-8 max-[600px]:px-3 max-[600px]:py-4">
        {/* Mobile-only heading */}
        <div className="hidden max-[600px]:block text-center mb-5">
          <h1 className="text-2xl font-extrabold text-gray-900">Let&apos;s get started!</h1>
        </div>

        {/* Two-column layout: builder + review */}
        <div className="grid grid-cols-[1fr_360px] gap-6 items-start max-[1024px]:grid-cols-1">
          <div>
            <AccordionBuilder />
          </div>
          <div className="sticky top-6 max-[1024px]:static">
            <ReviewPanel />
          </div>
        </div>
      </main>
    </BundleProvider>
  );
}
