import { createTheme } from "@mui/material/styles";

// Mapping from DaisyUI dark theme to MUI theme
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#000000", // DaisyUI primary
      light: "#9945FF", // DaisyUI primary-focus
      contrastText: "#ffffff", // DaisyUI primary-content
    },
    secondary: {
      main: "#808080", // DaisyUI secondary
      light: "#f3cc30", // DaisyUI secondary-focus
      contrastText: "#ffffff", // DaisyUI secondary-content
    },
    background: {
      default: "#000000", // DaisyUI base-100
      paper: "#011909", // Custom dark green used in cards
    },
    surface: {
      main: "#35363a", // DaisyUI base-200
      dark: "#222222", // DaisyUI base-300
    },
    text: {
      primary: "#f9fafb", // DaisyUI base-content
      secondary: "#ffffff", // DaisyUI neutral-content
    },
    info: {
      main: "#2094f3", // DaisyUI info
    },
    success: {
      main: "#009485", // DaisyUI success
      light: "#08b642", // Custom green used in links
    },
    warning: {
      main: "#ff9900", // DaisyUI warning
    },
    error: {
      main: "#ff5724", // DaisyUI error
    },
    // Custom colors for the blockchain explorer
    accent: {
      main: "#33a382", // DaisyUI accent
      light: "#2aa79b", // DaisyUI accent-focus
      contrastText: "#ffffff", // DaisyUI accent-content
    },
    neutral: {
      main: "#2b2b2b", // DaisyUI neutral
      light: "#2a2e37", // DaisyUI neutral-focus
      contrastText: "#ffffff", // DaisyUI neutral-content
    },
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif", // DaisyUI body font
    h1: {
      fontFamily: "PT Mono, monospace", // DaisyUI display font
      fontWeight: 600,
    },
    h2: {
      fontFamily: "PT Mono, monospace",
      fontWeight: 600,
    },
    h3: {
      fontFamily: "PT Mono, monospace",
      fontWeight: 500,
    },
    body1: {
      fontFamily: "Inter, sans-serif",
    },
    body2: {
      fontFamily: "Inter, sans-serif",
    },
    button: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8, // DaisyUI default border radius
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#011909", // Matches current card bg
          border: "none",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // DaisyUI shadow-xl
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 6,
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            backgroundColor: "#ffffff",
            color: "#000000",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          },
        },
        {
          props: { variant: "outlined", color: "primary" },
          style: {
            borderColor: "#ffffff",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderColor: "#ffffff",
            },
          },
        },
      ],
    },
    MuiTable: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          },
          "& .MuiTableHead-root .MuiTableCell-root": {
            backgroundColor: "transparent",
            fontWeight: 600,
            color: "#f9fafb",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#14460f", // Matches current AppBar bg
          borderBottom: "1px solid #374151",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#011909", // Matches current drawer bg
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
      variants: [
        {
          props: { color: "success" },
          style: {
            backgroundColor: "rgba(0, 148, 133, 0.2)",
            color: "#009485",
          },
        },
        {
          props: { color: "warning" },
          style: {
            backgroundColor: "rgba(255, 153, 0, 0.2)",
            color: "#ff9900",
          },
        },
        {
          props: { color: "error" },
          style: {
            backgroundColor: "rgba(255, 87, 36, 0.2)",
            color: "#ff5724",
          },
        },
      ],
    },
  },
});

// Extend the theme to include custom colors
declare module "@mui/material/styles" {
  interface Palette {
    accent: Palette["primary"];
    neutral: Palette["primary"];
    surface: Palette["primary"];
  }

  interface PaletteOptions {
    accent?: PaletteOptions["primary"];
    neutral?: PaletteOptions["primary"];
    surface?: PaletteOptions["primary"];
  }
}

export default darkTheme;
