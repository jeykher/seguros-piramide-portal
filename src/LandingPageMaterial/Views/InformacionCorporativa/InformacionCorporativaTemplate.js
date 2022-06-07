import React, {useEffect, useState} from "react"
import {graphql, Link, useStaticQuery} from "gatsby";

import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import LandingPage from 'LandingPageMaterial/Layout/LandingPage'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Parallax from "components/material-kit-pro-react/components/Parallax/Parallax.js";
import SectionTemplate from 'LandingPageMaterial/Views/Sections/SectionTemplate'
import TabSimple from 'components/Core/Tabs/TabSimple'
import sectionStyle from "LandingPageMaterial/Views/Sections/sectionStyle"
import SectionCoberturas from 'LandingPageMaterial/Views/Products/SectionCoberturas'
import InfoArea from "components/material-kit-pro-react/components/InfoArea/InfoAreaLanding.js"

const useStyles = makeStyles(sectionStyle);

export default ({ data }) => {
  const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
  const classes = useStyles();

  const [value, setValue] = useState(0)
  const [activeBackground,setActiveBackground] = useState(0)

  const handleActiveBackground = (value) =>{
    setActiveBackground(value);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    handleActiveBackground(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

    const seccionesObj = data.allStrapiSeccionesInfoCorporativas.nodes;
    const informacionObj = data.allStrapiInformacionCorporativas.edges;

    const navtabs = informacionObj.map( ({node}) => {
      const id = node.codigo;
      const NombreTabs = node.nombre
      const secciones = seccionesObj.filter( node => node.informacion_corporativa.codigo === id );
      return ({
          "titulo": NombreTabs,
          "component": (tabProducto(node,secciones))
      })
    })

    function tabProducto(props,secciones) {
      return(
         <>
          { (value === 0) && <GridContainer justify="center">
            <GridItem md={10} sm={10} className={classNames(classes.mrAuto, classes.mlAuto)}>
              <br/>
              <br/>
              <div  className={classes.p} dangerouslySetInnerHTML={{ __html: props.descripcion }}/>
            </GridItem>
          </GridContainer>}
          <GridContainer justify="center">
            <GridItem md={10} sm={10} className={classNames(classes.mrAuto, classes.mlAuto)}>
              {secciones.map((node,index) =>(
                <>
                  { (node.imagen_seccion !== null)

                  ?<SectionCoberturas
                    key={index}
                    image={node.imagen_seccion ? node.imagen_seccion.childImageSharp.fluid.originalImg : null }
                    title={node.nombre_seccion}
                    description={node.texto_seccion}
                    derecha={!!(index % 2)}
                  />

                  :<InfoArea
                    key={`${index}_acc`}
                    className={classes.infoArea}
                    icon={null}
                    title={node.nombre_seccion}
                    description={node.texto_seccion}
                    iconColor="primary"
                    image={null}
                  />}
                  <br/>
                </>
              ))}
            </GridItem>
          </GridContainer>
        </>
      )}


  return (
    <LandingPage>
      <Parallax small image={informacionObj[activeBackground].node.imagen.children[0].fluid.originalImg}>
        <div >
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={8}>

            </GridItem>
          </GridContainer>
        </div>
    </Parallax>
      <SectionTemplate>
            <TabSimple
              value={value}
              onChange={handleChange}
              variant='standard'
              centered={true}
              indicatorColor="primary"
              textColor="primary"
              scrollButtons="auto"
              data={navtabs}
              handleChangeIndex={handleChangeIndex}
            />
      </SectionTemplate>
    </LandingPage>
  )
}

export const query = graphql`
query {
  allStrapiInformacionCorporativas {
    totalCount
    edges {
      node {
        descripcion
        imagen {
          id
          children {
            ... on ImageSharp {
              fluid {
                base64
                originalImg
                src
              }
              id
            }
          }
        }
        codigo
        nombre
        orden
        strapiId
        id
      }
    }
  }
  allStrapiSeccionesInfoCorporativas {
    nodes {
      id
      nombre_seccion
      orden
      strapiId
      texto_seccion
      informacion_corporativa {
        codigo
        id
        nombre
        orden
      }
      imagen_seccion {
        childImageSharp {
          fluid {
            base64
            originalImg
          }
        }
      }
    }
  }
}`
