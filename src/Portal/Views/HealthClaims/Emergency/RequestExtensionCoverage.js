import React from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import InsuredInfo from '../InsuredInfo'
import RequestExtensionCoverageForm from './RequestExtensionCoverageForm'

export default function RequestExtensionCoverage(props) {
    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={4} lg={4}>
                <InsuredInfo id={props.id}/>
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>
                <RequestExtensionCoverageForm/>           
            </GridItem>
        </GridContainer>
    )
}
