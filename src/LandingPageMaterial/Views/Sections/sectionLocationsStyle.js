import {
  container,
  title,
  cardTitle,
  coloredShadow,
  description,
  mlAuto,
  mrAuto,
  grayColor
} from "components/material-kit-pro-react/material-kit-pro-react";

const sectionLocationsStyle = {
  container,
  title,
  coloredShadow,
  cardTitle,
  mlAuto,
  mrAuto,
  description,
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
  contentCenter: {
    display: "flex",
    justifyContent: "center",
    padding: "35px 0 35px 0"
  }
};

export default sectionLocationsStyle;
