"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "./components/Header";
import { HeroMedia } from "./components/HeroMedia";
import { ProductCard } from "./components/ProductCard";
import { ProductModal } from "./components/ProductModal";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";
import { PRODUCTS, PHILOSOPHY_PILLARS, PRODUCT_EXPERIENCE_FEATURES, Product } from "./data/brand-data";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => [...prev, product]);
    setIsBagOpen(true);
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBF9F5] text-[#1F2421]">
      {/* Header Navigation */}
      <Header
        cartCount={cartItems.length}
        onCartClick={() => setIsBagOpen(true)}
      />

      <main className="flex-1">
        {/* SECTION B: FULL-SCREEN CINEMATIC HERO EXPERIENCE */}
        <section className="relative min-h-[calc(100svh-4rem)] sm:min-h-[calc(100svh-5rem)] lg:min-h-screen flex flex-col justify-between pt-6 sm:pt-10 pb-12 sm:pb-16 overflow-hidden" style={{background: "linear-gradient(160deg, #FBF9F5 0%, #F5EEE3 38%, #EEE6D6 65%, #F4EFE6 100%)"}}>
          {/* Warm Atmospheric Halo — contained within viewport */}
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[90vw] max-w-[1100px] h-[400px] sm:h-[600px] pointer-events-none -z-10" style={{background: "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(196,151,92,0.13) 0%, rgba(230,220,200,0.25) 45%, transparent 80%)"}} />
          {/* Secondary sage halo — bottom-left */}
          <div className="absolute bottom-0 left-0 w-[80vw] max-w-[600px] h-[300px] sm:h-[400px] pointer-events-none -z-10" style={{background: "radial-gradient(ellipse 80% 70% at 10% 90%, rgba(141,163,148,0.10) 0%, transparent 70%)"}} />
          <div className="absolute bottom-0 inset-x-0 h-28 sm:h-40 bg-gradient-to-t from-[#F4EFE6]/80 to-transparent pointer-events-none z-10" />

          {/* Top Hero Editorial Headline */}
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-2 sm:pt-6 z-20">

            {/* Eyebrow — refined horizontal rule treatment, no pill */}
            <div className="inline-flex items-center gap-2.5 sm:gap-3.5 mb-5 sm:mb-9 max-w-full">
              <span className="block w-5 sm:w-10 h-px bg-[#C4975C]/60 shrink-0" />
              <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#8DA394] font-medium truncate">
                The Botanical Hair Wellness Standard
              </span>
              <span className="block w-5 sm:w-10 h-px bg-[#C4975C]/60 shrink-0" />
            </div>

            {/* Main Editorial Headline — deliberate scale contrast across lines */}
            <h1 className="font-serif font-normal text-[#14241B] tracking-[-0.025em] leading-[1.1] max-w-[780px] mx-auto px-1">
              <span className="block text-[28px] xs:text-[36px] sm:text-[54px] lg:text-[72px] leading-[1.08]">
                Restorative Haircare
              </span>
              <span className="block text-[24px] xs:text-[30px] sm:text-[46px] lg:text-[60px] leading-[1.15] text-[#3A2E28]/80 mt-1">
                Rooted in{" "}
                <em className="not-italic" style={{color: "#14241B"}}>Pure Nature</em>
              </span>
            </h1>

            {/* Divider line — editorial breath between headline and body */}
            <div className="mt-5 sm:mt-9 flex items-center justify-center gap-3 sm:gap-4">
              <span className="block w-8 sm:w-12 h-px bg-[#E6ECE8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4975C]/70" />
              <span className="block w-8 sm:w-12 h-px bg-[#E6ECE8]" />
            </div>

            {/* Editorial Subtitle — warm charcoal, restrained width */}
            <p className="mt-4 sm:mt-6 text-[13px] sm:text-[16px] text-[#3A2E28]/70 max-w-[500px] mx-auto leading-[1.7] sm:leading-[1.75] font-light tracking-[0.01em] px-2">
              Elevate daily grooming into an intentional restoration ritual. Cold-pressed botanical lipids paired with clean hair science for balanced roots and weightless luster.
            </p>
          </div>

          {/* Central Dominant Feature: Cinematic 3D Product Media Showcase */}
          <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 my-4 sm:my-7 z-10">
            <HeroMedia priority={true} />
          </div>

          {/* Bottom Hero Call to Action & Proof Badges */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center z-20">
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/order"
                id="hero-order-now-btn"
                className="w-full sm:w-auto px-7 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#14241B] text-[#FBF9F5] text-[11px] font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-center hover:bg-[#C4975C] transition-all shadow-[0_12px_30px_-8px_rgba(20,36,27,0.35)] hover:shadow-[0_16px_36px_-8px_rgba(196,151,92,0.45)] hover:-translate-y-0.5 luxury-shimmer flex items-center justify-center gap-2 sm:gap-2.5 active:scale-[0.98]"
              >
                <span>Order Now</span>
                <span className="w-1 h-1 rounded-full bg-[#C4975C]" />
                <span className="text-[10px] text-[#C4975C] tracking-widest font-normal">Complimentary Delivery</span>
              </Link>
              <Link
                href="#products"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full border border-[#14241B]/20 text-[#14241B] text-[11px] font-medium uppercase tracking-[0.16em] text-center hover:bg-[#14241B]/5 transition-all hover:-translate-y-0.5 backdrop-blur-sm active:scale-[0.98]"
              >
                Explore Collection
              </Link>
            </div>

            {/* Micro Brand Accreditations */}
            <div className="mt-6 sm:mt-7 pt-5 sm:pt-6 border-t border-[#E6ECE8]/90 w-full max-w-xl grid grid-cols-3 gap-2 sm:gap-6 text-center">
              <div>
                <span className="block font-serif text-lg sm:text-2xl text-[#14241B] font-normal">100%</span>
                <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.08em] sm:tracking-[0.12em] text-[#8DA394] font-medium">Conscious Care</span>
              </div>
              <div>
                <span className="block font-serif text-lg sm:text-2xl text-[#14241B] font-normal">Cold-Pressed</span>
                <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.08em] sm:tracking-[0.12em] text-[#8DA394] font-medium">Active Lipids</span>
              </div>
              <div>
                <span className="block font-serif text-lg sm:text-2xl text-[#14241B] font-normal">Scalp-First</span>
                <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.08em] sm:tracking-[0.12em] text-[#8DA394] font-medium">Root Balance</span>
              </div>
            </div>

            {/* Subtle Downward Scroll Indicator */}
            <div className="mt-5 flex flex-col items-center">
              <Link
                href="#products"
                aria-label="Scroll to products"
                className="group flex flex-col items-center text-[#8DA394] hover:text-[#14241B] transition-colors"
              >
                <span className="text-[10px] uppercase tracking-[0.25em] font-medium mb-1 group-hover:text-[#C4975C]">Scroll</span>
                <svg className="w-3.5 h-3.5 animate-bounce text-[#C4975C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION C: BRAND INTRODUCTION */}
        <section className="py-14 sm:py-20 lg:py-28 bg-[#F4EFE6] border-y border-[#E6ECE8]/90">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              <span className="w-6 sm:w-8 h-px bg-[#C4975C]/60" />
              <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#8DA394] font-medium">
                The Coco Roots Philosophy
              </span>
              <span className="w-6 sm:w-8 h-px bg-[#C4975C]/60" />
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-[54px] text-[#14241B] font-normal leading-[1.25] sm:leading-[1.2] max-w-3xl mx-auto">
              &ldquo;True hair vibrancy is not covered up. It is nurtured from the scalp follicle out.&rdquo;
            </h2>
            <p className="mt-5 sm:mt-8 text-sm sm:text-base lg:text-lg text-[#3A2E28]/70 leading-[1.75] sm:leading-[1.8] max-w-2xl mx-auto font-light">
              We founded Coco Roots on a foundational principle: modern life exposes our hair to persistent heat, city air, and chemical stress. Rather than masking fatigue with heavy silicones, our formulations honor the lipid architecture of each strand with bio-compatible botanical nutrition.
            </p>
          </div>
        </section>

        {/* SECTION D: FEATURED PRODUCTS */}
        <section id="products" className="py-16 sm:py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-4 sm:gap-6">
            <div>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#C4975C] font-semibold">
                Curated Formulations
              </span>
              <h2 className="mt-2 sm:mt-3 font-serif text-2xl sm:text-4xl lg:text-5xl xl:text-6xl text-[#14241B] font-normal tracking-[-0.02em]">
                The Core Botanical Collection
              </h2>
            </div>
            <p className="text-xs sm:text-sm lg:text-[15px] text-[#6B726C] max-w-md font-light leading-relaxed">
              Small-batch hair wellness essentials engineered with cold-pressed oils, clarifying botanical extracts, and restorative moisture complexes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {PRODUCTS.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={(p) => setSelectedProduct(p)}
                onAddToCart={(p) => handleAddToCart(p)}
              />
            ))}
          </div>
        </section>

        {/* SECTION E: HAIRCARE PHILOSOPHY & INGREDIENTS */}
        <section id="philosophy" className="py-16 sm:py-24 lg:py-32 bg-[#14241B] text-[#FBF9F5] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-5">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#C4975C] font-semibold">
                  Botanical Science
                </span>
                <h2 className="mt-3 sm:mt-4 font-serif text-2xl sm:text-4xl lg:text-5xl xl:text-6xl text-[#FBF9F5] font-normal leading-[1.2] tracking-[-0.02em]">
                  Crafted with Respect for the Botanical Seed.
                </h2>
                <p className="mt-4 sm:mt-6 text-sm sm:text-base text-[#FBF9F5]/75 leading-[1.75] font-light">
                  We balance time-honored botanical wisdom with modern cosmetic rigor. By extracting active compounds at low temperatures, we preserve raw antioxidants and lipid chains that work in effortless symmetry with your hair.
                </p>

                <div className="mt-8 sm:mt-10 space-y-5 sm:space-y-6">
                  {PHILOSOPHY_PILLARS.map((pillar) => (
                    <div key={pillar.step} className="flex gap-4 sm:gap-5 border-t border-[#223B2D] pt-5 sm:pt-6">
                      <span className="font-serif text-xl sm:text-2xl text-[#C4975C] font-light">{pillar.step}</span>
                      <div>
                        <h3 className="font-serif text-lg sm:text-2xl text-[#FBF9F5] font-normal">{pillar.title}</h3>
                        <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-[#FBF9F5]/70 leading-relaxed font-light">{pillar.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                  <Image
                    src="/images/story-ritual.jpg"
                    alt="Botanical extracts, raw cold pressed oils, and herbs used in Coco Roots formulations"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 650px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-3.5 sm:p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/15">
                    <p className="text-[11px] sm:text-xs text-white/95 font-light tracking-wide leading-relaxed">
                      Pure Botanical Lipid Extracts &bull; Formulated without heavy silicones, harsh sulfates, or artificial parabens.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION F: BENEFITS AND PRODUCT EXPERIENCE */}
        <section id="ritual" className="py-16 sm:py-24 lg:py-32 bg-[#FBF9F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#8DA394] font-medium">
                Tangible Results
              </span>
              <h2 className="mt-2 sm:mt-3 font-serif text-2xl sm:text-4xl lg:text-5xl text-[#14241B] font-normal tracking-[-0.02em]">
                The Sensorial Product Experience
              </h2>
              <p className="mt-3 sm:mt-4 text-xs sm:text-base text-[#6B726C] font-light leading-relaxed">
                Formulations crafted to delight the senses—from the lightweight slip between your fingertips to the delicate natural scent notes of botanical oils.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
              {PRODUCT_EXPERIENCE_FEATURES.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E6ECE8] luxury-card-hover flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C4975C]">
                      {feat.detail}
                    </span>
                    <h3 className="mt-2.5 sm:mt-3 font-serif text-xl sm:text-2xl text-[#14241B] font-normal leading-snug">
                      {feat.title}
                    </h3>
                    <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-[#6B726C] leading-relaxed font-light">
                      {feat.description}
                    </p>
                  </div>
                  <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-[#F4EFE6] flex items-center gap-2 text-xs text-[#8DA394]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#14241B]" />
                    <span className="font-light">Mindfully Tested</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION G & H: BRAND STORY & EDITORIAL CAMPAIGN */}
        <section id="story" className="py-16 sm:py-24 lg:py-32 bg-[#F4EFE6] border-t border-[#E6ECE8]/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              {/* Campaign Image */}
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-[#E6ECE8] group">
                  <Image
                    src="/images/campaign-editorial.jpg"
                    alt="Editorial model showcasing healthy, radiant hair in natural botanical light"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 650px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full text-[9px] uppercase font-medium tracking-[0.2em] text-[#14241B] shadow-sm">
                    Editorial Campaign
                  </div>
                </div>
              </div>

              {/* Story Narrative */}
              <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-start">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#C4975C] font-semibold">
                  Our Story
                </span>
                <h2 className="mt-2 sm:mt-3 font-serif text-2xl sm:text-4xl lg:text-5xl xl:text-6xl text-[#14241B] font-normal leading-[1.2] tracking-[-0.02em]">
                  Rediscovering the Roots of Hair Vitality.
                </h2>
                <p className="mt-4 sm:mt-6 text-sm sm:text-base text-[#3A2E28]/75 leading-[1.75] font-light">
                  Coco Roots emerged from a deep conviction: in our fast-paced modern world, haircare had become overly complicated, filled with synthetic shortcuts that deplete hair over time.
                </p>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#3A2E28]/75 leading-[1.75] font-light">
                  We returned to the original source—rich cold-pressed coconut lipids and restorative botanicals that have sustained vibrant hair across generations. We formulate in harmony with nature to deliver authentic nourishment you can see and feel.
                </p>
                <div className="mt-6 sm:mt-8">
                  <Link
                    href="#products"
                    className="inline-flex items-center gap-2 text-xs uppercase font-medium tracking-[0.18em] text-[#14241B] hover:text-[#C4975C] transition-colors group"
                  >
                    <span>Experience The Collection</span>
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION I: BRAND PHILOSOPHY / SOCIAL PROOF COMMITMENT */}
        <section className="py-14 sm:py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#E6ECE8]/90">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#8DA394] font-medium">
              Our Commitment
            </span>
            <h2 className="mt-2 sm:mt-3 font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-[#14241B] font-normal tracking-[-0.02em]">
              Conscious Craftsmanship, Proven Sourcing
            </h2>
            <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 text-left">
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FBF9F5] border border-[#E6ECE8] luxury-card-hover">
                <div className="w-2 h-2 rounded-full bg-[#C4975C] mb-3 sm:mb-4" />
                <h3 className="font-serif text-lg sm:text-2xl text-[#14241B] font-normal">Sustainable Harvesting</h3>
                <p className="mt-2 sm:mt-2.5 text-xs sm:text-[13px] text-[#6B726C] leading-relaxed font-light">
                  We source our coconut lipids and botanical ingredients with ethical growers committed to regenerative soil practices.
                </p>
              </div>
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FBF9F5] border border-[#E6ECE8] luxury-card-hover">
                <div className="w-2 h-2 rounded-full bg-[#C4975C] mb-3 sm:mb-4" />
                <h3 className="font-serif text-lg sm:text-2xl text-[#14241B] font-normal">Zero Harsh Fillers</h3>
                <p className="mt-2 sm:mt-2.5 text-xs sm:text-[13px] text-[#6B726C] leading-relaxed font-light">
                  Every drop is intentional. No artificial parabens, synthetic dyes, or drying alcohols. Only pure hair wellness.
                </p>
              </div>
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FBF9F5] border border-[#E6ECE8] luxury-card-hover">
                <div className="w-2 h-2 rounded-full bg-[#C4975C] mb-3 sm:mb-4" />
                <h3 className="font-serif text-lg sm:text-2xl text-[#14241B] font-normal">Small-Batch Calibrated</h3>
                <p className="mt-2 sm:mt-2.5 text-xs sm:text-[13px] text-[#6B726C] leading-relaxed font-light">
                  Formulated in limited batches to ensure optimum freshness, active potency, and lipid stability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION J: NEWSLETTER */}
        <Newsletter />
      </main>

      {/* SECTION K: FOOTER */}
      <Footer />

      {/* Interactive Product Details Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p) => handleAddToCart(p)}
      />

      {/* Interactive Shopping Bag Drawer Modal */}
      {isBagOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-full sm:max-w-md bg-[#FBF9F5] h-full shadow-2xl flex flex-col justify-between border-l border-[#E6ECE8] overflow-hidden">
            {/* Bag Header */}
            <div className="p-4 sm:p-6 border-b border-[#E6ECE8] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#14241B] font-normal">Your Shopping Bag</h3>
                <span className="text-[10px] sm:text-[11px] text-[#8DA394] uppercase tracking-[0.14em]">
                  {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsBagOpen(false)}
                aria-label="Close shopping bag"
                className="p-2.5 text-[#14241B] hover:text-[#C4975C] focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Bag Item List */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-3 sm:space-y-4">
              {cartItems.length === 0 ? (
                <div className="py-12 sm:py-16 text-center">
                  <p className="font-serif text-lg sm:text-xl text-[#14241B]">Your bag is currently empty.</p>
                  <p className="mt-2 text-xs text-[#6B726C] font-light">Explore our botanical collection to begin your ritual.</p>
                  <button
                    type="button"
                    onClick={() => setIsBagOpen(false)}
                    className="mt-6 px-7 py-3 rounded-full bg-[#14241B] text-[#FBF9F5] text-[11px] font-medium uppercase tracking-[0.14em]"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-xl bg-white border border-[#E6ECE8] items-center">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 bg-[#F4EFE6]">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm sm:text-base text-[#14241B] truncate">{item.name}</h4>
                      <p className="text-[9px] sm:text-[10px] text-[#8DA394] uppercase tracking-wider">{item.volume}</p>
                      <p className="text-xs text-[#C4975C] mt-0.5">{item.priceNote}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFromCart(idx)}
                      aria-label={`Remove ${item.name}`}
                      className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bag Checkout Section */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-[#E6ECE8] bg-white">
                <div className="flex justify-between items-baseline mb-2 sm:mb-3">
                  <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#8DA394]">Estimated Total</span>
                  <span className="font-serif text-lg sm:text-xl font-semibold text-[#14241B]">
                    ₦{cartItems.reduce((acc, curr) => acc + curr.price, 0).toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 sm:p-3 mb-3 sm:mb-4 rounded-xl bg-[#F4EFE6] text-[11px] sm:text-xs text-[#6B726C] leading-relaxed font-light flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4975C] shrink-0" />
                  <span>Complimentary express insulated courier included on this reservation.</span>
                </div>
                <Link
                  href="/order"
                  onClick={() => setIsBagOpen(false)}
                  className="w-full py-3.5 sm:py-4 rounded-full bg-[#14241B] text-[#FBF9F5] text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.2em] hover:bg-[#C4975C] transition-all flex items-center justify-center gap-2 shadow-lg luxury-shimmer block text-center"
                >
                  <span>Proceed to Private Order</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
