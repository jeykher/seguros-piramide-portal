import {
  cardTitle,
  blackColor,
  hexToRgb
} from "components/material-dashboard-pro-react/components/material-dashboard-pro-react";
import customSelectStyle from "components/material-dashboard-pro-react/components/customSelectStyle";
import customCheckboxRadioSwitch from "components/material-dashboard-pro-react/components/customCheckboxRadioSwitch.js";

const cardTemplateStyle = {
  ...customCheckboxRadioSwitch,
  ...customSelectStyle,
  cardTitle,
  cardIconTitle: {
    ...cardTitle,
    color:"black",
    fontSize:"0.9em",
    marginTop: "15px",
    marginBottom: "0px",
    minHeight: "55px",
    marginLeft: '75px'
  },
  label: {
    cursor: "pointer",
    paddingLeft: "0",
    color: "rgba(" + hexToRgb(blackColor) + ", 0.26)",
    fontSize: "14px",
    lineHeight: "1.428571429",
    fontWeight: "400",
    display: "inline-flex"
  },
  mrAuto: {
    marginRight: "auto"
  },
  mlAuto: {
    marginLeft: "auto"
  },
  buttonAccion: {
    textAlign: "right"
  },
  centerContent: {
    display:'flex',
    justifyContent: 'center'
  }
};


export default cardTemplateStyle;
