import React from 'react'
import Axios from 'axios';
import { useForm } from "react-hook-form";
import { useLocation } from "@reach/router"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import MuiAlert from '@material-ui/lab/Alert'
import NumberController from 'components/Core/Controller/NumberController'

export default function BudgetCode(props) {
    const { budgetId, onFinish } = props
    const location = useLocation();
    const { handleSubmit, ...objForm } = useForm()

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />
    }

    async function onSubmit(dataform, e) {
        try {
            const params = {
                p_budget_id: budgetId,
                p_json_info: JSON.stringify({ ...dataform, location: location.origin })
            }
            const response = await Axios.post('/dbo/budgets/validate_sms', params)
            onFinish(response.data.p_hash)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={3} >
            </GridItem>
            <GridItem xs={12} sm={12} md={6} >
                <GridItem xs={12} sm={12} md={12} className="sections30">
                    <Alert severity="success">Para continuar con su cotización
                        le hemos enviado el código de verificación via SMS a su teléfono </Alert>
                </GridItem>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <GridContainer className="sections30" spacing={3}>
                        <GridItem xs={12} sm={12} md={12} >
                            <NumberController
                                objForm={objForm}
                                label="Código de verificación"
                                name="code_validation"
                                inputProps={{ maxLength: 4 }} />
                        </GridItem>
                    </GridContainer>
                </form>
            </GridItem>
        </GridContainer>
    )
}
