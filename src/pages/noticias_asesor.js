import React from 'react'
import { useStaticQuery, graphql } from "gatsby"
import { makeStyles } from "@material-ui/core/styles";
import LandingPage from '../LandingPageMaterial/Layout/LandingPage'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Parallax from "components/material-kit-pro-react/components/Parallax/Parallax.js";
import SectionTemplate from 'LandingPageMaterial/Views/Sections/SectionTemplate'
import sectionStyle from "LandingPageMaterial/Views/Sections/sectionNoticiasStyle";
import NewsCard from 'components/Core/Card/NewsCard';

const useStyles = makeStyles(sectionStyle);

export default function Noticias() {
  const classes = useStyles();

  const data = useStaticQuery(
    graphql`
    query{
      allStrapiNoticias(sort: {order: DESC, fields: fecha_publicacion} filter: {categoria_publicacion:{ identificador_categoria: {eq: "2"}}} ){
        edges{
          node{
            id
            autor
            titulo_noticia
            cuerpo_noticia
            categoria_publicacion{
              identificador_categoria
            }
            area_seguro_noticia {
              nombre_area_seguro
            }
            imagen_principal {
              childImageSharp{
                fluid(quality: 100, maxWidth: 700){
                  ...GatsbyImageSharpFluid
                }
              }
            }
            imagen_alterna {
              childImageSharp{
                fluid(quality: 100, maxWidth: 700){
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
      allStrapiAssetsMedias( filter: {codigo: {eq: "NOTICIAS_BACKGROUND"}}){
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

  const noticias = data.allStrapiNoticias.edges;
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
        {noticias.map( ({node},index) =>(
          <NewsCard
            node={node}
            index={index}
            key={`${index}_a`}
            mdSize={4}
          />
        ))}
      </GridContainer>
      </SectionTemplate>
    </LandingPage>
  )
}