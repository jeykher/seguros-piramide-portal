import React, { useState } from "react"
import { makeStyles } from "@material-ui/styles"
import { graphql } from "gatsby"
import LandingPage from "../../Layout/LandingPage"
import Parallax from "components/material-kit-pro-react/components/Parallax/Parallax"
import SectionTemplate from 'LandingPageMaterial/Views/Sections/SectionTemplate'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
//import NoticiaTexto from "./NoticiaTexto"
import PublicidadStyle from "./publicidadStyle"
import Button from "components/material-kit-pro-react/components/CustomButtons/Button.js"
//import Img from "gatsby-image"

const useStyles = makeStyles(PublicidadStyle)
const handleBack = () => window.history.back();
const checkPath = () => {
    const windowGlobal = typeof window !== 'undefined' && window;
    if (windowGlobal) {
        if (window.location.pathname.includes('asesor') === true) {
            return false
        } else {
            return true
        }
    }
}

export default ({ data }) => {
    const classes = useStyles()
    
    const publicidad = data.strapiPublicidades

   
    return (
        <LandingPage noLinks={checkPath() ? undefined : true}>
            <div className={classes.advertisingImage}>                
                <img className={classes.imagen} src={publicidad.imagen_alterna.childImageSharp.original.src} />                    
            </div>
        </LandingPage >
    )
}

export const query = graphql`
  query($id: String!) {
    strapiPublicidades(id: { eq: $id }) {
      id
      titulo_publicidad
      fecha_publicacion
      imagen_principal {
        childImageSharp {
          fluid(quality: 98) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      imagen_alterna{
        childImageSharp{
          original{
            src
          }
        }
      }
    }
  }
`