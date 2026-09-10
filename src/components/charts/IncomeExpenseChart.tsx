import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactCurrency, formatCurrency } from "@/utils/format";

export interface IncomeExpensePoint {
  label: string;
  income: number;
  expense: number;
}

/** Income vs Expense grouped bars. */
export function IncomeExpenseChart({ data }: { data: IncomeExpensePoint[] }) {
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -12 }} barGap={4}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          />
          <YAxis
            tickFormatter={(v: number) => formatCompactCurrency(v)}
            tickLine={false}
            axisLine={false}
            width={64}
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          />
          <Tooltip
            cursor={{ fill: "var(--secondary)" }}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--popover-foreground)",
            }}
            formatter={(value: number, name: string) => [formatCurrency(value), name]}
          />
          <Bar dataKey="income" name="Income" fill="var(--brand)" radius={[3, 3, 0, 0]} />
          <Bar dataKey="expense" name="Expense" fill="var(--danger)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
