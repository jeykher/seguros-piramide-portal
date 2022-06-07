import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useStaticQuery, graphql } from "gatsby"

//import Chat from "@material-ui/icons/Chat";
// import VerifiedUser from "@material-ui/icons/VerifiedUser";
//import Fingerprint from "@material-ui/icons/Fingerprint";

import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import InfoArea from "components/material-kit-pro-react/components/InfoArea/InfoArea.js";
import featuresStyle from "./sectionStyle";
const useStyles = makeStyles(featuresStyle);

export default function SectionCaracteristicas({ ...rest }) {
  const classes = useStyles();
  const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
  const data = useStaticQuery(
    graphql`
      query  {
        allStrapiCaracteristicas(sort: {order: ASC, fields: orden}) {
          edges {
            node {
              orden
              descripcion_caracteristica
              nombre_caracteristica
              icono {
                childImageSharp{
                  fluid(quality: 60, maxWidth: 150){
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
          }
        }
    }`
  )
  return (

    <div className="cd-section" {...rest}>
      <div className={classes.container}>
        <div className={classes.features1}>
          <GridContainer>
            <GridItem xs={12} sm={8} md={8} className={classes.mlAuto + " " + classes.mrAuto}>
              <h2 className={classes.titleSection}>{(insuranceCompany == 'OCEANICA') ? 'Para nuestros clientes somos' : '¿Por qué Pirámide Seguros?'}</h2>
            </GridItem>
          </GridContainer>
          <GridContainer>
            {data.allStrapiCaracteristicas.edges.map(({ node }, index) => (
              <GridItem xs={12} sm={3} md={3} key={index}>
                <InfoArea
                  vertical
                  image={node.icono.childImageSharp.fluid.src}
                  title={node.nombre_caracteristica}
                  description={node.descripcion_caracteristica}
                  iconColor="danger"
                  titlecenter
                  justificar='center'
                />
              </GridItem>
            ))}
          </GridContainer>
        </div>
      </div>
    </div>
  );
}
