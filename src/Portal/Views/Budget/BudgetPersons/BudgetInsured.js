import React, { useState, useEffect, useRef } from 'react'
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
import { distinctArray } from 'utils/utils'
import InsuredForm from 'Portal/Views/Customer/InsuredForm'
import BudgetLayout from 'Portal/Views/Budget/BudgetLayout'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";

export default function BudgetInsured(props) {
    const { index, onFinish, onBack, objBudget } = props
    const { info, budgetInfo, getPlanBuy } = objBudget
    const dialog = useDialog()
    const [insured, setInsured] = useState([])
    const formRef = useRef([])

    function generateDistinctInsured() {
        const plan = getPlanBuy()
        const holderId = budgetInfo.insured[0].insured_id
        const onlyIsuredCobert = plan.coberturas.filter(element => element.insured_id !== holderId)
        const distinctInsured = distinctArray(onlyIsuredCobert, "insured_id", "insured_id")
        formRef.current = distinctInsured.map(() => React.createRef())
        setInsured(distinctInsured)
    }

    async function onSave() {
        try {
            const params = await getData()
            if (params)
                await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/budgets/set_customer`, params)
            onFinish()
        } catch (error) {
            console.error(error)
        }
    }

    async function getData() {
        try {
            let arrInsured = []
            for (const [key, insure] of insured.entries()) {
                const data = await formRef.current[key].current.isValidated();
                arrInsured = [...arrInsured, { "insured_id": insure.id, ...data }]
            }
            const params = {
                p_customer_type: index,
                p_budget_id: info[0].BUDGET_ID,
                p_customer_basic_info: JSON.stringify({ insured: arrInsured })
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
        generateDistinctInsured()
    }, [])

    return (
        <BudgetLayout title="Datos de las personas a asegurar" objBudget={objBudget}>
            {insured && insured.map((reg, indexAc) => {
                const insuredAge = budgetInfo.insured.find(element => element.insured_id === reg.id)
                return <InsuredForm
                    key={reg.id}
                    index={reg.id}
                    info={info}
                    customerType={index}
                    title={`Edad: ${insuredAge.age}`}
                    age={insuredAge.age}
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
