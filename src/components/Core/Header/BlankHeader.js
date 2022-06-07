import React from 'react'
import classNames from "classnames"
import { makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import styles from "components/material-kit-pro-react/components/Header/headerStyle.js"
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from '@material-ui/core/Slide';
import { Link } from "gatsby";
import LogoPiramide from "../../../../static/logo-piramides.svg"
import LogoOceanica from "../../../../static/oceanica_original.png";
const useStyles = makeStyles(styles)
function HideOnScroll(props) {
  const {children} = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction='down' in={!trigger}>
      {children}
    </Slide>
  )
}

export default function BlankHeader(props){
  const classes = useStyles()
  React.useEffect(() => {
    if (props.changeColorOnScroll) {
      window.addEventListener("scroll", headerColorChange);
    }
    return function cleanup() {
      if (props.changeColorOnScroll) {
        window.removeEventListener("scroll", headerColorChange);
      }
    };
  });
  const headerColorChange = () => {
    const { color, changeColorOnScroll } = props;

    const windowsScrollTop = window.pageYOffset;
    if (windowsScrollTop > changeColorOnScroll.height) {
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[changeColorOnScroll.color]);
    } else {
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[changeColorOnScroll.color]);
    }
  };
  const { color, fixed, absolute } = props;
  const appBarClasses = classNames({
    [classes.appBar]: true,
    [classes[color]]: color,
    [classes.absolute]: absolute,
    [classes.fixed]: fixed
  });

  const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
  const logo = (insuranceCompany == 'OCEANICA') ? LogoOceanica : LogoPiramide
  const altText = (insuranceCompany == 'OCEANICA') ? "Oceánica de Seguros" : "Pirámide Seguros"
  return(
    <HideOnScroll {...props}>
    <AppBar className={appBarClasses}>
        <Toolbar className={classes.container}>
          <div className={classes.flexLogo}>
          {(props.noLinks)
            ? <img className={classes.logo} src={logo} alt={altText} />
            : <Link to="/"><img className={classes.logo} src={logo} alt={altText} /></Link>
          }
          </div>
        </Toolbar>
      </AppBar >
    </HideOnScroll>
  )
}