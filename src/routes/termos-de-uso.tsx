import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/termos-de-uso")({
  head: () => pageHead({ title: "Termos de Uso", description: "Termos e condições de uso das ferramentas do Conta Gênio.", path: "/termos-de-uso" }),
  component: () => (
    <StaticPage title="Termos de Uso">
      <p>As ferramentas são oferecidas gratuitamente, para fins informativos. Os resultados são estimativas e não substituem orientação profissional.</p>
      <p>Ao usar o site, você concorda em não utilizá-lo para fins ilícitos. Estes termos podem ser atualizados a qualquer momento.</p>
    </StaticPage>
  ),
});
