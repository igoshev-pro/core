import { ThemeTokens } from "@/packages/renderer/src";

export const themes: Record<string, ThemeTokens> = {
  "default-light": {
    _id: "default-light",
    vars: {
      "color-bg": "255 255 255",
      "color-text": "17 24 39",
      "color-primary": "99 102 241",
    },
  },
  "default-dark": {
    _id: "default-dark",
    vars: {
      "color-bg": "17 24 39",
      "color-text": "243 244 246",
      "color-primary": "129 140 248",
    },
  },
};
