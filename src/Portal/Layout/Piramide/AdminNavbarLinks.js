import React, { Fragment } from "react"
import { useLocation } from "@reach/router"
import { navigate, Link } from "gatsby"
import classNames from "classnames"
import PropTypes from "prop-types"
import { deleteToken, deleteProfile, deleteOptionAsesor } from "utils/auth"

// import { Manager, Target, Popper } from "react-popper";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles"
import MenuItem from "@material-ui/core/MenuItem"
import MenuList from "@material-ui/core/MenuList"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import Paper from "@material-ui/core/Paper"
import Grow from "@material-ui/core/Grow"
import Hidden from "@material-ui/core/Hidden"
import Popper from "@material-ui/core/Popper"
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton"

// @material-ui/icons
import Person from "@material-ui/icons/Person"
import Notifications from "@material-ui/icons/Notifications"
import CloseIcon from '@material-ui/icons/Close';

// core components
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button"
import popoverStyles from "components/material-kit-pro-react/components/popoverStyles";

import styles from "./adminNavbarLinksStyle"
import Inbox from "../../Views/Notifications/Inbox"

const useStyles = makeStyles(styles)

export default function HeaderLinks(props) {
  const location = useLocation()
  const [openNotification, setOpenNotification] = React.useState(null)
  const prefixPathSite = (process.env.GATSBY_PREFIX_SITE) ? process.env.GATSBY_PREFIX_SITE + "/" : ""
  const handleClickNotification = event => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null)
    } else {
      setOpenNotification(event.currentTarget)
    }
  }
  const handleCloseNotification = () => {
    setOpenNotification(null)
  }
  const [openProfile, setOpenProfile] = React.useState(null)
  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null)
    } else {
      setOpenProfile(event.currentTarget)
    }
  }

  function handleCloseProfile() {
    setOpenProfile(null)
  }

  function handleChangePassword() {
    navigate("/app/seguridad/cambiar_clave")
  }

  function handleSettingUser() {
    navigate('/app/settings')
  }

  function handleLogout() {
    deleteToken()
    deleteProfile()
    deleteOptionAsesor()
    navigate('/')
  }
  const classes = useStyles()
  const { rtlActive } = props
  const dropdownItem = classNames(classes.dropdownItem, classes.primaryHover, {
    [classes.dropdownItemRTL]: rtlActive
  });
  const wrapper = classNames({
    [classes.wrapperRTL]: rtlActive
  });
  const managerClasses = classNames({
    [classes.managerClasses]: true
  });
  return (
    <div className={wrapper}>
      {/*<Button
        color="transparent"
        simple
        aria-label="Dashboard"
        justIcon
        className={classes.buttonLink}
        muiClasses={{
          label: ""
        }}
      >
        <Hidden mdUp implementation="css">
          <span className={classes.linkText}>
            Dashboard
          </span>
        </Hidden>
      </Button>*/}

      {//NOTIFICACIONES (Modo md o superior)
        <Hidden smDown className={managerClasses}>
          <Popovers />
          <Popper
            open={Boolean(openNotification)}
            anchorEl={openNotification}
            transition
            disablePortal
            placement="bottom"
            className={classNames({
              [classes.popperClose]: !openNotification,
              [classes.popperResponsive]: true,
              [classes.popperNav]: true
            })}
          >
            {({ TransitionProps }) => (
              <Grow
                {...TransitionProps}
                id="notification-menu-list"
                style={{ transformOrigin: "0 0 0" }}
              >
                <Paper className={classes.dropdown}>
                  <ClickAwayListener onClickAway={handleCloseNotification}>
                    <MenuList role="menu">
                      <MenuItem
                        onClick={handleCloseNotification}
                        className={dropdownItem}
                      >
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Hidden>}
      {//Notificaciones (Modo sm)
        <Hidden mdUp className={managerClasses}>
          <div
            color="transparent"
            aria-label="Notifications"
            justIcon
            //aria-owns={openNotification ? "profile-menu-list" : null}
            //aria-haspopup="true"
            onClick={handleClickNotification}
            className={classes.buttonLink + " " + classes.hoverLink}
          >
            <Notifications
              className={
                classes.headerLinksSvg +
                " " +
                (classes.links)
              }
            />
            <Hidden mdUp implementation="css">
              <span className={classes.linkText}>
                {"Notificaciones"}
              </span>
            </Hidden>
          </div>
          {openNotification && <Inbox numReg={3} onClosePop={handleCloseNotification} />}
        </Hidden>
      }
      {//PROFILE (Modo md o superior)
        <Hidden smDown className={managerClasses}>
          <Button
            color="transparent"
            aria-label="Person"
            justIcon
            aria-owns={openProfile ? "profile-menu-list" : null}
            aria-haspopup="true"
            onClick={handleClickProfile}
            className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
            muiClasses={{
              label: rtlActive ? classes.labelRTL : ""
            }}
          >
            <Person
              className={
                classes.headerLinksSvg +
                " " +
                (rtlActive
                  ? classes.links + " " + classes.linksRTL
                  : classes.links)
              }
            />
            <Hidden mdUp implementation="css">
              <span onClick={handleClickProfile} className={classes.linkText}>
                {rtlActive ? "الملف الشخصي" : "Profile"}
              </span>
            </Hidden>
          </Button>
          <Popper
            open={Boolean(openProfile)}
            anchorEl={openProfile}
            transition
            disablePortal
            placement="bottom"
            className={classNames({
              [classes.popperClose]: !openProfile,
              [classes.popperResponsive]: true,
              [classes.popperNav]: true
            })}
          >
            {({ TransitionProps }) => (
              <Grow
                {...TransitionProps}
                id="profile-menu-list"
                style={{ transformOrigin: "0 0 0" }}
              >
                <Paper className={classes.dropdown}>
                  <ClickAwayListener onClickAway={handleCloseProfile}>
                    <MenuList role="menu">
                      {/*<MenuItem
                      onClick={handleCloseProfile}
                      className={dropdownItem}
                    >
                      {rtlActive ? "الملف الشخصي" : "Perfil"}
                    </MenuItem>
                  <Divider light />*/}
                      {!props.parentNameUser && <MenuItem
                        onClick={handleSettingUser}
                        className={dropdownItem}
                      >
                        Ajustes
                  </MenuItem>}
                      <MenuItem
                        onClick={handleChangePassword}
                        className={dropdownItem}
                      >
                        {rtlActive ? "الإعدادات" : "Cambiar clave"}
                      </MenuItem>
                      <MenuItem onClick={handleLogout} className={dropdownItem}> Salir </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Hidden>
      }
      {//PROFILE (Modo sm)
        <Hidden mdUp>
          <a
            to={"#"}
            color="transparent"
            aria-label="Cambio de Clave"
            justIcon
            onClick={handleChangePassword}
            className={classes.buttonLink + " " + classes.hoverLink}
            muiClasses={{
              label: rtlActive ? classes.labelRTL : ""
            }}
          >
            <Person className={classes.headerLinksSvg + " " + classes.links} />

            <Hidden mdUp implementation="css">
              <span className={classes.linkText}>
                {"Cambio de Clave"}
              </span>
            </Hidden>
          </a>

          {!props.parentNameUser && <a
            to={"#"}
            color="transparent"
            aria-label="Ajustes"
            justIcon
            onClick={handleSettingUser}
            className={classes.buttonLink + " " + classes.hoverLink}
            muiClasses={{
              label: rtlActive ? classes.labelRTL : ""
            }}
          >
            <Person className={classes.headerLinksSvg + " " + classes.links} />

            <Hidden mdUp implementation="css">
              <span className={classes.linkText}>
                {"Ajustes"}
              </span>
            </Hidden>
          </a>}

          <Link
            color="transparent"
            aria-label="Salir"
            justIcon
            onClick={handleLogout}
            className={classes.buttonLink + " " + classes.hoverLink}
            muiClasses={{
              label: rtlActive ? classes.labelRTL : ""
            }}
          >
            <CloseIcon className={classes.headerLinksSvg + " " + classes.links} />

            <Hidden mdUp >
              <a to={"#"} onClick={handleLogout} className={classes.linkText + " " + classes.links}>
                {"Salir"}
              </a>
            </Hidden>
          </Link>
        </Hidden>
      }
    </div>
  );
}

HeaderLinks.propTypes = {
  rtlActive: PropTypes.bool
};


export function Popovers({ showPopover }) {
  const useStyles = makeStyles(popoverStyles);
  const [anchorElBottom, setAnchorElBottom] = React.useState(showPopover);
  const classes = useStyles();
  function onClose() {
    setAnchorElBottom(false)
  }
  return (
    <>
      <IconButton aria-label="Notificacion" style={{ width: 41, height: 41, margin: 5 }} onClick={event => setAnchorElBottom(event.currentTarget)}>
        <Notifications style={{ width: 20, height: 20 }} />
        {/*        <span className={classes.notifications}>5</span>*/}
      </IconButton>
      <Popover style={{ height: 600 }}
        classes={{
          paper: classes.popover,
          //width:600
        }}
        open={Boolean(anchorElBottom)}
        anchorEl={anchorElBottom}
        onClose={() => setAnchorElBottom(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <Inbox numReg={3} onClosePop={onClose} />
      </Popover>
    </>
  );
}
