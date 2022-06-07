import React from "react";
import { Link } from 'gatsby'
import { useStaticQuery, graphql } from "gatsby";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Card from "components/material-kit-pro-react/components/Card/Card.js";
import CardHeader from "components/material-kit-pro-react/components/Card/CardHeader.js";
import Info from "components/material-kit-pro-react/components/Typography/Info.js";

import Img from "gatsby-image"
import ReactMarkdown from "react-markdown"



import noticiasListStyle from './noticiasListStyle'
const useStyles = makeStyles(noticiasListStyle);

export default function NoticiasList(props) {
  const classes = useStyles();
  const data = useStaticQuery(
    graphql`
    query  {
      allStrapiNoticias(sort: {fields: fecha_publicacion, order: DESC}) {
        edges {
          node {
            autor
            cuerpo_noticia
            id
            fecha_publicacion(formatString: "DD/MM/YYYY")
            titulo_noticia
            imagen_principal {
              childImageSharp{
                fluid(quality: 95){
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }`
  )
  const noticias = data.allStrapiNoticias.edges;
  let noticiasList;

  if (props.filtro) {
    noticiasList = noticias.filter(({node}) => node.area_seguro_noticia.nombre_area_seguro === props.categoria);
  }else{
    noticiasList = noticias;
  }

  if(props.limit !== undefined){
    noticiasList = noticiasList.slice(0, props.limit);
  }
 
  return (
      <div className={classes.blog}>
        <div className={classes.container}>
          <GridItem xs={12} sm={12} md={12} className={classes.mlAuto + " " + classes.mrAuto}>
          {noticiasList.map(({node}) => (          
          <Card plain blog className={classes.card}>
            <GridContainer>
              <GridItem xs={12} sm={4} md={4} >
                <CardHeader image plain>
                  <Link to={`/${node.id}`}>
                    <Img loading='lazy' fluid={node.imagen_principal.childImageSharp.fluid} alt={node.titulo_noticia} />
                  </Link>
                  <div
                    className={classes.coloredShadow}
                    style={{
                      backgroundImage: `url(${node.imagen_principal.childImageSharp.fluid.src})`,
                      opacity: "1"
                    }}
                  />
                  <div
                    className={classes.coloredShadow}
                    style={{
                      backgroundImage: `url(${node.imagen_principal.childImageSharp.fluid.src})`,
                      opacity: "1"
                    }}
                  />
                </CardHeader>
              </GridItem>
              <GridItem xs={12} sm={8} md={8}>
                <Info>
                  <h6 className={classes.cardCategory}>{node.area_seguro_noticia.nombre_area_seguro}</h6>
                </Info>
                <h3 className={classes.cardTitle}>
                  <Link to={`/${node.id}`}>
                    {node.titulo_noticia}
                  </Link>
                </h3>
                <p className={classes.description}>
                  <ReactMarkdown source={node.cuerpo_noticia.substring(0,200)}/>
                  <Link to={`/${node.id}`}>
                    {" "}
                    Leer más{" "}
                  </Link>
                </p>
                <p className={classes.author}>
                  Por{" "}
                  <Link to={`/${node.id}`}>
                    <b>{node.autor}</b>
                  </Link>{" "}, {node.fecha_publicacion}
                </p>
              </GridItem>
            </GridContainer>
          </Card>
          ))}
          </GridItem>
        </div>
      </div>
  );
}
