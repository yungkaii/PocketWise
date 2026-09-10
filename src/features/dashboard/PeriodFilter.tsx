import { PERIOD_PRESETS, type PeriodPreset } from "@/constants/finance";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { DateRange } from "@/utils/date";

interface PeriodFilterProps {
  value: PeriodPreset;
  onChange: (preset: PeriodPreset) => void;
  customRange: DateRange;
  onCustomRangeChange: (range: DateRange) => void;
}

/** This Week / This Month / Last Month / Custom range switch. */
export function PeriodFilter({
  value,
  onChange,
  customRange,
  onCustomRangeChange,
}: PeriodFilterProps) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg bg-secondary p-1 text-sm font-medium">
      {PERIOD_PRESETS.map((preset) =>
        preset.id === "custom" ? (
          <Popover key={preset.id}>
            <PopoverTrigger
              onClick={() => onChange("custom")}
              className={cn(
                "rounded-md px-3 py-1.5 transition-colors",
                value === preset.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {preset.label}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 space-y-3">
              <label className="block text-xs font-medium text-muted-foreground">
                From
                <input
                  type="date"
                  value={customRange.from}
                  onChange={(e) => onCustomRangeChange({ ...customRange, from: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                />
              </label>
              <label className="block text-xs font-medium text-muted-foreground">
                To
                <input
                  type="date"
                  value={customRange.to}
                  onChange={(e) => onCustomRangeChange({ ...customRange, to: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                />
              </label>
            </PopoverContent>
          </Popover>
        ) : (
          <button
            key={preset.id}
            onClick={() => onChange(preset.id)}
            className={cn(
              "rounded-md px-3 py-1.5 transition-colors",
              value === preset.id
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {preset.label}
          </button>
        ),
      )}
    </div>
  );
}
