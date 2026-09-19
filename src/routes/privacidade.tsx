import { createFileRoute, Link } from "@tanstack/react-router";
import { UtensilsCrossed } from "lucide-react";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade | Achadinhos da China" },
      { name: "description", content: "Saiba como tratamos seus dados pessoais ao comprar o kit organizador na Achadinhos da China." },
      { property: "og:title", content: "Política de Privacidade | Achadinhos da China" },
      { property: "og:description", content: "Saiba como tratamos seus dados pessoais ao comprar o kit organizador na Achadinhos da China." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

const sections: Array<[string, string]> = [
  ["1. Dados que coletamos", "Para processar seu pedido, coletamos apenas as informações que você informa no formulário de compra: nome completo, CPF, telefone ou WhatsApp e endereço de entrega (CEP, estado, cidade, bairro, endereço, número e complemento). Também registramos a pergunta enviada na área de dúvidas para gerar a resposta automática."],
  ["2. Como usamos seus dados", "Usamos seus dados exclusivamente para processar o pedido, organizar a entrega do produto, permitir o acompanhamento pelo código de rastreio e atender suas dúvidas. Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing."],
  ["3. Compartilhamento", "Seus dados de entrega podem ser compartilhados apenas com a transportadora responsável pela entrega do pedido, no mínimo necessário para que o produto chegue até você."],
  ["4. Armazenamento e segurança", "Adotamos medidas técnicas para proteger seus dados contra acesso não autorizado. As informações são mantidas apenas pelo tempo necessário para cumprir a entrega e obrigações legais."],
  ["5. Seus direitos", "Você pode solicitar a qualquer momento a confirmação, correção ou exclusão dos seus dados pessoais, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Basta entrar em contato pelo WhatsApp informado na página de acompanhamento do pedido."],
  ["6. Cookies", "Esta página não utiliza cookies de rastreamento de terceiros. Utilizamos apenas recursos técnicos essenciais para o funcionamento da loja."],
  ["7. Alterações desta política", "Podemos atualizar esta política para refletir melhorias na loja. A versão vigente estará sempre disponível nesta página."],
];

function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="page-shell flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3" aria-label="Voltar para a loja">
            <span className="grid size-9 place-items-center rounded-full bg-gold text-gold-foreground"><UtensilsCrossed size={18} /></span>
            <span className="text-lg font-extrabold leading-none">Achadinhos da china<small className="mt-1 block text-[10px] font-semibold uppercase text-gold">MAIS PRÁTICA</small></span>
          </Link>
          <Link to="/termos" className="text-sm font-semibold text-muted-foreground hover:text-foreground">Termos de Uso</Link>
        </div>
      </header>
      <div className="page-shell max-w-3xl py-12 sm:py-16">
        <p className="text-xs font-extrabold uppercase text-gold">Documento legal</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Política de Privacidade</h1>
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
          Ficou com dúvida? <Link to="/" className="font-semibold text-primary hover:underline">Voltar para a loja</Link>
        </p>
      </div>
    </main>
  );
}
