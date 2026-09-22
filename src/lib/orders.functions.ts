import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const ORDER_AMOUNT_CENTS = 1299;
export const MIN_INSTALLMENT_CENTS = 500;

export type OrderEvent = { title: string; description: string | null; happenedAt: string };

export type OrderTracking = {
  orderCode: string;
  trackingCode: string | null;
  carrier: string | null;
  shippingStatus: string;
  paymentStatus: string;
  estimatedDelivery: string | null;
  customerFirstName: string;
  city: string;
  state: string;
  createdAt: string;
  events: OrderEvent[];
};

const orderInput = z.object({
  name: z.string().trim().min(3).max(100),
  cpf: z.string().trim().min(11).max(14),
  phone: z.string().trim().min(10).max(16),
  zip: z.string().trim().min(8).max(9),
  state: z.string().trim().length(2),
  city: z.string().trim().min(2).max(80),
  district: z.string().trim().min(2).max(80),
  street: z.string().trim().min(3).max(120),
  number: z.string().trim().min(1).max(12),
  complement: z.string().trim().max(80).optional(),
  installments: z.number().int().min(1).max(12),
});

function digits(value: string) {
  return value.replace(/\D/g, "");
}

function makeOrderCode() {
  const random = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `SC${Date.now().toString(36).toUpperCase().slice(-5)}${random}`;
}

function buildPaymentUrl(base: string | null, orderCode: string, installments: number) {
  if (!base) return null;
  try {
    const url = new URL(base);
    url.searchParams.set("pedido", orderCode);
    url.searchParams.set("parcelas", String(installments));
    return url.toString();
  } catch {
    return base;
  }
}

/** Public payment settings shown in the checkout. */
export const getPaymentSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("store_settings")
    .select("gateway_name, max_installments, payment_link_url, whatsapp")
    .eq("id", true)
    .maybeSingle();

  const maxByAmount = Math.max(1, Math.floor(ORDER_AMOUNT_CENTS / MIN_INSTALLMENT_CENTS));
  return {
    gatewayName: data?.gateway_name ?? "Escama Black",
    maxInstallments: Math.min(data?.max_installments ?? 12, maxByAmount),
    paymentConfigured: Boolean(data?.payment_link_url),
    whatsapp: data?.whatsapp ?? null,
    amountCents: ORDER_AMOUNT_CENTS,
  };
});

/** Creates a real order and returns the payment link for the chosen installments. */
export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => orderInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: settings } = await supabaseAdmin
      .from("store_settings")
      .select("payment_link_url, max_installments")
      .eq("id", true)
      .maybeSingle();

    const maxByAmount = Math.max(1, Math.floor(ORDER_AMOUNT_CENTS / MIN_INSTALLMENT_CENTS));
    const installments = Math.min(data.installments, settings?.max_installments ?? 12, maxByAmount);
    const orderCode = makeOrderCode();
    const paymentUrl = buildPaymentUrl(settings?.payment_link_url ?? null, orderCode, installments);

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        order_code: orderCode,
        customer_name: data.name,
        cpf_digits: digits(data.cpf),
        phone_digits: digits(data.phone),
        zip: digits(data.zip),
        state: data.state,
        city: data.city,
        district: data.district,
        street: data.street,
        number: data.number,
        complement: data.complement ?? null,
        amount_cents: ORDER_AMOUNT_CENTS,
        installments,
        payment_link_url: paymentUrl,
      })
      .select("id, order_code")
      .single();

    if (error || !order) throw new Error("Não foi possível registrar o pedido.");

    await supabaseAdmin.from("order_events").insert({
      order_id: order.id,
      title: "Pedido registrado",
      description: "Recebemos seus dados de entrega. Aguardando confirmação do pagamento.",
    });

    return {
      orderCode: order.order_code,
      installments,
      amountCents: ORDER_AMOUNT_CENTS,
      paymentUrl,
    };
  });

/** Real tracking lookup by order code, tracking code, phone or CPF. */
export const lookupOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ query: z.string().trim().min(6).max(40) }).parse(input))
  .handler(async ({ data }): Promise<OrderTracking | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const raw = data.query.trim();
    const numeric = digits(raw);
    const columns =
      "id, order_code, tracking_code, carrier, shipping_status, payment_status, estimated_delivery, customer_name, city, state, created_at";

    const filters = [`order_code.eq.${raw.toUpperCase()}`, `tracking_code.eq.${raw.toUpperCase()}`];
    if (numeric.length >= 10) filters.push(`phone_digits.eq.${numeric}`, `cpf_digits.eq.${numeric}`);

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select(columns)
      .or(filters.join(","))
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!order) return null;

    const { data: events } = await supabaseAdmin
      .from("order_events")
      .select("title, description, happened_at")
      .eq("order_id", order.id)
      .order("happened_at", { ascending: true });

    return {
      orderCode: order.order_code,
      trackingCode: order.tracking_code,
      carrier: order.carrier,
      shippingStatus: order.shipping_status,
      paymentStatus: order.payment_status,
      estimatedDelivery: order.estimated_delivery,
      customerFirstName: order.customer_name.split(" ")[0] ?? "",
      city: order.city,
      state: order.state,
      createdAt: order.created_at,
      events: (events ?? []).map((event) => ({
        title: event.title,
        description: event.description,
        happenedAt: event.happened_at,
      })),
    };
  });

export type OrderConfirmation = {
  orderCode: string;
  amountCents: number;
  installments: number;
  paymentStatus: string;
  shippingStatus: string;
  paymentUrl: string | null;
  customerName: string;
  city: string;
  state: string;
  street: string;
  number: string;
  complement: string | null;
  district: string;
  zip: string;
  createdAt: string;
  events: OrderEvent[];
};

/** Public confirmation page: full summary of a saved order. The order code acts as the access token. */
export const getOrderConfirmation = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ orderCode: z.string().trim().min(8).max(40) }).parse(input))
  .handler(async ({ data }): Promise<OrderConfirmation | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select(
        "id, order_code, amount_cents, installments, payment_status, shipping_status, payment_link_url, customer_name, city, state, street, number, complement, district, zip, created_at",
      )
      .eq("order_code", data.orderCode.toUpperCase())
      .maybeSingle();

    if (!order) return null;

    const { data: events } = await supabaseAdmin
      .from("order_events")
      .select("title, description, happened_at")
      .eq("order_id", order.id)
      .order("happened_at", { ascending: true });

    return {
      orderCode: order.order_code,
      amountCents: order.amount_cents,
      installments: order.installments,
      paymentStatus: order.payment_status,
      shippingStatus: order.shipping_status,
      paymentUrl: order.payment_link_url,
      customerName: order.customer_name,
      city: order.city,
      state: order.state,
      street: order.street,
      number: order.number,
      complement: order.complement,
      district: order.district,
      zip: order.zip,
      createdAt: order.created_at,
      events: (events ?? []).map((event) => ({
        title: event.title,
        description: event.description,
        happenedAt: event.happened_at,
      })),
    };
  });

function assertAdmin(code: string) {
  const expected = process.env["ADMIN_ACCESS_CODE"];
  if (!expected) throw new Error("Área administrativa ainda não configurada.");
  if (code !== expected) throw new Error("Código de acesso inválido.");
}

/** Owner view: list of real orders. */
export const adminListOrders = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ code: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    assertAdmin(data.code);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [orders, settings] = await Promise.all([
      supabaseAdmin
        .from("orders")
        .select(
          "id, order_code, customer_name, phone_digits, city, state, installments, payment_status, shipping_status, tracking_code, carrier, estimated_delivery, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(100),
      supabaseAdmin
        .from("store_settings")
        .select("gateway_name, payment_link_url, max_installments, whatsapp")
        .eq("id", true)
        .maybeSingle(),
    ]);

    return {
      orders: orders.data ?? [],
      settings: settings.data ?? null,
    };
  });

/** Owner action: update payment/shipping status and tracking code of one order. */
export const adminUpdateOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        code: z.string().min(1),
        orderId: z.string().uuid(),
        paymentStatus: z.enum(["pendente", "pago", "cancelado"]),
        shippingStatus: z.string().trim().min(2).max(60),
        trackingCode: z.string().trim().max(40),
        carrier: z.string().trim().max(40),
        estimatedDelivery: z.string().trim().max(10),
        note: z.string().trim().max(160),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    assertAdmin(data.code);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: data.paymentStatus,
        shipping_status: data.shippingStatus,
        tracking_code: data.trackingCode || null,
        carrier: data.carrier || null,
        estimated_delivery: data.estimatedDelivery || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.orderId);

    if (error) throw new Error("Não foi possível salvar o pedido.");

    await supabaseAdmin.from("order_events").insert({
      order_id: data.orderId,
      title: data.shippingStatus,
      description: data.note || null,
    });

    return { ok: true };
  });

/** Owner action: save the payment link of the gateway. */
export const adminSaveSettings = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        code: z.string().min(1),
        gatewayName: z.string().trim().min(2).max(40),
        paymentLinkUrl: z.string().trim().max(400),
        maxInstallments: z.number().int().min(1).max(12),
        whatsapp: z.string().trim().max(20),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    assertAdmin(data.code);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("store_settings")
      .update({
        gateway_name: data.gatewayName,
        payment_link_url: data.paymentLinkUrl || null,
        max_installments: data.maxInstallments,
        whatsapp: data.whatsapp || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", true);

    if (error) throw new Error("Não foi possível salvar as configurações.");
    return { ok: true };
  });
