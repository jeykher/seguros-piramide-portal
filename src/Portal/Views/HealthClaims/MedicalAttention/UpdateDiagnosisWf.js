import React, {useState,useEffect} from 'react'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import UpdateDiagnosisForm from './UpdateDiagnosisForm'
import ServiceWfDetail from '../../Workflow/ServiceWfDetail'

export default function UpdateDiagnosisWf(props) {
    const {workflow_id,program_id} = props
    const [parameters, setparameters] = useState(null)

    async function getParams(){
        const params = {p_workflow_id: workflow_id, p_program_id : program_id}
        const response = await Axios.post('/dbo/workflow/program_to_clob',params)
        const jsonResult = response.data.result
        setparameters(jsonResult.program_actions[0].parameters[0])
    }

    useEffect(()=>{
        getParams()
    }, [])

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={4} lg={4}>
                <ServiceWfDetail id={workflow_id}/>              
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>
                {parameters !== null &&
                    <UpdateDiagnosisForm parameters={parameters} workflowId={workflow_id}/>
                }             
            </GridItem>
        </GridContainer>
    )
}
