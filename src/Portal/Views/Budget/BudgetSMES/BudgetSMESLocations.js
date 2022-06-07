import React, { useState, useEffect, useRef } from 'react'
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
import { distinctArray } from 'utils/utils'
import BudgetSMESLocationsForm from './BudgetSMESLocationsForm'
import BudgetLayout from 'Portal/Views/Budget/BudgetLayout'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";

export default function BudgetSMESLocations(props) {
    const { index, onFinish, onBack, objBudget } = props
    const { info, budgetInfo, getPlanBuy } = objBudget
    const dialog = useDialog()
    const [locations, setLocations] = useState([])
    const formRef = useRef([])

    function getLocations() {
        const principalLocation = {
            location_number: 1,
            p_state_id_1: budgetInfo.p_state_id_1,
            p_city_id_1: budgetInfo.p_city_id_1,
            p_municipality_id_1: budgetInfo.p_municipality_id_1,
            p_address_1: budgetInfo.p_address_1,
            contact_name_1: budgetInfo.contact_name_1,
            contact_phone_1: budgetInfo.contact_phone_1
        }
        let locationsArray1
        if (budgetInfo.locations_number > 1) {
            const secondaryLocations = [...budgetInfo.secondary_locations]
            locationsArray1 = [principalLocation, ...secondaryLocations]
        }
        else {
            locationsArray1 = [principalLocation]
        }

        const locationsArray = [...locationsArray1]
        formRef.current = locationsArray.map(() => React.createRef())
        setLocations(locationsArray)
    }

    async function onSave() {
        try {
            const params = await getData()
            if (params) {
                await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/budgets/update_locations_data`, params)
                onFinish()
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function getData() {
        try {
            let arrayLocationsToUpdate = []
            for (const [index, location] of locations.entries()) {
                const data = await formRef.current[index].current.isValidated()
                arrayLocationsToUpdate.push(data)
            }
            const params = {
                p_budget_id: info[0].BUDGET_ID,
                p_json_char_locations: JSON.stringify(arrayLocationsToUpdate)
            }

            return params
        } catch (error) {
            dialog({
                variant: "info",
                catchOnCancel: false,
                title: "Alerta",
                description: error
            })

            throw "Debe verificar los datos suministrados"
        }
    }

    useEffect(() => {
        getLocations()
    }, [])

    return (
        <BudgetLayout title="Datos de las localidades" objBudget={objBudget}>
            {locations && locations.map((reg, indexAc) => {
                return <BudgetSMESLocationsForm                    
                    info={info}
                    locationData={reg}
                    ref={formRef.current[indexAc]}
                />
            })}
            <GridItem item xs={12} sm={12} md={12} lg={12}>
                <GridContainer justify="flex-end">
                    <Button onClick={onBack}><Icon>fast_rewind</Icon> Regresar</Button>
                    <Button color="primary" onClick={onSave}><Icon>send</Icon> Siguiente</Button>
                </GridContainer>
            </GridItem>
        </BudgetLayout>
    )
}
