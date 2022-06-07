import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

import Card from "components/material-dashboard-pro-react/components/Card/Card.js";
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js";
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js";
import CardIcon from "components/material-dashboard-pro-react/components/Card/CardIcon.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import Hidden from "@material-ui/core/Hidden";

import styles from "./cardPanelStyle";
const useStyles = makeStyles(styles);

export default function CardManagement(props) {
    const classes = useStyles();
    const { collapse, className } = props
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
                <CardIcon color={props.iconColor?props.iconColor:"primary"} className={classes.centerIcon}>
                    { props.icon &&
                        <Icon>{props.icon}</Icon>
                    }
                    {
                        props.iconValue &&
                        <h5>{props.iconValue}</h5>
                    }
                </CardIcon>
                <div className={classes.cardIconTitleManagement}>
                    <div className={classes.baseHeader}>
                        <h4 className={classes.titleText}>{props.titulo}</h4>
                    </div>
                    {
                        props.headerComponent &&
                        <Hidden smDown implementation="css" className={classes.baseHeader}>
                            <GridContainer justify="flex-end" alignItems="center" className={classes.textButton}>
                            {props.headerComponent}
                            </GridContainer>
                        </Hidden>
                    }
                </div>
            </CardHeader>
            <CardBody
                expanded={expanded}
            >
                {props.headerComponent &&
                    <Hidden mdUp implementation="css"> 
                        <GridContainer justify="center" alignItems="center" className={classes.textButton}>
                            {props.headerComponent}
                        </GridContainer>
                    </Hidden> 
                }
                {props.children}
            </CardBody>
        </Card>
    )
}
