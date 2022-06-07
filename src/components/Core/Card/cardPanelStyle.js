import {
    cardTitle
} from "components/material-dashboard-pro-react/components/material-dashboard-pro-react";

const cardPanelStyle = theme => ({
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        padding: '0 0',
        display: 'flex'
    },
    cardIconTitlePanel: {
      ...cardTitle,
      marginTop: "15px",
      display: 'flex',
      fontSize: '14px'
  },
    cardIconTitleManagement: {
      ...cardTitle,
      marginTop: "10px",
      padding: '0 1em',
      display: 'flex'
    },
    centerIcon:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    suspenseDots:{
        marginRight: 'auto'
      },
      containerIcons:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
      },
      fixed: {
        position: "fixed",
        width: "26%"
      },
      baseHeader:{
        width: '50%',
        "@media (max-width: 960px)": {
          width: "100%"
        }
      },
      textButton:{
        '& .MuiInputBase-root': {
          fontSize: '0.800rem',
        },
      },
      titleText:{
        fontSize: '1rem',
      },
      footerPanel:{
        background: 'rgb(242, 241, 241)',
        margin: '0',
        display: 'flex',
        justifyContent: 'center',
        padding: '0',
        color: 'blue',
      }
});

export default cardPanelStyle;
