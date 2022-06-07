import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

import Card from "components/material-dashboard-pro-react/components/Card/Card.js";
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js";
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js";
import CardIcon from "components/material-dashboard-pro-react/components/Card/CardIcon.js";
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter.js";
import styles from "components/Core/Card/cardPanelStyle";
const useStyles = makeStyles(styles);

const CardPanel = (props) => {
  const classes = useStyles();
  const { className,backgroundIconColor,dataCard,handleFooter } = props
  return (
    <Card 
    className={className ? className : undefined}
    >
    <CardHeader color={props.iconColor} icon>
        <CardIcon color={props.iconColor?props.iconColor:"primary"} className={classes.centerIcon} style={backgroundIconColor ? {background : backgroundIconColor} : undefined}>
            <Icon>{props.icon}</Icon>
        </CardIcon>
        <h4 className={classes.cardIconTitle}>{props.titulo}</h4> 
    </CardHeader>
    <CardBody>
        {props.children}
    </CardBody>
    <CardFooter className={classes.footerPanel} onClick={() => handleFooter(dataCard)}>
      <h5>Ver info.</h5>
    </CardFooter>
</Card>
  )
}

export default CardPanel