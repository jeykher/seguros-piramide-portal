import React from 'react'
import CardPanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import GenerateConsignmentTable from './GenerateConsignmentTable'


export default function GenerateConsignment({ insuranceArea, providerCode }) {

    return (
        <GridContainer>
            <GridItem item xs={12} sm={12} md={12} lg={12}>
                <CardPanel
                    titulo="Generar Remesa"
                    icon="assignment"
                    iconColor="primary"
                >
                    <GenerateConsignmentTable providerCode={providerCode} insuranceArea={insuranceArea}/>
                </CardPanel>
            </GridItem>
        </GridContainer>
    )
}
