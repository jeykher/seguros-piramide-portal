import React from "react"
import { navigate } from "gatsby"
import Axios from "axios"
import BudgetPersonsForm from "./BudgetPersonsForm"

export default function BudgetPersonsPortal({ codBroker, officeList }) {
  async function onGenerate(paramsForm) {
    try {
      const params = { p_insurance_broker_code: codBroker, ...paramsForm }
      const response = await Axios.post("/dbo/budgets/generate_budget_persons_portal",params)
      navigate(`/app/cotizacion/${response.data.p_budget_id}`)
    } catch (error) {
      console.error(error)
    }
  }

  return <BudgetPersonsForm onGenerate={onGenerate} hiddenApplicant codBroker={codBroker} officeList={officeList}/>
}
