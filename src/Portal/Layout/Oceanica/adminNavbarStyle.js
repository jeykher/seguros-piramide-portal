import {
  containerFluid,
  defaultFont,
  primaryColor,
  defaultBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  whiteColor,
  grayColor,
  blackColor,
  hexToRgb
} from 'components/material-dashboard-pro-react/components/material-dashboard-pro-react'

const headerStyle = () => ({
  appBar: {
    backgroundColor: primaryColor,
    boxShadow: "0px 10px 10px 0 rgba(" + hexToRgb(blackColor) + ", 0.14)",
    borderBottom: "0",
    marginBottom: "0",
    width: "100%",
    paddingTop: "10px",
    zIndex: "1029",
    color: grayColor[6],
    border: "0",
    borderRadius: "3px",
    padding: "10px 0",
    transition: "all 150ms ease 0s",
    minHeight: "50px",
    display: "block"
  },
  container: {
    ...containerFluid,
    minHeight: "50px"
  },
  flex: {
    flex: 1,
    textAlign: "center"
  },
  button__logo: {
    padding: "0",
    textAlign: "center"
  },
  logo: {
    maxHeight: "3rem",
    textAlign: "center"
  },
  title: {
    ...defaultFont,
    lineHeight: "30px",
    fontSize: "18px",
    borderRadius: "3px",
    textTransform: "none",
    color: "inherit",
    paddingTop: "0.625rem",
    paddingBottom: "0.625rem",
    margin: "0 !important",
    letterSpacing: "unset",
    "&:hover,&:focus": {
      background: "transparent"
    }
  },
  primary: {
    backgroundColor: primaryColor[0],
    color: whiteColor,
    ...defaultBoxShadow
  },
  info: {
    backgroundColor: infoColor[0],
    color: whiteColor,
    ...defaultBoxShadow
  },
  success: {
    backgroundColor: successColor[0],
    color: whiteColor,
    ...defaultBoxShadow
  },
  warning: {
    backgroundColor: warningColor[0],
    color: whiteColor,
    ...defaultBoxShadow
  },
  danger: {
    backgroundColor: dangerColor[0],
    color: whiteColor,
    ...defaultBoxShadow
  },
  sidebarMinimize: {
    float: "left",
    padding: "0 0 0 75px",
    display: "block",
    color: grayColor[6],
    transition: "all 150ms ease 0s"
  },
  sidebarMinimizeRTL: {
    float: "left",
    padding: "0 0 0 260px",
    display: "block",
    color: grayColor[6],
    transition: "all 150ms ease 0s"    
  },
  sidebarMiniIcon: {
    width: "20px",
    height: "17px"
  },
  absolute: {
    position: "static",
    top: "auto"
  },
  fixed: {
    position: "fixed"
  }
});

export default headerStyle;
