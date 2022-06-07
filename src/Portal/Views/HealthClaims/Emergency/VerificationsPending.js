import React from 'react'
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import VerificationsActiveAsEmployeePaging from 'Portal/Views/HealthClaims/Emergency/VerificationsActiveAsEmployeePaging'

export default function VerificationsPending() {
  
  return (
    <GridContainer>
            <GridItem xs={12} sm={12} md={12} lg={12}>
            <CardPanel
                    titulo="Verificaciones de Emergencias Pendientes por Solicitud de Ingreso"
                    icon="person"
                    iconColor="primary"
                >
                    <VerificationsActiveAsEmployeePaging />      
                </CardPanel>
            </GridItem>
    </GridContainer>
  )
}





