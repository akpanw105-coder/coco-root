import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
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
      shippingTierTitle,
    } = body;

    if (!items || !items.length || !customer || !customer.email) {
      return NextResponse.json(
        { error: "Invalid reservation payload. Missing items or recipient details." },
        { status: 400 }
      );
    }

    // Verify authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to acquire botanical formulations." },
        { status: 401 }
      );
    }

    // Generate bespoke order number (e.g. CR-2026-98421)
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `CR-${new Date().getFullYear()}-${randomSuffix}`;

    // 1. Create preliminary order in Supabase with 'pending_payment' status
    const { data: orderData, error: dbError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        customer_name: `${customer.firstName} ${customer.lastName}`.trim(),
        customer_email: customer.email,
        customer_phone: customer.phone || null,
        shipping_address: {
          address: customer.address,
          apartment: customer.apartment || "",
          city: customer.city,
          state: customer.state,
          postalCode: customer.postalCode,
          country: customer.country || "Nigeria",
        },
        items: items,
        subtotal: subtotal,
        shipping: shipping,
        discount: discount || 0,
        total: total,
        payment_method: "stripe",
        status: "pending_payment",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database order insertion error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // 2. Prepare Stripe line items in Nigerian Naira (NGN smallest unit = Kobo: 1 NGN = 100 kobo)
    const lineItems: any[] = items.map((item: any) => ({
      price_data: {
        currency: "ngn",
        product_data: {
          name: item.name,
          description: `${item.volume || "Botanical Formulation"} — Cold-Pressed Hair Care`,
          images: item.image ? [`${new URL(request.url).origin}${item.image}`] : [],
          metadata: {
            productId: item.id,
          },
        },
        // Unit amount in kobo (NGN * 100)
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add Shipping as a line item if greater than 0
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "ngn",
          product_data: {
            name: shippingTierTitle || "Priority Insulated Courier Protocol",
            description: "Temperature-controlled botanical transit",
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Apply discount via coupon or line adjustment if applicable
    let discounts = undefined;
    if (discount > 0) {
      try {
        const coupon = await stripe.coupons.create({
          amount_off: Math.round(discount * 100),
          currency: "ngn",
          duration: "once",
          name: "15% VIP Botanical Privilege",
        });
        discounts = [{ coupon: coupon.id }];
      } catch (couponErr) {
        console.warn("Could not create dynamic discount coupon:", couponErr);
      }
    }

    const origin = new URL(request.url).origin;
    const successUrl = `${origin}/order?session_id={CHECKOUT_SESSION_ID}&order_number=${orderNumber}&status=success`;
    const cancelUrl = `${origin}/order?order_number=${orderNumber}&status=cancelled`;

    // 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      discounts: discounts,
      customer_email: customer.email,
      client_reference_id: orderData.id,
      metadata: {
        orderId: orderData.id,
        orderNumber: orderNumber,
        userId: user.id,
        customerName: `${customer.firstName} ${customer.lastName}`.trim(),
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      billing_address_collection: "auto",
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
      orderNumber: orderNumber,
      orderId: orderData.id,
    });
  } catch (err: unknown) {
    console.error("Stripe Checkout creation error:", err);
    const message = err instanceof Error ? err.message : "Payment initialization failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
