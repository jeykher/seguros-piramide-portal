import React, { Fragment } from 'react'
import BudgetInfo from 'Portal/Views/Budget/BudgetInfo'
import BudgetInfoVehicle from 'Portal/Views/Budget/BudgetVehicle/BudgetInfoVehicle'
import Hidden from '@material-ui/core/Hidden';

export default function BudgetInfoVeh({ info, budgetInfo }) {
    return (
        <Fragment>
            <BudgetInfo info={info} />
            <Hidden xsDown>
                <BudgetInfoVehicle info={budgetInfo} />
            </Hidden>
        </Fragment>
    )
}
