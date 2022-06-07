import React from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
import ActiveServices from 'Portal/Views/Supervisors/ActiveServices'
import SlickChart from '../Supervisors/Charts/SlickChart';
import ActiveServicesChart from '../Supervisors/Charts/ActiveServiceChart';
import CasePerServiceChart from '../Supervisors/Charts/CasesPerServiceChart';
import PerfomanceChart from '../Supervisors/Charts/PerfomanceChart';

export default function HomeSupervisors() {
    return (
        <GridContainer>
            <GridItem item xs={12} sm={12} md={12} lg={12}>
            <SlickChart>
                    <ActiveServicesChart/>
                    <CasePerServiceChart/>
                    <PerfomanceChart/>
                </SlickChart>
            </GridItem>
            <GridItem item xs={12} sm={12} md={12} lg={12}>
                <CardPanel
                    titulo="Bandeja de mi equipo"
                    icon="person"
                    iconColor="primary"
                >
                  <ActiveServices/>
                </CardPanel>
            </GridItem>
        </GridContainer>

    )
}
