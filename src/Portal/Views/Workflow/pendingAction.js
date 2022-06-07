import Axios from 'axios'
import {navigate} from 'gatsby'
import handleActions from './handleActions'

export default async function pendingAction(workflow_id){
    try{
        const params = {p_workflow_id: workflow_id}
        const response = await Axios.post('/dbo/workflow/actual_pending_actions',params)
        const jsonPost = response.data.result
        if (jsonPost === null || jsonPost.actions === null || jsonPost.actions.length === 0){
            navigate(`/app/workflow/service/${workflow_id}`);            
        }else{
            handleActions(jsonPost.actions[0])
        }
    }catch(error){
        console.error(error)
    }
}