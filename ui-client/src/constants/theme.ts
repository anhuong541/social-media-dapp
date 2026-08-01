export const THEME_CSS_PATH = "src/styles/theme.css" as const;

export const TWEAKCN_URL = "https://tweakcn.com" as const;

/** Export settings to use when copying a theme from tweakcn into this project. */
export const TWEAKCN_EXPORT = {
  tailwindVersion: "4",
  colorFormat: "oklch",
  targetFile: THEME_CSS_PATH,
} as const;
