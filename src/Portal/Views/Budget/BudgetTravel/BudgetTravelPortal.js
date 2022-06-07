import React,{useEffect} from 'react'
import { navigate } from "gatsby"
import { initAxiosInterceptors } from 'utils/axiosConfig'
import { useDialog } from 'context/DialogContext'
import { useLoading } from 'context/LoadingContext'
import Axios from 'axios'
import BudgetTravelForm from './BudgetTravelForm'

export default function BudgetTravelPortal({ codBroker, officeList }) {
    const dialog = useDialog();
    const loading = useLoading();
    useEffect(() =>{
        initAxiosInterceptors(dialog,loading)
    },[])

    async function onGenerate(paramsForm) {
        try{
            const params = { p_insurance_broker_code: codBroker, ...paramsForm }
            const response = await Axios.post('/dbo/budgets/generate_budget_travel_portal', params)
            navigate(`/app/cotizacion/${response.data.p_budget_id}`)
        }catch(error){
            console.error(error)
        }
    }

    return (
        <BudgetTravelForm onGenerate={onGenerate} hiddenApplicant codBroker={codBroker} officeList={officeList}/>
    )
}
