import React from 'react';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
//import VerificationsActive from 'Portal/Views/HealthClaims/Emergency/VerificationsActive'
import VerificationsActivePaging from 'Portal/Views/HealthClaims/Emergency/VerificationsActivePaging'
import ActiveServices from 'Portal/Views/HealthClaims/ActiveServices'
import VerificationsCardView from '../HealthClaims/VerificationsCardView'
import { getProfileCode } from 'utils/auth'

export default function ProveedoresSalud() {
  return (
    <GridContainer>
      <VerificationsCardView />
      { getProfileCode() !== 'medicoext' &&
        <GridItem xs={12} sm={12} md={4}>
          <CardPanel
            titulo="Emergencia - Pendientes por Solicitud de Ingreso" 
            icon="local_hospital"
            iconColor="primary"
          >
            {/*<VerificationsActive/>*/}
            <VerificationsActivePaging />
          </CardPanel>
        </GridItem>
      }
      { getProfileCode() === 'medicoext' ?
          <GridItem xs={12} sm={12} md={12}>
            <CardPanel
              titulo=" Servicios Activos"
              icon="list_alt"
              iconColor="primary"
            >
              <ActiveServices />
            </CardPanel>
          </GridItem>

          :

          <GridItem xs={12} sm={12} md={8}>
            <CardPanel
              titulo=" Servicios Activos"
              icon="list_alt"
              iconColor="primary"
            >
              <ActiveServices />
            </CardPanel>
          </GridItem>
      }  
      {/*getProfileCode() !== 'clinic' &&
        <GridItem item xs={12} sm={12} md={12} lg={12}>
          <CardPanel
            titulo=" Servicios Activos"
            icon="list_alt"
            iconColor="primary"
          >
            <ActiveServices />
          </CardPanel>
    </GridItem>*/}
    </GridContainer>

  );
}