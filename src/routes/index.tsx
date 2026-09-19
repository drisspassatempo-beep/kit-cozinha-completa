import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  House,
  Loader2,
  LockKeyhole,
  MessageCircleQuestion,
  PackageCheck,
  PackageSearch,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import productImage from "@/assets/kitchen-utensil-kit.jpg";
import { askAboutProduct } from "@/lib/ai.functions";
import { lookupTracking, type TrackingResult } from "@/lib/tracking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kit Organizador + Utensílios | Sua Cozinha" },
      { name: "description", content: "Kit completo com organizador, talheres e utensílios para uma cozinha prática e bonita." },
      { property: "og:title", content: "Kit Organizador + Utensílios | Sua Cozinha" },
      { property: "og:description", content: "Organize sua cozinha com um kit completo de utensílios por R$ 12,99." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Storefront,
});

const addressSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo.").max(100, "Use no máximo 100 caracteres."),
  cpf: z.string().refine(isValidCpf, "Informe um CPF válido."),
  phone: z.string().refine((value) => /^\d{10,11}$/.test(digits(value)), "Informe um telefone com DDD."),
  zip: z.string().refine((value) => /^\d{8}$/.test(digits(value)), "Informe um CEP válido."),
  state: z.string().length(2, "Selecione o estado."),
  city: z.string().trim().min(2, "Informe a cidade.").max(80, "Use no máximo 80 caracteres."),
  district: z.string().trim().min(2, "Informe o bairro.").max(80, "Use no máximo 80 caracteres."),
  street: z.string().trim().min(3, "Informe o endereço.").max(120, "Use no máximo 120 caracteres."),
  number: z.string().trim().min(1, "Informe o número.").max(12, "Use no máximo 12 caracteres."),
  complement: z.string().trim().max(80, "Use no máximo 80 caracteres."),
});

type AddressData = z.infer<typeof addressSchema>;
type FieldErrors = Partial<Record<keyof AddressData, string>>;

const initialAddress: AddressData = {
  name: "", cpf: "", phone: "", zip: "", state: "", city: "", district: "", street: "", number: "", complement: "",
};

const kitItems = ["Colheres", "Garfos", "Facas", "Conchas", "Espátulas", "Pegador", "Fouet (batedor)", "Pincel", "Porta-utensílios", "E muito mais"];
const reviews = [
  ["Produto excelente! Chegou bem embalado e super completo. Amei!", "Juliana S. · Rio de Janeiro / RJ"],
  ["Muito lindo e de ótima qualidade! Já uso todos os dias.", "Carlos M. · São Paulo / SP"],
  ["Realmente vale a pena! Organizou minha cozinha e ficou linda!", "Beatriz L. · Minas Gerais / MG"],
  ["Chegou antes do prazo e tudo certinho. É exatamente o que eu precisava!", "Fernanda T. · Bahia / BA"],
];
const benefits: Array<[LucideIcon, string]> = [
  [ShieldCheck, "Material de alta qualidade"],
  [Sparkles, "Design moderno e elegante"],
  [House, "Cozinha sempre organizada"],
  [PackageCheck, "Praticidade no dia a dia"],
];

function digits(value: string) { return value.replace(/\D/g, ""); }
function isValidCpf(value: string) {
  const cpf = digits(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  const check = (size: number) => {
    const sum = cpf.slice(0, size).split("").reduce((total, n, index) => total + Number(n) * (size + 1 - index), 0);
    const result = (sum * 10) % 11;
    return Number(cpf[size]) === (result === 10 ? 0 : result);
  };
  return check(9) && check(10);
}
function formatCpf(value: string) { return digits(value).slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2"); }
function formatPhone(value: string) { return digits(value).slice(0, 11).replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{4})$/, "$1-$2"); }
function formatZip(value: string) { return digits(value).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2"); }

function Storefront() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    document.body.style.overflow = checkoutOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [checkoutOpen]);

  const openCheckout = () => { setStep(1); setCheckoutOpen(true); };

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground">
      <header className="border-b border-border bg-background/95">
        <div className="page-shell flex h-16 items-center justify-between">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Sua Cozinha — início">
            <span className="grid size-9 place-items-center rounded-full bg-gold text-gold-foreground"><UtensilsCrossed size={18} /></span>
            <span className="text-lg font-extrabold leading-none">Achadinhos da china<small className="mt-1 block text-[10px] font-semibold uppercase text-gold">MAIS PRÁTICA</small></span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-muted-foreground md:flex" aria-label="Navegação principal">
            <a href="#incluso" className="hover:text-foreground">O kit</a><a href="#beneficios" className="hover:text-foreground">Benefícios</a><a href="#avaliacoes" className="hover:text-foreground">Avaliações</a><a href="#duvidas" className="hover:text-foreground">Dúvidas</a><a href="#rastreio" className="hover:text-foreground">Meu pedido</a>
          </nav>
          <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><LockKeyhole size={15} /> Compra segura</span>
        </div>
      </header>

      <section id="inicio" className="subtle-grid border-b border-border py-10 sm:py-16">
        <div className="page-shell grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <span className="inline-flex rounded bg-gold px-3 py-1 text-xs font-extrabold uppercase text-gold-foreground">Kit completo</span>
            <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">Pote organizador + talheres e utensílios</h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">Tudo o que você precisa para uma cozinha mais prática, bonita e organizada.</p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold">
              {["Alta qualidade", "Resistente", "Design moderno"].map((item) => <span key={item} className="flex items-center gap-2"><Check className="text-primary" size={17} />{item}</span>)}
            </div>
            <div className="mt-8 flex flex-wrap items-end gap-x-7 gap-y-4 border-y border-border py-5">
              <div><p className="text-sm text-muted-foreground line-through">De R$ 49,90</p><p className="text-4xl font-extrabold">R$ 12,99</p></div>
              <span className="mb-1 rounded bg-destructive px-3 py-1.5 text-xs font-extrabold text-destructive-foreground">Restam apenas 78 unidades</span>
            </div>
            <Button variant="sale" size="sale" className="mt-7 w-full sm:w-auto" onClick={openCheckout}>Comprar agora <ArrowRight /></Button>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground"><span>🚚 Entrega rápida</span><span>💳 Pagamento seguro</span><span>🛡️ Satisfação garantida</span></div>
          </div>
          <div className="order-1 overflow-hidden rounded-lg border border-border bg-card lg:order-2">
            <img src={productImage} alt="Kit preto com organizador, talheres e utensílios de cozinha" width={1408} height={1104} className="aspect-[1.25] w-full object-cover" />
          </div>
        </div>
      </section>

      <section id="incluso" className="bg-surface-soft py-16 text-gold-foreground sm:py-20">
        <div className="page-shell grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="text-xs font-extrabold uppercase text-primary">Conteúdo do kit</p><h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Tudo organizado. Tudo à mão.</h2><p className="mt-4 max-w-lg text-base opacity-70">Um conjunto completo para preparar, servir e organizar suas refeições.</p>
            <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-4">{kitItems.map((item) => <li key={item} className="flex items-center gap-3 text-sm font-semibold"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold"><Check size={14} /></span>{item}</li>)}</ul>
          </div>
          <div className="grid grid-cols-2 gap-3"><img src={productImage} alt="Utensílios no porta-utensílios" loading="lazy" width={1408} height={1104} className="col-span-2 aspect-[2.1] w-full rounded-lg object-cover object-left" /><img src={productImage} alt="Detalhe dos utensílios pretos" loading="lazy" width={1408} height={1104} className="aspect-square w-full rounded-lg object-cover object-left" /><img src={productImage} alt="Detalhe do organizador de talheres" loading="lazy" width={1408} height={1104} className="aspect-square w-full rounded-lg object-cover object-right" /></div>
        </div>
      </section>

      <section id="beneficios" className="border-y border-border bg-background py-10"><div className="page-shell grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(([BenefitIcon, label]) => <div key={label} className="flex items-center gap-4 lg:flex-col lg:text-center"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-success-soft text-primary"><BenefitIcon size={21} /></span><h3 className="text-sm font-bold">{label}</h3></div>)}
      </div></section>

      <section id="avaliacoes" className="py-16 sm:py-20"><div className="page-shell"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-extrabold uppercase text-gold">Experiências reais</p><h2 className="mt-2 text-3xl font-extrabold">Quem comprou, recomenda</h2></div><div className="flex items-center gap-3"><span className="text-2xl font-extrabold">4,9</span><span className="text-sm text-gold">★★★★★</span></div></div>
        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{reviews.map(([text,author]) => <article key={author} className="rounded-lg border border-border bg-card p-5"><div className="text-sm text-gold" aria-label="5 estrelas">★★★★★</div><blockquote className="mt-4 text-sm leading-6 text-card-foreground">“{text}”</blockquote><p className="mt-5 text-xs font-bold text-muted-foreground">{author}</p></article>)}</div>
      </div></section>

      <ProductQuestions />
      <OrderTracking />


      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-strong bg-background/95 px-4 py-3 backdrop-blur"><div className="mx-auto flex max-w-4xl items-center justify-between gap-4"><div className="hidden sm:block"><p className="text-xs font-bold uppercase text-gold">Oferta especial</p><p className="font-extrabold">R$ 12,99 <span className="ml-2 text-xs font-medium text-muted-foreground line-through">R$ 49,90</span></p></div><Button variant="sale" size="sale" className="w-full sm:w-auto" onClick={openCheckout}>Comprar agora <ChevronRight /></Button></div></div>

      {checkoutOpen && <Checkout step={step} setStep={setStep} onClose={() => setCheckoutOpen(false)} />}
    </main>
  );
}

function Checkout({ step, setStep, onClose }: { step: 1 | 2; setStep: (step: 1 | 2) => void; onClose: () => void }) {
  const [data, setData] = useState(initialAddress);
  const [errors, setErrors] = useState<FieldErrors>({});
  const update = (field: keyof AddressData, value: string) => { setData((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: undefined })); };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = addressSchema.safeParse(data);
    if (!result.success) {
      const nextErrors: FieldErrors = {};
      result.error.issues.forEach((issue) => { const key = issue.path[0] as keyof AddressData; if (!nextErrors[key]) nextErrors[key] = issue.message; });
      setErrors(nextErrors);
      return;
    }
    setStep(2);
  };
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-background px-4 py-5 sm:py-8" role="dialog" aria-modal="true" aria-label="Finalizar pedido"><div className="mx-auto max-w-2xl">
    <div className="flex items-center justify-between"><Button variant="ghost" onClick={step === 2 ? () => setStep(1) : onClose}><ArrowLeft /> Voltar</Button><span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><LockKeyhole size={14} /> Ambiente seguro</span></div>
    <ol className="mt-5 grid grid-cols-3 gap-2" aria-label="Progresso da compra">{["Endereço","Pagamento","Confirmação"].map((label,index) => <li key={label} className={`border-t-2 pt-3 text-xs font-bold ${index < step ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}><span className={`mr-2 inline-grid size-6 place-items-center rounded-full ${index < step ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{index + 1}</span><span className="hidden sm:inline">{label}</span></li>)}</ol>
    {step === 1 ? <form onSubmit={submit} noValidate className="mt-7 rounded-lg border border-border bg-card p-5 sm:p-8"><div className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-success-soft text-primary"><Truck size={21} /></span><div><h2 className="text-2xl font-extrabold">Endereço de entrega</h2><p className="mt-1 text-sm text-muted-foreground">O pagamento acontece somente na próxima etapa.</p></div></div>
      <div className="mt-6 flex justify-between rounded-md bg-success-soft p-4 text-sm"><span>Kit organizador + utensílios</span><strong>R$ 12,99</strong></div>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field className="sm:col-span-2" id="name" label="Nome completo" error={errors.name}><Input id="name" autoComplete="name" maxLength={100} value={data.name} onChange={(e) => update("name", e.target.value)} aria-invalid={Boolean(errors.name)} /></Field>
        <Field id="cpf" label="CPF" error={errors.cpf}><Input id="cpf" inputMode="numeric" maxLength={14} value={data.cpf} onChange={(e) => update("cpf", formatCpf(e.target.value))} aria-invalid={Boolean(errors.cpf)} placeholder="000.000.000-00" /></Field>
        <Field id="phone" label="WhatsApp / telefone" error={errors.phone}><Input id="phone" type="tel" autoComplete="tel" maxLength={15} value={data.phone} onChange={(e) => update("phone", formatPhone(e.target.value))} aria-invalid={Boolean(errors.phone)} placeholder="(00) 00000-0000" /></Field>
        <Field id="zip" label="CEP" error={errors.zip}><Input id="zip" inputMode="numeric" autoComplete="postal-code" maxLength={9} value={data.zip} onChange={(e) => update("zip", formatZip(e.target.value))} aria-invalid={Boolean(errors.zip)} placeholder="00000-000" /></Field>
        <Field id="state" label="Estado" error={errors.state}><select id="state" value={data.state} onChange={(e) => update("state", e.target.value)} aria-invalid={Boolean(errors.state)} className="flex h-12 w-full rounded-md border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"><option value="">Selecione</option>{["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => <option key={uf}>{uf}</option>)}</select></Field>
        <Field id="city" label="Cidade" error={errors.city}><Input id="city" autoComplete="address-level2" maxLength={80} value={data.city} onChange={(e) => update("city", e.target.value)} aria-invalid={Boolean(errors.city)} /></Field>
        <Field id="district" label="Bairro" error={errors.district}><Input id="district" maxLength={80} value={data.district} onChange={(e) => update("district", e.target.value)} aria-invalid={Boolean(errors.district)} /></Field>
        <Field className="sm:col-span-2" id="street" label="Endereço" error={errors.street}><Input id="street" autoComplete="street-address" maxLength={120} value={data.street} onChange={(e) => update("street", e.target.value)} aria-invalid={Boolean(errors.street)} /></Field>
        <Field id="number" label="Número" error={errors.number}><Input id="number" maxLength={12} value={data.number} onChange={(e) => update("number", e.target.value)} aria-invalid={Boolean(errors.number)} /></Field>
        <Field id="complement" label="Complemento" optional error={errors.complement}><Input id="complement" maxLength={80} value={data.complement} onChange={(e) => update("complement", e.target.value)} /></Field>
      </div><Button type="submit" variant="sale" size="sale" className="mt-8 w-full">Ir para pagamento <ArrowRight /></Button><p className="mt-3 text-center text-xs text-muted-foreground">Seus dados são usados apenas para esta simulação de pedido.</p>
    </form> : <section className="mt-7 rounded-lg border border-border bg-card p-7 text-center sm:p-10"><span className="mx-auto grid size-14 place-items-center rounded-full bg-success-soft text-primary"><BadgeCheck size={29} /></span><p className="mt-6 text-xs font-extrabold uppercase text-gold">Endereço validado</p><h2 className="mt-2 text-2xl font-extrabold">Pronto para o pagamento</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">Esta demonstração não realiza cobranças. Em uma loja publicada, as formas de pagamento apareceriam aqui.</p><Button variant="saleOutline" size="sale" className="mt-7" onClick={onClose}>Voltar à oferta</Button></section>}
    <p className="mt-6 text-center text-xs text-muted-foreground">Compra protegida · Dados criptografados · Atendimento seguro</p>
  </div></div>;
}

function Field({ id, label, optional, error, className, children }: { id: string; label: string; optional?: boolean | undefined; error?: string | undefined; className?: string | undefined; children: ReactNode }) {
  return <div className={className}><Label htmlFor={id} className="mb-2 block">{label} {optional ? <span className="font-normal text-muted-foreground">(opcional)</span> : <span aria-hidden="true">*</span>}</Label>{children}{error && <p className="mt-1.5 text-xs font-semibold text-danger" role="alert">{error}</p>}</div>;
}

function ProductQuestions() {
  const ask = useServerFn(askAboutProduct);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const suggestions = ["Quantas peças vêm no kit?", "O material é resistente?", "Em quanto tempo chega?", "Pode ir na lava-louças?"];

  const send = async (text: string) => {
    const value = text.trim();
    if (value.length < 3 || loading) return;
    setLoading(true); setError(""); setAnswer("");
    try {
      const result = await ask({ data: { question: value } });
      setAnswer(result.answer);
    } catch {
      setError("Não foi possível responder agora. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="duvidas" className="border-y border-border bg-surface-soft py-16 text-gold-foreground sm:py-20">
      <div className="page-shell max-w-3xl">
        <p className="text-xs font-extrabold uppercase text-primary">Tire suas dúvidas</p>
        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Pergunte sobre o produto</h2>
        <p className="mt-3 text-base opacity-70">Um assistente responde na hora com as informações da oferta.</p>
        <form onSubmit={(event) => { event.preventDefault(); void send(question); }} className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Input value={question} maxLength={300} onChange={(event) => setQuestion(event.target.value)} placeholder="Ex.: o porta-utensílios acompanha o kit?" aria-label="Sua pergunta sobre o produto" className="h-12" />
          <Button type="submit" variant="sale" size="sale" disabled={loading || question.trim().length < 3}>
            {loading ? <><Loader2 className="animate-spin" /> Respondendo</> : <><MessageCircleQuestion /> Perguntar</>}
          </Button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <button key={item} type="button" onClick={() => { setQuestion(item); void send(item); }} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold opacity-80 hover:opacity-100">{item}</button>
          ))}
        </div>
        {error && <p className="mt-5 text-sm font-semibold text-danger" role="alert">{error}</p>}
        {answer && (
          <div className="mt-6 rounded-lg border border-border bg-card p-5 text-card-foreground" aria-live="polite">
            <p className="text-xs font-extrabold uppercase text-gold">Resposta</p>
            <p className="mt-2 whitespace-pre-line text-sm leading-6">{answer}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function OrderTracking() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    if (value.length < 8) {
      setResult(null);
      setError("Informe o código de rastreio, o WhatsApp ou o telefone da compra.");
      return;
    }
    setError("");
    setResult(lookupTracking(value));
  };

  return (
    <section id="rastreio" className="py-16 sm:py-20">
      <div className="page-shell max-w-3xl">
        <p className="text-xs font-extrabold uppercase text-gold">Acompanhe seu pedido</p>
        <h2 className="mt-2 text-3xl font-extrabold">Onde está o meu kit?</h2>
        <p className="mt-3 text-sm text-muted-foreground">Consulte pelo código de rastreio ou pelo WhatsApp/telefone usado na compra.</p>
        <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Input value={query} maxLength={40} onChange={(event) => setQuery(event.target.value)} placeholder="BR123456789SC ou (11) 99999-8888" aria-label="Código de rastreio, WhatsApp ou telefone" className="h-12" />
          <Button type="submit" variant="saleOutline" size="sale"><PackageSearch /> Consultar</Button>
        </form>
        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><Phone size={13} /> Também atendemos pelo WhatsApp informado no pedido.</p>
        {error && <p className="mt-4 text-sm font-semibold text-danger" role="alert">{error}</p>}
        {result && (
          <div className="mt-7 rounded-lg border border-border bg-card p-5 sm:p-7" aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">Código de rastreio</p>
                <p className="text-lg font-extrabold">{result.code}</p>
              </div>
              <span className="rounded-full bg-success-soft px-3 py-1.5 text-xs font-extrabold text-primary">{result.status}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{result.estimate}</p>
            <ol className="mt-6 space-y-5">
              {result.steps.map((step) => (
                <li key={step.title} className="flex gap-4">
                  <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${step.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {step.done ? <Check size={15} /> : <Truck size={15} />}
                  </span>
                  <div>
                    <p className={`text-sm font-bold ${step.done ? "" : "text-muted-foreground"}`}>{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                    <p className="mt-1 text-xs font-semibold text-gold">{step.date}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs text-muted-foreground">Acompanhamento demonstrativo, para ilustrar a experiência de entrega.</p>
          </div>
        )}
      </div>
    </section>
  );
}
