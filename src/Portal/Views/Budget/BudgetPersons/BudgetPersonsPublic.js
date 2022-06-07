import React, {useEffect} from 'react'
import { navigate } from "gatsby"
import { initAxiosInterceptors } from 'utils/axiosConfig'
import { useDialog } from 'context/DialogContext'
import { useLoading } from 'context/LoadingContext'
import Axios from 'axios'
import BudgetPersonsForm from './BudgetPersonsForm'


export default function BudgetPersonsPublic() {
    const dialog = useDialog();
    const loading = useLoading();
    useEffect(() =>{
        initAxiosInterceptors(dialog,loading)
    },[])

    async function onGenerate(params) {
        try{
            const response = await Axios.post('/dbo/budgets/generate_budget_persons_public', params)
            navigate(`/cotizar_valida?id=${response.data.p_budget_id}`)
        }catch(error){
            console.error(error)
        }
    }

    return (
        <BudgetPersonsForm onGenerate={onGenerate}/>
    )
}
