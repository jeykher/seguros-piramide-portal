import {
  container,
  section,
  sectionDark,
  mlAuto,
  mrAuto,
  title,
  description,
  cardTitle,
  roseColor,
  blackColor,
  whiteColor,
  grayColor,
  hexToRgb,
  primaryColor
} from "../../material-kit-pro-react.js";

const pricingSection = {
  container,
  mlAuto,
  mrAuto,
  title,
  cardTitle,
  description,
  divMount:{    
    "@media (max-width: 2023px)": {
      minHeight: '93px'
    },
    "@media (max-width: 599px)": {
      minHeight: '80px'
    },
  },
  cardPricing:{
    marginTop: "5px !important",
    marginBottom: "5px !important",    
    "& ul": {
      listStyle: "none",
      padding: 0,
      maxWidth: "240px",
      margin: "0px auto"
    },
    "& ul li": {
      marginTop: '0px !important',
      marginBottom: '0px !important',
      padding: '5px 0px'
    },
    "& ul li h6": {
      marginTop: '0px !important',
      marginBottom: '0px !important',
    },
  },
  cardPricingDetails:{
    marginTop: '0px !important',
    marginBottom: '0px !important',
    "& ul li": {
      height: '60px !important',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
  },
  cardTitlePrice: {
    ...cardTitle,
    "@media (max-width: 2023px)": {
      fontSize: '1.50em'
    },
    "@media (max-width: 1440px)": {
      fontSize: '1.28em'
    },
    "@media (max-width: 599px)": {
      fontSize: '1em'
    },
    "@media (max-width: 425px)": {
      fontSize: '1em'
    },
    "@media (max-width: 368px)": {
      fontSize: '1em'
    },
    "@media (max-width: 320px)": {
      fontSize: '1em'
    },
    marginTop: '0px !important',
    marginBottom: '0px !important',
  },
  cardTitleWhite: {
    ...cardTitle,
    color: whiteColor + "  !important"
  },
  iconClose:{
    position: "absolute",
    top: "3px",
    right: "2.3%",
    cursor: "pointer"
  },
  sectionGray: {
    background: grayColor[14]
  },
  section: {
    ...section,
    ...sectionDark,
    position: "relative",
    "& $container": {
      position: "relative",
      zIndex: "2"
    },
    "& $description": {
      color: "rgba(" + hexToRgb(whiteColor) + ", 0.5)"
    },
    "& $cardCategory": {
      color: "rgba(" + hexToRgb(whiteColor) + ", 0.76)"
    },
    "& $title": {
      color: whiteColor,
      marginBottom: "10px"
    },
    "&:after": {
      position: "absolute",
      zIndex: "1",
      width: "100%",
      height: "100%",
      display: "block",
      left: "0",
      top: "0",
      content: "''",
      backgroundColor: "rgba(" + hexToRgb(blackColor) + ", 0.7)"
    }
  },
  pricing1: {
    "&$section:after": {
      backgroundColor: "rgba(" + hexToRgb(blackColor) + ", 0.8)"
    }
  },
  pricing: {
    padding: "80px 0"
  },
  textCenter: {
    textAlign: "center"
  },
  sectionSpace: {
    height: "70px",
    display: "block"
  },
  cardCategory: {
    ...description
  },
  cardCategoryWhite: {
    color: whiteColor
  },
  cardDescription: {
    ...description,
    display: '-webkit-box',
    boxOrient: 'vertical',
    overflow: 'hidden',
    minHeight: "38px",
    lineClamp: '2',
    "@media (max-width: 1023px)": {
      fontSize: '1em'
    },
    "@media (max-width: 450px)": {
      fontSize: '0.9em'
    },
    marginTop: '0px !important',
    marginBottom: '0px !important'
  },
  justifyContentCenter: {
    WebkitBoxPack: "center !important",
    MsFlexPack: "center !important",
    justifyContent: "center !important"
  },
  icon: {
    color: "rgba(" + hexToRgb(whiteColor) + ", 0.76)",
    margin: "10px auto 0",
    width: "130px",
    height: "130px",
    border: "1px solid " + grayColor[14],
    borderRadius: "50%",
    lineHeight: "174px",
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      fontSize: "55px",
      lineHeight: "55px"
    },
    "& svg": {
      width: "55px",
      height: "55px"
    }
  },
  iconWhite: {
    color: whiteColor
  },
  iconRose: {
    color: roseColor[0]
  },
  marginTop30: {
    marginTop: "30px"
  },
  marginBottom20: {
    marginBottom: "20px"
  },
  marginBottom30: {
    marginBottom: "30px"
  },
  badgePaymentSection:{
    display: 'flex',
    flexDirection: 'row'
  },
  planPay: {
    fontSize: '58%'
  },
  buttonPay: {
    padding: '5px 20px'
  }
};

export default pricingSection;
