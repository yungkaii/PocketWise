/**
 * App-wide UI preferences. Currently holds the balance-privacy toggle
 * (hide/show total balance) so it stays consistent across pages.
 */
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface PreferencesContextValue {
  balanceHidden: boolean;
  toggleBalance: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue>({
  balanceHidden: false,
  toggleBalance: () => {},
});

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [balanceHidden, setBalanceHidden] = useState(false);
  const toggleBalance = useCallback(() => setBalanceHidden((v) => !v), []);

  return (
    <PreferencesContext.Provider value={{ balanceHidden, toggleBalance }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
