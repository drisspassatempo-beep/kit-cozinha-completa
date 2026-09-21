import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { Loader2, LockKeyhole, RefreshCw } from "lucide-react";
import { adminListOrders, adminSaveSettings, adminUpdateOrder } from "@/lib/orders.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel de pedidos | Achadinhos da China" },
      { name: "description", content: "Área restrita para acompanhar pedidos, pagamentos e códigos de rastreio." },
      { property: "og:title", content: "Painel de pedidos" },
      { property: "og:description", content: "Área restrita da loja." },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

type OrderRow = {
  id: string;
  order_code: string;
  customer_name: string;
  phone_digits: string;
  city: string;
  state: string;
  installments: number;
  payment_status: string;
  shipping_status: string;
  tracking_code: string | null;
  carrier: string | null;
  estimated_delivery: string | null;
  created_at: string;
};

type Settings = {
  gateway_name: string;
  payment_link_url: string | null;
  max_installments: number;
  whatsapp: string | null;
};

function AdminPage() {
  const list = useServerFn(adminListOrders);
  const update = useServerFn(adminUpdateOrder);
  const saveSettings = useServerFn(adminSaveSettings);

  const [code, setCode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [status, setStatus] = useState("");

  const load = async (accessCode: string) => {
    setLoading(true);
    setError("");
    try {
      const result = await list({ data: { code: accessCode } });
      setOrders(result.orders as OrderRow[]);
      setSettings((result.settings as Settings | null) ?? null);
      setAuthed(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  };

  const signIn = (event: FormEvent) => {
    event.preventDefault();
    void load(code);
  };

  if (!authed) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
        <form onSubmit={signIn} className="w-full max-w-sm rounded-lg border border-border bg-card p-7">
          <span className="grid size-11 place-items-center rounded-full bg-success-soft text-primary">
            <LockKeyhole size={20} />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold">Painel de pedidos</h1>
          <p className="mt-2 text-sm text-muted-foreground">Digite o código de acesso da loja.</p>
          <Label htmlFor="code" className="mb-2 mt-6 block">Código de acesso</Label>
          <Input id="code" type="password" value={code} onChange={(event) => setCode(event.target.value)} />
          {error && <p className="mt-3 text-sm font-semibold text-danger" role="alert">{error}</p>}
          <Button type="submit" variant="sale" size="sale" className="mt-6 w-full" disabled={loading || code.length < 1}>
            {loading ? <><Loader2 className="animate-spin" /> Entrando</> : "Entrar"}
          </Button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Pedidos</h1>
            <p className="mt-1 text-sm text-muted-foreground">{orders.length} pedido(s) registrado(s).</p>
          </div>
          <Button variant="saleOutline" size="sale" onClick={() => void load(code)} disabled={loading}>
            <RefreshCw /> Atualizar
          </Button>
        </div>

        {status && <p className="mt-4 text-sm font-semibold text-primary">{status}</p>}
        {error && <p className="mt-4 text-sm font-semibold text-danger" role="alert">{error}</p>}

        <section className="mt-8 rounded-lg border border-border bg-card p-5 sm:p-7">
          <h2 className="text-xl font-extrabold">Pagamento</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cole aqui o link de pagamento da sua gateway. Ele é usado no fim do checkout, já com o número de parcelas.
          </p>
          <SettingsForm
            settings={settings}
            onSave={async (values) => {
              setStatus("");
              setError("");
              try {
                await saveSettings({ data: { code, ...values } });
                setStatus("Configurações salvas.");
                await load(code);
              } catch (cause) {
                setError(cause instanceof Error ? cause.message : "Não foi possível salvar.");
              }
            }}
          />
        </section>

        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onSave={async (values) => {
                setStatus("");
                setError("");
                try {
                  await update({ data: { code, orderId: order.id, ...values } });
                  setStatus(`Pedido ${order.order_code} atualizado.`);
                  await load(code);
                } catch (cause) {
                  setError(cause instanceof Error ? cause.message : "Não foi possível salvar.");
                }
              }}
            />
          ))}
          {orders.length === 0 && <p className="text-sm text-muted-foreground">Nenhum pedido ainda.</p>}
        </div>
      </div>
    </main>
  );
}

function SettingsForm({
  settings,
  onSave,
}: {
  settings: Settings | null;
  onSave: (values: { gatewayName: string; paymentLinkUrl: string; maxInstallments: number; whatsapp: string }) => Promise<void>;
}) {
  const [gatewayName, setGatewayName] = useState(settings?.gateway_name ?? "Escama Black");
  const [paymentLinkUrl, setPaymentLinkUrl] = useState(settings?.payment_link_url ?? "");
  const [maxInstallments, setMaxInstallments] = useState(String(settings?.max_installments ?? 12));
  const [whatsapp, setWhatsapp] = useState(settings?.whatsapp ?? "");
  const [saving, setSaving] = useState(false);

  return (
    <form
      className="mt-5 grid gap-4 sm:grid-cols-2"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        await onSave({
          gatewayName,
          paymentLinkUrl,
          maxInstallments: Number(maxInstallments) || 1,
          whatsapp,
        });
        setSaving(false);
      }}
    >
      <div>
        <Label htmlFor="gateway" className="mb-2 block">Gateway</Label>
        <Input id="gateway" value={gatewayName} maxLength={40} onChange={(event) => setGatewayName(event.target.value)} />
      </div>
      <div>
        <Label htmlFor="whatsapp" className="mb-2 block">WhatsApp de atendimento</Label>
        <Input id="whatsapp" value={whatsapp} maxLength={20} onChange={(event) => setWhatsapp(event.target.value)} placeholder="(11) 99999-8888" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="link" className="mb-2 block">Link de pagamento</Label>
        <Input id="link" value={paymentLinkUrl} maxLength={400} onChange={(event) => setPaymentLinkUrl(event.target.value)} placeholder="https://..." />
      </div>
      <div>
        <Label htmlFor="parcelas" className="mb-2 block">Máximo de parcelas</Label>
        <Input id="parcelas" inputMode="numeric" value={maxInstallments} maxLength={2} onChange={(event) => setMaxInstallments(event.target.value.replace(/\D/g, ""))} />
      </div>
      <div className="flex items-end">
        <Button type="submit" variant="sale" size="sale" disabled={saving}>
          {saving ? <><Loader2 className="animate-spin" /> Salvando</> : "Salvar"}
        </Button>
      </div>
    </form>
  );
}

function OrderCard({
  order,
  onSave,
}: {
  order: OrderRow;
  onSave: (values: {
    paymentStatus: "pendente" | "pago" | "cancelado";
    shippingStatus: string;
    trackingCode: string;
    carrier: string;
    estimatedDelivery: string;
    note: string;
  }) => Promise<void>;
}) {
  const [paymentStatus, setPaymentStatus] = useState<"pendente" | "pago" | "cancelado">(
    (order.payment_status as "pendente" | "pago" | "cancelado") ?? "pendente",
  );
  const [shippingStatus, setShippingStatus] = useState(order.shipping_status);
  const [trackingCode, setTrackingCode] = useState(order.tracking_code ?? "");
  const [carrier, setCarrier] = useState(order.carrier ?? "");
  const [estimatedDelivery, setEstimatedDelivery] = useState(order.estimated_delivery ?? "");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const selectClass =
    "flex h-12 w-full rounded-md border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  return (
    <article className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">{order.order_code}</p>
          <p className="text-lg font-extrabold">{order.customer_name}</p>
          <p className="text-xs text-muted-foreground">
            {order.city} / {order.state} · {order.phone_digits} · {order.installments}x
          </p>
        </div>
        <span className="rounded-full bg-success-soft px-3 py-1.5 text-xs font-extrabold text-primary">{order.shipping_status}</span>
      </div>

      <form
        className="mt-5 grid gap-4 sm:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          await onSave({ paymentStatus, shippingStatus, trackingCode, carrier, estimatedDelivery, note });
          setNote("");
          setSaving(false);
        }}
      >
        <div>
          <Label htmlFor={`pay-${order.id}`} className="mb-2 block">Pagamento</Label>
          <select id={`pay-${order.id}`} className={selectClass} value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value as typeof paymentStatus)}>
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <div>
          <Label htmlFor={`ship-${order.id}`} className="mb-2 block">Status da entrega</Label>
          <select id={`ship-${order.id}`} className={selectClass} value={shippingStatus} onChange={(event) => setShippingStatus(event.target.value)}>
            {["Aguardando pagamento", "Pagamento confirmado", "Em separação", "Enviado", "Em trânsito", "Saiu para entrega", "Entregue"].map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor={`track-${order.id}`} className="mb-2 block">Código de rastreio</Label>
          <Input id={`track-${order.id}`} value={trackingCode} maxLength={40} onChange={(event) => setTrackingCode(event.target.value.toUpperCase())} />
        </div>
        <div>
          <Label htmlFor={`carrier-${order.id}`} className="mb-2 block">Transportadora</Label>
          <Input id={`carrier-${order.id}`} value={carrier} maxLength={40} onChange={(event) => setCarrier(event.target.value)} placeholder="Correios" />
        </div>
        <div>
          <Label htmlFor={`eta-${order.id}`} className="mb-2 block">Previsão de entrega</Label>
          <Input id={`eta-${order.id}`} type="date" value={estimatedDelivery} onChange={(event) => setEstimatedDelivery(event.target.value)} />
        </div>
        <div>
          <Label htmlFor={`note-${order.id}`} className="mb-2 block">Observação do cliente</Label>
          <Input id={`note-${order.id}`} value={note} maxLength={160} onChange={(event) => setNote(event.target.value)} placeholder="Opcional" />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" variant="sale" size="sale" disabled={saving}>
            {saving ? <><Loader2 className="animate-spin" /> Salvando</> : "Salvar pedido"}
          </Button>
        </div>
      </form>
    </article>
  );
}
