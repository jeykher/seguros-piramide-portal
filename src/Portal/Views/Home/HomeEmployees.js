import React from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
import ActiveServices from 'Portal/Views/Employees/ActiveServices'
import Dashboard from '../Employees/Dashboard/Dashboard';
import { getProfileCode} from 'utils/auth'

export default function HomeEmployees() {
    const profileCode = getProfileCode()
    return (
        <GridContainer>
            <Dashboard /> 
            <GridItem item xs={12} sm={12} md={12} lg={12}>
                <CardPanel
                    titulo="Bandeja de entrada"
                    icon="person"
                    iconColor="primary"
                >
                    <ActiveServices />      
                </CardPanel>
            </GridItem>
        </GridContainer>
    )
}
