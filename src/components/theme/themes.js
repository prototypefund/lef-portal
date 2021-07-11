const defaultColors = {
  NAVIGATION_COLOR: "#ffd3a7",
  INTERACTIVE_ELEMENT_COLOR: "#faf1e6",
  PRIMARY_COLOR_DARK: "#377f69",
  PRIMARY_COLOR: "#e4f1e7",
  SECONDARY_COLOR: "#fdfaf6",
  COLOR_TEXT_BRIGHT: "#DDD",
  COLOR_TEXT_DARK: "#222",
  LIGHT_BACKGROUND_COLOR: "#f9f9f9",
  LIGHT_BACKGROUND_COLOR_GREEN: "#f5f7f1",
  DIAGRAM_COLORS: ["#ECD662", "#5D8233", "#284E78", "#3E215D"],
};

const ALL_THEMES = {
  colors: {
    default: defaultColors,
    monochrome: {
      ...defaultColors,
      DIAGRAM_COLORS: ["#334257", "#476072", "#548CA8", "#EEEEEE"],
      PRIMARY_COLOR_DARK: "#334257",
      PRIMARY_COLOR: "#476072",
    },
  },
  fonts: {
    sansSerif:
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
    serif: "Georgia, Times, Times New Roman, serif",
    monospace:
      "source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace",
  },
};

export const themes = {
  default: defaultColors,
};

export const createTheme = (
  colorPalette = "default",
  fontStyle = "sansSerif"
) => ({
  colors: ALL_THEMES.colors[colorPalette],
  fonts: ALL_THEMES.fonts[fontStyle],
});
