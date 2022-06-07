import React from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
import ActiveServices from 'Portal/Views/HealthCareAdmin/ActiveServices'

export default function HealthCareAdminProvider() {
    return (
        <GridContainer>
            <GridItem item xs={12} sm={12} md={12} lg={12}>
                <CardPanel
                    titulo="Remesas Activas"
                    icon="assignment"
                    iconColor="primary"
                >
                    <ActiveServices />
                </CardPanel>
            </GridItem>
        </GridContainer>
    )
}