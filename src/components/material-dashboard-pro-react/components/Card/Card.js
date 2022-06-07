import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons

// core components
import styles from "./cardStyle.js";

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';



const useStyles = makeStyles(styles);

export default function Card(props) {
  const classes = useStyles();
  const windowGlobal = typeof window !== 'undefined' && window;

  const [state, setState] = React.useState({
    width: (windowGlobal) ? window.innerWidth : 960
  });



  React.useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return function cleanup() {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  });

  const handleWindowSizeChange = () => {
    setState({ width: (windowGlobal) ? window.innerWidth : 960 });
  };

  const {
    className,
    children,
    plain,
    profile,
    blog,
    raised,
    background,
    pricing,
    color,
    product,
    testimonial,
    chart,
    login,
    collapse,
    handleCollapseCard,
    expanded,
    fixed,
    ...rest
  } = props;
  const cardClasses = classNames({
    [classes.card]: true,
    [classes.relative]: (state.width < 960 || !fixed) ? true : false,
    [classes.fixed]: (state.width >= 960 && fixed) ? true : false,
    [classes.cardPlain]: plain,
    [classes.cardProfile]: profile || testimonial,
    [classes.cardBlog]: blog,
    [classes.cardRaised]: raised,
    [classes.cardBackground]: background,
    [classes.cardPricingColor]:
      (pricing && color !== undefined) || (pricing && background !== undefined),
    [classes[color]]: color,
    [classes.cardPricing]: pricing,
    [classes.cardProduct]: product,
    [classes.cardChart]: chart,
    [classes.cardLogin]: login,
    [className]: className !== undefined
  });

  return (
    <div className={cardClasses} {...rest}>
      { collapse !== undefined && 
        <Tooltip title="Expandir" placement="right" arrow className={classes.expandedIcon}>
          <IconButton color="primary" onClick={handleCollapseCard}>
            {!expanded ? 
              <ExpandMoreIcon/> 
              :
              <ExpandLessIcon/> 
            }
              
          </IconButton>
        </Tooltip>
      }
      {children}
    </div>
  );
}

Card.defaultProps = {
  fixed: false
};

Card.propTypes = {
  className: PropTypes.string,
  fixed: PropTypes.bool,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  blog: PropTypes.bool,
  raised: PropTypes.bool,
  background: PropTypes.bool,
  pricing: PropTypes.bool,
  testimonial: PropTypes.bool,
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose"
  ]),
  product: PropTypes.bool,
  chart: PropTypes.bool,
  login: PropTypes.bool,
  children: PropTypes.node,
  expansion: PropTypes.bool
};
