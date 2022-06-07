import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import styles from "./infoStyleLanding.js";



const useStyles = makeStyles(styles);

export default function InfoArea(props) {
  const { title, description, iconColor, vertical, className,justificar,titlecenter } = props;
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
  if(props.icon!=null)
    switch (typeof props.icon) {
      case "string":
        icon = <Icon className={iconClasses}>{props.icon}</Icon>;
        break;
      default:
        icon = <props.icon className={iconClasses}/>;
        break;
    }


    let titleCenter=titlecenter && classes.titlecenter;

  return (
    <div className={infoAreaClasses}>
      {icon!=null && <div className={iconWrapper}>{icon}</div>}
      {props.image!=null&&<div className={iconWrapper}><img src={props.image} alt={props.image}/></div>}
      <div className={classes.descriptionWrapper}>
        <div className={classes.containerTitle}>
          {icon!=null && <div className={classes.iconWrapperScreenSmall}>{icon}</div>}
          <h4 className={classes.title +' '+ titleCenter}>{title}</h4>
        </div>
        <div className={classes.description +''+ justificar && classes.p}  dangerouslySetInnerHTML={{ __html: description }}/>
      </div>
    </div>
  );
}

InfoArea.defaultProps = {
  iconColor: "gray",
  justificar:false
};

InfoArea.propTypes = {
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
  justificar: PropTypes.bool,
  titlecenter: PropTypes.bool,
  className: PropTypes.string
};
