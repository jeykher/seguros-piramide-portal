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

const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
const colorHeader = insuranceCompany == 'OCEANICA' ? '#47C0B6': '#ED1C24';

const sectionNoticiasStyle = {
  container,
  title:{
    ...title,
  },
  coloredShadow,
  cardTitle:{
    ...cardTitle,
    textAlign: 'justify',
    "&:hover":{
      cursor:'pointer'
    }
  },
  mlAuto,
  mrAuto,
  description:{
    ...description,
    textAlign: 'justify'
  },
  blog__titulo: {
    textAlign: "center",
  },
  blog: {
    paddingTop: "0",
    paddingBottom: "80px"
  },
  cardCategory: {
    marginBottom: "0",
    marginTop: "10px",
    "& svg,& .fab,& .fas,& .far,& .fal,& .material-icons": {
      position: "relative",
      top: "8px",
      lineHeight: "0"
    },
    color: colorHeader
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
  textCenter: {
    textAlign: "center"
  },
  cardImg:{
    height: '220px'
  },
  imgContainer:{
    "&:hover":{
      cursor: "pointer"
    }
  },
  link:{
    "&:hover":{
      cursor: "pointer"
    }
  },
  buttonLanding:{
    padding: '5px',
    width: '80%'
  }
};

export default sectionNoticiasStyle;
