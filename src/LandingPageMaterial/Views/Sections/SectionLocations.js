import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import sectionLocationsStyle from "./sectionLocationsStyle"
import ProviderLocationsController from "components/Core/ProviderLocationsController/ProviderLocationsController"
const useStyles = makeStyles(sectionLocationsStyle);

export default function SectionLocations() {

  const classes = useStyles();

  return (
    <div className="cd-section">
      <div className={classes.blog}>
        <div className={classes.container}>
          <div className={classes.blog__titulo}>
            <GridContainer>
              <GridItem xs={12} sm={8} md={8} className={classes.mlAuto + " " + classes.mrAuto}>
                <h2 className={classes.title}>Ubicación de Aliados</h2>
              </GridItem>
            </GridContainer>
          </div>
          <GridContainer className={classes.contentCenter}>
            <GridItem>
              <ProviderLocationsController
                callFrom={"SectionLocations"}
              />
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
}
