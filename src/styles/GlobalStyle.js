import { css } from "@nfront/global-styles"

const GlobalStyle = css`
    html {
      font-family: ${props => props.theme.typography.fontFamily};
      color: #000;
    }
    body{
      margin: 0;
    }
    main{
      padding-top: 4rem;
    }
    section {
      /*padding: 1rem 0;*/ 
      padding-bottom: 1rem;
      overflow: hidden;
      border-bottom: 1px solid #000;
    }
    a {
      text-decoration: none;
      color: ${props => props.theme.palette.primary.main};
      margin: 0 0.5em;
    }
    a:hover {
      text-decoration: underline;
    }
    strong {
      color: ${props => props.theme.palette.primary.main};
    }
    ul {
      list-style: none; /* Remove list bullets */
      padding: 0;
      margin: 0;
    }
    
    h1, h2, h3, h4, h5, h6{
     font-family: ${props => props.theme.typography.fontFamily};
    }

    /*.MuiAppBar-root {
      background-color: #FFF;
    }
    .MuiAppBar-root {
      background-color: #FFF;
    }
    .MuiButton-root {
      background-color: ${props => props.theme.palette.primary.main};
    }*/
`

export default GlobalStyle
