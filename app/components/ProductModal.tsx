"use client";

import Image from "next/image";
import { Product } from "../data/brand-data";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  if (!product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0D1812]/70 backdrop-blur-md animate-in fade-in duration-300"
    >
      {/* Backdrop click close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 bg-[#FBF9F5] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E6ECE8] flex flex-col md:flex-row">
        {/* Product Image Stage */}
        <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto min-h-[300px] bg-[#F4EFE6]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 350px"
            className="object-cover object-center"
          />
          {product.isPopular && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#14241B]/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 text-[9px] uppercase font-medium tracking-[0.2em] text-[#FBF9F5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4975C]" />
              <span>Signature Blend</span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-7 sm:p-9 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] text-[#8DA394] font-medium uppercase tracking-[0.2em] mb-2.5">
              <span>{product.category}</span>
              <span className="text-[#3A2E28]/60 font-light">{product.volume}</span>
            </div>

            <h3 id="modal-product-title" className="font-serif text-2xl sm:text-3xl text-[#14241B] font-normal leading-snug">
              {product.name}
            </h3>

            <p className="mt-2 text-xs text-[#C4975C] font-medium tracking-[0.08em] uppercase">
              {product.tagline}
            </p>

            <p className="mt-4 text-sm text-[#6B726C] leading-relaxed font-light">
              {product.description}
            </p>

            <div className="mt-6">
              <h4 className="text-[10px] uppercase font-semibold tracking-[0.18em] text-[#14241B] mb-3">
                Ritual Benefits:
              </h4>
              <ul className="space-y-2 text-xs text-[#3A2E28]/80">
                {product.benefits.map((b, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C4975C]" />
                    <span className="font-light">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[#F4EFE6] text-xs text-[#6B726C] font-light flex items-center justify-between">
              <span className="font-medium text-[#14241B]">Acquisition:</span>
              <span className="text-[#14241B] font-medium font-sans">{product.priceNote}</span>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            {onAddToCart && (
              <button
                type="button"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="flex-1 py-3.5 px-6 rounded-full bg-[#14241B] text-[#FBF9F5] text-[11px] font-semibold uppercase tracking-[0.18em] hover:bg-[#C4975C] transition-all shadow-md hover:-translate-y-0.5"
              >
                Add to Bag
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="py-3.5 px-6 rounded-full border border-[#14241B]/20 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#14241B] hover:bg-black/5 transition-all"
            >
              Close
            </button>
          </div>
        </div>

        {/* Close Icon */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-[#14241B] bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-sm focus:outline-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
