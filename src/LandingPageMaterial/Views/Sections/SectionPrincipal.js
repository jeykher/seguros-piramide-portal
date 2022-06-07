import React,{useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/styles'
import Hidden from "@material-ui/core/Hidden";

import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import ParallaxView from "../Parallax/ParallaxView"
import PestanasCotizadores from '../PestanasCotizadores/PestanasCotizadores'

import sectionPrincipalStyle from './sectionPrincipalStyle'
import { graphql, useStaticQuery } from "gatsby";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles(sectionPrincipalStyle);
const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY


export default function SectionPrincipal() {
    const theme = useTheme();
    const matchesTablet = useMediaQuery(theme.breakpoints.up('sm'));
    const matchesLaptop = useMediaQuery(theme.breakpoints.up('md'));
    const classes = useStyles();

    const data = useStaticQuery(
      graphql`
      query {
        allStrapiCotizadores( filter: {orden: {eq: 1}}) {
    edges {
      node {
        id
        nombre_cotizador
        texto_principal
        texto_secundario
        imagen_fondo {
          childImageSharp{
              fluid(quality:100, maxWidth: 2000){
                ...GatsbyImageSharpFluid
              }
          }
        }
        imagen_tablet {
            childImageSharp{
              fluid(quality: 100, maxWidth: 2000){
                ...GatsbyImageSharpFluid
              }
            }
          }
          imagen_movil {
            childImageSharp{
              fluid(quality: 100, maxWidth: 2000){
                ...GatsbyImageSharpFluid
              }
            }
          }
      }
    }
  }

    }`
    );

    const  [titulo,setTitulo]=useState({
        title:data.allStrapiCotizadores.edges[0].node.texto_principal,
        texto:data.allStrapiCotizadores.edges[0].node.texto_secundario,
        imagen:data.allStrapiCotizadores.edges[0].node.imagen_fondo.childImageSharp.fluid.src,
        imagen_movil:data.allStrapiCotizadores.edges[0].node.imagen_movil.childImageSharp.fluid.src,
        imagen_tablet:data.allStrapiCotizadores.edges[0].node.imagen_tablet.childImageSharp.fluid.src,
    });


    const handleGetBackgroundImage = () =>{
        if(matchesLaptop && matchesTablet){
            return titulo.imagen
        }else if(matchesTablet && !matchesLaptop){
            return titulo.imagen_tablet
        }else{
            return titulo.imagen_movil
        }
    }


    useEffect(() =>{
       titulo && handleGetBackgroundImage();
    },[matchesLaptop,matchesTablet,titulo])

   function updateTitleCotizador  (value,valor)  {
       setTitulo({
           ...titulo,
           title:value.texto_principal,
           texto:value.texto_secundario,
           imagen:value.imagen,
           imagen_movil:value.imagen_movil,
           imagen_tablet:value.imagen_tablet,

       });
    }

    return (
        <>
        {insuranceCompany === 'OCEANICA' ?
            <ParallaxView
            image={handleGetBackgroundImage()}
            >
                <div className={classes.container}>
                    <GridContainer justify="center" className={classes.containerBudget}>
                        <Hidden xsDown>
                            <GridItem xs={12} sm={6} md={4} lg={4} className={classes.brand}>
                                <div className={classes.brandOceanica}>
                                    <div dangerouslySetInnerHTML={{ __html: titulo.title }}/>
                                    <div className={classes.title} dangerouslySetInnerHTML={{ __html: titulo.texto }}/>
                                </div>
                            </GridItem>
                        </Hidden>
                        <GridItem xs={12} sm={6} md={8} lg={8} className={classes.itemBudget}>
                          <PestanasCotizadores updateTitle={updateTitleCotizador} insuranceCompany={insuranceCompany} />
                        </GridItem>
                    </GridContainer>
                </div>
            </ParallaxView>
        :
            <ParallaxView
            image={handleGetBackgroundImage()}
            >
               <>
               <div className={classes.contCustom}>
                   <GridContainer justify="center">
                       <GridContainer alignItems="center" xs={12} sm={6} md={6} lg={6} className={classes.itemBudgetPiramid}>
                         <PestanasCotizadores updateTitle={updateTitleCotizador} insuranceCompany={insuranceCompany}/>
                       </GridContainer>
                       <Hidden xsDown>
                           <GridItem xs={12} sm={6} md={6} lg={6}  className={classes.itemBudgetPiramid}>
                               <div className={classes.brand}>
                                   {/* <ReactMarkdown source={titulo.title} className={classes.titleItalic}/>
                                   <ReactMarkdown source={titulo.texto} className={classes.titlePiramide}/> */}
                                   <div className={classes.titleItalic} dangerouslySetInnerHTML={{ __html: titulo.title }}/>
                                   <div className={classes.titlePiramide} dangerouslySetInnerHTML={{ __html: titulo.texto }}/>
                               </div>
                           </GridItem>
                       </Hidden>
                   </GridContainer>
               </div>
               </>

            </ParallaxView>
        }
        </>
    )
}
