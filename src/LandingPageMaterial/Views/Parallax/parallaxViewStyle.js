import {
    container
  } from "components/material-kit-pro-react/material-kit-pro-react";

const parallaxViewStyle = {
    container,
    parallax: {
        height: "90vh",
        overflow: "hidden",
        "@media (max-width: 415px)": {
          height: "95vh"
        },
        "@media (max-width: 375px)": {
          height: "100vh"
        },
        "@media (max-width: 325px)": {
          height: "103vh"
        }
    }
};

export default parallaxViewStyle;
