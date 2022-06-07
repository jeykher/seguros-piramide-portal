import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Icon from "@material-ui/core/Icon";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

const styles = {
    actionButtonRound: {
        width: "auto",
        height: "auto",
        minWidth: "auto"
    },
    actionButton: {
        margin: "0 0 0 5px",
        padding: "5px",
        "& svg,& .fab,& .fas,& .far,& .fal,& .material-icons": {
            marginRight: "0px"
        }
    },
    icon: {
        verticalAlign: "middle",
        width: "17px",
        height: "17px",
        top: "-1px",
        position: "relative"
    },
}
const useStyles = makeStyles(styles);

export default function ButtonIconText(props) {
    const classes = useStyles();
    return (
        <Tooltip title={props.tooltip} placement="right-start" arrow TransitionComponent={Zoom}>
            <Button
                round
                color={props.color}
                className={classes.actionButton + " " + classes.actionButtonRound}
            >
                <div>
                    <Icon className={classes.icon}>{props.icon}</Icon>
                </div>
            </Button>
        </Tooltip>
    )
}

