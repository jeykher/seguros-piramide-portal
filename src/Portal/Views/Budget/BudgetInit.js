import React from 'react'
import Cardpanel from 'components/Core/Card/CardPanel'
import BudgetList from './BudgetList'
import BudgetTabs from './BudgetTabs'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";

export default function BudgetInit() {
    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={4} >
                <Cardpanel titulo="Cotizar" icon="description" iconColor="primary">
                    <BudgetTabs />
                </Cardpanel>
            </GridItem>
            <GridItem xs={12} sm={12} md={8} >
                <Cardpanel titulo="Cotizaciones" icon="list" iconColor="primary">
                    <BudgetList />
                </Cardpanel>
            </GridItem>
        </GridContainer>
    )
}
