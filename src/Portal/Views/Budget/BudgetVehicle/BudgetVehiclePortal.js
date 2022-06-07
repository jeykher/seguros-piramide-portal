import React, {useEffect}from 'react'
import { navigate } from "gatsby"
import { initAxiosInterceptors } from 'utils/axiosConfig'
import { useDialog } from 'context/DialogContext'
import { useLoading } from 'context/LoadingContext'
import Axios from 'axios'
import BudgetVehicleForm from './BudgetVehicleForm'

export default function BudgetVehiclePortal({ codBroker, officeList }){
    const dialog = useDialog();
    const loading = useLoading();
    useEffect(() =>{
        initAxiosInterceptors(dialog,loading)
    },[])

    async function onGenerate(paramsForm) {
        try {
            const params = { p_insurance_broker_code: codBroker, ...paramsForm }
            const response = await Axios.post('/dbo/budgets/generate_budget_vehicle_portal', params)
            navigate(`/app/cotizacion/${response.data.p_budget_id}`)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <BudgetVehicleForm onGenerate={onGenerate} style={{ padding: "0" }} hiddenApplicant codBroker={codBroker}  officeList={officeList}/>
    )
}
