"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthModal } from "./AuthModal";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
}

export function Header({ cartCount = 0, onCartClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const supabase = createClient();

  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    // Check URL search params for auth trigger
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("auth") === "signin") {
        const redirectedFrom = params.get("redirect");
        if (redirectedFrom === "/order") {
          setAuthNotice("Please sign in or create an account to proceed with your order.");
          setReturnUrl("/order");
        }
        setAuthOpen(true);
        // Clean URL without refresh
        const url = new URL(window.location.href);
        url.searchParams.delete("auth");
        url.searchParams.delete("redirect");
        window.history.replaceState({}, "", url.toString());
      }
    }

    // Get initial session
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
  };

  const userInitial = user?.user_metadata?.full_name?.[0]?.toUpperCase()
    ?? user?.email?.[0]?.toUpperCase()
    ?? "U";

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#14241B] text-[#FBF9F5]/85 text-[10px] font-light tracking-[0.22em] py-2.5 px-4 text-center border-b border-[#223B2D]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span className="w-1 h-1 rounded-full bg-[#C4975C]" />
          <span className="uppercase">Cold-Pressed Botanical Lipids &bull; Scalp-First Hair Wellness</span>
          <span className="w-1 h-1 rounded-full bg-[#C4975C]" />
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E6ECE8]/90 transition-all shadow-[0_4px_24px_-12px_rgba(20,36,27,0.06)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          {/* Left Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-10 text-[11px] font-medium tracking-[0.16em] uppercase text-[#14241B]/70">
            <Link
              href="#products"
              className="hover:text-[#14241B] transition-colors duration-200 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#C4975C] after:transition-all after:duration-300 hover:after:w-full"
            >
              Collection
            </Link>
            <Link
              href="#philosophy"
              className="hover:text-[#14241B] transition-colors duration-200 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#C4975C] after:transition-all after:duration-300 hover:after:w-full"
            >
              Botanical Science
            </Link>
            <Link
              href="#story"
              className="hover:text-[#14241B] transition-colors duration-200 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#C4975C] after:transition-all after:duration-300 hover:after:w-full"
            >
              Our Story
            </Link>
          </nav>

          {/* Wordmark */}
          <Link
            href="/"
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
          >
            <span className="font-serif text-2xl sm:text-[28px] tracking-[0.25em] text-[#14241B] uppercase font-normal leading-none group-hover:text-[#3A2E28] transition-colors">
              COCO ROOTS
            </span>
            <span className="text-[9px] tracking-[0.35em] uppercase text-[#8DA394] mt-1.5 font-medium font-sans">
              Botanical Care
            </span>
          </Link>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/order"
              id="header-order-now-btn"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-semibold px-5 py-2.5 rounded-full bg-[#14241B] text-[#FBF9F5] hover:bg-[#C4975C] transition-all shadow-[0_4px_16px_-4px_rgba(20,36,27,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(196,151,92,0.4)] hover:-translate-y-0.5"
            >
              <span>Order Now</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            {/* Auth button / User avatar */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  id="user-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="Account menu"
                  className="w-9 h-9 rounded-full bg-[#14241B] text-[#FBF9F5] text-[13px] font-semibold flex items-center justify-center hover:bg-[#C4975C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#14241B]/30"
                >
                  {userInitial}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-[#E6ECE8] shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-[#F4EFE6]">
                      <p className="text-[11px] text-[#8DA394] uppercase tracking-widest">Signed in as</p>
                      <p className="text-xs text-[#14241B] font-medium truncate mt-0.5">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-[#14241B] hover:bg-[#F4EFE6] transition-colors"
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Account
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                id="header-signin-btn"
                onClick={() => setAuthOpen(true)}
                className="hidden sm:flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] font-medium text-[#14241B]/70 hover:text-[#14241B] transition-colors"
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Sign In
              </button>
            )}

            {/* Shopping Bag Icon */}
            <button
              type="button"
              onClick={onCartClick}
              aria-label={`Shopping bag containing ${cartCount} items`}
              className="relative p-2 text-[#14241B] hover:text-[#C4975C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#14241B]/20 rounded-full"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#14241B] text-[#FBF9F5] text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="md:hidden p-2 text-[#14241B] focus:outline-none focus:ring-2 focus:ring-[#14241B]/20 rounded-lg"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FBF9F5] border-t border-[#E6ECE8] px-6 py-8 shadow-xl animate-in slide-in-from-top-2 duration-300">
            <nav className="flex flex-col gap-6 text-lg font-serif tracking-wider text-[#14241B]">
              <Link href="#products" onClick={() => setMobileMenuOpen(false)} className="py-1 border-b border-[#E6ECE8]/60 hover:text-[#C4975C] transition-colors">Collection</Link>
              <Link href="#philosophy" onClick={() => setMobileMenuOpen(false)} className="py-1 border-b border-[#E6ECE8]/60 hover:text-[#C4975C] transition-colors">Philosophy &amp; Ingredients</Link>
              <Link href="#story" onClick={() => setMobileMenuOpen(false)} className="py-1 border-b border-[#E6ECE8]/60 hover:text-[#C4975C] transition-colors">Our Story</Link>
              <Link href="#ritual" onClick={() => setMobileMenuOpen(false)} className="py-1 border-b border-[#E6ECE8]/60 hover:text-[#C4975C] transition-colors">Product Experience</Link>
              <Link href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#C4975C] transition-colors">Contact &amp; Newsletter</Link>
              <Link
                href="/order"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 mt-2 rounded-full bg-[#14241B] text-[#FBF9F5] text-[11px] font-medium uppercase tracking-[0.18em] text-center shadow-lg"
              >
                Order Now
              </Link>
              {!user && (
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); setAuthOpen(true); }}
                  className="py-3 mt-2 rounded-full bg-[#14241B] text-[#FBF9F5] text-[11px] font-medium uppercase tracking-[0.16em] text-center"
                >
                  Sign In / Create Account
                </button>
              )}
              {user && (
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                  className="py-3 mt-2 rounded-full border border-red-200 text-red-500 text-[11px] font-medium uppercase tracking-[0.16em] text-center"
                >
                  Sign Out
                </button>
              )}
            </nav>
            <div className="mt-8 pt-6 border-t border-[#E6ECE8] text-xs text-[#8DA394] uppercase tracking-widest text-center">
              COCO ROOTS &bull; Botanical Hair Wellness
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      {authOpen && (
        <AuthModal
          notice={authNotice ?? undefined}
          returnUrl={returnUrl ?? undefined}
          onClose={() => {
            setAuthOpen(false);
            setAuthNotice(null);
            setReturnUrl(null);
          }}
        />
      )}

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
}
