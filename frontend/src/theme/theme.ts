import { alpha, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f6f78",
      light: "#4aa0ab",
      dark: "#144c53",
      contrastText: "#fdfcf7",
    },
    secondary: {
      main: "#d97757",
      light: "#e8a285",
      dark: "#a9553a",
    },
    background: {
      default: "#f6f2ea",
      paper: "#fffdf8",
    },
    text: {
      primary: "#182028",
      secondary: "#5f6b76",
    },
    divider: alpha("#1b3442", 0.1),
    success: {
      main: "#3c8d5a",
    },
    warning: {
      main: "#d3933b",
    },
    error: {
      main: "#c85f51",
    },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h3: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h4: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      letterSpacing: "0.01em",
      textTransform: "none",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(circle at top left, rgba(31,111,120,0.14), transparent 28%), radial-gradient(circle at top right, rgba(217,119,87,0.14), transparent 24%), #f6f2ea",
        },
        "#root": {
          minHeight: "100vh",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#fffdf8", 0.82),
          color: "#182028",
          backdropFilter: "blur(18px)",
          boxShadow: "none",
          borderBottom: `1px solid ${alpha("#1b3442", 0.08)}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#fffdf8", 0.92),
          border: `1px solid ${alpha("#1b3442", 0.08)}`,
          boxShadow: "0 18px 50px rgba(34, 48, 61, 0.08)",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
          minHeight: 44,
        },
        containedPrimary: {
          boxShadow: "0 12px 24px rgba(31,111,120,0.22)",
        },
        outlined: {
          borderColor: alpha("#1f6f78", 0.24),
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#ffffff", 0.72),
          borderRadius: 16,
          "& fieldset": {
            borderColor: alpha("#1b3442", 0.12),
          },
          "&:hover fieldset": {
            borderColor: alpha("#1f6f78", 0.4),
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 28,
          padding: 8,
        },
      },
    },
  },
});

export default theme;
