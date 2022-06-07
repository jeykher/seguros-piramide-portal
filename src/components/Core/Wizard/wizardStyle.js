import {
  primaryColor,
  dangerColor,
  successColor,
  roseColor,
  infoColor,
  warningColor,
  whiteColor,
  blackColor,
  grayColor,
  hexToRgb
} from "components/material-dashboard-pro-react/components/material-dashboard-pro-react";

const wizardStyle = {
  wizardContainer: {},
  card: {
    display: "inline-block",
    position: "relative",
    width: "100%",
    margin: "20px 0",
    boxShadow: "0 1px 4px 0 rgba(" + hexToRgb(blackColor) + ", 0.14)",
    borderRadius: "6px",
    color: "rgba(" + hexToRgb(blackColor) + ", 0.87)",
    background: whiteColor,
    transition: "all 300ms linear",
    minHeight: "390px"
  },
  wizardHeader: {
    textAlign: "center",
    padding: "4px 0 4px"
  },
  title: {
    margin: "0"
  },
  subtitle: {
    margin: "5px 0 0"
  },
  wizardNavigation: {
    position: "relative"
  },
  nav: {
    marginTop: "5px",
    paddingLeft: "0",
    marginBottom: "0",
    listStyle: "none",
    backgroundColor: "rgba(" + hexToRgb(grayColor[17]) + ", 0.2)",
    "&:after,&:before": {
      display: "table",
      content: '" "'
    },
    "&:after": {
      boxSizing: "border-box"
    }
  },
  steps: {
    marginLeft: "0",
    textAlign: "center",
    // float: "left",
    // display: "block",
    //position: "relative",
    //display: "inline-block"
    padding: "10px",
    fontSize: "11px",
  },
  stepsAnchor: {
    cursor: "pointer",
    position: "relative",
    display: "block",
    padding: "4px 10px",
    textDecoration: "none",
    transition: "all .3s",
    border: "0 !important",
    borderRadius: "30px",
    lineHeight: "15px",
    textTransform: "uppercase",
    fontSize: "12px",
    fontWeight: "500",
    minWidth: "60px",
    textAlign: "center",
    color: whiteColor,
    "&:hover":{
      color: whiteColor
    }
  },
  content: {
    marginTop: "0px",
    minHeight: "250px",
    padding: "5px",
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  stepContent: {
    display: "none"
  },
  stepContentActive: {
    display: "block",
    width: '100%'
  },
  movingTab: {
    //position: "absolute",
    textAlign: "center",
    padding: "10px",
    fontSize: "12px",
    textTransform: "uppercase",
    WebkitFontSmoothing: "subpixel-antialiased",
    top: "-4px",
    left: "0px",
    borderRadius: "4px",
    color: whiteColor+" !important",
    cursor: "pointer",
    fontWeight: "500"
  },
  primary: {
    backgroundColor: primaryColor[0],
    boxShadow:
      "0 4px 20px 0px rgba(" +
      hexToRgb(blackColor) +
      ", 0.14), 0 7px 10px -5px rgba(" +
      hexToRgb(primaryColor[0]) +
      ", 0.4)"
  },
  warning: {
    backgroundColor: warningColor[0],
    boxShadow:
      "0 4px 20px 0px rgba(" +
      hexToRgb(blackColor) +
      ", 0.14), 0 7px 10px -5px rgba(" +
      hexToRgb(warningColor[0]) +
      ", 0.4)"
  },
  danger: {
    backgroundColor: dangerColor[0],
    boxShadow:
      "0 4px 20px 0px rgba(" +
      hexToRgb(blackColor) +
      ", 0.14), 0 7px 10px -5px rgba(" +
      hexToRgb(dangerColor[0]) +
      ", 0.4)"
  },
  success: {
    backgroundColor: successColor[0],
    boxShadow:
      "0 4px 20px 0px rgba(" +
      hexToRgb(blackColor) +
      ", 0.14), 0 7px 10px -5px rgba(" +
      hexToRgb(successColor[0]) +
      ", 0.4)"
  },
  info: {
    backgroundColor: infoColor[0],
    boxShadow:
      "0 4px 20px 0px rgba(" +
      hexToRgb(blackColor) +
      ", 0.14), 0 7px 10px -5px rgba(" +
      hexToRgb(infoColor[0]) +
      ", 0.4)"
  },
  rose: {
    backgroundColor: roseColor[0],
    boxShadow:
      "0 4px 20px 0px rgba(" +
      hexToRgb(blackColor) +
      ", 0.14), 0 7px 10px -5px rgba(" +
      hexToRgb(roseColor[0]) +
      ", 0.4)"
  },
  footer: {
    padding: "0 15px"
  },
  left: {
    float: "left!important"
  },
  right: {
    float: "right!important"
  },
  clearfix: {
    "&:after,&:before": {
      display: "table",
      content: '" "'
    },
    clear: "both"
  }
};

export default wizardStyle;
