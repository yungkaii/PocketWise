import { Input } from "@/components/ui/input";
import { useCallback } from "react";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Flexible currency input that accepts:
 * - "1000000" → displays as "1.000.000"
 * - "1.000.000" → normalizes to "1000000"
 * - "1jt" → converts to "1000000"
 * - "2,5jt" → converts to "2500000"
 * - "500rb" → converts to "500000"
 */
export function CurrencyInput({ value, onChange, placeholder, disabled }: CurrencyInputProps) {
  const parseAndNormalize = useCallback((input: string): string => {
    let cleaned = input.toLowerCase().trim();

    // Handle "jt" (juta = million)
    if (cleaned.includes("jt")) {
      cleaned = cleaned.replace("jt", "");
      const num = parseFloat(cleaned.replace(/\D/g, ""));
      if (!isNaN(num)) {
        return Math.round(num * 1_000_000).toString();
      }
    }

    // Handle "rb" (ribu = thousand)
    if (cleaned.includes("rb")) {
      cleaned = cleaned.replace("rb", "");
      const num = parseFloat(cleaned.replace(/\D/g, ""));
      if (!isNaN(num)) {
        return Math.round(num * 1_000).toString();
      }
    }

    // Remove all non-digit characters
    const digitsOnly = cleaned.replace(/\D/g, "");
    return digitsOnly;
  }, []);

  const formatDisplay = useCallback((numStr: string): string => {
    if (!numStr) return "";
    // Add thousands separator
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const normalized = parseAndNormalize(input);
    onChange(normalized);
  };

  const displayValue = formatDisplay(value);

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder || "0"}
      disabled={disabled}
      inputMode="decimal"
    />
  );
}
