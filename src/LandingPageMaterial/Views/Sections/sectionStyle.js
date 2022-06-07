import {
  main,
  mainRaised,
  container,
  mlAuto,
  mrAuto,
  title,
  description,
  blackColor,
  whiteColor,
  hexToRgb,
  grayColor,
} from "components/material-kit-pro-react/material-kit-pro-react";

const sectionStyle = {
  main: {
    ...main
  },
  mainRaised,
  container,
  mlAuto,
  mrAuto,
  title:{
    ...title,
  },
  titleSection:{
    ...title,
    color: '#3C4858'
  },
  description,
  gray26: {
    color: grayColor[26]
  },
  propTitle: {
    ...title,
    "@media (max-width: 600px)": {
      textAlign: "center",
    },
  },
  propTitleOcea: {
    ...title,
    fontSize: "26px",
    "@media (max-width: 600px)": {
      textAlign: "center",

    },
  },
  mTop120: {
    marginTop: "120px",
  },
  mTop60: {
    marginTop: "60px",
  },
  mTop30: {
    marginTop: "30px",
  },
  mLeft30: {
    marginLeft: "30px",
  },
  smallScreenBtn: {
    "@media (max-width: 600px)": {
      marginLeft: "0",
      paddingLeft: "0",
      display: "flex",
      justifyContent: "center",
      maxWidth: "100%!important",
    },
  },
  features1: {
    textAlign: "center",
    padding: "0"
  },
  features2: {
    padding: "150px 0",
    minHeight: "100vh",
    "@media (max-width: 580px)": {
      padding: '120px 0'
    },
  },
  features3: {
    padding: "80px 0",
    "& $phoneContainer": {
      maxWidth: "220px",
      margin: "0 auto"
    }
  },
  features4: {
    padding: "80px 0",
    "& $phoneContainer": {
      maxWidth: "260px",
      margin: "60px auto 0"
    }
  },
  features5: {
    padding: "80px 0",
    backgroundSize: "cover",
    backgroundPosition: "50%",
    backgroundRepeat: "no-repeat",
    position: "relative",
    "& $title": {
      marginBottom: "30px"
    },
    "& $title,& $container": {
      position: "relative",
      zIndex: "2",
      color: whiteColor
    },
    "&:after": {
      background: "rgba(" + hexToRgb(blackColor) + ",0.55)",
      position: "absolute",
      width: "100%",
      height: "100%",
      content: "''",
      zIndex: "0",
      left: "0px",
      top: "0px"
    },
    "& $container": {
      "& $gridContainer:last-child": {
        "& $gridItem": {
          borderBottom: "0"
        }
      },
      "& $gridItem": {
        border: "1px solid rgba(" + hexToRgb(whiteColor) + ", 0.35)",
        borderTop: "0",
        borderLeft: "0",
        "&:last-child": {
          borderRight: "0"
        }
      }
    },
    "& $infoArea5": {
      textAlign: "center",
      maxWidth: "310px",
      minHeight: "320px",
      "& h4,& p,& svg,& .fab,& .fas,& .far,& .fal,& .material-icons": {
        color: whiteColor
      }
    }
  },
  features6: {
    paddingTop: "0px",
    paddingBottom: "80px",
    paddingLeft: "0",
    paddingRigth: "0",
    "& $phoneContainer": {
      maxWidth: "220px",
      margin: "0 auto"
    }
  },
  textCenter: {
    textAlign: "center"
  },
  phoneContainer: {
    "& img": {
      width: "100%",
    }
  },
  imgContainer: {
    "@media (max-width: 600px)": {
      textAlign: "center",
    },
    "& .gatsby-image-wrapper": {
      width: "80%"
    }
  },
  infoArea: {
    maxWidth: "none",
    margin: "0 auto",
    padding: "10px 0 0px"
  },
  p: {
    textAlign: 'justify',
  },
  pSized16: {
    textAlign: 'justify',
    "& > p":{
      fontSize: "16px!important",
    }
  },
  pSized14: {
    textAlign: 'justify',
    "& > p":{
      fontSize: "14px!important",
    }
  },
  dSized14: {
    textAlign: 'justify',
    fontSize: "14px!important",
  },
  titleBudget:{
    "@media (max-width: 768px)": {
      fontSize: '1.80em'
    },
    "@media (max-width: 360px)": {
      fontSize: '1.40em'
    },
  },
  titleWhite: {
    color: "#FFF"
  },
  containerPayment:{
    backgroundColor : '#eee'
  },
  featuresPayment:{
    padding: "100px 0",
    minHeight: "90vh",
    "@media (max-width: 580px)": {
      padding: '100px 0'
    },
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonLanding:{
    padding: '3px',
    width: '80%'
  },
  imgSize: {
    width: '70%',
  }
};

export default sectionStyle;
