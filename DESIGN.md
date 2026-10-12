# COCO ROOTS — Design System & Visual Specification

*Botanical Scalp Wellness & Restorative Haircare*
*Version: 2.0 (Google Stitch & Editorial Design System Architecture)*

---

## 1. Brand Essence & Creative Direction

**COCO ROOTS** is a modern botanical haircare house combining cold-pressed lipid integrity with contemporary trichological scalp wellness. 

### Visual Principles
1. **Understated Luxury & Warmth**: Warm cream and ivory foundations balanced with deep forest-green architecture, muted sage accents, and warm gold micro-details. Never stark black-and-white; never clinical.
2. **Editorial Typographic Rhythm**: **Cormorant Garamond** for display headlines paired with **Plus Jakarta Sans** for body copy and navigational controls. Deliberate scale contrast, restrained line lengths, and generous negative space.
3. **Tactile Craftsmanship**: Clean borders (1px hairline rules), subtle layered elevations, and micro-interactions with smooth cubic-bezier transitions (`0.16, 1, 0.3, 1`).
4. **Cinematic Botanical Media**: Art-directed packaging, botanical closeups, and the signature 3D cold-pressed hair cream animation with graceful static fallbacks.

---

## 2. Color Palette & Semantic Tokens

| Role | Color Name | Hex Code | Usage |
|---|---|---|---|
| **Primary Base** | Deep Forest Green | `#14241B` | Primary buttons, hero typography, announcement bars |
| **Abyssal Base** | Deep Night Green | `#0D1812` | Footers, dark overlays, modal backdrops |
| **Canvas** | Ivory White | `#FBF9F5` | Page background, cards, light surfaces |
| **Canvas Warm** | Warm Alabaster Cream | `#F4EFE6` | Secondary sections, image backings, subtle wells |
| **Accent Primary** | Warm Antique Gold | `#C4975C` | Eyebrow badges, hover borders, CTA accents, icons |
| **Accent Secondary**| Botanical Sage | `#8DA394` | Category labels, dividers, metadata, checkmarks |
| **Subtle Tint** | Light Sage Mist | `#E6ECE8` | Hairline dividers, subtle card borders, form outlines |
| **Text Primary** | Deep Charcoal Bark | `#1F2421` | Body copy, primary editorial paragraphs |
| **Text Muted** | Warm Earth Muted | `#6B726C` | Supporting descriptions, form helper text |

---

## 3. Typography Scale & Hierarchy

- **Serif Display**: *Cormorant Garamond* (`var(--font-serif)`)
  - Hero Display: `text-5xl sm:text-7xl lg:text-8xl`, `font-normal`, `tracking-[-0.03em]`, `leading-[1.05]`
  - Section Titles (H2): `text-3xl sm:text-5xl lg:text-6xl`, `font-normal`, `tracking-[-0.02em]`
  - Product Names (H3): `text-xl sm:text-2xl`, `font-normal`, `tracking-[-0.01em]`
- **Sans Interface**: *Plus Jakarta Sans* (`var(--font-sans)`)
  - Eyebrows & Badges: `text-[10px] sm:text-[11px]`, `tracking-[0.2em]`, `uppercase`, `font-medium`
  - Body Text: `text-[14px] sm:text-[16px]`, `leading-[1.7]`, `font-light`
  - Buttons & Links: `text-[11px] sm:text-[12px]`, `tracking-[0.16em]`, `uppercase`, `font-semibold`
  - Microcopy: `text-[11px] sm:text-[12px]`, `text-[#6B726C]`

---

## 4. UI Components & Layout Rules

### Buttons
- **Primary CTA**: Solid `#14241B` with `#FBF9F5` typography, full capsule radius (`rounded-full`), smooth hover transitioning to `#C4975C` with subtle scale lift (`-translate-y-0.5`).
- **Secondary CTA**: Transparent or warm cream background, 1px `#14241B`/20 border, hover background `#14241B` and text `#FBF9F5`.
- **Icon / Quick-Add Buttons**: Circular 40px–48px buttons with hover color transitions and micro-scale feedback.

### Cards & Surfaces
- **Product Cards**: 1px `#E6ECE8` border with subtle hover transition to `#8DA394`/40; soft shadow `0 20px 40px -15px rgba(20,36,27,0.08)`; aspect-square or 4:5 image ratio.
- **Modals & Overlays**: `#0D1812`/60 backdrop with 12px blur; modal cards in `#FBF9F5` with 24px border radius and 1px hairline border.

### Forms & Controls
- **Inputs**: 48px height, `#FFFFFF` or `#F4EFE6` surface, 1px `#E6ECE8` border, focus ring `#C4975C`.
- **Step Badges**: Refined horizontal rules and circular botanical indicator dots rather than bulky boxes.
