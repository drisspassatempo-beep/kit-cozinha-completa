export type TrackingStep = {
  title: string;
  description: string;
  date: string;
  done: boolean;
};

export type TrackingResult = {
  code: string;
  status: string;
  estimate: string;
  steps: TrackingStep[];
};

const STEP_TEMPLATES: Array<[string, string]> = [
  ["Pedido confirmado", "Recebemos seu pedido e a separação foi iniciada."],
  ["Pedido enviado", "Seu kit saiu do centro de distribuição."],
  ["Em trânsito", "O pacote está a caminho da sua cidade."],
  ["Saiu para entrega", "O entregador está com o seu pedido hoje."],
  ["Entregue", "Pedido entregue. Boas receitas!"],
];

const STATUS_LABELS = ["Em separação", "Enviado", "Em trânsito", "Saiu para entrega", "Entregue"];

function hashOf(value: string) {
  let hash = 0;
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) % 100000;
  return hash;
}

function formatDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

/** Demonstração: gera um acompanhamento consistente a partir do dado informado. */
export function lookupTracking(query: string): TrackingResult {
  const clean = query.replace(/\s+/g, "").toUpperCase();
  const hash = hashOf(clean);
  const reached = hash % 5;
  const code = /^[A-Z]{2}\d{9}[A-Z]{2}$/.test(clean)
    ? clean
    : `BR${String(100000000 + (hash * 811) % 899999999)}SC`;

  const steps = STEP_TEMPLATES.map(([title, description], index) => ({
    title,
    description,
    date: index <= reached ? formatDate(reached - index) : "Previsto",
    done: index <= reached,
  }));

  return {
    code,
    status: STATUS_LABELS[reached] ?? "Em trânsito",
    estimate: reached === 4 ? "Entrega concluída" : `Previsão de entrega em ${5 - reached} dia(s) útil(eis)`,
    steps,
  };
}
