import {
    container,
    title,
    main,
    whiteColor,
    mainRaised
  } from "components/material-kit-pro-react/material-kit-pro-react";
  
  const publicidadStyle = {
   advertisingImage:{
    paddingTop: "80px",
    width:"100%",  
    "@media (max-width: 580px)": {
      paddingTop: '80px'
    },
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor : '#eee'
  },
  imagen: {   
    width: "100%",
    height: "auto"
   }
  };
  
  export default publicidadStyle;
  