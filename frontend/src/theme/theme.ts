import { createTheme } from '@mui/material/styles';

// Lonca brand colors - Updated with #ffeff6 theme
export const loncaTheme = createTheme({
  palette: {
    primary: {
      main: '#E8B4E3', // Soft pink-purple derived from #ffeff6
      light: '#F5E6F3',
      dark: '#D897D1',
      contrastText: '#4A4A4A',
    },
    secondary: {
      main: '#B39DDB', // Complementary purple
      light: '#E1BEE7',
      dark: '#7E57C2',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#ffeff6', // Main theme color
      paper: '#FFFFFF',
    },
    text: {
      primary: '#4A4A4A',
      secondary: '#7B6F7D',
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
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#2C2C2C',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#2C2C2C',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#2C2C2C',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#2C2C2C',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#2C2C2C',
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#2C2C2C',
    },
    body1: {
      fontSize: '1rem',
      color: '#2C2C2C',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#5D4037',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #E8B4E3 0%, #D897D1 100%)',
          boxShadow: '0 4px 6px rgba(232, 180, 227, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(232, 180, 227, 0.15)',
          border: '1px solid rgba(232, 180, 227, 0.2)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(232, 180, 227, 0.25)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(232, 180, 227, 0.15)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 20px',
        },
        contained: {
          boxShadow: '0 2px 8px rgba(232, 180, 227, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(232, 180, 227, 0.4)',
          },
        },
      },
    },
  },
});

export default loncaTheme;