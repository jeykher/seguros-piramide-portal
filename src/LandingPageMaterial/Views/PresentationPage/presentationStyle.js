import {
  main,
  mainRaised
} from "components/material-kit-pro-react/material-kit-pro-react";
import footerStyle from "components/material-kit-pro-react/components/Footer/footerStyle";

const presentationStyle = {
  ...footerStyle,
  main: {
    ...main
    /*overflow: "hidden"*/
  },
  mainRaised:{
    ...mainRaised,
    margin: '-15px 30px 0px'
  }
};

export default presentationStyle;
