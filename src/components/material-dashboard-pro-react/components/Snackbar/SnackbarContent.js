import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Snack from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import { Button } from "@material-ui/core"

// @material-ui/icons
import Close from "@material-ui/icons/Close";

import styles from "./snackbarContentStyle.js";

import { whiteColor } from "../material-dashboard-pro-react"

const useStyles = makeStyles(styles);

const useStylesSnackButton = makeStyles({
  root: {
    textTransform: 'none',
    padding: '0px 0px 0px 0px',
    color: whiteColor
  },
});

export default function SnackbarContent(props) {
  const classes = useStyles();
  const classesSnackButton = useStylesSnackButton();
  const { message, color, close, icon, isButton, buttonMessage } = props;
  var action = [];

  function onSnackButtonClick() {
    if (props.onButtonClick) {
      props.onButtonClick();
    }
  }
  const messageClasses = cx({
    [classes.iconMessage]: icon !== undefined
  });
  if (close !== undefined) {
    action = [
      <IconButton
        className={classes.iconButton}
        key="close"
        aria-label="Close"
        color="inherit"
      >
        <Close className={classes.close} />
      </IconButton>
    ];
  }

  const iconClasses = cx({
    [classes.icon]: classes.icon,
    [classes.infoIcon]: color === "info",
    [classes.successIcon]: color === "success",
    [classes.warningIcon]: color === "warning",
    [classes.dangerIcon]: color === "danger",
    [classes.primaryIcon]: color === "primary",
    [classes.roseIcon]: color === "rose"
  });
  return (
    <Snack
      message={
        <div>
          {icon !== undefined ? <props.icon className={iconClasses} /> : null}
          {(isButton !== undefined) ?
            <Button className={classesSnackButton.root} fullWidth onClick={() => onSnackButtonClick()}>
              {buttonMessage}
            </Button>
          : <span className={messageClasses}>{message}</span>}         
        </div>
      }
      classes={{
        root: classes.root + " " + classes[color],
        message: classes.message
      }}
      action={action}
    />
  );
}

SnackbarContent.defaultProps = {
  color: "info"
};

SnackbarContent.propTypes = {
  message: PropTypes.node.isRequired,
  color: PropTypes.oneOf([
    "info",
    "success",
    "warning",
    "danger",
    "primary",
    "rose"
  ]),
  close: PropTypes.bool,
  icon: PropTypes.object,
  isButton: PropTypes.bool,
  onButtonClick: PropTypes.func,
  buttonMessage: PropTypes.string
};
