import React from 'react';

import Img from "gatsby-image"
import ReactMarkdown from "react-markdown"
import { Link } from 'gatsby'
import { makeStyles } from "@material-ui/core/styles";
import Card from "components/material-kit-pro-react/components/Card/Card.js";
import CardBody from "components/material-kit-pro-react/components/Card/CardBody.js";
import CardHeader from "components/material-kit-pro-react/components/Card/CardHeader.js";
import Info from "components/material-kit-pro-react/components/Typography/Info.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Typography from '@material-ui/core/Typography';


import sectionStyle from "LandingPageMaterial/Views/Sections/sectionNoticiasStyle";

const useStyles = makeStyles(sectionStyle);

export default function CardNoticia({node,index}){

  const classes = useStyles();

  return(
    <GridItem xs={12} sm={4} md={4} key={index}>
        <Card plain blog>
          <CardHeader plain image>
            <Link to={`/noticias/${node.id}`}>
            <Img loading='lazy' fluid={node.imagen_alterna.childImageSharp.fluid} alt={node.titulo_noticia} className={classes.cardImg} />
            </Link>
            <div
                className={classes.coloredShadow}
                style={{
                  backgroundImage: `url(${node.imagen_alterna.childImageSharp.fluid.src})`,
                  opacity: "1"
                }}
              />
          </CardHeader>
          <CardBody plain>
            <Info>
              <h6 className={classes.cardCategory}>{node.area_seguro_noticia.nombre_area_seguro}</h6>
            </Info>
            <h4 className={classes.cardTitle}>
              <Link to={`/noticias/${node.id}`}>
                {node.titulo_noticia}
              </Link>
            </h4>
            <div className={classes.description}>
              {/*<ReactMarkdown className={classes.description} source={`${node.cuerpo_noticia.substring(0,175)}...`} />*/}
              <div  className={classes.description} dangerouslySetInnerHTML={{ __html: `${node.cuerpo_noticia.substring(0,175)}...` }}/>
              <Typography variant="caption" color="primary">
                <Link to={`/noticias/${node.id}`}>
                  Continuar...
                </Link>
              </Typography>
            </div>
          </CardBody>
        </Card>
      </GridItem>
  )
}
