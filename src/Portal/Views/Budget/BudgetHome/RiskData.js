import React, { useState, Fragment } from 'react'
import Axios from 'axios'
import { useForm } from "react-hook-form";
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import RadioButtonController from 'components/Core/Controller/RadioButtonController'
import BudgetLayout from 'Portal/Views/Budget/BudgetLayout'
import AddressController from 'components/Core/Controller/AddressController'

export default function RiskData(props) {
    const { objBudget, onFinish,onBack } = props
    const { info } = objBudget
    const { handleSubmit, ...objForm } = useForm()
    const [sameDirection, setSameDirection] = useState(null)

    async function onSave(data) {
        const params = {
            p_budget_id: info[0].BUDGET_ID,
            p_info_risk: JSON.stringify({...data })
        }
        await Axios.post('/dbo/budgets/set_data_risk', params)
        onFinish()
    }

    function handleSameDirection(value) {
        setSameDirection(value === "S" ? true : false)
    }

    return (
        <BudgetLayout title="Datos del Inmueble" objBudget={objBudget}>
            <form onSubmit={handleSubmit(onSave)} noValidate autoComplete="off" >
                <GridContainer>
                    <GridItem xs={12} sm={12} md={1}>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={8}>
                        <h5>¿La dirección del inmueble es la misma del titular?</h5>
                        <RadioButtonController
                            row
                            objForm={objForm}
                            name="direction_same"
                            values={[{ label: "Si", value: "S" }, { label: "No", value: "N" }]}
                            onChange={handleSameDirection}
                        />
                        {sameDirection !== null && !sameDirection && <Fragment>
                            <h5>Introduzca la dirección del inmueble</h5>
                            <AddressController
                                index={0}
                                objForm={objForm}
                                showUrbanization={true}
                                showDetails={true}
                            />
                        </Fragment>}                       
                            <GridContainer justify="flex-end">
                                <Button onClick={onBack}><Icon>fast_rewind</Icon> Regresar</Button>
                                {sameDirection !== null &&<Button color="primary" type="submit"><Icon>send</Icon> Siguiente</Button>}
                            </GridContainer>
                    </GridItem>
                </GridContainer>
            </form>
        </BudgetLayout>
    )
}
