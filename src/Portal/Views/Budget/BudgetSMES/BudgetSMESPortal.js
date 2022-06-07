import React from 'react'
import { navigate } from "gatsby"
import { initAxiosInterceptors } from 'utils/axiosConfig'
import { useDialog } from 'context/DialogContext'
import { useLoading } from 'context/LoadingContext'
import Axios from 'axios'
import BudgetSMESForm from './BudgetSMESForm'

export default function BudgetSMESPortal({ insuranceBrokerCode }) {
    const dialog = useDialog();
    const loading = useLoading();
    initAxiosInterceptors(dialog, loading);

    async function onGenerate(paramsForm) {
        try {
            const params = { p_insurance_broker_code: insuranceBrokerCode, ...paramsForm }
            const response = await Axios.post('/dbo/budgets/generate_budget_smes_portal', params)
            navigate(`/app/cotizacion/${response.data.result}`)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <BudgetSMESForm onGenerate={onGenerate}/>
    )
}
