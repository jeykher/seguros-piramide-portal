import React, {useState,useEffect} from 'react'
import {navigate} from 'gatsby'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Icon from "@material-ui/core/Icon";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import ConsignmentDetailsView from './ConsignmentDetailsView'
import ServiceWfDetail from '../Workflow/ServiceWfDetail'

export default function ConsignmentWf(props) {
    const {workflow_id} = props

    function handleBack (e){
        e.preventDefault();
        navigate(`/app/workflow/service/${workflow_id}`);
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={4} lg={4}>
                <ServiceWfDetail id={workflow_id}/>              
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>
                {workflow_id !== null &&
                    <ConsignmentDetailsView workflow_id={workflow_id}/>
                }  
                <GridContainer justify="center">
                    <Button color="secondary" onClick={handleBack}>
                        <Icon>fast_rewind</Icon> Ir al Caso
                    </Button>   
                </GridContainer>              
            </GridItem>
        </GridContainer>
    )
}
