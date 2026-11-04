import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/politica-de-cookies")({
  head: () => pageHead({ title: "Política de Cookies", description: "Saiba como o Conta Gênio utiliza cookies.", path: "/politica-de-cookies" }),
  component: () => (
    <StaticPage title="Política de Cookies">
      <p>Atualmente o Conta Gênio não utiliza cookies de rastreamento próprios.</p>
      <p>Caso anúncios ou ferramentas de análise sejam adicionados, cookies de terceiros poderão ser usados, e esta página será atualizada. Você pode gerenciar cookies nas configurações do seu navegador.</p>
    </StaticPage>
  ),
});
