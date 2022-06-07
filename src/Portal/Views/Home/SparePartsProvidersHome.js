import React from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
import SparePartsBudgetSummary from 'Portal/Views/SparePartsProviders/SparePartsBudgetSummary'

export default function SparePartsProvidersHome() {
    return (
        <GridContainer>
            <GridItem item xs={12} sm={12} md={12} lg={12}>
            <SparePartsBudgetSummary />
            </GridItem>
        </GridContainer>

    )
}
