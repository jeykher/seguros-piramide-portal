import React,{useEffect, useState} from 'react'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import FormGenerate from './FormGenerate'
import ServiceWfDetail from './ServiceWfDetail'
import SnackbarContent from "components/material-dashboard-pro-react/components/Snackbar/SnackbarContent.js";
export default function ProcedureWf(props) {
    const {workflow_id,program_id,task_id} = props
    const [inputParameters,setInputParameters] = useState(null)

    async function getTaskExecuter(){
        const params = {
            p_task_id: task_id,
            p_program_id: program_id,
            p_workflow_id: workflow_id
        }
        const response = await Axios.post('/dbo/workflow/task_executer',params)
        console.log(response.data.p_input_parameters)
        setInputParameters(response.data.p_input_parameters)
    }

    useEffect(()=>{
        getTaskExecuter()
    },[props.workflow_id,props.program_id,props.task_id])

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={4} lg={4}>
                <ServiceWfDetail id={workflow_id}/>            
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>
                {inputParameters && <FormGenerate params={props} schemaForm={inputParameters} />}
                {inputParameters === null && program_id === '313' &&
                    <SnackbarContent
                            message={"Siniestro liquidado Satisfactoriamente."}
                            color="success"
                    />
                }
            </GridItem>
            
        </GridContainer>
    )
}
