import { createTheme } from "@mui/material/styles";

// BBAChain Modern Color Palette - Updated Design System
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1E40AF", // Deep Blue - Primary brand color
      light: "#3B82F6", // Bright Blue - Interactive elements
      dark: "#1E3A8A", // Navy Blue - Hover states
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#8B5CF6", // Purple - Secondary brand color
      light: "#A78BFA", // Light Purple - Highlights
      dark: "#7C3AED", // Dark Purple - Active states
      contrastText: "#ffffff",
    },
    background: {
      default: "#0F172A", // Very Dark Blue - Main background
      paper: "#1E293B", // Dark Blue Gray - Card backgrounds
    },
    surface: {
      main: "#334155", // Blue Gray - Card surfaces
      dark: "#475569", // Medium Gray - Elevated surfaces
      light: "#64748B", // Light Gray - Subtle elements
    },
    text: {
      primary: "#F8FAFC", // Almost White - Primary text
      secondary: "#CBD5E1", // Light Blue Gray - Secondary text
    },
    info: {
      main: "#0EA5E9", // Sky Blue - Information
      light: "#38BDF8",
      dark: "#0284C7",
    },
    success: {
      main: "#06D6A0", // Teal Green - Success states
      light: "#20E6B8", // Light Teal - Success highlights
      dark: "#059669", // Dark Teal - Success hover
    },
    warning: {
      main: "#F59E0B", // Amber - Warning states
      light: "#FBBF24",
      dark: "#D97706",
    },
    error: {
      main: "#EF4444", // Red - Error states
      light: "#F87171",
      dark: "#DC2626",
    },
    // Custom colors for the blockchain explorer
    accent: {
      main: "#06D6A0", // Teal Green - Accent color
      light: "#20E6B8", // Light Teal - Accent highlights
      dark: "#059669", // Dark Teal - Accent hover
      contrastText: "#ffffff",
    },
    neutral: {
      main: "#475569", // Medium Gray - Neutral elements
      light: "#64748B", // Light Gray - Neutral highlights
      dark: "#334155", // Dark Gray - Neutral shadows
      contrastText: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif", // Modern font stack
    h1: {
      fontFamily: "Inter, sans-serif", // Clean modern font
      fontWeight: 700,
      fontSize: "2.5rem",
      letterSpacing: "-0.025em",
    },
    h2: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 600,
      fontSize: "2rem",
      letterSpacing: "-0.025em",
    },
    h3: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 600,
      fontSize: "1.5rem",
      letterSpacing: "-0.025em",
    },
    h4: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h5: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 600,
      fontSize: "1.125rem",
    },
    body1: {
      fontFamily: "Inter, sans-serif",
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: "Inter, sans-serif",
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    button: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      textTransform: "none",
      letterSpacing: "0.025em",
    },
  },
  shape: {
    borderRadius: 12, // More modern border radius
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1E293B", // Dark Blue Gray
          border: "1px solid rgba(100, 116, 139, 0.2)", // Subtle border
          borderRadius: 16,
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          backdropFilter: "blur(8px)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "8px 16px",
          fontWeight: 500,
          transition: "all 0.2s ease-in-out",
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
            color: "#ffffff",
            "&:hover": {
              background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
              transform: "translateY(-1px)",
              boxShadow:
                "0 10px 15px -3px rgba(30, 64, 175, 0.4), 0 4px 6px -2px rgba(30, 64, 175, 0.1)",
            },
          },
        },
        {
          props: { variant: "outlined", color: "primary" },
          style: {
            borderColor: "#3B82F6",
            color: "#3B82F6",
            "&:hover": {
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderColor: "#1E40AF",
              transform: "translateY(-1px)",
            },
          },
        },
      ],
    },
    MuiTable: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
            padding: "12px 16px",
          },
          "& .MuiTableHead-root .MuiTableCell-root": {
            backgroundColor: "rgba(30, 41, 59, 0.5)",
            fontWeight: 600,
            color: "#F8FAFC",
            fontSize: "0.875rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          },
          "& .MuiTableBody-root .MuiTableRow-root": {
            "&:hover": {
              backgroundColor: "rgba(100, 116, 139, 0.1)",
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
          backdropFilter: "blur(12px)",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1E293B",
          borderRight: "1px solid rgba(100, 116, 139, 0.2)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
      variants: [
        {
          props: { color: "success" },
          style: {
            backgroundColor: "rgba(6, 214, 160, 0.2)",
            color: "#06D6A0",
            border: "1px solid rgba(6, 214, 160, 0.3)",
          },
        },
        {
          props: { color: "warning" },
          style: {
            backgroundColor: "rgba(245, 158, 11, 0.2)",
            color: "#F59E0B",
            border: "1px solid rgba(245, 158, 11, 0.3)",
          },
        },
        {
          props: { color: "error" },
          style: {
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            color: "#EF4444",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          },
        },
        {
          props: { color: "info" },
          style: {
            backgroundColor: "rgba(14, 165, 233, 0.2)",
            color: "#0EA5E9",
            border: "1px solid rgba(14, 165, 233, 0.3)",
          },
        },
      ],
    },
    // New gradient backgrounds for special cards
    MuiPaper: {
      variants: [
        {
          props: { className: "gradient-card" },
          style: {
            background:
              "linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
            border: "1px solid rgba(30, 64, 175, 0.2)",
          },
        },
        {
          props: { className: "stats-card" },
          style: {
            background:
              "linear-gradient(135deg, rgba(6, 214, 160, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)",
            border: "1px solid rgba(6, 214, 160, 0.2)",
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
