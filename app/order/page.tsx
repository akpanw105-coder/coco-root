import { createClient } from "@/lib/supabase/server";
import { OrderClient } from "./OrderClient";
import { PRODUCTS } from "../data/brand-data";

export const metadata = {
  title: "Boutique Order & Checkout — Coco Roots Botanical Care",
  description: "Acquire artisan cold-pressed botanical hair formulations with complimentary white-glove shipping.",
};

export const instant = false;

import { redirect } from "next/navigation";

export default async function OrderPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Enforce mandatory sign-in before accessing order page
  if (!user) {
    redirect("/?auth=signin&redirect=/order");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const initialProfile = profile || {
    full_name: user.user_metadata?.full_name || "",
    email: user.email || "",
  };

  return (
    <OrderClient
      user={user}
      initialProfile={initialProfile}
      catalogProducts={PRODUCTS}
    />
  );
}
