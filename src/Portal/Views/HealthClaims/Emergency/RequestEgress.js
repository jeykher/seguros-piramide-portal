import React from 'react'
import Icon from "@material-ui/core/Icon";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Card from "components/material-dashboard-pro-react/components/Card/Card.js";
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js";
import InsuredInfo from '../InsuredInfo'
import RequestEgressForm from './RequestEgressForm'

export default function RequestEgress(props) {
    function handleBack (e){
        e.preventDefault();
        window.history.back()
    }
    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={4} lg={4}>
                
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>
                <RequestEgressForm/>
                <Card>
                    <CardBody align="center">
                        <Button color="secondary" onClick={handleBack}>
                            <Icon>fast_rewind</Icon> Regresar
                        </Button>
                        <Button color="primary">
                            <Icon>send</Icon> Enviar
                        </Button>
                    </CardBody>
                </Card>           
            </GridItem>
        </GridContainer>
    )
}
