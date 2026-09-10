import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";

import { PaperPanel, PanelHeading } from "@/components/common/PaperPanel";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { Badge } from "@/components/ui/badge";
import { mockProfile } from "@/data/mock-data";
import { store } from "@/services/mock-store";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings · PocketWise" },
      { name: "description", content: "Manage preferences, theme, and app configuration." },
    ],
  }),
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { balanceHidden, toggleBalance } = usePreferences();

  const totalBalance = store.accounts.reduce((sum, account) => sum + account.balance, 0);

  const handleThemeChange = useCallback(
    (newTheme: "light" | "dark" | "system") => {
      setTheme(newTheme);
    },
    [setTheme]
  );

  return (
    <DashboardLayout totalBalance={totalBalance}>
      <div className="space-y-6 pb-8 max-w-2xl">
        {/* Profile Section */}
        <PaperPanel>
          <PanelHeading title="Profile" />
          <div className="mt-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="mt-1 font-medium">{mockProfile.name}</p>
              </div>
              <Badge variant="outline">{mockProfile.plan}</Badge>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">Email Address</p>
              <p className="mt-1 font-mono text-sm">{mockProfile.email}</p>
            </div>
          </div>
        </PaperPanel>

        {/* Appearance Settings */}
        <PaperPanel>
          <PanelHeading title="Appearance" />
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose how PocketWise looks
                </p>
              </div>
              <select
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value as "light" | "dark" | "system")}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </PaperPanel>

        {/* Privacy Settings */}
        <PaperPanel>
          <PanelHeading title="Privacy & Security" />
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Hide Balance</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mask balance amounts across the app
                </p>
              </div>
              <button
                onClick={toggleBalance}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  balanceHidden ? "bg-success" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    balanceHidden ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {balanceHidden && (
              <div className="rounded-md border border-border bg-secondary/40 p-3">
                <p className="text-xs text-muted-foreground">
                  ✓ Balances are now hidden. You can toggle this setting anytime.
                </p>
              </div>
            )}
          </div>
        </PaperPanel>

        {/* About Section */}
        <PaperPanel>
          <PanelHeading title="About" />
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Application</p>
                  <p className="mt-1 font-medium">PocketWise</p>
              <p className="mt-0.5 text-xs text-muted-foreground">v1.0.0</p>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="mt-1 font-medium">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </PaperPanel>
      </div>
    </DashboardLayout>
  );
}
