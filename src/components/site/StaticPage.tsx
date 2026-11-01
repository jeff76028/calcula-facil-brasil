import type { ReactNode } from "react";
import { PageHeader } from "./Layout";

export function StaticPage({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <>
      <PageHeader crumbs={[{ label: "Início", to: "/" }, { label: title }]} title={title} {...(intro ? { intro } : {})} />
      <div className="container-site prose-site max-w-3xl pt-10">{children}</div>
    </>
  );
}
