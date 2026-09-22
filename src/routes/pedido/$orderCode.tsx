import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BadgeCheck, Clock, CreditCard, House, MapPin, PackageSearch, Truck, UtensilsCrossed } from "lucide-react";
import { getOrderConfirmation } from "@/lib/orders.functions";

export const Route = createFileRoute("/pedido/$orderCode")({
  loader: async ({ params }) => {
    const order = await getOrderConfirmation({ data: { orderCode: params.orderCode } });
    if (!order) throw notFound();
    return order;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Pedido ${loaderData?.orderCode ?? ""} confirmado | Achadinhos da China` },
      { name: "description", content: "Confirmação do seu pedido com número, pagamento, entrega e acompanhamento." },
      { property: "og:title", content: "Pedido confirmado" },
      { property: "og:description", content: "Seu pedido foi registrado e está sendo processado." },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  notFoundComponent: () => (
    <main className="page-shell grid min-h-svh place-items-center px-4">
      <section className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center">
        <PackageSearch className="mx-auto text-gold" size={30} />
        <h1 className="mt-4 text-xl font-extrabold">Pedido não encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">Confira o número do pedido ou acompanhe pelo seu telefone na página inicial.</p>
        <Link to="/" className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-extrabold text-primary-foreground">
          <House size={17} /> Voltar à oferta
        </Link>
      </section>
    </main>
  ),
  component: OrderConfirmationPage,
});

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const PAYMENT_LABELS: Record<string, string> = {
  pendente: "Aguardando pagamento",
  pago: "Pagamento confirmado",
  cancelado: "Pagamento cancelado",
};

function OrderConfirmationPage() {
  const order = Route.useLoaderData();
  const paid = order.paymentStatus === "pago";

  return (
    <main className="page-shell min-h-svh px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="flex items-center justify-center gap-2 text-lg font-extrabold tracking-tight">
          <UtensilsCrossed className="text-primary" size={22} /> Achadinhos da china
        </Link>

        <section className="mt-8 rounded-lg border border-border bg-card p-7 text-center sm:p-10">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-success-soft text-primary">
            <BadgeCheck size={29} />
          </span>
          <p className="mt-6 text-xs font-extrabold uppercase text-gold">Pedido {order.orderCode}</p>
          <h1 className="mt-2 text-3xl font-extrabold">{paid ? "Pedido confirmado" : "Pedido registrado"}</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            {paid
              ? `Obrigado, ${order.customerName.split(" ")[0]}! Seu pagamento foi confirmado e o pedido está a caminho.`
              : `Obrigado, ${order.customerName.split(" ")[0]}! Seu pedido foi salvo e aguarda a confirmação do pagamento.`}
          </p>

          <div className="mt-7 grid gap-3 text-left sm:grid-cols-2">
            <div className="rounded-md border border-border p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground"><CreditCard size={14} /> Pagamento</p>
              <p className={`mt-2 text-sm font-extrabold ${paid ? "text-primary" : "text-gold"}`}>{PAYMENT_LABELS[order.paymentStatus] ?? order.paymentStatus}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {order.installments}x de {formatMoney(Math.round(order.amountCents / order.installments))} · total {formatMoney(order.amountCents)}
              </p>
            </div>
            <div className="rounded-md border border-border p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground"><Truck size={14} /> Entrega</p>
              <p className="mt-2 text-sm font-extrabold">{order.shippingStatus}</p>
              <p className="mt-1 text-sm text-muted-foreground">Kit organizador + utensílios</p>
            </div>
          </div>

          <div className="mt-3 rounded-md border border-border p-4 text-left">
            <p className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground"><MapPin size={14} /> Endereço de entrega</p>
            <p className="mt-2 text-sm">
              {order.street}, {order.number}{order.complement ? ` · ${order.complement}` : ""}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.district} · {order.city}/{order.state} · CEP {order.zip.replace(/(\d{5})(\d{3})/, "$1-$2")}
            </p>
          </div>

          {!paid && order.paymentUrl && (
            <a
              href={order.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-extrabold text-primary-foreground"
            >
              <CreditCard /> Pagar agora
            </a>
          )}

          <div className="mt-8 text-left">
            <p className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground"><Clock size={14} /> Acompanhamento</p>
            <ol className="mt-4 space-y-4">
              {order.events.map((event) => (
                <li key={`${event.title}-${event.happenedAt}`} className="flex gap-3">
                  <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><BadgeCheck size={15} /></span>
                  <div>
                    <p className="text-sm font-bold">{event.title}</p>
                    {event.description && <p className="text-xs text-muted-foreground">{event.description}</p>}
                    <p className="mt-1 text-xs font-semibold text-gold">{formatDate(event.happenedAt)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-8 rounded-md bg-success-soft p-4 text-xs leading-5 text-muted-foreground">
            Guarde o número <strong className="text-foreground">{order.orderCode}</strong> — ele é a chave para acompanhar sua entrega na seção "Acompanhe seu pedido".
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/" hash="rastreio" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary px-6 text-sm font-extrabold text-primary">
              <Truck size={17} /> Acompanhar entrega
            </Link>
            <Link to="/" className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-extrabold text-muted-foreground">
              <House size={17} /> Voltar à oferta
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
