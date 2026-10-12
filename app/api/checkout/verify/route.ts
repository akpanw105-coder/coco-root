import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const orderId = session.client_reference_id || session.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json({ error: "No associated order found" }, { status: 404 });
    }

    const supabase = await createClient();

    // If payment is paid, update status to 'confirmed'
    if (session.payment_status === "paid") {
      await supabase
        .from("orders")
        .update({
          status: "confirmed",
          payment_method: "stripe",
        })
        .eq("id", orderId);
    }

    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    return NextResponse.json({
      success: true,
      paid: session.payment_status === "paid",
      order,
      session: {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_details?.email,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error verifying session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
