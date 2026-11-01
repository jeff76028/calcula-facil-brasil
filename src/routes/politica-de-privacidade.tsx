import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => pageHead({ title: "Política de Privacidade", description: "Como o Calcula Fácil trata seus dados, em conformidade com a LGPD.", path: "/politica-de-privacidade" }),
  component: () => (
    <StaticPage title="Política de Privacidade">
      <h2>Dados digitados nas ferramentas</h2>
      <p>Os cálculos são realizados no seu navegador. Não enviamos nem armazenamos os valores que você digita.</p>
      <h2>Publicidade</h2>
      <p>No futuro, o site poderá exibir anúncios do Google AdSense, que podem usar cookies conforme as políticas do Google. Esta política será atualizada antes disso.</p>
      <h2>Seus direitos</h2>
      <p>Em conformidade com a LGPD (Lei nº 13.709/2018), você pode entrar em contato pela página de contato para dúvidas.</p>
    </StaticPage>
  ),
});
