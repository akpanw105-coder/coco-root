import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0D1812] text-[#FBF9F5] border-t border-[#223B2D]/40 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16 pb-16 border-b border-[#223B2D]/40">
          {/* Brand Col */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-block group">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] text-[#FBF9F5] uppercase font-normal group-hover:text-[#C4975C] transition-colors">
                  COCO ROOTS
                </span>
                <span className="block text-[9px] tracking-[0.35em] uppercase text-[#8DA394] mt-1 font-medium font-sans">
                  Botanical Care
                </span>
              </Link>
              <p className="mt-5 text-sm text-[#FBF9F5]/70 max-w-sm leading-[1.8] font-light">
                Elevated hair wellness uniting the restorative power of cold-pressed botanical lipids and mindful rituals. Engineered for scalp balance, strand longevity, and natural luminosity.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 text-xs text-[#8DA394]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4975C]" />
              <span className="font-light tracking-wide">Small-Batch Formulations &bull; Consciously Sourced</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 md:col-start-7">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C4975C] mb-5">
              Explore
            </h4>
            <ul className="space-y-3.5 text-[13px] text-[#FBF9F5]/75 font-light">
              <li>
                <Link href="#products" className="hover:text-[#C4975C] transition-colors">
                  The Collection
                </Link>
              </li>
              <li>
                <Link href="#philosophy" className="hover:text-[#C4975C] transition-colors">
                  Botanical Science
                </Link>
              </li>
              <li>
                <Link href="#ritual" className="hover:text-[#C4975C] transition-colors">
                  Care Rituals
                </Link>
              </li>
              <li>
                <Link href="#story" className="hover:text-[#C4975C] transition-colors">
                  Our Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Philosophy / Principles */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C4975C] mb-5">
              Pillars
            </h4>
            <ul className="space-y-3.5 text-[13px] text-[#FBF9F5]/75 font-light">
              <li>Scalp First</li>
              <li>Cold-Pressed Oils</li>
              <li>Cruelty-Free</li>
              <li>Clean Synthesis</li>
            </ul>
          </div>

          {/* Brand Note */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C4975C] mb-5">
              Private Inquiries
            </h4>
            <p className="text-[13px] text-[#FBF9F5]/70 leading-[1.8] font-light mb-5">
              For concierge care, order assistance, or small-batch guidance, our botanical specialists are at your service.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#C4975C] hover:text-[#D8AC6E] transition-colors"
            >
              <span>Get in Touch</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FBF9F5]/50 gap-4">
          <p>&copy; 2026 COCO ROOTS. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Terms of Care
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Accessibility
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
