import { ThemeTokens } from "@/packages/renderer/src";

export const themes: Record<string, ThemeTokens> = {
  "default": {
    _id: "default",
    vars: {
      "color-primary": "#22C55E",
      "color-primary-2": "#00C7BE",
      "color-secondary": "#333F4E",
      "color-gray": "#F2F4F8",
      "font-sans": '"Montserrat"',
    },
  },
  "default-red": {
    _id: "default",
    vars: {
      "color-primary": "#FF5F57",
      "color-secondary": "#0088FF",
      "color-gray": "#F2F4F8",
      "font-sans": '"Montserrat"',
    },
  },
  "default-light": {
    _id: "default-light",
    vars: {
     "color-primary": "#22C55E",
      "color-secondary": "#333F4E",
      "color-gray": "#F2F4F8",
      "font-sans": '"Montserrat"',
    },
  },
  "default-dark": {
    _id: "default-dark",
    vars: {
      "color-primary": "#22C55E",
      "color-secondary": "#333F4E",
      "color-gray": "#F2F4F8",
      "font-sans": '"Montserrat"',
    },
  },
};
