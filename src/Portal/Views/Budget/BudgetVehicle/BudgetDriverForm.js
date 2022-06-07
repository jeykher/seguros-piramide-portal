import React, {useState} from 'react'
import Axios from 'axios'
import { useForm } from "react-hook-form";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import BudgetLayout from 'Portal/Views/Budget/BudgetLayout'
import CustomerFormDriver from 'Portal/Views/Customer/CustomerFormDriver'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import UseCustomer from 'Portal/Views/Customer/UseCustomer'
import { Alert } from '@material-ui/lab';

export default function BudgetDriverForm(props) {
    const { index, onFinish, onBack, objBudget } = props
    const { info, budgetInfo } = objBudget
    const { handleSubmit, ...objForm } = useForm();
    const { ...objCustomer } = UseCustomer()
    const [severity, setSeverity] = useState('error')
    const [showMessage, setShowMessage] = useState('N')
    const [message, setMessage] = useState('')

    async function onSave(dataform) {
        try {
            const params = {
                p_customer_type: index,
                p_budget_id: info[0].BUDGET_ID,
                p_customer_basic_info:
                    JSON.stringify({ [`p_identification_verified_${index}`]: objCustomer.identificationVerified, ...dataform })
            }            
            
            if ("p_name_one_DRIVER" in dataform && "p_surmane_one_DRIVER" in dataform
               &&  "p_sex_DRIVER" in dataform){
                setShowMessage('N')
                await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/budgets/set_customer`, params)
                onFinish()
            }               
            else {
                setShowMessage('S')
                setMessage('Por favor ingrese la información del conductor habitual, presione el boton "Buscar".')
            }
               
        } catch (error) {
            console.error(error)
        }
    }

    return (
            
            <BudgetLayout title="Conductor Habitual" objBudget={objBudget}>
                { showMessage =='S' &&
                    <Alert severity={severity}>
                        {message}
                    </Alert>
                }
                <form onSubmit={handleSubmit(onSave)} noValidate autoComplete="off" >
                    <CustomerFormDriver
                        info={info}
                        budgetInfo={budgetInfo}
                        onFinish={onFinish}
                        index={index}
                        customerType={index}
                        objForm={objForm}
                        objCustomer={objCustomer}
                    />
                    <GridContainer>
                        <GridItem item xs={12} sm={12} md={12} lg={12}>
                            <GridContainer justify="flex-end">
                                <Button onClick={onBack}><Icon>fast_rewind</Icon> Regresar</Button>
                                <Button color="primary" type="submit"><Icon>send</Icon> Siguiente</Button>
                            </GridContainer>
                        </GridItem>
                    </GridContainer>
                </form>
            </BudgetLayout>
        
    )
}

