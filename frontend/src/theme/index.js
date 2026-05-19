import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#eff6ff",
      paper: "#ffffff"
    },
    primary: {
      main: "#1e40af",
      light: "#3b82f6",
      dark: "#1e3a8a",
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#1d4ed8",
      contrastText: "#ffffff"
    },
    text: {
      primary: "#1e3a8a",
      secondary: "#64748b"
    },
    divider: "#bfdbfe"
  },

  shape: {
    borderRadius: 12
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #bfdbfe",
          boxShadow: "none",
          transition: "0.2s",
          "&:hover": {
            boxShadow: "0 10px 25px rgba(30,64,175,0.1)"
          }
        }
      }
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid #bfdbfe"
        }
      }
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none"
        }
      }
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: "#eff6ff",
          borderRadius: 8,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#bfdbfe"
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1e40af"
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1e40af"
          }
        }
      }
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#1e40af"
        }
      }
    },

    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#1e40af"
          }
        }
      }
    },

    MuiChip: {
      styleOverrides: {
        colorPrimary: {
          background: "#eff6ff",
          color: "#1d4ed8"
        }
      }
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: "#eff6ff"
        },
        bar: {
          backgroundColor: "#1e40af"
        }
      }
    },

    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: "#1e40af"
        }
      }
    }
  }
});

export default theme;