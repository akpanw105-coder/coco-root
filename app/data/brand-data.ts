export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: string;
  volume: string;
  price: number;
  priceNote: string;
  description: string;
  benefits: string[];
  image: string;
  isPopular?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "botanical-scalp-serum",
    name: "Hair & Scalp Botanical Serum",
    tagline: "Cellular scalp nourishment & follicle vitality",
    category: "Scalp Treatment",
    volume: "50ml / 1.7 fl oz",
    price: 45000,
    priceNote: "₦45,000 • Complimentary shipping",
    description:
      "A lightweight, quick-absorbing botanical serum engineered with concentrated botanical extracts to soothe tension, revitalize follicle roots, and foster balanced scalp wellness.",
    benefits: ["Soothes scalp irritation", "Restores moisture balance", "Non-greasy absorption"],
    image: "/images/product-scalp-serum.jpg",
    isPopular: true,
  },
  {
    id: "luxury-hair-mask",
    name: "Restorative Moisture Cream Mask",
    tagline: "Deep strand hydration & moisture barrier repair",
    category: "Deep Conditioning",
    volume: "200ml / 6.7 fl oz",
    price: 50000,
    priceNote: "₦50,000 • Complimentary shipping",
    description:
      "An intensive velvet hair mask enriched with cold-pressed coconut lipids and botanical emollients that envelopes brittle strands in deep, enduring nourishment.",
    benefits: ["Smoothes strand cuticle", "Intense hydration therapy", "Velvety botanical softness"],
    image: "/images/product-moisture-mask.jpg",
  },
  {
    id: "golden-botanical-elixir",
    name: "Golden Botanical Elixir",
    tagline: "Cold-pressed multipurpose strand & end treatment",
    category: "Finishing Elixir",
    volume: "100ml / 3.4 fl oz",
    price: 55000,
    priceNote: "₦55,000 • Complimentary shipping",
    description:
      "A pure golden ritual oil featuring nutrient-dense cold-pressed extracts to tame flyaways, enhance natural radiant luster, and seal vulnerable ends from heat and arid conditions.",
    benefits: ["Weightless radiant sheen", "Heat & humidity shield", "Silky touch finish"],
    image: "/images/product-nourishing-oil.jpg",
    isPopular: true,
  },
];

export const PHILOSOPHY_PILLARS = [
  {
    step: "01",
    title: "Root-First Hair Wellness",
    description:
      "Healthy hair begins in the micro-environment of the scalp. Our formulas respect and nourish the scalp barrier, paving the way for resilient, naturally buoyant hair.",
  },
  {
    step: "02",
    title: "Cold-Pressed Lipid Integrity",
    description:
      "We avoid harsh heat processing. Our raw botanical oils and coconut extracts retain their native micronutrients, fatty acid profiles, and natural protective properties.",
  },
  {
    step: "03",
    title: "Conscious Ritual Formulations",
    description:
      "Every texture, slip, and subtle herbal aroma is calibrated to transform daily haircare from a mechanical chore into an intentional moment of calm and restoration.",
  },
];

export const PRODUCT_EXPERIENCE_FEATURES = [
  {
    title: "Weightless Absorption",
    description: "Formulated for deep strand penetration without heavy residue or unwanted buildup.",
    detail: "Breathable botanical layer",
  },
  {
    title: "Cuticle Smoothing",
    description: "Aligns hair cuticle scales to reflect natural light with genuine, luminous luster.",
    detail: "Natural radiant gloss",
  },
  {
    title: "Scalp Comfort",
    description: "Calms dryness and environmental strain with bio-compatible botanical moisture.",
    detail: "Micro-balanced harmony",
  },
  {
    title: "Thermal & Sun Defense",
    description: "Natural lipid barriers cushion hair shafts from dry air, friction, and styling stresses.",
    detail: "Protective organic shield",
  },
];
