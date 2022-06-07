import React from 'react';
import Img from "gatsby-image"
import { makeStyles } from "@material-ui/core/styles";
import Card from "components/material-kit-pro-react/components/Card/Card.js";
import CardBody from "components/material-kit-pro-react/components/Card/CardBody.js";
import CardHeader from "components/material-kit-pro-react/components/Card/CardHeader.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";


import sectionStyle from "LandingPageMaterial/Views/Sections/sectionNoticiasStyle";

const useStyles = makeStyles(sectionStyle);

export default function CardNoticia({node,index,mdSize}){
  
  const classes = useStyles();

  const getTabImage = () => {
    window.open(`${window.location.origin}/publicaciones_asesor_detalle?imgsrc=${node.imagen_alterna.childImageSharp.fluid.src}`,'_blank');
  }

  const getToAdvertising = (node) => {
    window.open(`${window.location.origin}/publicaciones_asesor/${node.id}`);
  }
  
  return(
    <GridItem xs={12} sm={4} md={mdSize} key={index}>
        <Card plain blog>
          <CardHeader plain image>
            <div onClick={() => getToAdvertising(node)} className={classes.imgContainer}>
            <Img loading='lazy' fluid={node.imagen_principal.childImageSharp.fluid} alt={node.titulo_publicidad} className={classes.cardImg} />
            </div>
            <div
                className={classes.coloredShadow}
                style={{
                  backgroundImage: `url(${node.imagen_principal.childImageSharp.fluid.src})`,
                  opacity: "1"
                }}
              />
          </CardHeader>
          <CardBody plain>
            <h4 className={classes.cardTitle} onClick={() => getToAdvertising(node)}>
              {node.titulo_publicidad}
            </h4>
          </CardBody>
        </Card>
      </GridItem>
  )
}