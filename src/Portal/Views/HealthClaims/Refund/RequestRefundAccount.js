import React, { useEffect, useState } from "react"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import RequestRefundAccountForm from "./RequestRefundAccountForm"
import ServiceWfDetail from "../../Workflow/ServiceWfDetail"
import Axios from "axios"

export default function RequestRefundAccount(props) {
  const { workflow_id, program_id } = props

  const [parameters, setparameters] = useState(null)
  const [preAdmissionId, setPreAdmissionId] = useState(null)
  const [complementId, setComplementId] = useState(null)

  async function getParams() {
    const params = { p_workflow_id: workflow_id, p_program_id: program_id }
    const response = await Axios.post("/dbo/workflow/program_to_clob", params)
    const jsonResult = response.data.result
    console.log(jsonResult)
    setparameters(jsonResult.program_actions[0].parameters[0])
  }

  useEffect(() => {
    getParams()
  }, [])

  useEffect(() => {

    if (parameters) {
      setPreAdmissionId(parameters.p_preadmission_id)
      setComplementId(parameters.p_complement_id)
    }

  }, [parameters])

  return (
    <GridContainer>
      <GridItem item xs={12} sm={12} md={12} lg={4}>
        <ServiceWfDetail id={workflow_id}/>
      </GridItem>
      {/* <GridItem xs={12} sm={12} md={12} lg={8}>
        {preAdmissionId &&
        <RequestRefundAccountForm preadmission_id={preAdmissionId} complement_id={complementId} workflow_id={workflow_id}/>
        }
      </GridItem> */}
    </GridContainer>
  )
}
