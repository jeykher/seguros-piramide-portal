import {
  container,
  title,
  description,
  section,
  btnLink,
  twitterColor,
  dribbbleColor,
  instagramColor,
  grayColor
} from  "../../material-kit-pro-react";

import imagesStyles from "../../views/imagesStyles"

const style = {
  ...imagesStyles,
  container,
  title,
  description,
  section: {
    ...section,
    padding: "70px 0px"
  },
  socialFeed: {
    "& p": {
      display: "table-cell",
      verticalAlign: "top",
      overflow: "hidden",
      paddingBottom: "10px",
      maxWidth: 300
    },
    "& i": {
      fontSize: "20px",
      display: "table-cell",
      paddingRight: "10px"
    }
  },
  img: {
    width: "20%",
    marginRight: "5%",
    marginBottom: "5%",
    float: "left"
  },
  list: {
    marginBottom: "0",
    padding: "0",
    marginTop: "0",
    "@media (max-width: 768px)": {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center'
    },
  },
  secondLine: {
    "@media (max-width: 440px)": {
      display: "block",
    },
  },
  inlineBlock: {
    display: "inline-block",
    padding: "0px",
    width: "auto"
  },
  flexContainerUp: {
    "@media (min-width: 1000px)": {
      display: "flex",
    },
    "@media (min-width: 1250px)": {
      justifyContent: "space-between",
    },
    width: "100%",
    justifyContent: "start",
    marginBottom: "15px",
  },
  inlineBlockFooter: {
    padding: "0px 25px 20px 0px",
    textTransform: "uppercase",
    fontSize: "12px",
    textAlign: "left",
  },
  left: {
    float: "left!important",
    display: "block",
    "@media (max-width: 768px)": {
      width: '100%'
    },
  },
  right: {
    padding: "15px 0",
    margin: "0",
    float: "right"
  },
  rightLegalStyle: {
    padding: "15px 0",
    margin: "0",
  },
  leftFooter: {
    "@media (min-width: 350px)": {
      display: "flex",
    },
    "@media (min-width: 1000px)": {
      justifyContent: "center",
    },
    "@media (min-width: 760px)": {
      justifyContent: "center",
    },
    flexWrap: "wrap",
  },
  paragraphSize: {
    fontSize:"11px",
  },
  topBottomCompany: {
    "@media (max-width: 1000px)": {
      margin: "15px 0 3px 0 ",
    },
  },
  inlineLinker: {
    "@media (min-width: 760px)": {
      display: "flex",
    },
  },
  aClass: {
    textDecoration: "none",
    backgroundColor: "transparent"
  },
  logoPosition: {
    textAlign: "center",
    borderRight: "solid",
    borderWidth: "thin",
    borderColor: 'rgba(255,255,255, .2)!important',
    marginTop: "12px",
    marginRight: "8px",
    "@media (max-width: 760px)": {
      textAlign: "center",
    },
    "@media (max-width: 960px)": {
      borderRight: "none",
      borderBottom: "solid",
      borderWidth: "thin!important",
      }

  },
  block: {
    color: "inherit",
    padding: "0.9375rem",
    fontWeight: "500",
    fontSize: "12px",
    textTransform: "uppercase",
    borderRadius: "3px",
    textDecoration: "none",
    position: "relative",
    display: "block",
  },
  footerBrand: {
    height: "50px",
    padding: "15px 15px",
    fontSize: "18px",
    lineHeight: "50px",
    marginLeft: "-15px",
    color: grayColor[1],
    textDecoration: "none",
    fontWeight: 700,
    //fontFamily: "Roboto Slab,Times New Roman,sans-serif"
  },
  pullCenter: {
    display: "inline-block",
    float: "none"
  },
  rightLinks: {
    float: "right!important",
    "& ul": {
      marginBottom: 0,
      padding: 0,
      listStyle: "none",
      "& li": {
        display: "inline-block"
      },
      "& a": {
        display: "block"
      }
    },
    "& i": {
      fontSize: "20px"
    }
  },
  linksVertical: {
    "& li": {
      display: "block !important",
      marginLeft: "-5px",
      marginRight: "-5px",
      "& a": {
        padding: "5px !important"
      }
    }
  },
  footer: {
    "& ul li": {
      display: "inline-block"
    },
    "& h4, & h5": {
      color: grayColor[1],
      textDecoration: "none"
    },
    "& ul:not($socialButtons) li a": {
      color: "inherit",
      padding: "0.9375rem",
      fontWeight: "500",
      fontSize: "12px",
      textTransform: "uppercase",
      borderRadius: "3px",
      textDecoration: "none",
      position: "relative",
      display: "block"
    },
    "& small": {
      fontSize: "75%",
      color: grayColor[10]
    },
    "& $pullCenter": {
      display: "inline-block",
      float: "none"
    }
  },
  iconSocial: {
    width: "41px",
    height: "41px",
    fontSize: "24px",
    minWidth: "41px",
    padding: 0,
    overflow: "hidden",
    position: "relative"
  },
  copyRight: {
    padding: "15px 0px"
  },
  socialButtons: {
    "& li": {
      display: "inline-block"
    }
  },
  btnTwitter: {
    ...btnLink,
    color: twitterColor
  },
  btnDribbble: {
    ...btnLink,
    color: dribbbleColor
  },
  btnInstagram: {
    ...btnLink,
    color: instagramColor
  },
  icon: {
    top: "3px",
    width: "18px",
    height: "18px",
    position: "relative"
  },
  customFormControl: {
    paddingTop: "14px"
  },
  algoritmiadiv: {
    padding: "0px 0 0",
    margin: "0",

  },
  algoritmia: {
    fontSize: "12px",
  },
  algoritmiaicon: {
    width: "28px",
    height: "29px",
    padding: "0 0 4px",
  },
  copyRightSize: {
    fontSize: "0.8em"
  }
};

export default style;
