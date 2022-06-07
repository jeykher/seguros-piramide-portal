import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

import Card from "components/material-dashboard-pro-react/components/Card/Card.js";
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js";
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js";
import CardIcon from "components/material-dashboard-pro-react/components/Card/CardIcon.js";

import styles from "./cardPanelStyle";
const useStyles = makeStyles(styles);

export default function CardPanel(props) {
    const classes = useStyles();
    const { collapse, className, backgroundIconColor } = props
    const [expanded,setExpanded] = React.useState(true);
    const handleCollapseCard = () =>{
        collapse && setExpanded(!expanded);
    }
    return (
        <Card 
            collapse={collapse}
            handleCollapseCard={handleCollapseCard}
            expanded={expanded}
            className={className ? className : undefined}
        >
            <CardHeader color={props.iconColor} icon>
                <CardIcon color={props.iconColor?props.iconColor:"primary"} className={classes.centerIcon} style={backgroundIconColor ? {background : backgroundIconColor} : undefined}>
                    <Icon>{props.icon}</Icon>
                </CardIcon>
                <h4 className={classes.cardIconTitle}>{props.titulo}</h4> 
            </CardHeader>
            <CardBody
                expanded={expanded}
            >
                {props.children}
            </CardBody>
        </Card>
    )
}
