import React from 'react';
import Img from "gatsby-image"
import ReactMarkdown from "react-markdown"
import { makeStyles } from "@material-ui/core/styles";
import Card from "components/material-kit-pro-react/components/Card/Card.js";
import CardBody from "components/material-kit-pro-react/components/Card/CardBody.js";
import CardHeader from "components/material-kit-pro-react/components/Card/CardHeader.js";
import Info from "components/material-kit-pro-react/components/Typography/Info.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Typography from '@material-ui/core/Typography';


import sectionStyle from "LandingPageMaterial/Views/Sections/sectionNoticiasStyle";

const useStyles = makeStyles(sectionStyle);

export default function NewsCard({node,index, mdSize}){
  
  const classes = useStyles();

  const goToNews = (node) => {
    window.open(`${window.location.origin}/noticias_asesor/${node.id}`);
  }


  return(
    <GridItem xs={12} sm={4} md={mdSize} key={index}>
        <Card plain blog>
          <CardHeader plain image>
            <div onClick={() => goToNews(node)} className={classes.imgContainer}>
            <Img loading='lazy' fluid={node.imagen_alterna.childImageSharp.fluid} alt={node.titulo_noticia} className={classes.cardImg} />
            </div>
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
            <h4 className={classes.cardTitle} onClick={() => goToNews(node)}>
                {node.titulo_noticia}
            </h4>
            <div className={classes.description} onClick={() => goToNews(node)}>
              {/*<ReactMarkdown className={classes.description} source={`${node.cuerpo_noticia.substring(0,175)}...`}/>*/}
              <div  className={classes.description} dangerouslySetInnerHTML={{ __html: `${node.cuerpo_noticia.substring(0,175)}...` }}/>
              <Typography variant="p" color="primary" className={classes.link}>
                  Leer más
              </Typography>
            </div>
          </CardBody>
        </Card>
      </GridItem>
  )
}
