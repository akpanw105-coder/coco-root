"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  items: any[];
  shipping_address: any;
  payment_method: string;
  created_at: string;
}

interface AccountClientProps {
  user: User;
  profile: Profile | null;
  initialOrders?: Order[];
}

export function AccountClient({ user, profile, initialOrders = [] }: AccountClientProps) {
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);

    startTransition(async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) {
        setError(error.message);
      } else {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 3000);
      }
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const initial = fullName?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "U";
  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      {/* Header */}
      <div className="bg-[#14241B] text-[#FBF9F5]/80 text-[10px] font-light tracking-[0.2em] py-2 px-4 text-center border-b border-[#223B2D]">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span className="w-1 h-1 rounded-full bg-[#C4975C]/70" />
          <span className="uppercase">Artisan Cold-Pressed Botanical Formulations &bull; Rooted in Botanical Science</span>
          <span className="w-1 h-1 rounded-full bg-[#C4975C]/70" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#8DA394] hover:text-[#14241B] transition-colors mb-10"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 12H5m7 7l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Avatar + Name */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 rounded-full bg-[#14241B] text-[#FBF9F5] text-2xl font-serif font-normal flex items-center justify-center shrink-0 shadow-lg">
            {initial}
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#14241B] font-normal">
              {fullName || user.email}
            </h1>
            <p className="text-[11px] text-[#8DA394] uppercase tracking-[0.16em] mt-1">
              Member since {joinedDate}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-[#E6ECE8] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <svg width="18" height="18" fill="none" stroke="#C4975C" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="font-serif text-xl text-[#14241B] font-normal">Profile Details</h2>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.16em] text-[#8DA394] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl border border-[#E6ECE8] bg-[#FBF9F5] text-[#14241B] text-sm placeholder-[#C4B8A8] focus:outline-none focus:ring-2 focus:ring-[#14241B]/20 focus:border-[#14241B]/40 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.16em] text-[#8DA394] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email ?? ""}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-[#E6ECE8] bg-[#F4EFE6] text-[#8DA394] text-sm cursor-not-allowed"
                />
                <p className="mt-1.5 text-[11px] text-[#8DA394]">Email cannot be changed here.</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {saved && (
                <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Profile updated successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="px-7 py-3 rounded-full bg-[#14241B] text-[#FBF9F5] text-[11px] font-medium uppercase tracking-[0.16em] hover:bg-[#223B2D] disabled:opacity-60 transition-colors flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#FBF9F5]/30 border-t-[#FBF9F5] animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>

          {/* Acquisition Dossier & Purchase History Card */}
          <div className="bg-white rounded-2xl border border-[#E6ECE8] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F4EFE6]">
              <div className="flex items-center gap-3">
                <svg width="20" height="20" fill="none" stroke="#C4975C" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h2 className="font-serif text-xl text-[#14241B] font-normal">
                  Acquisition Dossier &amp; Orders
                </h2>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-[#8DA394] font-medium font-sans">
                {initialOrders.length} {initialOrders.length === 1 ? "Order" : "Orders"}
              </span>
            </div>

            {initialOrders.length === 0 ? (
              <div className="py-10 text-center">
                <p className="font-serif text-lg text-[#14241B]">No acquisitions recorded yet.</p>
                <p className="text-xs text-[#8DA394] font-light mt-1">
                  Explore our core botanical collection to begin your restorative hair wellness ritual.
                </p>
                <Link
                  href="/order"
                  className="mt-5 inline-block px-6 py-2.5 rounded-full bg-[#14241B] text-[#FBF9F5] text-[11px] font-semibold uppercase tracking-[0.16em] hover:bg-[#C4975C] transition-colors"
                >
                  Acquire Formulations
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {initialOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 rounded-xl border border-[#E6ECE8] bg-[#FBF9F5] hover:border-[#8DA394]/50 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E6ECE8]/70">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base text-[#14241B] font-medium">
                            {order.order_number}
                          </span>
                          <span
                            className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                              order.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending_payment"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-stone-200 text-stone-700"
                            }`}
                          >
                            {order.status === "confirmed"
                              ? "Confirmed & Allocated"
                              : order.status === "pending_payment"
                              ? "Awaiting Payment"
                              : order.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8DA394] mt-0.5">
                          Placed on {new Date(order.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })} &bull; Via {order.payment_method?.toUpperCase()}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase tracking-wider text-[#8DA394] block">
                          Total Remitted
                        </span>
                        <span className="font-serif text-lg font-semibold text-[#14241B]">
                          ₦{Number(order.total || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="space-y-2">
                      {(order.items || []).map((it: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-xs text-[#14241B]">
                          <span className="font-light">
                            {it.quantity}x {it.name} {it.volume ? `(${it.volume})` : ""}
                          </span>
                          <span className="font-serif font-medium">
                            ₦{Number((it.price || 0) * (it.quantity || 1)).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.shipping_address && (
                      <div className="pt-2 border-t border-[#E6ECE8]/50 text-[11px] text-[#8DA394]">
                        <span>Destination: </span>
                        <span className="text-[#14241B]">
                          {order.shipping_address.address}, {order.shipping_address.city},{" "}
                          {order.shipping_address.state}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Info Card */}
          <div className="bg-white rounded-2xl border border-[#E6ECE8] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <svg width="18" height="18" fill="none" stroke="#C4975C" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className="font-serif text-xl text-[#14241B] font-normal">Account Security</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-[#F4EFE6]">
                <div>
                  <p className="text-sm text-[#14241B] font-medium">Authentication Method</p>
                  <p className="text-[11px] text-[#8DA394] mt-0.5">
                    {user.app_metadata?.provider === "google" ? "Google OAuth" : "Email & Password"}
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#8DA394] bg-[#F4EFE6] px-3 py-1 rounded-full">
                  {user.app_metadata?.provider === "google" ? "Google" : "Email"}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-[#14241B] font-medium">Account ID</p>
                  <p className="text-[11px] text-[#8DA394] mt-0.5 font-mono">{user.id.slice(0, 8)}...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl border border-red-100 p-6 sm:p-8">
            <h2 className="font-serif text-xl text-red-500 font-normal mb-4">Danger Zone</h2>
            <p className="text-sm text-[#6B726C] font-light mb-5">
              Signing out will end your current session on this device.
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              className="px-7 py-3 rounded-full border border-red-200 text-red-500 text-[11px] font-medium uppercase tracking-[0.16em] hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
