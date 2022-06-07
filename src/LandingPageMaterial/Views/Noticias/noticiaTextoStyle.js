import {
    grayColor,
    container,
    title,
    coloredShadow
} from "components/material-kit-pro-react/material-kit-pro-react";
  
import imagesStyles from "components/material-kit-pro-react/views/imagesStyles";
  
  const noticiaTextoStyle = {
    container,
    title,
    section: {
      paddingBottom: "0",
      backgroundPosition: "50%",
      backgroundSize: "cover",
      padding: "70px 0",
      "& p": {
        fontSize: "1.188rem",
        lineHeight: "1.5em",
        color: grayColor[15],
        marginBottom: "30px"
      }
    },
    quoteText: {
      fontSize: "1.5rem !important"
    },
    coloredShadow,
    ...imagesStyles
  };
  
  export default noticiaTextoStyle;
  