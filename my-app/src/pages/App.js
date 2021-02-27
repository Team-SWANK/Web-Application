import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CssBaseline from '@material-ui/core/CssBaseline';

// import Navbar from '../components/navbar'; 
import Navigation from '../components/Navigation'; 
import Routes from '../routes/routes'; 
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = createMuiTheme({
    palette: {
      type: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#ec407a',
      },background: {
        paper: prefersDarkMode ? '#303030' : '#fff',
        default: prefersDarkMode ? '#212121' : '#fafafa'
      }
    }
  })

  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navigation />
        <Routes />
      </ThemeProvider>
    </div>
  );
}

export default App;
