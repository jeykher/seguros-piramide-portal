import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import styles from "./infoStyle.js";
import ReactMarkdown from "react-markdown"
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

    const AlignTextFn = justificar => {
      if (justificar === 'justify') {
        return classes.pJustify
      }
      if (justificar === 'right') {
        return classes.pRight
      }
      if (justificar === 'center') {
        return classes.titlecenter
      }
    }

  return (
    <div className={infoAreaClasses}>
      {icon!=null && <div className={iconWrapper}>{icon}</div>}
      {props.image!=null&&<div className={classes.imgContainer}><img src={props.image} alt={props.image}/></div>}
      <div className={classes.descriptionWrapper}>
        <h4 className={classes.title +' '+ titleCenter}>{title}</h4>
        <ReactMarkdown source={description} className={classes.description +' '+ AlignTextFn(justificar) }/>
      </div>
    </div>
  );
}

InfoArea.defaultProps = {
  iconColor: "gray",
  justificar:null
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
