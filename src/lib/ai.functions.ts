import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const QuestionInput = z.object({
  question: z.string().trim().min(3).max(300),
});

const OFFER_CONTEXT = `
Produto: Kit Pote Organizador + Talheres e Utensílios de cozinha (Achadinhos da China).
Preço promocional: R$ 12,99 (de R$ 49,90). Estoque limitado (78 unidades).
Itens inclusos: colheres, garfos, facas, conchas, espátulas, pegador, fouet (batedor), pincel e porta-utensílios.
Características: material de alta qualidade e resistente, design moderno, fácil de lavar, mantém a cozinha organizada.
Compra: o cliente clica em "Comprar agora", preenche o endereço de entrega e o pagamento acontece na etapa seguinte.
Entrega: envio rápido para todo o Brasil; o cliente acompanha o pedido na área "Acompanhe seu pedido" usando o código de rastreio, o WhatsApp ou o telefone informado na compra.
Avaliação média: 4,9 de 5 com base em avaliações de clientes.
`;

export const askAboutProduct = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => QuestionInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        reasoning: { effort: "low", summary: "auto" },
        instructions:
          "Você é o atendente da loja. Responda em português do Brasil, com no máximo 3 frases curtas, tom simpático e direto. Use apenas as informações da oferta abaixo. Se a resposta não estiver nas informações, diga que a equipe confirma pelo WhatsApp após a compra. Nunca invente prazos, valores ou políticas." +
          OFFER_CONTEXT,
        input: data.question,
      }),
    });

    if (!response.ok || !response.body) {
      const detail = await response.text().catch(() => "");
      throw new Error(`AI_GATEWAY_${response.status}:${detail.slice(0, 200)}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let answer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const event = JSON.parse(payload) as {
            type?: string;
            delta?: string;
            response?: { output_text?: string };
          };
          if (event.type === "response.output_text.delta" && event.delta) {
            answer += event.delta;
          } else if (event.type === "response.completed" && event.response?.output_text) {
            answer = event.response.output_text;
          }
        } catch {
          // ignore keep-alive / partial frames
        }
      }
    }

    return {
      answer:
        answer.trim() ||
        "Não consegui gerar a resposta agora. Envie sua dúvida pelo WhatsApp que a equipe responde rapidinho.",
    };
  });
