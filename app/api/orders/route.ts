import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      items,
      customer,
      subtotal,
      shipping,
      discount,
      total,
      paymentMethod,
    } = body;

    if (!items || !items.length || !customer || !customer.email) {
      return NextResponse.json(
        { error: "Invalid order payload. Missing items or customer details." },
        { status: 400 }
      );
    }

    // Verify authenticated user is placing the order
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in or create an account to place an order." },
        { status: 401 }
      );
    }

    // Generate luxurious order number (e.g. CR-2026-98421)
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `CR-${new Date().getFullYear()}-${randomSuffix}`;

    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user?.id ?? null,
        customer_name: `${customer.firstName} ${customer.lastName}`.trim(),
        customer_email: customer.email,
        customer_phone: customer.phone || null,
        shipping_address: {
          address: customer.address,
          apartment: customer.apartment || "",
          city: customer.city,
          state: customer.state,
          postalCode: customer.postalCode,
          country: customer.country,
        },
        items: items,
        subtotal: subtotal,
        shipping: shipping,
        discount: discount || 0,
        total: total,
        payment_method: paymentMethod || "card",
        status: "confirmed",
      })
      .select()
      .single();

    if (error) {
      console.error("Order creation database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: data.id,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
