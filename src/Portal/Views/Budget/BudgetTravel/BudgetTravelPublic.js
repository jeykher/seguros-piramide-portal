import React,{useEffect} from 'react'
import { navigate } from "gatsby"
import { initAxiosInterceptors } from 'utils/axiosConfig'
import { useDialog } from 'context/DialogContext'
import { useLoading } from 'context/LoadingContext'
import Axios from 'axios'
import BudgetTravelForm from './BudgetTravelForm'

export default function BudgetTravelPublic() {
    const dialog = useDialog();
    const loading = useLoading();
    useEffect(() =>{
        initAxiosInterceptors(dialog,loading)
    },[])

    async function onGenerate(params) {
        try{
            const response = await Axios.post('/dbo/budgets/generate_budget_travel_public', params)
            navigate(`/cotizar_valida?id=${response.data.p_budget_id}`)
        }catch(error){
            console.error(error)
        }
    }

    return (
        <BudgetTravelForm publicForm onGenerate={onGenerate}/>
    )
}
