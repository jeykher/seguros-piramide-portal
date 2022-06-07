import {
  container,
  title,
  cardTitle,
  coloredShadow,
  description,
  mlAuto,
  mrAuto,
  grayColor,
  primaryColor,
} from "components/material-kit-pro-react/material-kit-pro-react";

const transitDeclarationStyles = {
  container,
  title,
  coloredShadow,
  cardTitle,
  mlAuto,
  mrAuto,
  description,
  TextLeft: {
    textAlign: "left",
  },
  VerticalPos: {
    marginTop: "15px",
  },
  selectFormControl: {
    margin: "0px 0 0px 0 !important",
    "& > div": {
      "&:before": {
        borderBottomWidth: "1px !important",
        borderBottomColor: grayColor[4] + "!important"
      },
      "&:after": {
        borderBottomColor: primaryColor[0] + "!important"
      }
    }
  },
  root: {
    '& .MuiTextField-root': {
      margin: "0",
      width: '100%',
    },
  },
  pTop30: {
    paddingTop: "30px",
  },
  blog__titulo: {
    textAlign: "center",
    marginLeft: "15px",
    marginRight: "15px",
  },
  blog_title_hide: {
    display: "none",
  },
  blog: {
    padding: "0"
  },
  cardCategory: {
    marginBottom: "0",
    marginTop: "10px",
    "& svg,& .fab,& .fas,& .far,& .fal,& .material-icons": {
      position: "relative",
      top: "8px",
      lineHeight: "0"
    }
  },
  description1: {
    ...description,
    lineHeight: "1.313rem"
  },
  author: {
    "& a": {
      color: grayColor[1],
      textDecoration: "none"
    }
  },
  card: {
    marginBottom: "80px"
  },
  card4: {
    marginBottom: "60px",
    textAlign: "center"
  },
  boxMapShadow: {
    borderRadius: "12px!important",
    boxShadow: "10px 10px 32px 9px rgba(164,164,164,0.79)",
  },
  colorAlert: {
    color: "#DF342B",
  },
  colorMessageRed: {
    color: "#FC2D22"
  },
  colorMessageGreen: {
    color: "#00838f"
  },
  errorMessage: {
    color: "red",
    textAlign: "right",
    display: "block",
    paddingTop: "5px",
    minHeight: "30px"
  },
  providerList: {
    overflowY: "scroll",
    maxHeight:"450px",
    marginBottom:"15px"
  },
  mapContainer: {
      height:"450px",
      width:"100%",
      borderRadius: "8px",
      boxShadow: "13px 14px 57px 13px rgba(182,182,182,0.54)",
    },
    contCtrlLegend: {
      padding: "5px",
      backgroundColor: "#F2EFE9",
      opacity: "0.8",
      borderRadius: "6px",
    },
    legendCtrlMarker: {
      opacity: "1",
      textAlign: "right",
      color:"#007994",
      paddingRight: "5px",
      paddingBottom: "3px",
    },
    legendCtrlCluster: {
      opacity: "1",
      textAlign: 'right',
      color:"#007994"
    },
    imgMarker: {
      marginLeft: "3px",
    },
    messageMap: {
      textAlign: "center"
    },
    linealShow: {
      display:""
    },
    linealHide: {
      display:"none"
    },
    containerTopLef: {
      paddingTop:"15px",
      textAlign: "left"
    },
    tCenter: {
      textAlign: "center"
    }
};

export default transitDeclarationStyles;
