import { ThemeTokens } from "@/packages/renderer/src";

export function themeToCssVars(theme: ThemeTokens): string {
  const lines = Object.entries(theme.vars).map(([k, v]) => `--${k}: ${v};`);
  return `:root{${lines.join("")}}`;
}
