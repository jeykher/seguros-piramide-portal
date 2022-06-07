import React, {useState} from 'react'
import {navigate} from 'gatsby'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import TimelineWf from './TimelineWf'
import ServiceWfDetail from './ServiceWfDetail'
import Icon from "@material-ui/core/Icon";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import { getProfileHome } from 'utils/auth';

export default function ServiceWf(props) {
    const {id,id_message, showBackButton = true } = props
    const [indShowBackButton , setIndShowBackButton] = useState(showBackButton)
    let indBack = props.location.state.indBack
     
     console.log('indShowBackButton:', indShowBackButton)

    function handleStart (e){
        e.preventDefault();
        navigate(getProfileHome());
    }

    function handleBack (e){
        e.preventDefault();
        window.history.back()
    }

    let button;
    if (indBack === undefined || !indBack) {
        button = indShowBackButton ?
            <Button color="secondary" onClick={handleStart}>
                <Icon>fast_rewind</Icon> Ir al Inicio
            </Button> : ''
    } else {
        button = 
            <Button color="secondary" onClick={handleBack}>
            <Icon>fast_rewind</Icon> Regresar
        </Button>
        
            
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={4} lg={4}>
                <ServiceWfDetail id={id}/>            
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>
                <TimelineWf id={id} id_message={id_message}/>
                <GridContainer justify="center">
                    {button}
                </GridContainer>
            </GridItem>
        </GridContainer>
    )
}


