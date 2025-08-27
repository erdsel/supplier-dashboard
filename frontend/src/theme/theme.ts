import { createTheme } from '@mui/material/styles';

// Lonca brand colors - Updated with #532d3c theme
export const loncaTheme = createTheme({
  palette: {
    primary: {
      main: '#532d3c', // Dark wine color
      light: '#00000',
      dark: '#3a1f2a',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E8B4E3', // Pink accent color
      light: '#F5E6F3',
      dark: '#D897D1',
      contrastText: '#532d3c',
    },
    background: {
      default: '#532d3c', // Main theme color - dark wine
      paper: '#3a1f2a', // Darker for better contrast
    },
    text: {
      primary: '#FFFFFF', // White text
      secondary: '#F5E6F3', // Light pink text for secondary
    },
    success: {
      main: '#66BB6A',
    },
    warning: {
      main: '#FF9800',
    },
    error: {
      main: '#F44336',
    },
    info: {
      main: '#2196F3',
    },
  },
  typography: {
    fontFamily: '"Roboto Flex", sans-serif, "Nantes", "Times New Roman", Times, serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    body1: {
      fontSize: '1rem',
      color: '#FFFFFF',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#F5E6F3',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 0, // Dikdörtgen için 0
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #532d3c 0%, #3a1f2a 100%)',
          boxShadow: '0 4px 6px rgba(83, 45, 60, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Tamamen dikdörtgen
          backgroundColor: '#3a1f2a', // Daha koyu arka plan
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(232, 180, 227, 0.1)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Tamamen dikdörtgen
          backgroundColor: '#3a1f2a', // Daha koyu arka plan
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Dikdörtgen butonlar
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 20px',
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: '#2a1520', // Çok koyu arka plan
          borderRadius: 0,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: '#FFFFFF', // Beyaz yazı
          borderBottom: '1px solid rgba(232, 180, 227, 0.2)',
        },
        head: {
          backgroundColor: '#3a1f2a',
          color: '#F5E6F3',
          fontWeight: 600,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(232, 180, 227, 0.05)',
          },
        },
      },
    },
  },
});

export default loncaTheme;