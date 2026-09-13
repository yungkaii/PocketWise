/**
 * Hook untuk mengambil ringkasan dashboard, dan otomatis refresh
 * setiap kali ada perubahan (insert/update/delete) pada tabel
 * accounts atau transactions milik user yang sedang login.
 */
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { dashboardService, type DashboardSummary } from "@/services/dashboardService";
import type { DateRange } from "@/utils/date";

export function useDashboardRealtime(range: DateRange) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      const data = await dashboardService.getSummary(range);
      setSummary(data);
      setError(null);
    } catch (err: any) {
      setError(err.message ?? "Gagal memuat data dashboard.");
    } finally {
      setLoading(false);
    }
  }, [range.from, range.to]);

  useEffect(() => {
    setLoading(true);
    fetchSummary();

    // Subscribe ke perubahan tabel accounts & transactions secara real-time.
    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "accounts" },
        () => {
          fetchSummary();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => {
          fetchSummary();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
}