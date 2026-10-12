import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY is not defined in the environment.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia" as any,
  appInfo: {
    name: "COCO ROOTS Luxury Botanical Care",
    version: "2.0.0",
  },
});
