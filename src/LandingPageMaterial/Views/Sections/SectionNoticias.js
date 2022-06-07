import React from "react";
import { Link } from 'gatsby'
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Button from "components/material-kit-pro-react/components/CustomButtons/Button.js";
import NoticiasCards from '../Noticias/NoticiasCards'

import sectionNoticiasStyle from "./sectionNoticiasStyle"
const useStyles = makeStyles(sectionNoticiasStyle);

export default function SectionBlogs({ ...rest }) {
  const classes = useStyles();

  return (
    <div className="cd-section" {...rest}>
      <div className={classes.blog}>
        <div className={classes.container}>
          <div className={classes.blog__titulo}>
            <GridContainer>
              <GridItem xs={12} sm={8} md={8} className={classes.mlAuto + " " + classes.mrAuto}>
                <h2 className={classes.title}>Noticias</h2>
              </GridItem>
            </GridContainer>
          </div>
          <NoticiasCards/>
          <GridContainer justify="center">
            <GridItem xs={6} sm={3} md={3}>
              <Link to="/noticias">
                <Button className={classes.buttonLanding} round block color="primary">
                  Más Noticias
                </Button>
              </Link>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
}
