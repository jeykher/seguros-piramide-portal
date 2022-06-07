import React, { useState, useEffect } from "react";
import { useLocation } from "@reach/router"
import { makeStyles } from "@material-ui/core/styles";
import { useUser } from 'context/UserContext'
import cx from "classnames";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import "components/material-dashboard-pro-react/scss/material-dashboard-pro-react.scss?v=1.8.0";
import AdminNavbar from "./AdminNavbar"
import Footer from "./Footer";
import Sidebar from "./Sidebar";

import Axios from 'axios'
import styles from "Portal/Layout/appStyle";
import Routing from 'Portal/Layout/Routing'
import Inbox from "../../Views/Notifications/Inbox"
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { bufferToImageBase64 } from 'utils/utils'



//import NotificationsActiveServices from '../Portal/Views/Workflow/Notifications/NotificationsActiveServices'

var ps;
const useStyles = makeStyles(styles);

export default function Layout(props) {
  const { ...rest } = props;
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [miniActive, setMiniActive] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [nameUser, setNameUser] = useState()
  const [parentNameUser, setParentNameUser] = useState()
  const [isHome, setIsHome] = useState(false);
  const theme = useTheme();
  const smallView = useMediaQuery(theme.breakpoints.down('sm'))
  const { setHome } = useUser() || { setHome: "" };

  const {profilePictureUser, handleProfilePictureUser} = useUser();
  const [profilePicture,setProfilePicture] = useState()

  const classes = useStyles();
  const mainPanelClasses =
    classes.mainPanel +
    " " +
    cx({
      [classes.mainPanelSidebarMini]: miniActive,
      [classes.mainPanelWithPerfectScrollbar]: false
    });
  const mainPanel = React.createRef();


  async function cargarRoutes(params) {
    const response = await Axios.post('/dbo/security/menu_to_clob', params);
    const jsonResult = response.data.result
    /*const rutas = jsonResult.menu.map((reg) => {
      return { path: reg.path, name: reg.option_name, icon: reg.icon, layout: "/app" }
    })*/
    const rutas = jsonResult.views
    if(jsonResult.parent_name&&jsonResult.parent_name.toUpperCase()!='NULL'&&jsonResult.parent_name!=''){
      setParentNameUser(jsonResult.parent_name)
    } 
    setNameUser(jsonResult.first_name)
    setHome(jsonResult.home)
    setRoutes(rutas);

    if (pathname == jsonResult.home) {
      setIsHome(true)
    }

    const home = jsonResult.views[0]
    //setApplication("prueba")
    //navigate(`/app${home.path}`)
  }

  async function searchPictureProfile(){
    const picture = profilePictureUser
    if(picture){
      setProfilePicture(picture)
      return
    }else{
      const {data} = await Axios.post('/dbo/portal_admon/get_profile_picture')
      if(data.result.length > 0 && data.result[0].IMAGE !== null){
        const image = bufferToImageBase64(data.result[0].IMAGE.data)
        handleProfilePictureUser(`data:image/png;base64,${image}`)
        setProfilePicture(`data:image/png;base64,${image}`)
      }
    }
  }

  useEffect(() => {
    cargarRoutes();

    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);

    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };

  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getRoute = () => {
    if (typeof window !== `undefined`) {
      return window.location.pathname !== "/admin/full-screen-maps";
    }
  };

  const getActiveRoute = routes => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (typeof window !== `undefined`) {
          if (
            window.location.href.indexOf(routes[i].path) !== -1
          ) {
            return routes[i].name;
          }
        }
      }
    }
    return activeRoute;
  };

  const sidebarMinimize = () => {
    setMiniActive(!miniActive);
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  function restartScroll(){
    mainPanel.current.scrollTop = 0;
  }

  const validatePanel = () => {
    if(pathname.includes('home_supervisor') || pathname.includes('home_empleado') || pathname.includes('panel_presidente') ){
      setMiniActive(true);
    }
  }

  useEffect(() => {
    restartScroll()
    validatePanel()
  }, [pathname]);

  useEffect(() =>{
    const botScript = document.querySelector('#_agentCoreScript');
    const agentBot = document.querySelector('#AgentAppContainer');
    if(botScript && agentBot){
      botScript.remove();
      agentBot.remove();
    }
  })

  useEffect(() =>{
    searchPictureProfile();
  },[profilePictureUser])

  return (
    <div className={classes.wrapper}>
      {isHome && <Inbox modal={true} numReg={5} />}
      <Sidebar
        routes={routes}
        logoText=""
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={!smallView ? "green" : ""}
        bgColor="blue"
        miniActive={miniActive}
        nameUser={nameUser}
        parentNameUser={parentNameUser}
        pictureProfile={profilePicture}
        {...rest}
      />
      <div className={mainPanelClasses} id="main_panel" ref={mainPanel}>
        <AdminNavbar
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
          brandText={getActiveRoute(routes)}
          handleDrawerToggle={handleDrawerToggle}
          parentNameUser={parentNameUser}
          {...rest}
        />
        <div className={classes.content}>
          <div className={classes.container}>
            <Routing restartScroll={restartScroll}/>
            {/*<NotificationsActiveServices/>*/}
          </div>
        </div>
        {getRoute() ? <Footer fluid /> : null}
      </div>      
    </div>
  );
}
