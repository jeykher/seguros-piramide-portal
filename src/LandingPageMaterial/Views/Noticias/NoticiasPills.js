import React from "react";
import { useStaticQuery, graphql } from "gatsby"
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import NavPills from "components/material-kit-pro-react/components/NavPills/NavPills.js";
import NoticiasList from './NoticiasList'

import noticiasPillsStyle from "./noticiasPillsStyle";
const useStyles = makeStyles(noticiasPillsStyle);

export default function NoticiasPills(props) {
  const classes = useStyles();
  const data = useStaticQuery(
    graphql`
    query  {
      allStrapiNoticias(filter: {categoria_publicacion: {identificador_categoria: {eq: "1"}}}, sort: {order: ASC, fields: categoria_publicacion___orden}) {
        edges {
          node {
            area_seguro_noticia {
              codigo_area_seguro
              nombre_area_seguro
            }
          }
        }
        distinct(field: area_seguro_noticia___nombre_area_seguro)
        }
    }`
  )
  const categorias = [{
    tabButton: "TODAS", 
    tabContent: (<NoticiasList filtro={false}/>)
  }]
  data.allStrapiNoticias.distinct.map((prod)=> {
    categorias.push({
      tabButton: prod, 
      tabContent: (<NoticiasList filtro={true} categoria={prod}/>)
    });
  }) 

  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={10} md={10}>
          <NavPills
            alignCenter
            tabs={categorias}          
          />
          <div className={classes.tabSpace} />
        </GridItem>
      </GridContainer>      
    </div>
  );
}
