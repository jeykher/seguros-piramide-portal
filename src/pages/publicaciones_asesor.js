import React from 'react'
import { useStaticQuery, graphql } from "gatsby"
import { makeStyles } from "@material-ui/core/styles";
import LandingPage from '../LandingPageMaterial/Layout/LandingPage'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Parallax from "components/material-kit-pro-react/components/Parallax/Parallax.js";
import SectionTemplate from 'LandingPageMaterial/Views/Sections/SectionTemplate'
import sectionStyle from "LandingPageMaterial/Views/Sections/sectionNoticiasStyle";
import AdvertisingCard from 'components/Core/Card/AdvertisingCard';

const useStyles = makeStyles(sectionStyle);

export default function Publications() {
  const classes = useStyles();

  const data = useStaticQuery(
    graphql`
    query{
      allStrapiPublicidades(sort: {order: DESC, fields: fecha_publicacion} filter: {categoria_publicacion:{ identificador_categoria: {eq: "2"}}}){
        edges{
          node{
            id
            titulo_publicidad
            fecha_publicacion
            imagen_principal{
              childImageSharp{
                fluid(quality: 95, maxWidth: 700){
                  ...GatsbyImageSharpFluid
                }
              }
            }
            imagen_alterna{
              childImageSharp{
                fluid{
                  src
                }
              }
            }
          }
        }
      }
      allStrapiAssetsMedias( filter: {codigo: {eq: "COMUNICADOS_BACKGROUND"}}){
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
    }
  `
  )

  const advertising = data.allStrapiPublicidades.edges;
  const backgroundImage = data.allStrapiAssetsMedias.edges[0].node.archivo.childImageSharp.fluid.src
  
  return (
    <LandingPage noLinks>
      <Parallax small image={backgroundImage}>
          <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={12} className={classes.textCenter}>
                    <h1 className={classes.title}></h1>
                </GridItem>
              </GridContainer>
          </div>
      </Parallax>
      <SectionTemplate>
      <GridContainer>
      {
        advertising.map(({ node }, index) => (
          <AdvertisingCard
            node={node}
            index={index}
            key={`${index}_ac`}
            mdSize={4}
          />
        ))
      }
      </GridContainer>
      </SectionTemplate>
    </LandingPage>
  )
}