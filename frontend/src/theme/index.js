import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f8fafc",
      paper: "#ffffff"
    },
    primary: {
      main: "#6366f1"
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b"
    },
    divider: "#e2e8f0"
  },

  shape: {
    borderRadius: 12
  },

  components: {

    /* 🔥 GLOBAL CARD STYLE */
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #e2e8f0",
          boxShadow: "none",
          transition: "0.2s",
          "&:hover": {
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
          }
        }
      }
    },

    /* 🔥 GLOBAL PAPER */
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid #e2e8f0"
        }
      }
    },

    /* 🔥 BUTTON */
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none"
        }
      }
    },

    /* 🔥 TEXTFIELD */
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: "#f1f5f9",
          borderRadius: 8
        }
      }
    }

  }
});

export default theme;