"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please provide a valid email address.");
      return;
    }

    setStatus("loading");

    // Simulating newsletter dispatch with clear architectural isolation
    setTimeout(() => {
      setStatus("success");
      setMessage("Thank you for joining our circle. You will receive our botanical dispatches.");
      setEmail("");
    }, 600);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 lg:py-32 bg-[#14241B] text-[#FBF9F5] relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#223B2D]/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#C4975C]/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#C4975C] font-semibold">
          The Botanical Journal
        </span>

        <h2 className="mt-3 sm:mt-4 font-serif text-2xl sm:text-4xl lg:text-5xl text-[#FBF9F5] font-normal leading-tight">
          Join the Coco Roots Circle
        </h2>

        <p className="mt-3 sm:mt-4 text-xs sm:text-base lg:text-lg text-[#FBF9F5]/70 max-w-xl mx-auto leading-relaxed font-light px-2">
          Receive seasonal hair wellness insights, mindful scalp care rituals, and early notification of small-batch formulations.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 sm:mt-10 max-w-md mx-auto w-full">
          <div className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="newsletter-email" className="sr-only">
              Email Address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="Enter your email address"
              required
              className="w-full flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-[#FBF9F5] placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#C4975C] focus:border-transparent text-sm transition-all font-light"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#C4975C] hover:bg-[#D8AC6E] text-[#14241B] font-semibold text-xs tracking-[0.14em] uppercase transition-all disabled:opacity-50 shrink-0 shadow-md active:scale-[0.98]"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </div>

          {status === "success" && (
            <p className="mt-4 text-sm text-[#8DA394] font-medium animate-in fade-in">
              {message}
            </p>
          )}

          {status === "error" && (
            <p className="mt-4 text-sm text-amber-300 font-medium animate-in fade-in">
              {message}
            </p>
          )}

          <p className="mt-4 text-[11px] text-white/40">
            We honor your privacy. Unsubscribe at any time with a single click.
          </p>
        </form>
      </div>
    </section>
  );
}
