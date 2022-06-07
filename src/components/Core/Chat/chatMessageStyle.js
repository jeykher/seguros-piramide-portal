import
    {grayColor,infoColor,successColor,warningColor,primaryColor} 
from "components/material-dashboard-pro-react/components/material-dashboard-pro-react";

const chatMessageStyle = theme => ({
    message : {
        color: '#000',
        clear: 'both',
        lineHeight: '18px',
        fontSize: '15px',
        padding: '8px',
        position: 'relative',
        margin: '8px 0',
        maxWidth: '85%',
        wordWrap: 'break-word',
        "&::after": {
            position: 'absolute',
            content: "''",
            width: 0,
            height: 0,
            borderStyle: 'solid'
        }
    },
    received : {
        background: grayColor[8],
        borderRadius: '0px 5px 5px 5px',
        float: 'left',
        "&::after": {
            borderWidth: '0px 10px 10px 0',
            borderColor: `transparent ${grayColor[8]} transparent transparent`,
            top: 0,
            left: '-10px'
        }
    },
    metadata : {
        padding: '0 0 0 16px'
    },
    sent : {
        background: '#e1ffc7',
        borderRadius: '5px 0px 5px 5px',
        float: 'right',
        "&::after": {
            borderWidth: '0px 0 10px 10px',
            borderColor: 'transparent transparent transparent #e1ffc7',
            top: 0,
            right: '-10px'
        }
    },
    metadata: {
        display: 'inline-block',
        float: 'right',
        padding: '0 0 0 7px',
        position: 'relative',
        bottom: '-4px'
    },
    time : {
        color: 'rgba(0, 0, 0, .45)',
        fontSize: '11px',
        display: 'inline-block'
    },
    readed : {
        color: infoColor[1],
        fontSize: '0.75rem'
    },
    notreaded : {
        color:  grayColor[2],
        fontSize: '0.75rem'
    },
    footermsj : {
        textAlign: 'right'
    },
    success: {
        color: successColor[0]
    },
    warning: {
        color: warningColor[0]
    },
    info: {
        color: infoColor[0]
    },
    primary: {
        color: primaryColor[0]
    },
});

export default chatMessageStyle;