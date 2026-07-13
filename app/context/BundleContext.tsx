"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import productsData from "@/data/products.json";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Variant {
  id: string;
  label: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string | null;
  learnMoreUrl: string;
  badge: string | null;
  compareAtPrice: number | null;
  price: number;
  priceUnit?: string;
  priceLabel?: string;
  category: string;
  variants: Variant[];
  isPlan?: boolean;
}

export interface Step {
  id: string;
  stepNumber: number;
  title: string;
  icon: string;
  nextLabel: string | null;
  products: Product[];
}

// { productId: { variantId: quantity } }
export type Selections = Record<string, Record<string, number>>;

interface BundleContextValue {
  steps: Step[];
  activeStep: number;
  setActiveStep: (step: number) => void;
  selections: Selections;
  selectedVariant: Record<string, string>; // productId -> currently-active variantId
  setSelectedVariant: (productId: string, variantId: string) => void;
  getQuantity: (productId: string, variantId: string) => number;
  setQuantity: (productId: string, variantId: string, qty: number) => void;
  incrementQuantity: (productId: string, variantId: string) => void;
  decrementQuantity: (productId: string, variantId: string) => void;
  getStepSelectedCount: (stepIndex: number) => number;
  getSelectedItems: () => SelectedItem[];
  getSubtotal: () => number;
  getCompareAtTotal: () => number;
  getSavings: () => number;
  saveSystem: () => void;
  loadSystem: () => boolean;
  shipping: typeof productsData.shipping;
}

export interface SelectedItem {
  product: Product;
  variantId: string;
  variantLabel: string;
  quantity: number;
  linePrice: number;
  lineCompareAtPrice: number | null;
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

const BundleContext = createContext<BundleContextValue | null>(null);

export function useBundleContext() {
  const ctx = useContext(BundleContext);
  if (!ctx) throw new Error("useBundleContext must be used inside BundleProvider");
  return ctx;
}

function getDefaultVariant(product: Product): string {
  return product.variants.length > 0 ? product.variants[0].id : "_default";
}

export function BundleProvider({ children }: { children: React.ReactNode }) {
  const steps = productsData.steps as Step[];
  const shipping = productsData.shipping;

  /* ---------- State ---------- */
  const [activeStep, setActiveStep] = useState(0);
  const [selections, setSelections] = useState<Selections>(() => {
    return { ...productsData.initialSelections } as Selections;
  });

  // Track which variant chip is active per product
  const [selectedVariant, setSelectedVariantState] = useState<Record<string, string>>(() => {
    const sv: Record<string, string> = {};
    for (const step of steps) {
      for (const p of step.products) {
        // If the product has initial selections, pick the first variant with qty > 0
        const initial = productsData.initialSelections[p.id as keyof typeof productsData.initialSelections];
        if (initial) {
          const variantWithQty = Object.entries(initial).find(([, qty]) => qty > 0);
          if (variantWithQty) {
            sv[p.id] = variantWithQty[0];
            continue;
          }
        }
        sv[p.id] = getDefaultVariant(p);
      }
    }
    return sv;
  });

  /* ---------- Hydrate from localStorage on mount ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("wyze-bundle-saved");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.selections) setSelections(parsed.selections);
        if (parsed.selectedVariant) setSelectedVariantState(parsed.selectedVariant);
        if (typeof parsed.activeStep === "number") setActiveStep(parsed.activeStep);
      } catch {
        // ignore bad data
      }
    }
  }, []);

  /* ---------- Helpers ---------- */
  const setSelectedVariant = useCallback((productId: string, variantId: string) => {
    setSelectedVariantState((prev) => ({ ...prev, [productId]: variantId }));
  }, []);

  const getQuantity = useCallback(
    (productId: string, variantId: string) => {
      return selections[productId]?.[variantId] ?? 0;
    },
    [selections]
  );

  const setQuantity = useCallback((productId: string, variantId: string, qty: number) => {
    setSelections((prev) => {
      const prodSelections = { ...(prev[productId] || {}) };
      if (qty <= 0) {
        delete prodSelections[variantId];
      } else {
        prodSelections[variantId] = qty;
      }
      return { ...prev, [productId]: prodSelections };
    });
  }, []);

  const incrementQuantity = useCallback(
    (productId: string, variantId: string) => {
      const current = getQuantity(productId, variantId);
      setQuantity(productId, variantId, current + 1);
    },
    [getQuantity, setQuantity]
  );

  const decrementQuantity = useCallback(
    (productId: string, variantId: string) => {
      const current = getQuantity(productId, variantId);
      if (current > 0) {
        setQuantity(productId, variantId, current - 1);
      }
    },
    [getQuantity, setQuantity]
  );

  const getStepSelectedCount = useCallback(
    (stepIndex: number) => {
      const step = steps[stepIndex];
      if (!step) return 0;
      let count = 0;
      for (const p of step.products) {
        const prodSelections = selections[p.id];
        if (prodSelections) {
          const totalQty = Object.values(prodSelections).reduce((a, b) => a + b, 0);
          if (totalQty > 0) count++;
        }
      }
      return count;
    },
    [steps, selections]
  );

  const allProducts = useMemo(() => {
    const map = new Map<string, Product>();
    for (const step of steps) {
      for (const p of step.products) {
        map.set(p.id, p);
      }
    }
    return map;
  }, [steps]);

  const getSelectedItems = useCallback((): SelectedItem[] => {
    const items: SelectedItem[] = [];
    for (const [productId, variants] of Object.entries(selections)) {
      const product = allProducts.get(productId);
      if (!product) continue;
      for (const [variantId, qty] of Object.entries(variants)) {
        if (qty <= 0) continue;
        const variant = product.variants.find((v) => v.id === variantId);
        items.push({
          product,
          variantId,
          variantLabel: variant?.label ?? "",
          quantity: qty,
          linePrice: product.price * qty,
          lineCompareAtPrice: product.compareAtPrice ? product.compareAtPrice * qty : null,
        });
      }
    }
    return items;
  }, [selections, allProducts]);

  const getSubtotal = useCallback(() => {
    return getSelectedItems().reduce((sum, item) => sum + item.linePrice, 0);
  }, [getSelectedItems]);

  const getCompareAtTotal = useCallback(() => {
    const items = getSelectedItems();
    let total = 0;
    for (const item of items) {
      total += (item.lineCompareAtPrice ?? item.linePrice);
    }
    // Include shipping compare-at
    total += shipping.compareAtPrice;
    return total;
  }, [getSelectedItems, shipping]);

  const getSavings = useCallback(() => {
    const compare = getCompareAtTotal();
    const sub = getSubtotal();
    return compare - sub;
  }, [getCompareAtTotal, getSubtotal]);

  const saveSystem = useCallback(() => {
    const data = {
      selections,
      selectedVariant,
      activeStep,
    };
    localStorage.setItem("wyze-bundle-saved", JSON.stringify(data));
  }, [selections, selectedVariant, activeStep]);

  const loadSystem = useCallback((): boolean => {
    const saved = localStorage.getItem("wyze-bundle-saved");
    if (!saved) return false;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.selections) setSelections(parsed.selections);
      if (parsed.selectedVariant) setSelectedVariantState(parsed.selectedVariant);
      if (typeof parsed.activeStep === "number") setActiveStep(parsed.activeStep);
      return true;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo<BundleContextValue>(
    () => ({
      steps,
      activeStep,
      setActiveStep,
      selections,
      selectedVariant,
      setSelectedVariant,
      getQuantity,
      setQuantity,
      incrementQuantity,
      decrementQuantity,
      getStepSelectedCount,
      getSelectedItems,
      getSubtotal,
      getCompareAtTotal,
      getSavings,
      saveSystem,
      loadSystem,
      shipping,
    }),
    [
      steps,
      activeStep,
      selections,
      selectedVariant,
      setSelectedVariant,
      getQuantity,
      setQuantity,
      incrementQuantity,
      decrementQuantity,
      getStepSelectedCount,
      getSelectedItems,
      getSubtotal,
      getCompareAtTotal,
      getSavings,
      saveSystem,
      loadSystem,
      shipping,
    ]
  );

  return <BundleContext.Provider value={value}>{children}</BundleContext.Provider>;
}
