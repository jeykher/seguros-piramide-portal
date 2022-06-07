import React, { useState, useEffect, Fragment } from 'react'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import BudgetCard from 'Portal/Views/Budget/BudgetCard'
import CardVehicle from 'Portal/Views/Budget/BudgetVehicle/CardVehicle'
import CardTravel from 'Portal/Views/Budget/BudgetTravel/CardTravel'
import CardPersons from 'Portal/Views/Budget/BudgetPersons/CardPersons'
import PlansCardInfo from 'Portal/Views/Budget/Plans/PlansCardInfo'
import BudgetTitle from 'Portal/Views/Budget/BudgetTitle'
import CardSMES from 'Portal/Views/Budget/BudgetSMES/CardSMES'
import PlansCardInfoV2 from 'Portal/Views/Budget/Plans/PlansCardInfoV2'

export default function BudgetLayout(props) {
    const { children, objBudget, title } = props
    const { plans, info, budgetInfo, getPlanBuy } = objBudget
    const [planBuy, setPlanBuy] = useState()
    const AREA_NAME = info[0].AREA_NAME

    useEffect(() => {
        setPlanBuy(getPlanBuy())
    }, [plans])

    return (
        <Fragment>
            <BudgetTitle title={title} />
            <GridContainer>
                <GridItem xs={12} sm={3} md={3}>
                    <BudgetCard info={info} budgetInfo={(AREA_NAME === 'PYME') ? budgetInfo : null} />
                    {AREA_NAME === 'AUTOMOVIL' && <CardVehicle info={budgetInfo} />}
                    {AREA_NAME === 'VIAJE' && <CardTravel budgetInfo={budgetInfo} />}
                    {AREA_NAME === 'PERSONAS' && <CardPersons budgetInfo={budgetInfo} plan={planBuy} />}
                    {AREA_NAME === 'PYME' && <CardSMES budgetInfo={budgetInfo} />}
                    {planBuy && info.length > 0 && AREA_NAME !== 'PYME' && <PlansCardInfo plan={planBuy} info={info} />}
                    {planBuy && info.length > 0 && AREA_NAME === 'PYME' && <PlansCardInfoV2 plan={planBuy} info={info} />}
                </GridItem>
                <GridItem xs={12} sm={9} md={9}>
                    {children}
                </GridItem>
            </GridContainer>
        </Fragment>
    )
}
