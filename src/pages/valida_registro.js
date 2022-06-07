/*eslint-disable*/
import React, {useState, useEffect} from 'react'

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import LandingPage from '../LandingPageMaterial/Layout/LandingPage'
import Parallax from "components/material-kit-pro-react/components/Parallax/Parallax.js";
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import loginPageStyle from "components/material-kit-pro-react/views/loginPageStyle"
import { useDialog } from "../context/DialogContext";
import queryString from 'query-string';
import Axios from 'axios'
import {Link, graphql, useStaticQuery} from 'gatsby'
import { useLoading } from 'context/LoadingContext'
import Card from "components/material-kit-pro-react/components/Card/Card.js";
import CardBody from "components/material-kit-pro-react/components/Card/CardBody.js";
import CardHeader from "components/material-kit-pro-react/components/Card/CardHeader.js";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";


const useStyles = makeStyles(loginPageStyle);

export default function ValidaRegistroPage(props) {
    const classes = useStyles();  
    const dialog = useDialog(); 
    const loading = useLoading();
    const data = useStaticQuery(
      graphql`
      {
        allStrapiAssetsMedias( filter: {codigo: {eq: "ACCESS_BACKGROUND"}}){
          edges{
            node{
              archivo{
                childImageSharp{
                  fluid(quality: 95, maxWidth: 1700){
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
          }
        }
      }`
    );
    
    const backgroundImage = data.allStrapiAssetsMedias.edges[0].node.archivo.childImageSharp.fluid.src
    
    let params = queryString.parse(props.location.search)
    const [state, setstate] = useState({
        p_hash_id: params.id, 
        mensaje: "Espere mientras confirmamos su registro ...",
        isValid: false
    })
    React.useEffect(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
    });
    
    async function validateCode(){    
        try{
            loading(true)
            const payload = state
            const result = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/validate_register`,payload)  
            
            loading(false)    
            setstate({
                mensaje : "Su usuario fue activado satisfactoriamente, ya puede ingresar a nuestro portal a disfrutar de los servicios que le ofrecemos.",
                isValid : true
            })   
        }catch(error){
            loading(false)
            setstate({
                mensaje : "Acceso no autorizado",
            })
            dialog({
              variant: "info",
              catchOnCancel: false,
              title: "Alerta",
              description: error.response.data
            })
        }
    }

    useEffect(() => {
        validateCode()
    }, [])

  return (
    <LandingPage>
      <Parallax
        image={backgroundImage ? backgroundImage : null}
        className={classes.parallax}
      > 
        <div className={classes.container}>
            <GridContainer justify="center">
                <GridItem xs={12} sm={4} className={classes.textCenter}>                    
                    <Card>                
                        <CardHeader color="primary" validaRegistro className={classes.cardHeader}>
                            <h4 className={classes.cardTitle}>Activación de Usuario</h4>
                        </CardHeader>
                        <CardBody validaRegistro justify="center">
                            <br></br>
                            {state.mensaje}

                            {state.isValid&&
                            <div>
                                <br></br>    
                                
                                <Link to={`/login`}>
                                    <Button type="button" color="primary" fullWidth>Inicia sesión</Button>
                                </Link>
                            </div>
                            }
                            <br></br>
                            <br></br>
                        </CardBody>
                    </Card> 
                </GridItem>
            </GridContainer>   
        </div>     
       </Parallax>
    </LandingPage>
  );
}
