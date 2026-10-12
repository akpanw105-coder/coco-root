import Image from "next/image";
import { Product } from "../data/brand-data";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onSelect, onAddToCart }: ProductCardProps) {
  return (
    <article className="group flex flex-col bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#E6ECE8] hover:border-[#8DA394]/50 transition-all duration-500 luxury-card-hover relative">
      {/* Editorial Image Stage */}
      <div
        className="relative aspect-square w-full overflow-hidden bg-[#F4EFE6] cursor-pointer"
        onClick={() => onSelect(product)}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {product.isPopular && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#14241B]/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 text-[9px] uppercase font-medium tracking-[0.2em] text-[#FBF9F5] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4975C]" />
            <span>Signature Blend</span>
          </div>
        )}

        <div className="absolute inset-0 bg-[#14241B]/0 group-hover:bg-[#14241B]/5 transition-colors duration-300" />
      </div>

      {/* Content Framing */}
      <div className="flex flex-col flex-1 p-7 sm:p-8 justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] text-[#8DA394] font-medium tracking-[0.2em] uppercase mb-3">
            <span>{product.category}</span>
            <span className="text-[#3A2E28]/60 font-light">{product.volume}</span>
          </div>

          <h3
            onClick={() => onSelect(product)}
            className="font-serif text-2xl text-[#14241B] font-normal leading-snug group-hover:text-[#C4975C] transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="mt-2.5 text-[13px] text-[#6B726C] line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>

          <div className="mt-5 pt-3 border-t border-[#F4EFE6] flex items-center justify-between">
            <span className="text-xs text-[#8DA394] font-sans font-light">
              {product.priceNote}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-7 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelect(product)}
            className="flex-1 py-3 px-4 rounded-full border border-[#14241B]/20 text-[11px] font-medium tracking-[0.16em] uppercase text-[#14241B] hover:bg-[#14241B] hover:text-[#FBF9F5] transition-all"
          >
            Explore Formula
          </button>
          {onAddToCart && (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              aria-label={`Add ${product.name} to shopping bag`}
              className="p-3 rounded-full bg-[#14241B] text-[#FBF9F5] hover:bg-[#C4975C] transition-colors shadow-sm hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
