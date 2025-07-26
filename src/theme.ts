import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5A189A', // Botones principales
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#7B2CBF', // Links, íconos
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#10002B', // Fondo principal
      paper: '#240046', // Cards, secciones
    },
    error: {
      main: '#FF6F61', // Coral
    },
    warning: {
      main: '#FFD700', // Dorado
    },
    info: {
      main: '#00B4D8', // Cian brillante
    },
    success: {
      main: '#00C9A7', // Verde agua
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#ECECEC',
      disabled: '#AAAAAA',
    },
    divider: '#ECECEC',
    // Colores mágicos extra (referencia):
    // violet: #9D4EDD
    // epic: #C77DFF
    // legendary: #FFD700
    // chaotic: #F72585
    // aura: #F9F871
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
    h1: { color: '#E0AAFF' },
    h2: { color: '#C77DFF' },
    h3: { color: '#9D4EDD' },
    h4: { color: '#7B2CBF' },
    h5: { color: '#5A189A' },
    h6: { color: '#3C096C' },
    body1: { color: '#FFFFFF' },
    body2: { color: '#ECECEC' },
  },
});

export default theme; 