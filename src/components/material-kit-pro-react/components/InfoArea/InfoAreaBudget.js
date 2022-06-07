import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

import styles from "./infoBudgetStyle.js";

const useStyles = makeStyles(styles);

export default function InfoAreaBudget(props) {
  const { title, description, iconColor, vertical, className } = props;
  const classes = useStyles();
  const iconWrapper = classNames({
    [classes.iconWrapper]: true,
    [classes[iconColor]]: true,
    [classes.iconWrapperVertical]: vertical
  });
  const iconClasses = classNames({
    [classes.icon]: true,
    [classes.iconVertical]: vertical
  });
  const infoAreaClasses = classNames({
    [classes.infoArea]: true,
    [className]: className !== undefined
  });
  let icon = null;
  if(props.icon==null){
    icon=<div className={classes.imgContainer}>
         <img src={props.image} alt={props.image}/>
         </div>;
  }else{
  switch (typeof props.icon) {
    case "string":
      icon = <div className={iconWrapper}><Icon className={iconClasses}>{props.icon}</Icon></div>;
      break;
    default:
      icon =<div className={iconWrapper}> <props.icon className={iconClasses} /></div>;
      break;
  }
  }
  return (
    <div className={infoAreaClasses}>
      {icon}
      <div className={classes.descriptionWrapper}>
        <h4 className={classes.title}>{title}</h4>
        <div className={classes.description}>{description}</div>
      </div>
    </div>
  );
}

InfoAreaBudget.defaultProps = {
  iconColor: "gray"
};

InfoAreaBudget.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  iconColor: PropTypes.oneOf([
    "primary",
    "warning",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  vertical: PropTypes.bool,
  className: PropTypes.string
};
