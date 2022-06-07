import React, { Fragment } from 'react'
import BudgetInfo from 'Portal/Views/Budget/BudgetInfo'
import BudgetInfoPersons from 'Portal/Views/Budget/BudgetPersons/BudgetInfoPersons'

export default function BudgetInfoContainer({ info, budgetInfo }) {
    return (
        <Fragment>
            <BudgetInfo info={info} />       
            <BudgetInfoPersons budgetInfo={budgetInfo} />         
        </Fragment>
    )
}
