import { useContext } from "react";
import { ThemeProviderContext } from "@/context/theme-provider-context";

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
