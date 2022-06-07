import React, { Fragment, useState } from "react"
import { useForm } from "react-hook-form"
import Cardpanel from "components/Core/Card/CardPanel"
import BudgetList from "./BudgetList"
import BudgetTabs from "./BudgetTabs"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import AdvisorController from "components/Core/Controller/AdvisorController"

export default function BudgetInitCorporate() {
  const { handleSubmit, ...objForm } = useForm()
  const [selectedBroker, setSelectedBroker] = useState(null)
  const index = 0

  function handleBroker(value) {
    setSelectedBroker(value)
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Cardpanel
          titulo="Selecciona el asesor de seguros"
          icon="supervised_user_circle"
          iconColor="primary"
        >
          <AdvisorController
            objForm={objForm}
            label="Asesor de seguros"
            name={`p_advisor_selected_${index}`}
            //codBroker={selectedBroker}
            onChange={handleBroker}
          />
        </Cardpanel>
      </GridItem>
      {selectedBroker && (
        <Fragment>
          <GridItem xs={12} sm={12} md={4}>
            <Cardpanel titulo="Cotizar" icon="description" iconColor="primary">
              <BudgetTabs codBroker={selectedBroker}/>
            </Cardpanel>
          </GridItem>
          <GridItem xs={12} sm={12} md={8}>
            <Cardpanel titulo="Cotizaciones" icon="list" iconColor="primary">
              <BudgetList codBroker={selectedBroker}/>
            </Cardpanel>
          </GridItem>
        </Fragment>
      )}
    </GridContainer>
  )
}
