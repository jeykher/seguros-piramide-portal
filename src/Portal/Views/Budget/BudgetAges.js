import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios'
import { useForm } from "react-hook-form"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Typography from '@material-ui/core/Typography';
import { distinctArray } from 'utils/utils'
import CheckBox from 'components/Core/CheckBox/CheckBox'
import AccordionPanelCard from 'components/Core/AccordionPanel/AccordionPanelCard'
import InputController from 'components/Core/Controller/InputController'

export default function BudgetAges() {
    const {  ...objForm } = useForm();
    return (
        <AccordionPanelCard title="Agregue las edades de su familiares" color="primary">
            <GridContainer>
            <GridItem xs={6} sm={6} md={3}>
            <InputController objForm={objForm} label="" name={`p_nas_edaa`} variant="outlined" />
            </GridItem>
            </GridContainer>
        </AccordionPanelCard>
    )
}
