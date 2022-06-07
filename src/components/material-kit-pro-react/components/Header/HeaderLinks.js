/* eslint-disable */
import React, {useState,useEffect} from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// react components for routing our app without refresh
import {graphql, Link, useStaticQuery} from "gatsby";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Icon from "@material-ui/core/Icon";
import Apps from "@material-ui/icons/Apps";
import ViewDay from "@material-ui/icons/ViewDay";

// core components
import CustomDropdown from "../CustomDropdown/CustomDropdown.js";

import styles from "./headerLinksStyle";
import Button from "components/material-kit-pro-react/components/CustomButtons/Button.js";
import {navigate} from 'gatsby'
import Axios from "axios"

const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
//const insuranceCompany = 'piramide'
const useStyles = makeStyles(styles);

const keyUrlClub = 'URL_CLUB'
const keyNameClub = 'CLUB_NAME';

export default function HeaderLinks(props) {
  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const [PWAEvent,setPWAEvent] = useState(null);
  const [showButtton,setShowButton] = useState(false);
  const [urlClub,setUrlClub] = useState(false);
  const [nameClub,setNameClub] = useState(false);

  const handlePWAEvent = (e = null) => {
    e && e.preventDefault();
    e && setPWAEvent(e);
    setShowButton(true);
  }

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => handlePWAEvent(e))
    window.addEventListener('appinstalled', (evt) => {
      setShowButton(false)
    });
    return () => {
      window.removeEventListener('beforeinstallprompt', () => handlePWAEvent())
      window.removeEventListener('appinstalled', (evt) => {
        setShowButton(false)
      });
    }
  },[])

  useEffect(() => {

    const params = { p_key_name: keyUrlClub }
    const paramsName = {p_key_name: keyNameClub}
    const getValues = async () => {
      const {data} = await Axios.post('/dbo/toolkit/get_constant_value',params);
      const result = await Axios.post('/dbo/toolkit/get_constant_value',paramsName);
      setUrlClub(data.result)
      setNameClub(result.data.result);
    }
    getValues();
    
  },[])

  const handleInstallPWA = () => {
    PWAEvent.prompt();
    PWAEvent.userChoice.then((choiceResult) => {
      if(choiceResult){
        setShowButton(false);
      }else{
      }
    })
  }

  const scrollGo = (element, to, duration) => {
    var start = element.scrollTop,
      change = to - start,
      currentTime = 0,
      increment = 20;

    var animateScroll = function() {
      currentTime += increment;
      var val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  };

  const { dropdownHoverColor } = props;
  const classes = useStyles();
  const data = useStaticQuery(
    graphql`
    query  {
      allStrapiSegmentosProductos(sort: {fields: orden,order: ASC}) {
        edges {
          node {
            nombre_segmento
            codigo_segmento
            orden
            icono
          }
        }
      }
      allStrapiPerfiles(sort: {fields: orden,order: ASC}) {
        edges {
          node {
            nombre_perfil
            icono_perfil
          }
        }
       }
    }`
  );

  /*const accessOptions =
  [
    {nombre_segmento: 'Ingresa',icono:'lock_open', link_to: 'login'},
    {nombre_segmento: 'Regístrate',icono:'how_to_reg', link_to: 'register'},
  ];*/

  return (
    <List className={classes.list + " " + classes.mlAuto}>

      {/* <ListItem className={classes.listItem}>
        <CustomDropdown
          noLiPadding
          navDropdown
          hoverColor={dropdownHoverColor}
          buttonText="Servicios"
          buttonProps={{
            className: classes.navLink,
            color: "transparent"
          }}
          buttonIcon={Apps}
          dropdownList={data.allStrapiPerfiles.edges.map( ({node}) => (
            <Link to={`/Servicios/${node.nombre_perfil}`} className={classes.dropdownLink}>
              <Icon className={classes.dropdownIcons}>{node.icono_perfil}</Icon>{node.nombre_perfil}
            </Link>
          ))}
        />
      </ListItem> */}
      {
        urlClub &&
        <ListItem className={classes.listItem}>
          <a
            rel="noreferrer noopener"
            target="_blank"
            href={urlClub}
            className={classes.links}
            >
            <Button
            simple
            color="primary"
            className={classes.navLink}
            >
              <Icon color="primary">fiber_new</Icon>
              {nameClub}
          </Button>
            </a>
        </ListItem>
      }

      {(insuranceCompany == 'OCEANICA') && <ListItem className={classes.listItem}>
        <Button
          simple
          color="transparent"
          className={classes.navLink}
          onClick={() => navigate('/InformacionCorporativa')}
        >
          <Icon>group</Icon>
          Quiénes Somos
        </Button>
    </ListItem>}

      <ListItem className={classes.listItem}>
        <CustomDropdown
          noLiPadding
          navDropdown
          hoverColor={dropdownHoverColor}
          buttonText="Productos"
          buttonProps={{
            className: classes.navLink,
            color: "transparent"
          }}
          buttonIcon={ViewDay}
          dropdownList=
            {data.allStrapiSegmentosProductos.edges.map( ({node}) => (
              <Link to={`/Productos/${node.codigo_segmento}`} className={classes.dropdownLink}>
                <Icon className={classes.dropdownIcons}>{node.icono}</Icon>{node.nombre_segmento}
              </Link>
            ))}
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          simple
          color="transparent"
          className={classes.navLink}
          onClick={() => navigate('/pagos')}
        >
          <Icon>payment</Icon>
          Paga en Linea
        </Button>
      </ListItem>
        <ListItem className={classes.listItem}>
        <Button
          simple
          color="transparent"
          className={classes.navLink}
          onClick={() => navigate('/login')}
        >
          <Icon>lock_open</Icon>
          Ingresa
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          simple
          color="transparent"
          className={classes.navLink}
          onClick={() => navigate('/register')}
        >
          <Icon>how_to_reg</Icon>
          Regístrate
        </Button>
      </ListItem>
        { showButtton &&
          <ListItem className={classes.listItem}>
          <Button
            simple
            color="transparent"
            className={classes.navLinkApp}
            onClick={() => handleInstallPWA()}
          >
            <Apps/>
            Instalar App
          </Button>
        </ListItem>
        }
    </List>
  );
}

HeaderLinks.defaultProps = {
  hoverColor: "primary"
};

HeaderLinks.propTypes = {
  dropdownHoverColor: PropTypes.oneOf([
    "dark",
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose"
  ])
};
