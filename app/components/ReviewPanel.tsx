"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useBundleContext, type SelectedItem, type Product } from "@/app/context/BundleContext";
import QuantityStepper from "./QuantityStepper";

interface GroupedItem {
  product: Product;
  quantity: number;
  linePrice: number;
  lineCompareAtPrice: number | null;
}

export default function ReviewPanel() {
  const {
    getSelectedItems,
    getSubtotal,
    getCompareAtTotal,
    getSavings,
    saveSystem,
    shipping,
  } = useBundleContext();

  const [saved, setSaved] = useState(false);

  const items = getSelectedItems();
  const subtotal = getSubtotal();
  const compareAtTotal = getCompareAtTotal();
  const savings = getSavings();

  // Group selected items by product id (merging variants into a single line item)
  const groupedProductsMap = new Map<string, GroupedItem>();
  for (const item of items) {
    const existing = groupedProductsMap.get(item.product.id);
    if (existing) {
      existing.quantity += item.quantity;
      existing.linePrice += item.linePrice;
      if (item.lineCompareAtPrice !== null) {
        existing.lineCompareAtPrice = (existing.lineCompareAtPrice || 0) + item.lineCompareAtPrice;
      }
    } else {
      groupedProductsMap.set(item.product.id, {
        product: item.product,
        quantity: item.quantity,
        linePrice: item.linePrice,
        lineCompareAtPrice: item.lineCompareAtPrice,
      });
    }
  }
  const groupedItems = Array.from(groupedProductsMap.values());

  // Group items by category
  const grouped: Record<string, GroupedItem[]> = {};
  for (const item of groupedItems) {
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
    <div className="bg-[#EDF4FF] grid min-[980px]:grid-cols-2  min-[1500px]:grid-cols-1 rounded-xl p-6 max-[600px]:p-4 w-">
      {/* Summery */}
      <div>
        {/* Header */}
        <div className="text-[10px]  min-[600px]:text-[12px] font-semibold tracking-widest text-muted uppercase mb-2">
          REVIEW
        </div>
        <h2 className="font-gilroy font-semibold text-[22px] leading-none tracking-[0.6px] align-middle mb-1.5 text-gray-900">Your security system</h2>
        <p className="text-[12px]  min-[600px]:text-[14px] text-secondary leading-normal mb-5">
          Review your personalized protection system designed to keep what matters most safe.
        </p>

        {/* Grouped line items */}
        <div className="space-y-3">
          {categoryOrder.map((cat) => {
            const catItems = grouped[cat];
            if (!catItems || catItems.length === 0) return null;
            return (
              <div key={cat}>
                <div className="text-[10px] text-[#A8B2BD] font-bold tracking-widest uppercase border-b border-gray-200 pb-1 mb-2">
                  {categoryLabels[cat]}
                </div>
                {catItems.map((item) => (
                  <ReviewLineItem key={item.product.id} item={item} />
                ))}
              </div>
            );
          })}
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between gap-2 border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center gap-2">
            <Image
              src="/shipping.svg"
              alt="Fast Shipping"
              width={41}
              height={41}
              className="shrink-0 object-contain"
            />
            <span className="text-[12px] min-[600px]:text-[18px] min-[1500px]:text-[14px] font-bold leading-tight text-gray-900">
              Fast Shipping
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[14px] text-[#8C8C8C] line-through leading-tight">
              ${shipping.compareAtPrice.toFixed(2)}
            </span>
            <span className="text-[12px] min-[600px]:text-[14px] font-bold leading-tight text-primary">
              FREE
            </span>
          </div>
        </div>
      </div>
      {/* Satisfaction & Totals section */}
      <div className="pt-4 border-t flex flex-col border-gray-200 mt-3 min-[980px]:pl-12.75 min-[1500px]:pl-0">
        <div className="flex flex-col min-[1500px]:flex-row items-center justify-between mb-4">
          {/* Satisfaction badge */}
          <div className="flex items-center gap-6">
            <div className="shrink-0 w-32.75 h-32.75 min-[1500px]:w-19.75 min-[1500px]:h-19.75 ">
              <Image
                src="/Satisfaction Badge-05 1.png"
                alt="100% Wyze satisfaction guarantee"
                width={131}
                height={131}
                className="shrink-0 w-full h-full"
              />
            </div>
            <div className=" min-[1500px]:hidden ">
              <span className="block text-[18px] mb-6 font-gilroy font-semibold leading-[110%] tracking-[0.6px] align-middle text-gray-900">
                30-day hassle-free returns
              </span>
              <span className="block text-[18px] font-gilroy font-normal leading-[110%] tracking-[0.6px] align-middle text-gray-900">
                If you're not totally in love with the product, we will refund you 100%.
              </span>
            </div>
          </div>


          {/* Pricing & Financing */}
          <div className="flex mt-4 justify-between items-center min-[1500px]:items-end w-full min-[1500px]:w-fit gap-1  min-[1500px]:flex-col">
            {/* Financing line */}
            <span className="bg-primary text-white font-gilroy font-normal px-2 py-1 h-fit min-[600px]:h-6.75 min-[1500px]:h-fit text-[12px] leading-none   flex items-center justify-center rounded-[3px]">
              as low as $17.19/mo
            </span>

            {/* Total */}
            <div className="flex justify-end items-baseline gap-2.5 pt-1 pb-1">
              <span className="text-[22px] font-gilroy font-medium text-[#8C8C8C] line-through">${compareAtTotal.toFixed(2)}</span>
              <span className="text-[24px] font-gilroy font-bold text-primary leading-8 tracking-[-0.0013em] text-right align-middle">
                ${subtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Savings callout */}

        <div className="flex flex-col items-center">
          {savings > 0 && (
            <div className="text-center mx-auto text-[14px] font-gilroy font-semibold text-[#0AA288] tracking-[-0.06px]">
              Congrats! You&apos;re saving ${savings.toFixed(2)} on your security bundle!
            </div>
          )}

          {/* Checkout button */}
          <button
            type="button"
            className="flex items-center justify-center w-full --w-121.5 h-13.5 rounded-md bg-primary text-white text-xl font-gilroy font-bold transition-colors hover:bg-[#3D22B1] cursor-pointer"
            onClick={handleCheckout}
          >
            Checkout
          </button>

          {/* Save link */}
          <button
            type="button"
            className="block w-full mt-2 text-[16px] font-gilroy font-light italic text-[#484848] underline text-center cursor-pointer transition-colors hover:text-primary-hover"
            onClick={handleSave}
          >
            {saved ? "✓ System saved!" : "Save my system for later"}
          </button>
        </div>

      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ReviewLineItem                                                     */
/* ------------------------------------------------------------------ */

function ReviewLineItem({ item }: { item: GroupedItem }) {
  const {
    incrementQuantity,
    decrementQuantity,
    selectedVariant,
    getQuantity,
    selections
  } = useBundleContext();

  const isPlan = item.product.isPlan;

  const handleIncrement = () => {
    const activeVariantId = selectedVariant[item.product.id] ?? (item.product.variants && item.product.variants.length > 0 ? item.product.variants[0].id : "_default");
    incrementQuantity(item.product.id, activeVariantId);
  };

  const handleDecrement = () => {
    const activeVariantId = selectedVariant[item.product.id] ?? (item.product.variants && item.product.variants.length > 0 ? item.product.variants[0].id : "_default");
    if (getQuantity(item.product.id, activeVariantId) > 0) {
      decrementQuantity(item.product.id, activeVariantId);
    } else {
      // Find another variant that currently has quantity > 0 and decrement it
      const prodSelections = selections[item.product.id] || {};
      const variantWithQty = Object.keys(prodSelections).find(vid => prodSelections[vid] > 0);
      if (variantWithQty) {
        decrementQuantity(item.product.id, variantWithQty);
      }
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      {/* Left: thumbnail + name */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {item.product.image && (
          <Image
            src={item.product.image}
            alt={item.product.name}
            width={41}
            height={41}
            className="rounded shrink-0 object-contain"
          />
        )}
        {isPlan && !item.product.image && (
          <Image
            src="/plan copy.svg"
            alt="Wyze Shield Logo"
            width={20}
            height={24}
            className="shrink-0 object-contain"
          />
        )}
        {!item.product.image && !isPlan && (
          <span className="flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </span>
        )}
        <span className="text-[12px] min-[600px]:text-[18px] min-[1500px]:text-[14px] font-medium leading-tight">
          {isPlan ? (
            <>
              <span className="font-bold text-gray-900">Cam </span>
              <span className="font-bold text-primary">Unlimited</span>
            </>
          ) : (
            <>{item.product.name}</>
          )}
        </span>
      </div>

      {/* Right: stepper + pricing */}
      <div className="flex items-center gap-2 shrink-0">
        {!isPlan && (
          <QuantityStepper
            quantity={item.quantity}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            compact
            locked={item.product.id === "wyze-sense-hub"}
          />
        )}
        <div className="flex flex-col items-end min-w-13.75">
          {item.lineCompareAtPrice != null && item.lineCompareAtPrice !== item.linePrice && (
            <span className="text-[12px] min-[600px]:text-[14px] line-through leading-tight text-[#8C8C8C]">
              ${item.lineCompareAtPrice.toFixed(2)}{isPlan ? "/mo" : ""}
            </span>
          )}
          <span className="text-[12px] min-[600px]:text-[14px] font-bold leading-tight text-primary">
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
