import { createMuiTheme } from '@material-ui/core/styles';
import { red, grey } from '@material-ui/core/colors';


// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ED1C24',
    },
    secondary: {
      main: grey[700],
      light: grey[300],
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontSize: 14,
    fontFamily: "Museo Sans",
      h6: {
        fontSize: '1.10em',
      },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': "Museo Sans",
        'font-display': 'swap'
      },
    },
  },
});



export default theme;