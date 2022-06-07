import React, { Fragment } from 'react'
import BudgetInfo from 'Portal/Views/Budget/BudgetInfo'
import BudgetInfoTravel from 'Portal/Views/Budget/BudgetTravel/BudgetInfoTravel'

export default function BudgetInfoContainer({ info, budgetInfo }) {
    return (
        <Fragment>
            <BudgetInfo info={info} />
            <BudgetInfoTravel budgetInfo={budgetInfo}/>
        </Fragment>
    )
}
