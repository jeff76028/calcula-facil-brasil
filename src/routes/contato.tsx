import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contato")({
  head: () => pageHead({ title: "Contato", description: "Fale com a equipe do Conta Gênio: sugestões, correções e parcerias.", path: "/contato" }),
  component: () => (
    <StaticPage title="Contato" intro="Sugestões de ferramentas, correções ou parcerias.">
      <p>Envie sua mensagem para <a href="mailto:contato@contagenio.com.br">contato@contagenio.com.br</a>.</p>
    </StaticPage>
  ),
});
