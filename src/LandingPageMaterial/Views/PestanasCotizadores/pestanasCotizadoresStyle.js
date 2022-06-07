import {
    whiteColor
  } from "components/material-kit-pro-react/material-kit-pro-react";

const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
const boxShadowPiramide =  "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 40px -5px rgba(0, 0, 0, 0.2)";
const boxShadowOceanica = "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)";

const pestanasCotizadoresStyle = {
    container: {
        backgroundColor: whiteColor,
        marginTop: '4.6em',
        opacity: insuranceCompany === 'OCEANICA' ? "1" : "0.8",
        "&:hover":{
          opacity: '1'
        },
        transition: 'all 0.4s ease-in',
        padding: "10px 0",
        maxWidth: "350px",
        height: 'fit-content',
        boxShadow: insuranceCompany === 'OCEANICA' ? boxShadowOceanica : boxShadowPiramide,
        "@media (max-width: 400px)": {
          maxWidth: "315px",
        }
    },
    titleBudget: {
     color: "#ED1C24",
     opacity: "0.9",
     fontSize: "17px",
     margin: 0,
     textAlign:'center'
    },
    titleBudgetOceanica: {
     color: "#3C4858",
     opacity: "0.9",
     fontSize: "17px",
     margin: 0,
     textAlign:'center'
    }
};

export default pestanasCotizadoresStyle;
