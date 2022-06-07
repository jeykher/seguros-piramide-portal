import React from 'react'
import { graphql } from "gatsby"
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import LandingPage from '../../Layout/LandingPage'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Parallax from "components/material-kit-pro-react/components/Parallax/Parallax.js";
import SectionTemplate from 'LandingPageMaterial/Views/Sections/SectionTemplate'
import TabSimple from 'components/Core/Tabs/TabSimple'

import SectionCoberturas from 'LandingPageMaterial/Views/Products/SectionCoberturas'


import sectionStyle from "LandingPageMaterial/Views/Sections/sectionStyle"
const useStyles = makeStyles(sectionStyle);

export default ({ data }) => {
    const classes = useStyles();

    const [activeBackground,setActiveBackground] = React.useState(0);
    const [value, setValue] = React.useState(0);

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

    const productos = data.allStrapiProductos.edges;
    const coberturasT = data.allStrapiSeccionesProductos.edges

    const navtabs = productos.map(({node})=> {
      const id= node.codigo_producto;
      const coberturas= coberturasT.filter(({ node }) => node.producto.codigo_producto === id);
        return ({
            "titulo": node.nombre_producto,
            id: node.id,
            "component": (tabProducto(node,coberturas))
        })
    })

    return (
        <LandingPage>
            <Parallax small image={productos[activeBackground].node.imagen_producto.childImageSharp.fluid.src}>
                <div className={classes.container}>
                    <GridContainer justify="center">
                        <GridItem xs={12} sm={12} md={8} className={classes.textCenter}>
                            {/* <h2 className={classes.title}>Productos {productos[0].node.segmento_producto.nombre_segmento}</h2> */}
                        </GridItem>
                    </GridContainer>
                </div>
            </Parallax>
            <SectionTemplate>
                  <TabSimple
                    value={value}
                    onChange={handleChange}
                    variant={navtabs.length > 4 ? 'scrollable' : 'standard'}
                    centered={navtabs.length > 4 ? false : true}
                    indicatorColor="primary"
                    textColor="primary"
                    scrollButtons="auto"
                    data={navtabs}
                    handleChangeIndex={handleChangeIndex}
                  />
                <div className={classes.tabSpace} />
            </SectionTemplate>
        </LandingPage>
    )

    function tabProducto(props,coberturas) {
        return(
            <>
                <GridContainer justify="center">
                    <GridItem xs={12} sm={10} md={10} className={classes.mlAuto + " " + classes.mrAuto}>
                        <h2 className={classes.title}>{props.titulo_producto}</h2>
                    </GridItem>
                </GridContainer>
                <GridContainer justify="center">
                    <GridItem md={10} sm={10} className={classNames(classes.mrAuto, classes.mlAuto)}>
                      <div  className={classes.dSized14} dangerouslySetInnerHTML={{ __html: props.descripcion_producto }}/>
                    </GridItem>
                </GridContainer><br />
              <GridContainer justify="center">
                <GridItem md={10} sm={10} className={classNames(classes.mrAuto, classes.mlAuto)}>
                  {coberturas.map(({node},index) =>(
                  <SectionCoberturas
                    key={index}
                    image={node.imagen_seccion.childImageSharp.fluid.src}
                    title={node.nombre_seccion}
                    description={node.texto_seccion}
                    derecha={!!(index % 2)}
                  />
                  ))}
                </GridItem>
              </GridContainer>
            </>
        )}
}

export const query = graphql`
query($id: String!)  {
	allStrapiProductos(filter: {segmento_producto: { identificador_segmento: {eq : $id}}}, sort: {order: ASC, fields: orden}) {
  	edges {
			node {
      	codigo_producto
        descripcion_producto
    		nombre_producto
        imagen_producto {
        	childImageSharp{
            fluid(quality: 95, maxWidth: 1600){
              ...GatsbyImageSharpFluid
            }
          }
        }
        segmento_producto {
      		nombre_segmento
      	}
  		}
  	}
	}

	allStrapiSeccionesProductos(sort: {fields: orden, order: ASC}) {
		edges {
    	node {
      	nombre_seccion
        texto_seccion
        imagen_seccion {
          childImageSharp{
            fluid(quality: 80, maxWidth: 480){
              ...GatsbyImageSharpFluid
            }
          }
        }
        producto {
          codigo_producto
        }
      }
    }
  }
}`
