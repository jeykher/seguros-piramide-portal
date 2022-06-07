/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import LandingPage from '../LandingPageMaterial/Layout/LandingPage'
import Parallax from "components/material-kit-pro-react/components/Parallax/Parallax.js";
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Card from "components/material-kit-pro-react/components/Card/Card.js";
import CardBody from "components/material-kit-pro-react/components/Card/CardBody.js";
import loginPageStyle from "components/material-kit-pro-react/views/loginPageStyle"
import RecoveryUsername from 'Portal/Views/Security/RecoveryUsername'
import { graphql, useStaticQuery } from "gatsby";


const useStyles = makeStyles(loginPageStyle);

export default function RecoveryUserPage() {

  const classes = useStyles();

  const data = useStaticQuery(
    graphql`
    {
      allStrapiAssetsMedias( filter: {codigo: {eq: "ACCESS_BACKGROUND"}}){
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
    }`
  );

  const backgroundImage = data.allStrapiAssetsMedias.edges[0].node.archivo.childImageSharp.fluid.src


  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });

  return (
    <LandingPage>
      <Parallax
        image={backgroundImage ? backgroundImage : null}
        className={classes.parallax}
      >
        <div className={classes.container+ " " +classes.containerTopSeparation}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={8} md={6}>
                <Card>
                    <CardBody>
                        <RecoveryUsername/>
                    </CardBody>
                </Card>
            </GridItem>
          </GridContainer>
        </div>
        </Parallax>
    </LandingPage>
  );
}
