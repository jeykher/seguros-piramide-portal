import {
    container,
    title,
    whiteColor,
    grayColor,
    blackColor,
    hexToRgb
  } from "components/material-kit-pro-react/material-kit-pro-react";

  const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY

const colorTitle = whiteColor;//insuranceCompany === "OCEANICA" ? blackColor : whiteColor;

const fontSizeTitle = insuranceCompany === "OCEANICA" ? "3.4em" : "3.8em";

  const sectionPrincipalStyle = {
    container: {
      ...container,
      zIndex: 1
    },
    contCustom: {
     zIndex: 1,
     marginLeft: "auto",
     marginRight: "auto",
     padding: "0 30px",
     "@media (max-width: 3000px)": {
       minWidth: "2150px",
     },
     "@media (max-width: 2250px)": {
       minWidth: "1620px",
     },
     "@media (max-width: 1920px)": {
       minWidth: "1560px",
     },
     "@media (max-width: 1540px)": {
       minWidth: "1350px",
     },
     "@media (max-width: 1340px)": {
       minWidth: "960px",
     },
     "@media (max-width: 1024px)": {
       minWidth: "720px",
     },
     "@media (max-width: 720px)": {
       minWidth: "335px",
       padding: "0",
     },
     "@media (max-width: 500px)": {
       minWidth: "0px",
       padding: "0",
     }
    },
    itemBudget: {
      display: "flex",
      justifyContent: "flex",
      textAlign: "center",
      "@media (max-width: 600px)": {
        justifyContent: "center"
      }
    },
    itemBudgetPiramid: {
     display: 'flex',
     justifyContent: 'center',
     textAlign: 'center'
    },
    title: {
      ...title,
      color: colorTitle,
      marginBottom: 0,
      marginTop: '1em',
      paddingTop: '1em',
      textAlign: "left",
      "& p":{
        margin: 0,
        marginBottom: 0,
        fontSize: "1.2em",
      }
    },
    titlePiramide: {
      ...title,
      color: colorTitle,
      marginBottom: 0,
      marginTop: '6em',
      paddingTop: '5em',
      textAlign: "center",

      "@media (max-width: 1200px)": {
        marginTop: '4.5em',
        paddingTop: '4em',
      },
      "@media (max-width: 1024px)": {
        marginTop: '3em',
        paddingTop: '2em',
      },
      "@media (max-width: 720px)": {
        marginTop: '6em',
        paddingTop: '5em',
      },
      "@media (max-width: 500px)": {
        marginTop: '6em',
        paddingTop: '5em',
      },
      "& p":{
        margin: 0,
        marginBottom: 0,
        fontSize: "1.5em",
      }
    },
    brand: {
      "& h1": {
        fontSize: fontSizeTitle,
        fontWeight: "600",
      },
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'column'

    },
    brandOceanica: {
     padding: "0 0 0 0",
     marginTop: '2em',
     paddingTop: '2em',
      color: colorTitle,
      textAlign: "left",
      "& h1": {
        fontSize: fontSizeTitle,
        fontWeight: "600",
        display: "inline-block",
        position: "relative"
      }
    },
    proBadge: {
      position: "relative",
      fontSize: "22px",
      textTransform: "uppercase",
      fontWeight: "700",
      right: "-10px",
      padding: "10px 18px",
      top: "-30px",
      background: colorTitle,
      borderRadius: "3px",
      color: grayColor[18],
      lineHeight: "22px",
      boxShadow: "0 5px 5px -2px rgba(" + hexToRgb(grayColor[25]) + ",.4)"
    },
    titleItalic:{
      ...title,
      color:whiteColor,
      fontFamily: "Bell MT",
      fontSize: "0.975rem",
      "@media (max-width: 3000px)": {
        marginTop: "0px",
      },
      "@media (max-width: 1920px)": {
        marginTop: "50px",
      },
      "@media (max-width: 1540px)": {
        marginTop: "50px",
      },
      "@media (max-width: 1340px)": {
        marginTop: "70px",
      },
      "@media (max-width: 1200px)": {
        marginTop: "80px",
      },
      "@media (max-width: 720px)": {
        marginTop: "50px",
      },
      "@media (max-width: 500px)": {
        marginTop: "50px",
      },
      "& h1": {
        margin: 0,
        fontSize: '3.8em',
        "@media (max-width: 3000px)": {
          marginBottom: "5em",
        },
        "@media (max-width: 1920px)": {
          marginBottom: "4.5em",
        },
        "@media (max-width: 1540px)": {
          marginBottom: "3em",
        },
        "@media (max-width: 1340px)": {
          marginBottom: "1.6em",
        },
        "@media (max-width: 1200px)": {
          marginBottom: "1.4em",
        },
        "@media (max-width: 720px)": {
          marginBottom: "0.5em",
        },
        "@media (max-width: 500px)": {
          marginBottom: "0.2em",
        },
      },
    },
    titleBudget: {
     color: "white",
     opacity: "0.8",
     fontSize: "17px",
     "@media (max-width: 400px)": {
       fontSize: "17px",
     }
    },
  };

  export default sectionPrincipalStyle;
