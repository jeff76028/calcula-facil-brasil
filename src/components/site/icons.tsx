import { Calculator, Wallet, Home, CalendarClock, Type, type LucideIcon } from "lucide-react";
import type { CategorySlug } from "@/data/categories";

export const categoryIcons: Record<CategorySlug, LucideIcon> = {
  matematica: Calculator,
  financas: Wallet,
  "casa-e-construcao": Home,
  cotidiano: CalendarClock,
  produtividade: Type,
};
