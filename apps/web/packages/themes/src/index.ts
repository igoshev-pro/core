import { ThemeTokens } from "@/packages/renderer/src";
import { themes } from "./tokens";

export function getTheme(themeId: string): ThemeTokens {
  const t = themes[themeId];
  if (!t) throw new Error(`Unknown theme: ${themeId}`);
  return t;
}

export { themeToCssVars } from "./applyThemeCssVars";
