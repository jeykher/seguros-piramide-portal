import React, { useState, useEffect } from 'react'
import GridContainer from 'components/material-dashboard-pro-react/components/Grid/GridContainer.js'
import GridItem from 'components/material-dashboard-pro-react/components/Grid/GridItem.js'
import Card from 'components/material-kit-pro-react/components/Card/Card'
import CardBody from 'components/material-kit-pro-react/components/Card/CardBody'
import CardHeader from 'components/material-kit-pro-react/components/Card/CardHeader'
import { makeStyles } from '@material-ui/core/styles'
import TransitDeclarationStyles from './transitDeclarationStyles'
import PolicyInformation from './PolicyInformation'
import TransitDeclaration from './TransitDeclaration'
import pendingAction from "../Workflow/pendingAction"
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
const useStyles = makeStyles(TransitDeclarationStyles)

export default function TransitDeclarationController(props) {

  const { policyId } = props
  const classes = useStyles()
  const [policyData, setPolicyData] = useState('')
  const dialog = useDialog()

  const confirmation = async (data) => {
    if (data.length > 0) {
      const params = {
        p_details_transp_advertisement: JSON.stringify(data),
        p_policy_id: policyId
      }
      const response = await Axios.post('/dbo/patrimonial/advertise', params)
      const jsonTranspData = response.data.result
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Exito",
        description: "Su declaración ha sido registrada de manera exitosa. Recuerde realizar el pago del recibo desde la opción Pago en Línea o puede dirigirse a nuestras oficinas para formalizar el pago en efectivo"
      })
      await pendingAction(jsonTranspData.workflowId)
    }
  }

  async function GetPolicyData() {
    const params = {
      p_policy_id: policyId
    }
    const response = await Axios.post('/dbo/patrimonial/get_policy_data', params)
    const jsonTranspData = response.data.result[0]
    setPolicyData(jsonTranspData)
  }

  useEffect( () => {
    GetPolicyData()
  }, [])

  return (
    <>
      {policyData &&
        <GridContainer>
          <GridItem item xs={12} sm={12} md={12} lg={12}>
            <Card>
              <CardHeader color="primary"  className="text-center">
                <h5>Declaración de Transporte Terrestre</h5>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem item xs={12} sm={12} md={12} lg={12}>
                    <>
                      <PolicyInformation data={policyData} />
                      <GridContainer>
                        <GridItem item xs={12} sm={12} md={12} lg={12}>
                          <TransitDeclaration
                            serviceType={'01'}
                            confirmation={confirmation}
                            policyData={policyData}
                          />
                        </GridItem>
                      </GridContainer>
                    </>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      }
    </>
  )
}
