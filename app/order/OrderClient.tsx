"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Product } from "../data/brand-data";
import type { User } from "@supabase/supabase-js";

interface OrderItem extends Product {
  quantity: number;
}

interface OrderClientProps {
  user: User | null;
  initialProfile: { full_name?: string; email?: string } | null;
  catalogProducts: Product[];
}

export function OrderClient({
  user,
  initialProfile,
  catalogProducts,
}: OrderClientProps) {
  // Items in bag for the order (default to pre-populating with signature serum or elixir)
  const [items, setItems] = useState<OrderItem[]>([
    { ...catalogProducts[0], quantity: 1 },
    { ...catalogProducts[2], quantity: 1 },
  ]);

  const searchParams = useSearchParams();

  // Customer & Shipping Form State
  const defaultNames = (initialProfile?.full_name || user?.user_metadata?.full_name || "").split(" ");
  const [formData, setFormData] = useState({
    firstName: defaultNames[0] || "",
    lastName: defaultNames.slice(1).join(" ") || "",
    email: initialProfile?.email || user?.email || "",
    phone: "",
    address: "Plot 12B, Admiralty Way",
    apartment: "Penthouse Suite",
    city: "Lekki Phase 1",
    state: "Lagos",
    postalCode: "105102",
    country: "Nigeria",
  });

  // Shipping Method (Naira currency)
  const [shippingMethod, setShippingMethod] = useState<"complimentary" | "express" | "courier">("complimentary");

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "concierge">("stripe");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [isPackagingEco, setIsPackagingEco] = useState(true);

  // Submission / Confirmation State
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    deliveryDate: string;
    amountPaid?: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check for returning Stripe Checkout redirect
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const orderNumber = searchParams.get("order_number");
    const status = searchParams.get("status");

    if (status === "cancelled") {
      setErrorMessage("Your Stripe payment session was cancelled. You may adjust your details and try again.");
    } else if (sessionId && status === "success") {
      setIsSubmitting(true);
      fetch(`/api/checkout/verify?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.paid) {
            setConfirmedOrder({
              orderNumber: data.order?.order_number || orderNumber || "CR-CONFIRMED",
              deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
              amountPaid: data.order?.total || total,
            });
          } else {
            setErrorMessage("Payment verification is pending or incomplete. Please check your bank status.");
          }
        })
        .catch(() => {
          // Fallback confirmation display if network delayed
          setConfirmedOrder({
            orderNumber: orderNumber || "CR-CONFIRMED",
            deliveryDate: "In 2-3 Business Days",
          });
        })
        .finally(() => setIsSubmitting(false));
    }
  }, [searchParams]);

  // Calculations in Naira (₦)
  const subtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const shippingCost = shippingMethod === "complimentary" ? 0 : shippingMethod === "express" ? 5000 : 15000;
  const discountAmount = appliedPromo === "BOTANICAL15" ? Math.round(subtotal * 0.15) : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  // Quantity controllers
  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const addCatalogProduct = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "BOTANICAL15") {
      setAppliedPromo("BOTANICAL15");
      setErrorMessage(null);
    } else {
      setErrorMessage("Promo code not recognized. Try 'BOTANICAL15' for 15% VIP privilege.");
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage("Please select at least one botanical formulation to place an order.");
      return;
    }
    if (!formData.firstName || !formData.email || !formData.address) {
      setErrorMessage("Please provide complete shipping recipient details.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const shippingTierTitles: Record<string, string> = {
      complimentary: "Complimentary Carbon-Neutral Ground",
      express: "Priority Air Botanical Expedited (₦5,000)",
      courier: "Same-Day Concierge White-Glove (₦15,000)",
    };

    try {
      if (paymentMethod === "stripe") {
        // Create Stripe Checkout Session in Nigerian Naira (NGN)
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              id: i.id,
              name: i.name,
              quantity: i.quantity,
              price: i.price,
              volume: i.volume,
              image: i.image,
            })),
            customer: formData,
            subtotal,
            shipping: shippingCost,
            shippingTierTitle: shippingTierTitles[shippingMethod],
            discount: discountAmount,
            total,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Unable to initialize Stripe checkout.");
        }

        if (data.checkoutUrl) {
          // Billion-dollar company experience: smooth transition to Stripe's secure checkout
          window.location.href = data.checkoutUrl;
          return;
        } else {
          throw new Error("No checkout URL returned from payment server.");
        }
      } else {
        // VIP Concierge / Direct Wire Booking
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              id: i.id,
              name: i.name,
              quantity: i.quantity,
              price: i.price,
              volume: i.volume,
            })),
            customer: formData,
            subtotal,
            shipping: shippingCost,
            discount: discountAmount,
            total,
            paymentMethod: "concierge",
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Unable to reserve acquisition.");
        }

        setConfirmedOrder({
          orderNumber: data.orderNumber,
          deliveryDate: data.estimatedDelivery,
          amountPaid: total,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Order processing failure.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS / CONFIRMATION SCREEN
  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] text-[#14241B] flex flex-col justify-between">
        {/* Top Minimal Brand Bar */}
        <header className="border-b border-[#E6ECE8] py-6 px-8 bg-white/70 backdrop-blur-md">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl tracking-[0.25em] text-[#14241B] uppercase">
              COCO ROOTS
            </Link>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#8DA394] font-medium">
              Acquisition Confirmed
            </span>
          </div>
        </header>

        {/* Confirmation Hero Card */}
        <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24 w-full">
          <div className="relative rounded-3xl p-8 sm:p-14 bg-white border border-[#E6ECE8] shadow-[0_30px_70px_-20px_rgba(20,36,27,0.12)] text-center overflow-hidden">
            {/* Atmospheric background aura */}
            <div
              className="absolute -top-32 -left-32 w-80 h-80 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(196,151,92,0.18) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(20,36,27,0.1) 0%, transparent 70%)",
              }}
            />

            {/* Checkmark Crest Badge */}
            <div className="w-20 h-20 mx-auto rounded-full bg-[#14241B] text-[#C4975C] flex items-center justify-center shadow-xl mb-6 relative">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="absolute -inset-1 rounded-full border border-[#C4975C]/40 animate-ping opacity-30" />
            </div>

            <span className="text-[11px] uppercase tracking-[0.28em] text-[#C4975C] font-semibold">
              Order Confirmed &amp; Allocating
            </span>

            <h1 className="mt-3 font-serif text-3xl sm:text-5xl text-[#14241B] font-normal tracking-tight">
              Thank You for Your Patronage
            </h1>

            <p className="mt-4 text-sm sm:text-base text-[#6B726C] max-w-lg mx-auto leading-relaxed font-light">
              Your botanical formulas are being hand-inspected and sealed in our climate-controlled lab. A confirmation dossier has been dispatched to{" "}
              <strong className="text-[#14241B] font-medium">{formData.email}</strong>.
            </p>

            {/* Order Dossier Details */}
            <div className="mt-10 p-6 rounded-2xl bg-[#FBF9F5] border border-[#E6ECE8] text-left grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8DA394] font-medium block">
                  Reference
                </span>
                <span className="font-serif text-lg text-[#14241B] font-semibold mt-1 block">
                  {confirmedOrder.orderNumber}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8DA394] font-medium block">
                  Estimated Arrival
                </span>
                <span className="font-serif text-lg text-[#14241B] font-semibold mt-1 block">
                  {confirmedOrder.deliveryDate}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8DA394] font-medium block">
                  White-Glove Status
                </span>
                <span className="text-xs text-[#228B22] font-semibold mt-1 block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#228B22] animate-pulse" />
                  Courier Assigned
                </span>
              </div>
            </div>

            {/* Purchased Items Recap */}
            <div className="mt-8 text-left border-t border-[#E6ECE8] pt-6">
              <h3 className="text-xs uppercase tracking-[0.16em] text-[#14241B] font-semibold mb-4">
                Reserved Formulations ({items.length})
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#F4EFE6] border border-[#E6ECE8]">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-serif text-base text-[#14241B]">{item.name}</p>
                        <p className="text-[10px] text-[#8DA394] uppercase tracking-wider">
                          Qty: {item.quantity} &bull; {item.volume}
                        </p>
                      </div>
                    </div>
                    <span className="font-serif text-base font-semibold text-[#14241B]">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-[#E6ECE8] flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider text-[#8DA394]">Total Remitted</span>
                <span className="font-serif text-2xl text-[#14241B] font-semibold">
                  ₦{(confirmedOrder.amountPaid || total).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/account"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#14241B] text-[#FBF9F5] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#C4975C] transition-colors"
              >
                View in My Account
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[#14241B]/20 text-[#14241B] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-black/5 transition-colors"
              >
                Return to Gallery
              </Link>
            </div>
          </div>
        </main>

        <footer className="border-t border-[#E6ECE8] py-8 text-center text-xs text-[#8DA394] uppercase tracking-[0.2em]">
          Coco Roots &bull; Botanical Luxury Grooming
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#14241B]">
      {/* Top Banner */}
      <div className="bg-[#14241B] text-[#FBF9F5]/90 text-[10px] tracking-[0.22em] uppercase py-2.5 px-4 text-center border-b border-[#223B2D] flex items-center justify-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C4975C] animate-pulse" />
        <span>Boutique Acquisition &bull; Bespoke Botanical Packaging &bull; Complimentary Secured Courier</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#C4975C] animate-pulse" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E6ECE8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <span className="font-serif text-2xl tracking-[0.25em] text-[#14241B] uppercase font-normal leading-none">
              COCO ROOTS
            </span>
            <span className="text-[9px] tracking-[0.35em] uppercase text-[#8DA394] mt-1 font-medium">
              Private Checkout
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[11px] uppercase tracking-[0.16em] text-[#8DA394] hover:text-[#14241B] transition-colors flex items-center gap-1.5 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 19l-7-7 7-7" />
              </svg>
              Return to Collection
            </Link>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#14241B]/5 border border-[#14241B]/10 text-[10px] uppercase tracking-wider text-[#14241B] font-medium">
              <svg className="w-3.5 h-3.5 text-[#C4975C]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              256-Bit SSL Encrypted
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CHECKOUT CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10 lg:py-16">
        {/* Page Title & Breadcrumb */}
        <div className="mb-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#C4975C] font-semibold mb-2">
            <span>Direct From Formulation Atelier</span>
            <span>&bull;</span>
            <span>Express Fulfillment</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#14241B] font-normal tracking-tight">
            Acquisition &amp; Order Dossier
          </h1>
          <p className="mt-2 text-sm text-[#6B726C] font-light max-w-xl">
            Confirm your formulation selection, customize packaging ritual preferences, and complete your secured acquisition below.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-800 text-xs font-semibold">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: CHECKOUT FORMS (7 COLS) */}
          <div className="lg:col-span-7 space-y-10">
            {/* STEP 1: RECIPIENT INFORMATION */}
            <section className="bg-white rounded-3xl p-7 sm:p-9 border border-[#E6ECE8] shadow-[0_10px_35px_-10px_rgba(20,36,27,0.05)]">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F4EFE6]">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#14241B] text-[#FBF9F5] text-xs font-serif font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="font-serif text-2xl text-[#14241B]">Recipient &amp; Delivery Destination</h2>
                </div>
                <span className="text-[11px] text-[#228B22] font-semibold uppercase tracking-wider flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-[#228B22] animate-pulse" />
                  Verified Member
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#8DA394] font-medium mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E6ECE8] text-sm text-[#14241B] bg-[#FBF9F5]/40 focus:outline-none focus:border-[#14241B] transition-colors"
                    placeholder="Eleanor"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#8DA394] font-medium mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E6ECE8] text-sm text-[#14241B] bg-[#FBF9F5]/40 focus:outline-none focus:border-[#14241B] transition-colors"
                    placeholder="Vanderbilt"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#8DA394] font-medium mb-1.5">
                    Email Address (For Tracking &amp; Dossier)
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E6ECE8] text-sm text-[#14241B] bg-[#FBF9F5]/40 focus:outline-none focus:border-[#14241B] transition-colors"
                    placeholder="eleanor@atelier.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#8DA394] font-medium mb-1.5">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E6ECE8] text-sm text-[#14241B] bg-[#FBF9F5]/40 focus:outline-none focus:border-[#14241B] transition-colors"
                    placeholder="740 Park Avenue"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#8DA394] font-medium mb-1.5">
                    Suite / Apt
                  </label>
                  <input
                    type="text"
                    value={formData.apartment}
                    onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E6ECE8] text-sm text-[#14241B] bg-[#FBF9F5]/40 focus:outline-none focus:border-[#14241B] transition-colors"
                    placeholder="Penthouse 14B"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#8DA394] font-medium mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E6ECE8] text-sm text-[#14241B] bg-[#FBF9F5]/40 focus:outline-none focus:border-[#14241B] transition-colors"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#8DA394] font-medium mb-1.5">
                    State / Region
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E6ECE8] text-sm text-[#14241B] bg-[#FBF9F5]/40 focus:outline-none focus:border-[#14241B] transition-colors"
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#8DA394] font-medium mb-1.5">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E6ECE8] text-sm text-[#14241B] bg-[#FBF9F5]/40 focus:outline-none focus:border-[#14241B] transition-colors"
                    placeholder="10021"
                  />
                </div>
              </div>
            </section>

            {/* STEP 2: WHITE-GLOVE SHIPPING TIER */}
            <section className="bg-white rounded-3xl p-7 sm:p-9 border border-[#E6ECE8] shadow-[0_10px_35px_-10px_rgba(20,36,27,0.05)]">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#F4EFE6]">
                <span className="w-7 h-7 rounded-full bg-[#14241B] text-[#FBF9F5] text-xs font-serif font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="font-serif text-2xl text-[#14241B]">Fulfillment &amp; Courier Protocol</h2>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    id: "complimentary",
                    title: "Complimentary Carbon-Neutral Courier",
                    desc: "Handled with temperature preservation • 3-5 Business Days Nationwide",
                    cost: "₦0",
                    badge: "Included",
                  },
                  {
                    id: "express",
                    title: "Priority Air Botanical Expedited",
                    desc: "Guaranteed insulated transit & signature confirmation • 1-2 Days",
                    cost: "₦5,000",
                    badge: "Fastest",
                  },
                  {
                    id: "courier",
                    title: "Same-Day Concierge White-Glove",
                    desc: "Dedicated luxury courier with scheduled handoff (Lagos & Abuja Metro)",
                    cost: "₦15,000",
                    badge: "Exclusive",
                  },
                ].map((tier) => (
                  <label
                    key={tier.id}
                    onClick={() => setShippingMethod(tier.id as any)}
                    className={`flex items-center justify-between p-4.5 rounded-2xl border cursor-pointer transition-all ${
                      shippingMethod === tier.id
                        ? "border-[#14241B] bg-[#14241B]/5 ring-1 ring-[#14241B]"
                        : "border-[#E6ECE8] hover:border-[#8DA394]/50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          shippingMethod === tier.id
                            ? "border-[#14241B] bg-[#14241B]"
                            : "border-stone-300"
                        }`}
                      >
                        {shippingMethod === tier.id && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-serif text-base text-[#14241B] font-medium">{tier.title}</p>
                          <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#C4975C]/15 text-[#C4975C]">
                            {tier.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B726C] font-light mt-0.5">{tier.desc}</p>
                      </div>
                    </div>
                    <span className="font-serif text-base font-semibold text-[#14241B]">
                      {tier.cost}
                    </span>
                  </label>
                ))}
              </div>

              {/* Bespoke Packaging Ritual Option */}
              <div className="mt-6 pt-5 border-t border-[#F4EFE6] flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#14241B]">
                    Signature Embossed Eco-Linen Gift Box
                  </p>
                  <p className="text-xs text-[#8DA394] font-light">
                    Hand-tied raw cotton ribbon with seeded paper botanical note.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPackagingEco(!isPackagingEco)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    isPackagingEco ? "bg-[#14241B]" : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPackagingEco ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </section>

            {/* STEP 3: PAYMENT METHOD */}
            <section className="bg-white rounded-3xl p-7 sm:p-9 border border-[#E6ECE8] shadow-[0_10px_35px_-10px_rgba(20,36,27,0.05)]">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#F4EFE6]">
                <span className="w-7 h-7 rounded-full bg-[#14241B] text-[#FBF9F5] text-xs font-serif font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="font-serif text-2xl text-[#14241B]">Secured Payment &amp; Remittance</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  {
                    id: "stripe",
                    label: "Stripe Secure Checkout",
                    sub: "Cards, Apple Pay & Bank Remittance in ₦",
                    icon: "🛡️",
                    badge: "Instant Allocation",
                  },
                  {
                    id: "concierge",
                    label: "VIP Concierge Protocol",
                    sub: "Direct Wire Transfer & Invoicing",
                    icon: "🏛️",
                    badge: "Private Client",
                  },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === pm.id
                        ? "border-[#14241B] bg-[#14241B] text-[#FBF9F5] shadow-lg ring-1 ring-[#14241B]"
                        : "border-[#E6ECE8] text-[#14241B] hover:border-[#8DA394]/40 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{pm.icon}</span>
                      <span
                        className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                          paymentMethod === pm.id
                            ? "bg-[#C4975C] text-[#14241B]"
                            : "bg-[#F4EFE6] text-[#8DA394]"
                        }`}
                      >
                        {pm.badge}
                      </span>
                    </div>
                    <span className="text-xs font-serif font-semibold tracking-wide block">
                      {pm.label}
                    </span>
                    <span
                      className={`text-[11px] block mt-0.5 font-light ${
                        paymentMethod === pm.id ? "text-[#FBF9F5]/70" : "text-[#6B726C]"
                      }`}
                    >
                      {pm.sub}
                    </span>
                  </button>
                ))}
              </div>

              {paymentMethod === "stripe" && (
                <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-[#E6ECE8] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#228B22] animate-pulse" />
                      <span className="text-xs uppercase font-semibold tracking-wider text-[#14241B]">
                        Stripe Global Encryption Protocol
                      </span>
                    </div>
                    <span className="text-[10px] text-[#8DA394] uppercase tracking-widest font-mono">
                      PCI-DSS Level 1
                    </span>
                  </div>
                  <p className="text-xs text-[#6B726C] font-light leading-relaxed">
                    When you click <strong>Complete Acquisition</strong> below, you will be redirected to Stripe's secure checkout page to finalize payment in <strong>Nigerian Naira (₦)</strong> via credit/debit card, Apple Pay, Google Pay, or direct bank transfer.
                  </p>
                  <div className="flex items-center gap-4 pt-2 border-t border-[#E6ECE8] text-[11px] text-[#8DA394]">
                    <span className="flex items-center gap-1">🔒 256-Bit SSL Protection</span>
                    <span>&bull;</span>
                    <span>Instant Order Confirmation</span>
                    <span>&bull;</span>
                    <span>Zero Data Retained Locally</span>
                  </div>
                </div>
              )}

              {paymentMethod === "concierge" && (
                <div className="p-6 rounded-2xl bg-[#14241B] text-[#FBF9F5] border border-[#C4975C]/30 text-center">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#C4975C] font-semibold block mb-1">
                    Private Client Services
                  </span>
                  <p className="font-serif text-xl text-[#FBF9F5]">Direct Invoicing &amp; Wire Transfer</p>
                  <p className="text-xs text-[#FBF9F5]/70 font-light mt-2 max-w-md mx-auto leading-relaxed">
                    A dedicated Coco Roots concierge specialist will immediately coordinate with your office to provide authenticated bank coordinates and schedule dispatch.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY DOSSIER & SUBMIT BUTTON (5 COLS) */}
          <div className="lg:col-span-5 space-y-8 sticky top-28">
            <div className="bg-white rounded-3xl p-7 sm:p-9 border border-[#E6ECE8] shadow-[0_20px_50px_-15px_rgba(20,36,27,0.1)] relative overflow-hidden order-glow-border">
              {/* Subtle gold ribbon top edge */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#14241B] via-[#C4975C] to-[#14241B]" />

              <div className="flex items-center justify-between pb-4 border-b border-[#F4EFE6] mb-6">
                <h3 className="font-serif text-2xl text-[#14241B]">Order Bag Dossier</h3>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C4975C] font-semibold">
                  {items.reduce((acc, i) => acc + i.quantity, 0)} Items Selected
                </span>
              </div>

              {/* Items in Bag List */}
              <div className="divide-y divide-[#F4EFE6] max-h-80 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#8DA394]">
                    Your bag is empty. Please add a formulation below.
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="py-4 flex gap-4 items-center">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#F4EFE6] border border-[#E6ECE8]">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-base text-[#14241B] truncate">{item.name}</h4>
                        <p className="text-[10px] text-[#8DA394] uppercase tracking-wider">{item.volume}</p>
                        <p className="text-xs text-[#C4975C] font-semibold mt-0.5">
                          ₦{item.price.toLocaleString()} each
                        </p>
                      </div>
                      {/* Qty changer */}
                      <div className="flex items-center gap-2 border border-[#E6ECE8] rounded-full px-2.5 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-[#14241B] text-sm hover:text-red-500 font-bold px-1"
                        >
                          &minus;
                        </button>
                        <span className="text-xs font-semibold text-[#14241B] min-w-[12px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-[#14241B] text-sm hover:text-[#C4975C] font-bold px-1"
                        >
                          &#43;
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Catalog Upsell / Add more formulations */}
              <div className="mt-4 pt-4 border-t border-[#F4EFE6]">
                <p className="text-[11px] uppercase tracking-wider text-[#8DA394] font-medium mb-2.5">
                  Enhance Your Ritual With:
                </p>
                <div className="space-y-2">
                  {catalogProducts
                    .filter((p) => !items.some((i) => i.id === p.id))
                    .map((extra) => (
                      <div
                        key={extra.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#FBF9F5] border border-[#E6ECE8]"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-[#14241B]">
                            <Image src={extra.image} alt={extra.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-serif text-[#14241B]">{extra.name}</p>
                            <p className="text-[10px] text-[#C4975C]">₦{extra.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => addCatalogProduct(extra)}
                          className="text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-[#14241B] text-[#FBF9F5] hover:bg-[#C4975C] transition-colors"
                        >
                          Add +
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* VIP Promo Code */}
              <form onSubmit={applyPromo} className="mt-6 pt-4 border-t border-[#F4EFE6] flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="VIP Privilege Code"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#E6ECE8] text-xs text-[#14241B] uppercase tracking-wider focus:outline-none focus:border-[#14241B]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#14241B] text-[#FBF9F5] text-xs uppercase font-semibold tracking-wider hover:bg-[#223B2D] transition-colors"
                >
                  Apply
                </button>
              </form>
              {appliedPromo && (
                <p className="text-[11px] text-[#228B22] font-semibold mt-1.5 flex items-center gap-1">
                  ✓ 15% VIP Botanical Privilege applied
                </p>
              )}

              {/* Price Calculation breakdown */}
              <div className="mt-6 pt-4 border-t border-[#F4EFE6] space-y-2 text-xs">
                <div className="flex justify-between text-[#6B726C]">
                  <span>Subtotal</span>
                  <span className="font-serif text-sm text-[#14241B] font-medium">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#228B22]">
                    <span>VIP Privilege (15%)</span>
                    <span>&minus;₦{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6B726C]">
                  <span>Courier &amp; Temperature Control</span>
                  <span className="font-serif text-sm text-[#14241B] font-medium">
                    {shippingCost === 0 ? "Complimentary" : `₦${shippingCost.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#6B726C]">
                  <span>Atelier Packaging Ritual</span>
                  <span className="text-[#228B22] font-medium">Included</span>
                </div>
                <div className="pt-3 border-t border-[#14241B]/10 flex justify-between items-baseline">
                  <span className="font-serif text-base text-[#14241B] uppercase tracking-wider font-semibold">
                    Grand Total
                  </span>
                  <span className="font-serif text-3xl text-[#14241B] font-semibold">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Complete Acquisition CTA */}
              <button
                type="button"
                onClick={handleSubmitOrder}
                disabled={isSubmitting || items.length === 0}
                className="w-full mt-7 py-4 rounded-full bg-[#14241B] text-[#FBF9F5] text-xs font-semibold uppercase tracking-[0.2em] shadow-[0_12px_30px_-8px_rgba(20,36,27,0.4)] hover:bg-[#C4975C] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 luxury-shimmer hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <>
                    <span className="auth-spinner" />
                    <span>Allocating Formulations...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Acquisition</span>
                    <span>&bull;</span>
                    <span>₦{total.toLocaleString()}</span>
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-[#8DA394] uppercase tracking-widest text-center">
                <span>30-Day Ritual Guarantee</span>
                <span>&bull;</span>
                <span>Cold-Pressed Lab Freshness</span>
              </div>
            </div>

            {/* Prestige Heritage Trust Card */}
            <div className="rounded-2xl p-6 bg-[#F4EFE6] border border-[#E6ECE8] text-center">
              <span className="font-serif text-lg text-[#14241B] block font-normal">
                The Coco Roots Quality Seal
              </span>
              <p className="mt-2 text-xs text-[#6B726C] font-light leading-relaxed">
                Every bottle is filled in micro-batches and sealed under nitrogen to protect raw botanical lipid bonds. If your scalp and hair do not transform within 30 days, receive an effortless full refund.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
