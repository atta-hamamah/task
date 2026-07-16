"use client";

import React from "react";
import Image from "next/image";
import { useBundleContext, type Product } from "@/app/context/BundleContext";
import QuantityStepper from "./QuantityStepper";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    selectedVariant,
    setSelectedVariant,
    getQuantity,
    incrementQuantity,
    decrementQuantity,
    setQuantity,
    selections,
  } = useBundleContext();

  const hasVariants = product.variants ? product.variants.length > 0 : false;
  const activeVariantId = selectedVariant[product.id] ?? (hasVariants ? product.variants![0].id : "_default");
  const qty = getQuantity(product.id, activeVariantId);

  // Card is "selected" if ANY variant of this product has qty > 0
  const productSelections = selections[product.id] || {};
  const totalQty = Object.values(productSelections).reduce((a, b) => a + b, 0);
  const isSelected = totalQty > 0;

  return (
    <div
      onClick={
        product.isPlan
          ? () => {
              if (qty > 0) {
                setQuantity(product.id, activeVariantId, 0);
              } else {
                setQuantity(product.id, activeVariantId, 1);
              }
            }
          : undefined
      }
      className={`relative bg-white transition-all duration-200 flex items-center justify-center rounded-[10px] gap-4.75
          p-(--card-padding) [--card-padding:11px] flex-row max-[1500px]:h-82.5 
        max-[600px]:[--card-height:331.1px] [--card-height:159px]
        max-[1500px]:flex-col w-full
        ${product.isPlan ? "cursor-pointer select-none" : ""}
        ${isSelected ? "border-primary/70 border-2" : " "}`}
    >
      {/* Badge */}
      {product.badge && (
        <span className="absolute top-3 left-3 bg-primary text-white text-[11px] font-bold px-2.5 py-1 rounded-full z-10 tracking-wide">
          {product.badge}
        </span>
      )}

      {/* Product image */}
      {product.image && (
        <div className="flex items-center justify-center shrink-0 w-20 h-29.5 max-[600px]:w-full  max-[600px]:h-27.5">
          <Image
            src={product.image}
            alt={product.name}
            width={120}
            height={120}
            className="object-contain max-h-full max-w-full"
          />
        </div>
      )}

      {/* Content area */}
      <div className="flex flex-col justify-between flex-1 min-w-0 h-full w-full">
        <div className="min-w-0">
          {/* Title */}
          <h3 className="text-[15px] font-bold leading-tight mb-1 text-gray-900 truncate">
            {product.name}
          </h3>

          {/* Description & Learn More inline */}
          <p className="text-[13px] text-secondary leading-snug mb-1 line-clamp-2 max-[600px]:line-clamp-3">
            {product.description}{" "}
            <a href={product.learnMoreUrl} className="text-[13px] font-medium text-primary hover:underline inline-block">
              Learn More
            </a>
          </p>
        </div>

        {/* Variant chips */}
        {hasVariants && (
          <div className="flex gap-1.5 mb-1.5 flex-wrap">
            {product.variants!.map((v) => {
              const isActive = v.id === activeVariantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  className={`inline-flex items-center gap-0.75 w-16.25 h-6.5 rounded-xs border-[0.5px] pt-px pr-0.75 pb-px pl-0.75 font-medium cursor-pointer transition-colors text-[10px] leading-none shrink-0
                  ${isActive ? "border-[#0AA288] bg-[#1DF0BB0A]" : "border-[#CCCCCC]"}`}
                  onClick={() => setSelectedVariant(product.id, v.id)}
                  aria-label={`Select ${v.label}`}
                >
                  {v.image ? (
                    <Image
                      src={v.image}
                      alt={v.label}
                      width={20}
                      height={20}
                      className="object-contain shrink-0"
                    />
                  ) : (
                    <span
                      className="w-3 h-3 rounded-full border border-gray-300 shrink-0 ml-0.5"
                      style={{ backgroundColor: v.color }}
                    />
                  )}
                  <span className="leading-none truncate">{v.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Quantity + price row */}
        <div className="flex items-center justify-between pt-1">
          {product.isPlan ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (qty > 0) {
                  setQuantity(product.id, activeVariantId, 0);
                } else {
                  setQuantity(product.id, activeVariantId, 1);
                }
              }}
              className={`h-9 px-4 rounded-full text-[13px] font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                qty > 0
                  ? "bg-primary text-white hover:bg-primary/95"
                  : "border border-primary text-primary bg-transparent hover:bg-primary hover:text-white"
              }`}
            >
              {qty > 0 ? "Selected" : "Select"}
            </button>
          ) : (
            <QuantityStepper
              quantity={qty}
              onIncrement={() => incrementQuantity(product.id, activeVariantId)}
              onDecrement={() => decrementQuantity(product.id, activeVariantId)}
              locked={product.id === "wyze-sense-hub"}
            />
          )}
          <div className="flex flex-col items-end shrink-0">
            {product.compareAtPrice != null && (
              <span className="font-gilroy font-normal text-[16px] text-[#D8392B] line-through leading-none tracking-[0.6px] text-right align-middle mb-1">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
            <span className="font-gilroy font-normal text-[16px] leading-none tracking-[0.6px] text-right align-middle text-gray-900">
              {product.priceLabel ? product.priceLabel : `$${product.price.toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
