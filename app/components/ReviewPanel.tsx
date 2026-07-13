"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useBundleContext, type SelectedItem } from "@/app/context/BundleContext";
import QuantityStepper from "./QuantityStepper";

export default function ReviewPanel() {
  const {
    getSelectedItems,
    getSubtotal,
    getCompareAtTotal,
    getSavings,
    incrementQuantity,
    decrementQuantity,
    saveSystem,
    shipping,
  } = useBundleContext();

  const [saved, setSaved] = useState(false);

  const items = getSelectedItems();
  const subtotal = getSubtotal();
  const compareAtTotal = getCompareAtTotal();
  const savings = getSavings();

  // Group items by category
  const grouped: Record<string, SelectedItem[]> = {};
  for (const item of items) {
    const cat = item.product.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  }

  const categoryOrder = ["Cameras", "Sensors", "Accessories", "Plan"];
  const categoryLabels: Record<string, string> = {
    Cameras: "CAMERAS",
    Sensors: "SENSORS",
    Accessories: "ACCESSORIES",
    Plan: "PLAN",
  };

  const handleSave = () => {
    saveSystem();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCheckout = () => {
    alert("Checkout complete! Thank you for your order.");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 max-[600px]:p-4">
      {/* Header */}
      <div className="text-[11px] font-semibold tracking-widest text-muted uppercase mb-2">
        REVIEW
      </div>
      <h2 className="text-xl font-extrabold mb-1.5">Your security system</h2>
      <p className="text-[13px] text-secondary leading-normal mb-5">
        Review your personalized protection system designed to keep what matters most safe.
      </p>

      {/* Grouped line items */}
      <div className="space-y-3">
        {categoryOrder.map((cat) => {
          const catItems = grouped[cat];
          if (!catItems || catItems.length === 0) return null;
          return (
            <div key={cat}>
              <div className="text-[10px] font-bold tracking-widest text-muted uppercase mb-1.5">
                {categoryLabels[cat]}
              </div>
              {catItems.map((item) => (
                <ReviewLineItem key={`${item.product.id}-${item.variantId}`} item={item} />
              ))}
            </div>
          );
        })}
      </div>

      {/* Shipping */}
      <div className="flex items-center justify-between gap-2 border-t border-gray-200 pt-3 mt-3">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5C3CFC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="1" />
              <polygon points="16,8 20,8 23,11 23,16 16,16" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </span>
          <span className="text-[13px] font-medium">Fast Shipping</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-danger line-through">${shipping.compareAtPrice.toFixed(2)}</span>
          <span className="text-sm font-extrabold text-success">FREE</span>
        </div>
      </div>

      {/* Satisfaction badge */}
      <div className="flex items-center gap-3.5 py-4 border-t border-gray-200 mt-3">
        <Image
          src="/Satisfaction Badge-05 1.png"
          alt="100% Wyze satisfaction guarantee"
          width={80}
          height={80}
          className="shrink-0"
        />
        <div>
          <div className="text-sm font-bold mb-1">30-day hassle-free returns</div>
          <p className="text-xs text-secondary leading-snug">
            If you&apos;re not totally in love with the product, we will refund you 100%.
          </p>
        </div>
      </div>

      {/* Financing line */}
      <div className="flex justify-end py-2">
        <span className="bg-primary text-white text-[11px] font-bold px-3 py-[5px] rounded-md">
          as low as $17.19/mo
        </span>
      </div>

      {/* Total */}
      <div className="flex justify-end items-baseline gap-2.5 pt-1 pb-1">
        <span className="text-base text-muted line-through">${compareAtTotal.toFixed(2)}</span>
        <span className="text-[28px] font-extrabold text-gray-900 max-[600px]:text-2xl">
          ${subtotal.toFixed(2)}
        </span>
      </div>

      {/* Savings callout */}
      {savings > 0 && (
        <div className="text-center text-[13px] font-semibold text-success-dark my-2">
          Congrats! You&apos;re saving ${savings.toFixed(2)} on your security bundle!
        </div>
      )}

      {/* Checkout button */}
      <button
        type="button"
        className="block w-full py-3.5 mt-2 text-base font-bold text-white bg-gray-900 rounded-lg transition-colors hover:bg-gray-700"
        onClick={handleCheckout}
      >
        Checkout
      </button>

      {/* Save link */}
      <button
        type="button"
        className="block w-full py-3 text-sm font-medium text-primary underline text-center cursor-pointer transition-colors hover:text-primary-hover"
        onClick={handleSave}
      >
        {saved ? "✓ System saved!" : "Save my system for later"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ReviewLineItem                                                     */
/* ------------------------------------------------------------------ */

function ReviewLineItem({ item }: { item: SelectedItem }) {
  const { incrementQuantity, decrementQuantity } = useBundleContext();

  const isPlan = item.product.isPlan;

  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      {/* Left: thumbnail + name */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {item.product.image && (
          <Image
            src={item.product.image}
            alt={item.product.name}
            width={32}
            height={32}
            className="rounded shrink-0 object-contain"
          />
        )}
        {isPlan && (
          <span className="flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C3CFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </span>
        )}
        {!item.product.image && !isPlan && (
          <span className="flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </span>
        )}
        <span className="text-[13px] font-medium leading-tight truncate">
          {isPlan ? (
            <>Cam <span className="font-bold">Unlimited</span></>
          ) : (
            item.product.name
          )}
        </span>
      </div>

      {/* Right: stepper + pricing */}
      <div className="flex items-center gap-2 shrink-0">
        {!isPlan && (
          <QuantityStepper
            quantity={item.quantity}
            onIncrement={() => incrementQuantity(item.product.id, item.variantId)}
            onDecrement={() => decrementQuantity(item.product.id, item.variantId)}
            compact
          />
        )}
        <div className="flex flex-col items-end min-w-[55px]">
          {item.lineCompareAtPrice != null && item.lineCompareAtPrice !== item.linePrice && (
            <span className="text-[11px] text-danger line-through leading-tight">
              ${item.lineCompareAtPrice.toFixed(2)}
            </span>
          )}
          <span className={`text-[13px] font-bold leading-tight ${item.product.priceLabel === "FREE" ? "text-success" : "text-gray-900"}`}>
            {item.product.priceLabel
              ? item.product.priceLabel
              : item.product.priceUnit
                ? `$${item.product.price.toFixed(2)}${item.product.priceUnit}`
                : `$${item.linePrice.toFixed(2)}`}
          </span>
        </div>
      </div>
    </div>
  );
}
