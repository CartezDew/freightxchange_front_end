import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // blue
    },
    secondary: {
      main: '#dc004e', // pink/red
    },
  },
  typography: {
    button: {
      textTransform: 'none', // prevent buttons from being all caps
    },
  },
});

export default theme;
