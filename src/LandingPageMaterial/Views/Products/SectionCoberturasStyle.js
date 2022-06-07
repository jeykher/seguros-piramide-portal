import {
  grayColor,
  title
} from "../../../../src/components/material-kit-pro-react/material-kit-pro-react";
const SectionCoberturas = {
  SectionCoberturas: {
    maxWidth: "360px",
    margin: "0 auto",
    padding: "10px 0 10px"
  },
  descriptionWrapper: {
    color: grayColor[26],
    overflow: "hidden",
    float: "left!important",
    align: "justify"
  },
  title: {
    ...title,
    color: grayColor[26],
    margin: "1.75rem 0 0.875rem !important",
    minHeight: "unset",
    display: 'block',
    textAlign: 'justify'
  },
  description: {
    color: grayColor[26],
    overflow: "hidden",
    "& p": {
      color: grayColor[26],
      fontSize: "14px"
    },
    float: "left!important"
  }
};

export default SectionCoberturas;
