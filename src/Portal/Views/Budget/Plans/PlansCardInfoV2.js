
import React, { Fragment } from 'react'
import CardPanel from 'components/Core/Card/CardPanel'
import { getSymbolCurrency } from 'utils/utils'
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'

export default function PlansCardInfoV2({ plan, info }) {

    function getPrima() {
        //if (info[0].PLAN_ID_PAY === null) 
        return plan.budgetPlanParticularInfo.budget_plan_premium_amount
        //const indexActiveFrac = plan.fraccionamiento.findIndex((e) => e.numfracc === info[0].PLAN_ID_PAY)
        //return indexActiveFrac === -1 ? plan.prima : plan.fraccionamiento[indexActiveFrac].prima
    }

    function getPay() {
        //if (info[0].PLAN_ID_PAY === null)
        return 'Anual'
        //const indexPay = plan.fraccionamiento.findIndex(e => e.numfracc === info[0].PLAN_ID_PAY)
        //return indexPay === -1 ? 'Anual' : plan.fraccionamiento[indexPay].nomplan
    }

    return (
        <CardPanel
            titulo={
                <Fragment>
                    <small>{getSymbolCurrency(plan.currency_code)} </small>
                    <AmountFormatDisplay name="plan_price" value={getPrima()} />
                </Fragment>
            }
            icon="payments" iconColor="primary"
        >
            <h6><strong>Plan:</strong> {plan.plan_description}</h6>
            {/*plan.indsumaaseg === 'S' && <h6>
                <strong>Asegurado por: </strong><small>{getSymbolCurrency(plan.codmoneda)} </small>
                <AmountFormatDisplay name="plan_sum" value={plan.sumaaseg} />
        </h6>*/}
            {/*plan.indpago === 'S' && */<h6><strong>Forma de pago:</strong> {getPay()}</h6>}
        </CardPanel>
    )
}
