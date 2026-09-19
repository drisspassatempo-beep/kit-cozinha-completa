import { createFileRoute, Link } from "@tanstack/react-router";
import { UtensilsCrossed } from "lucide-react";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso | Achadinhos da China" },
      { name: "description", content: "Condições de compra, entrega, troca e uso da loja Achadinhos da China." },
      { property: "og:title", content: "Termos de Uso | Achadinhos da China" },
      { property: "og:description", content: "Condições de compra, entrega, troca e uso da loja Achadinhos da China." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

const sections: Array<[string, string]> = [
  ["1. Sobre a loja", "A Achadinhos da China é uma loja online que comercializa utensílios de cozinha, incluindo o kit pote organizador com talheres. Ao navegar ou comprar nesta página, você concorda com estes Termos de Uso."],
  ["2. Oferta e preços", "O kit organizador é oferecido por R$ 12,99 (preço promocional, de R$ 49,90), enquanto durar o estoque. A contagem de unidades disponíveis exibida na página é atualizada conforme a disponibilidade e pode variar."],
  ["3. Pedidos", "Para concluir o pedido, você informa seus dados de contato e endereço de entrega. O pedido é confirmado após a conclusão das etapas de endereço e pagamento. Reservamo-nos o direito de cancelar pedidos com informações incompletas ou incorretas, com reembolso integral quando houver cobrança."],
  ["4. Entrega e rastreio", "Após a confirmação, o pedido recebe um código de rastreio que pode ser consultado na área “Acompanhe seu pedido”, usando o código, o WhatsApp ou o telefone cadastrado. Os prazos de entrega são estimativas e podem variar conforme a região."],
  ["5. Trocas e devoluções", "Você pode solicitar a troca ou devolução em até 7 dias após o recebimento, conforme o Código de Defesa do Consumidor, desde que o produto esteja sem sinais de uso e na embalagem original."],
  ["6. Conteúdo da página", "As avaliações de clientes exibidas refletem experiências de compradores. Imagens e descrições do produto têm caráter ilustrativo e buscam representar fielmente o item ofertado."],
  ["7. Contato", "Dúvidas sobre pedidos, trocas ou estes termos podem ser enviadas pelo WhatsApp informado na área de acompanhamento do pedido."],
];

function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="page-shell flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3" aria-label="Voltar para a loja">
            <span className="grid size-9 place-items-center rounded-full bg-gold text-gold-foreground"><UtensilsCrossed size={18} /></span>
            <span className="text-lg font-extrabold leading-none">Achadinhos da china<small className="mt-1 block text-[10px] font-semibold uppercase text-gold">MAIS PRÁTICA</small></span>
          </Link>
          <Link to="/privacidade" className="text-sm font-semibold text-muted-foreground hover:text-foreground">Política de Privacidade</Link>
        </div>
      </header>
      <div className="page-shell max-w-3xl py-12 sm:py-16">
        <p className="text-xs font-extrabold uppercase text-gold">Documento legal</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Termos de Uso</h1>
        <p className="mt-3 text-sm text-muted-foreground">Última atualização: setembro de 2026.</p>
        <div className="mt-10 space-y-8">
          {sections.map(([title, body]) => (
            <section key={title}>
              <h2 className="text-lg font-extrabold">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{body}</p>
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-muted-foreground">
          <Link to="/" className="font-semibold text-primary hover:underline">Voltar para a loja</Link>
        </p>
      </div>
    </main>
  );
}
