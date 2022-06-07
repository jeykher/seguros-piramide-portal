import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";

import sectionStyle from "LandingPageMaterial/Views/Sections/sectionStyle"
const useStyles = makeStyles(sectionStyle);

export default function BudgetTitle({title}) {
    const classes = useStyles();
    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <h2 className={classNames(classes.title, classes.textCenter, classes.titleBudget)}>{title}</h2>
            </GridItem>
        </GridContainer>
    )
}
