import React, { useState } from 'react'
import Axios from 'axios'
import { useForm } from "react-hook-form";
import InspectionFormSearch from 'Portal/Views/Inspection/InspectionFormSearch'
import BudgetLayout from 'Portal/Views/Budget/BudgetLayout'
import MuiAlert from '@material-ui/lab/Alert';
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";

export default function BudgetInspection(props) {
    const { objBudget, onFinish } = props
    const { info } = objBudget
    const { handleSubmit, ...objForm } = useForm()
    const [inspection, setInspection] = useState(false)

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />
    }

    async function onSave(data) {
        const params = {
            p_budget_id: info[0].BUDGET_ID,
            p_info_vehicle: JSON.stringify({ ...data, inspection_has: "S" })
        }
        await Axios.post('/dbo/budgets/set_data_vehicle', params)
        onFinish()
    }

    function onInspection(value) {
        setInspection(value)
    }

    return (
        <BudgetLayout title="Datos del Vehículo" objBudget={objBudget}>
            <GridContainer>
                <GridItem xs={12} sm={12} md={12} className="sections30">
                    <Alert severity="info">
                        Luego de hacer la inspección a su vehículo,
                        introduzca su número de placa para continuar con su compra.
                        Puede continuar su compra ingresando al enlace que le enviamos a su correo.
                        </Alert>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} className="sections30">
                    <form onSubmit={handleSubmit(onSave)} noValidate autoComplete="off" >
                        <InspectionFormSearch objForm={objForm} budgetId={info[0].BUDGET_ID} onInspection={onInspection} />
                        <GridContainer justify="flex-end">
                            {inspection && <Button color="primary" type="submit"><Icon>send</Icon> Siguiente</Button>}
                        </GridContainer>
                    </form>
                </GridItem>
            </GridContainer>
        </BudgetLayout>
    )
}
