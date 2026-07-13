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
    selections,
  } = useBundleContext();

  const hasVariants = product.variants.length > 0;
  const activeVariantId = selectedVariant[product.id] ?? (hasVariants ? product.variants[0].id : "_default");
  const qty = getQuantity(product.id, activeVariantId);

  // Card is "selected" if ANY variant of this product has qty > 0
  const productSelections = selections[product.id] || {};
  const totalQty = Object.values(productSelections).reduce((a, b) => a + b, 0);
  const isSelected = totalQty > 0;

  return (
    <div
      className={` relative border-2 rounded-xl p-4 bg-white transition-all duration-200 flex
        ${isSelected ? "border-primary shadow-[0_0_0_1px_var(--color-primary)]" : "border-gray-200"}`}
    >
      {/* Badge */}
      {product.badge && (
        <span className="absolute top-3 left-3 bg-primary text-white text-[11px] font-bold px-2.5 py-1 rounded-full z-10 tracking-wide">
          {product.badge}
        </span>
      )}

      {/* Product image */}
      {product.image && (
        <div className="flex items-center justify-center h-[140px] mb-3">
          <Image
            src={product.image}
            alt={product.name}
            width={140}
            height={140}
            style={{ objectFit: "contain" }}
          />
        </div>
      )}
      <div className="">
        {/* Title */}
        <h3 className="text-[15px] font-bold leading-tight mb-1">{product.name}</h3>

        {/* Description */}
        <p className="text-[13px] text-secondary leading-snug mb-1">{product.description}</p>

        {/* Learn More */}
        <a href={product.learnMoreUrl} className="text-[13px] font-medium text-primary mb-3 inline-block">
          Learn More
        </a>

        {/* Variant chips */}
        {hasVariants && (
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {product.variants.map((v) => {
              const isActive = v.id === activeVariantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  className={`inline-flex items-center gap-[5px] px-2.5 pl-1.5 py-1 border-[1.5px] rounded-full text-xs font-medium bg-white cursor-pointer transition-colors
                  ${isActive ? "border-primary bg-primary-light" : "border-gray-200"}`}
                  onClick={() => setSelectedVariant(product.id, v.id)}
                  aria-label={`Select ${v.label}`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"
                    style={{ backgroundColor: v.color }}
                  />
                  <span className="leading-none">{v.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Quantity + price row */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <QuantityStepper
            quantity={qty}
            onIncrement={() => incrementQuantity(product.id, activeVariantId)}
            onDecrement={() => decrementQuantity(product.id, activeVariantId)}
          />
          <div className="flex flex-col items-end">
            {product.compareAtPrice != null && (
              <span className="text-[13px] text-danger line-through">${product.compareAtPrice.toFixed(2)}</span>
            )}
            <span className="text-[15px] font-bold text-gray-900">
              {product.priceLabel ? product.priceLabel : `$${product.price.toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
