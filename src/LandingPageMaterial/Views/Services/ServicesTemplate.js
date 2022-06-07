import React from 'react'
import {graphql } from "gatsby"
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import LandingPage from '../../Layout/LandingPage'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Parallax from "components/material-kit-pro-react/components/Parallax/Parallax.js";
import SectionTemplate from 'LandingPageMaterial/Views/Sections/SectionTemplate'

import sectionStyle from "LandingPageMaterial/Views/Sections/sectionStyle"

import ReactMarkdown from "react-markdown"
const useStyles = makeStyles(sectionStyle);

export default ({ data }) => {
  const classes = useStyles();
  const servicio = data.strapiPerfiles;
  return (
    <LandingPage>
      <Parallax small
        image={servicio.imagen_principal_perfil.childImageSharp.fluid.src}
      />
      <SectionTemplate>
        <GridContainer>
          <GridItem xs={12} sm={8} md={8} className={classes.mlAuto + " " + classes.mrAuto}>
            <h2 className={classes.title}>{servicio.nombre_perfil}</h2>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem md={8} sm={8} className={classNames(classes.mrAuto, classes.mlAuto)}>
            <h5 className={classes.description + " " + classes.gray26}>
              <ReactMarkdown source={servicio.descripcion_perfil} className={classes.p}/>
            </h5>
          </GridItem>
        </GridContainer>
      </SectionTemplate>
    </LandingPage>
  )
}
export const query = graphql`
query($id: String!) {
	strapiPerfiles(id: {eq: $id}) {
  	nombre_perfil
    descripcion_perfil
    id
    imagen_principal_perfil {
      childImageSharp{
        fluid(quality: 95){
        	...GatsbyImageSharpFluid
        }
    	}
  	}
	}
}`
