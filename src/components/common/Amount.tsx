import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";
import { usePreferences } from "@/contexts/PreferencesContext";

interface AmountProps {
  value: number;
  signed?: boolean;
  /** Respects the global hide-balance toggle. */
  privacy?: boolean;
  className?: string;
}

/** Reusable currency renderer (IDR) with optional privacy masking. */
export function Amount({ value, signed, privacy, className }: AmountProps) {
  const { balanceHidden } = usePreferences();
  const masked = privacy && balanceHidden;
  const formatOptions = signed ? { signed: true } : undefined;

  return (
    <span className={cn("tabular-nums", className)}>
      {masked ? "Rp ••••••" : formatCurrency(value, formatOptions)}
    </span>
  );
}
