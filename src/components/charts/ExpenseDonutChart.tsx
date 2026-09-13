import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { COLOR_TOKEN } from "@/constants/finance";
import { formatCompactCurrency, formatCurrency } from "@/utils/format";
import type { CategorySpend } from "@/types/finance";

const PALETTE = ["brand", "accent", "success", "danger", "warning", "brand-deep", "ink"];

function colorFor(item: CategorySpend, index: number) {
  const fallbackKey = PALETTE[index % PALETTE.length] as keyof typeof COLOR_TOKEN;
  const key = item.color in COLOR_TOKEN ? (item.color as keyof typeof COLOR_TOKEN) : fallbackKey;
  return COLOR_TOKEN[key]?.css ?? "var(--brand)";
}

/** Expense distribution donut (Food, Transport, Rent, Bills, …). */
export function ExpenseDonutChart({ data }: { data: CategorySpend[] }) {
  const total = data.reduce((s, d) => s + d.total, 0);

  return (
    <div className="flex w-full max-w-full flex-col items-center gap-5 sm:flex-row sm:items-center">
      <div className="relative h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="name"
              innerRadius={48}
              outerRadius={78}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((item, index) => (
                <Cell key={item.categoryId} fill={colorFor(item, index)} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--popover-foreground)",
              }}
              formatter={(value: number, name: string) => [formatCurrency(value), name]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Total</p>
            <p className="font-display text-sm font-bold">{formatCompactCurrency(total)}</p>
          </div>
        </div>
      </div>

      <ul className="w-full max-w-full space-y-1.5 text-xs font-medium sm:max-w-[220px]">
        {data.slice(0, 7).map((item, index) => (
          <li key={item.categoryId} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-sm"
              style={{ background: colorFor(item, index) }}
            />
            <span className="min-w-0 truncate">{item.name}</span>
            <span className="tabular-nums text-muted-foreground">
              {item.percentage.toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
