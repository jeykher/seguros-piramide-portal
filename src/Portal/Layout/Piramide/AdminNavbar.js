import React, {useState, useEffect} from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";


// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";

// material-ui icons
import Menu from "@material-ui/icons/Menu";
import MoreVert from "@material-ui/icons/MoreVert";
import ViewList from "@material-ui/icons/ViewList";

// core components
import AdminNavbarLinks from "./AdminNavbarLinks";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button"
import Logo from "../../../../static/logo-piramides.svg"

import Slide from '@material-ui/core/Slide';


import styles from "./adminNavbarStyle";
const useStyles = makeStyles(styles);

export default function AdminNavbar(props) {
  const classes = useStyles();
  const {rtlActive} = props;
  const appBarClasses = classNames({
    [classes.appBar]: true,
    [classes.fixed]: true
  });


  useEffect(() => {
    //props.sidebarMinimize()
}, [])

  return (
    <AppBar className={appBarClasses}>
      <Slide in={true} direction="left" timeout={2800}>
      <Toolbar className={classes.container}>
        <Hidden smDown implementation="css">

          {props.miniActive ? (
            <div className={classes.sidebarMinimize} >
              <Button
                justIcon
                round
                color="white"
                onClick={props.sidebarMinimize}
              >
                <ViewList className={classes.sidebarMiniIcon} />
              </Button>
            </div>
          ) : (
              <div className={classes.sidebarMinimizeRTL}  >
                <Button
                  justIcon
                  round
                  color="white"                 
                  onClick={props.sidebarMinimize}
                >
                  <MoreVert className={classes.sidebarMiniIcon} />
                </Button>
              </div>
            )}

        </Hidden>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button href="#" className={classes.button__logo} color="transparent">
            <img className={classes.logo} src={Logo} alt="Piramide Seguros" />
          </Button>
        </div>
        <Hidden smDown implementation="css">
          <AdminNavbarLinks rtlActive={rtlActive} parentNameUser={props.parentNameUser}/>
        </Hidden>
        <Hidden mdUp implementation="css">
          <Button
            className={classes.appResponsive}
            color="transparent"
            justIcon
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu parentNameUser={props.parentNameUser}/>
          </Button>
        </Hidden>
      </Toolbar>
      </Slide>
    </AppBar>
  );
}

AdminNavbar.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  rtlActive: PropTypes.bool,
  brandText: PropTypes.string,
  miniActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  sidebarMinimize: PropTypes.func
};
