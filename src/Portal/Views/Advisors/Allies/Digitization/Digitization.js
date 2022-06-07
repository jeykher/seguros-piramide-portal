import React, { useState, useEffect } from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
import Icon from "@material-ui/core/Icon";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import DigitizationList from './DigitizationList'
//import ServiceWfDetail from '../Workflow/ServiceWfDetail'
import Card from "components/material-dashboard-pro-react/components/Card/Card.js";
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js";
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js";
import CardIcon from "components/material-dashboard-pro-react/components/Card/CardIcon.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "components/Core/Card/cardPanelStyle";


const useStyles = makeStyles(styles);

export default function Digitization(props) {
    const classes = useStyles();
    const { 
        handleStep, 
        dataReqAlly,
        selectedAlly,
        getRequiremntsAlly,
        brokerSelected,
        handleDataReqAlly 
    } = props

    return (
        <>
        { selectedAlly &&
            <GridContainer>
            <GridItem xs={12} sm={12} md={4} lg={4}>
            <Card fixed>
                    <CardHeader icon>
                        <CardIcon color={'success'} >
                            <Icon>fast_rewind</Icon>
                        </CardIcon>
                            <h4 className={classes.cardIconTitle}>{`Datos del ${selectedAlly.DESCRIPCIONNIVEL.toLowerCase()}`}</h4>  
                            <div className={classes.containerIcons}></div>
                    </CardHeader>
                    <CardBody>                        
                            <h5 key={1}><strong>Cédula:</strong>{` ${selectedAlly.CEDULA}`}</h5>   
                            <h5 key={2}><strong>Usuario Portal:</strong>{` ${selectedAlly.PORTAL_USERNAME}`}</h5>   
                            <h5 key={3}><strong>Nombre:</strong>{` ${selectedAlly.NOMBRE}`}</h5>   
                            <h5 key={4}><strong>Estatus:</strong>{` ${selectedAlly.STATUS === 'ACT' ? 'Activo' : 'suspendido'}`}</h5>
                            {/* <h5 key={4}><strong>Areas:</strong>{` ${selectedAlly.AREAS}`}</h5> */}
                    </CardBody>
                </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>                
                <CardPanel titulo="Gestión de Documentos" icon="dynamic_feed" iconColor="primary">
                    <DigitizationList
                        dataReqAlly={dataReqAlly} 
                        selectedAlly={selectedAlly}
                        getRequiremntsAlly={getRequiremntsAlly}
                        brokerSelected={brokerSelected}
                        handleDataReqAlly={handleDataReqAlly}
                    />
                </CardPanel>                
                <GridContainer justify="center">
                    <Button  onClick={() => handleStep(0)}>
                        <Icon>fast_rewind</Icon> Regresar
                    </Button>
                </GridContainer>
            </GridItem>
        </GridContainer>
        }
        </>
    )
}
