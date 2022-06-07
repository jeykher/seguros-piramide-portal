import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { makeStyles } from "@material-ui/core/styles"
import Extension from "@material-ui/icons/Extension"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import InfoArea from "components/material-kit-pro-react/components/InfoArea/InfoAreaLanding.js"
import Button from "components/material-kit-pro-react/components/CustomButtons/Button.js";
import featuresStyle from "./sectionStyle"
import Img from "gatsby-image"
const useStyles = makeStyles(featuresStyle)

export default function SectionProductos({ ...rest }) {
  const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY;
  const classes = useStyles()

  const data = useStaticQuery( graphql `
  query  {
    allStrapiSegmentosProductos(sort: {fields: orden, order: ASC}) {
      edges {
        node {
          identificador_segmento
          nombre_segmento
          codigo_segmento
          orden
          icono
          descripcion
          imagen_icono {
            childImageSharp {
              fluid(quality: 90, maxWidth: 50) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          imagen_segmento{
            childImageSharp{
              fluid(quality: 90, maxWidth: 650){
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }

    allStrapiProductos(sort: {fields: orden, order: ASC}) {
      edges {
        node {
          nombre_producto
          descripcion_producto
          segmento_producto {
            identificador_segmento
          }
          icono{
            childImageSharp{
              fluid(quality: 95, maxWidth: 250){
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }

    allStrapiPerfiles(sort: {fields: orden,order: DESC}) {
      edges {
        node {
          nombre_perfil
          icono_perfil
        }
      }
     }
  }` )

  const productos = data.allStrapiProductos.edges
  const segmentos = data.allStrapiSegmentosProductos.edges
  const definitivo=[];
  segmentos.map((node, index) => {
    const id = segmentos[index].node.identificador_segmento ;
    const orden = segmentos[index].node.orden ;
    segmentos[index].node.hijos=productos.filter(({ node }) => node.segmento_producto.identificador_segmento.includes(id));
    if (orden < 3 && insuranceCompany !== "OCEANICA") {
      definitivo.push(segmentos[index]);
    }
    if ( insuranceCompany === "OCEANICA"){
      definitivo.push(segmentos[index]);
    }
  })


  const imageClass120 = myIndex => {
    let theClass = null;
    if (myIndex == 0) {
      theClass = [classes.imgContainer , classes.mTop120];
    } else if (myIndex == 1){
      theClass = [classes.imgContainer , classes.mTop60];
    }else if (myIndex == 2){
      theClass = [classes.imgContainer];
    }else{
      theClass = [classes.imgContainer, classes.imgSize];
    }
    return theClass.join(' ');
  }

  const marginTL30 = () => {
    let mtl30 = [classes.mTop30, classes.mLeft30, classes.smallScreenBtn];
    return mtl30.join(' ');
  }

  return (
    <>
      { insuranceCompany !== "OCEANICA"
        ? <div className="cd-section" {...rest}>
            <div className={classes.container}>
              {definitivo.map(({node},index) =>(
                <div className={classes.features6} key={`${index}_ab`}>
                  <GridContainer>
                    <GridItem xs={12} sm={6} md={6}>
                      <div className={imageClass120(index)}>
                      <Img loading='lazy' fluid={node.imagen_segmento.childImageSharp.fluid} alt={` Productos ${node.nombre_segmento}`} />
                      </div>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={6}>
                      <h2 className={classes.propTitle}>{`Productos ${node.nombre_segmento}`}</h2>
                      {node.hijos.map(({ node }, index) => (
                        index<=1 &&
                        <InfoArea
                        key={`${index}_acc`}
                        className={classes.infoArea}
                        icon={node.icono.childImageSharp.fluid.src ? null: Extension}
                        title={node.nombre_producto}
                        description={node.descripcion_producto}
                        iconColor="primary"
                        image={node.icono.childImageSharp.fluid.src ? node.icono.childImageSharp.fluid.src : null }
                        />
                        ))
                      }
                      <GridItem xs={6} sm={5} md={3} className={marginTL30()}>
                        <Link to={`/Productos/${node.codigo_segmento}`}>
                          <Button className={classes.buttonLanding} round block color="primary">
                            Leer más
                          </Button>
                        </Link>
                      </GridItem>
                    </GridItem>
                  </GridContainer>
                </div>
              ))}
            </div>
          </div>
        : <div className={classes.mTop60}>
            <div className="cd-section" {...rest}>
              <div className={classes.container}>
                {definitivo.map(({node},index) =>(
                  <div className={classes.features6} key={`${index}_ab`}>
                    <GridContainer justify="center">
                      <GridItem xs={12} sm={6} md={6}>
                        <div className={imageClass120(3)}>
                          <Img loading='lazy' fluid={node.imagen_segmento.childImageSharp.fluid} alt={ node.nombre_segmento } />
                        </div>
                      </GridItem>
                      <GridItem xs={12} sm={6} md={6}>
                        <span className={classes.propTitleOcea}>{ node.nombre_segmento }</span>
                          <InfoArea
                          key={`${index}_acc`}
                          className={classes.infoArea}
                          icon={ null }
                          title={node.nombre_producto}
                          description={node.descripcion}
                          iconColor="primary"
                          image={ node.imagen_icono ? node.imagen_icono.childImageSharp.fluid.src : null  }
                          />

                        <GridItem xs={6} sm={5} md={3} className={marginTL30()}>
                          <Link to={`/Productos/${node.codigo_segmento}`}>
                            <Button className={classes.buttonLanding} round block color="primary">
                              Leer más
                            </Button>
                          </Link>
                        </GridItem>
                      </GridItem>
                    </GridContainer>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
    </>

  )
}
