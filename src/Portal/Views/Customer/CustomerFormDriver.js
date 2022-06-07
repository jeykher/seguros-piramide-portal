import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { makeStyles } from "@material-ui/core/styles";
import { indentificationTypeNaturalMayor } from 'utils/utils'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CustomerIdentificationControl from './CustomerIdentificationControl'
import CustomerPersonalDriver from './CustomerPersonalDriver'
import CardPanel from 'components/Core/Card/CardPanel'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
}));

export default function CustomerFormDriver(props) {
    const { index, info, customerType, objForm, objCustomer } = props
    const classes = useStyles()
    const [showIdentification, setShowIdentification] = useState(true)

    async function getBudgetCustomer() {
        const params = { p_customer_type: customerType, p_budget_id: info[0].BUDGET_ID }
        const response = await Axios.post('/dbo/budgets/get_budget_customer', params)
        const data = response.data.p_customer
        if (data !== null) {
            setShowIdentification(false)
            await objCustomer.setValuesIdentification(objForm, index, data[`p_identification_type_${index}`], data[`p_identification_number_${index}`])
            setShowIdentification(true)
            objForm.reset({ ...data })
            objCustomer.setcustomer(data)
            objCustomer.setShowForm(true)
        }
    }

    useEffect(() => {
        getBudgetCustomer()
    }, [])

    return (
        <CardPanel titulo="Conductor Habitual" icon="airline_seat_recline_normal" iconColor="primary" >
            <GridContainer className={classes.root}>
                <GridItem item xs={12} sm={12} md={12} lg={12}>
                    {showIdentification && <CustomerIdentificationControl
                        index={index}
                        info={info}
                        customerType={customerType}
                        objForm={objForm}
                        onChangeType={objCustomer.handleIndetification}
                        onChangeNumber={objCustomer.handleIndetification}
                        onSearch={() => objCustomer.getCustomer(index, objForm)}
                        indentificationArray={indentificationTypeNaturalMayor}
                        objCustomer={objCustomer}
                        handleIndetification={objCustomer.handleIndetification}
                        onChangeCheckYounger={objCustomer.handleCheckYounger}
                    />}
                    {objCustomer.showForm && <CustomerPersonalDriver
                        index={index}
                        objForm={objForm}
                        customer={objCustomer.customer}
                        disabledInfo={objCustomer.customer !== null ? true : false}
                    />}
                </GridItem>
            </GridContainer>
        </CardPanel>
    )
}
