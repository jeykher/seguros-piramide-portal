import React from "react"
import { makeStyles } from '@material-ui/styles'

import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Card from "components/material-kit-pro-react/components/Card/Card.js";
import CardHeader from "components/material-kit-pro-react/components/Card/CardHeader.js";

import Img from "gatsby-image"

import NoticiaTextoStyle from './noticiaTextoStyle';
const useStyles = makeStyles(NoticiaTextoStyle);

export default function NoticiaTexto(props) {
    const { noticia } = props;
    const classes = useStyles();
    return (
        <div className={classes.section}>
            <GridContainer justify="center">
                <GridItem xs={12} sm={4} md={4}>
                    <Card plain blog>
                        <CardHeader plain image>
                        <Img loading='lazy' fluid={noticia.imagen_alterna.childImageSharp.fluid} alt={noticia.titulo_noticia} />
                        <div
                          className={classes.coloredShadow}
                          style={{
                            backgroundImage: `url(${noticia.imagen_alterna.childImageSharp.fluid.src})`,
                            opacity: "1"
                          }}
                        />
                        </CardHeader>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={8} md={8}>
                    <h5 className={classes.title}>
                        Por {noticia.autor} - {noticia.fecha_publicacion}
                    </h5>
                    {/*<ReactMarkdown source={noticia.cuerpo_noticia} />*/}
                    <div dangerouslySetInnerHTML={{ __html: noticia.cuerpo_noticia }}/>
                </GridItem>
            </GridContainer>
        </div>
    )
}
