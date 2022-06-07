import React from 'react'
import { navigate } from "gatsby"

import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button"
import Icon from "@material-ui/core/Icon"

export default function BudgetSMESPortalInit({ codBroker }) {

    async function onInit() {
        navigate(`/app/cotizar/pyme/${codBroker}`)
    }

    return (
        <GridContainer justify="center">
            <Button color="primary" onClick={onInit}>
                <Icon>send</Icon> Iniciar Cotización PYME
            </Button>
        </GridContainer>
    )
}