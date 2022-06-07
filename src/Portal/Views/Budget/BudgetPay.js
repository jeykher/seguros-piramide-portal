import React, { useState, Fragment } from "react"
import Axios from "axios"
import BudgetTitle from 'Portal/Views/Budget/BudgetTitle'
import PayPolicy from 'Portal/Views/Pays/PayPolicy'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import Typography from "@material-ui/core/Typography"

export default function BudgetPay({ onFinish, objBudget }) {
  const [viewResult, setResultView] = useState(false)
  const { info } = objBudget

  async function onSuccess() {
    setResultView(true)
    const params = { p_budget_id: info[0].BUDGET_ID }
    await Axios.post("/dbo/budgets/set_pay", params)
    onFinish()
  }

  return (
    <Fragment>
      <BudgetTitle title={!viewResult && "Realice su pago"} />
      <GridContainer justify="center">
        <Typography variant="caption"> O puede dirigirse a nuestras oficinas para formalizar el pago en efectivo.</Typography>
      </GridContainer>
      <PayPolicy
        policy_id={info[0].EMITED_NUMBER}
        certificate_id={info[0].EMITED_CERT}
        onSuccess={onSuccess}
        onFinish={onFinish}
        objBudget={objBudget}
      />
    </Fragment>
  )
}