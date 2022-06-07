import React, { Fragment } from 'react'
import CardPanel from 'components/Core/Card/CardPanel'
import { getSymbolCurrency } from 'utils/utils'
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'

export default function PlansCardInfo({ plan, info }) {
    console.log(plan)
    console.log(info)
    function getPrima() {
        if (info[0].PLAN_ID_PAY === null) return plan.prima
        const indexActiveFrac = plan.fraccionamiento.findIndex((e) => e.numfracc === info[0].PLAN_ID_PAY)
        return indexActiveFrac === -1 ? plan.prima : plan.fraccionamiento[indexActiveFrac].prima
    }

    function getPay() {
        if (info[0].PLAN_ID_PAY === null) return 'Anual'
        const indexPay = plan.fraccionamiento.findIndex(e => e.numfracc === info[0].PLAN_ID_PAY)
        return indexPay === -1 ? 'Anual' : plan.fraccionamiento[indexPay].nomplan
    }

    return (
        <CardPanel
            titulo={
                <Fragment>
                    <small>{getSymbolCurrency(plan.codmoneda)} </small>
                    <AmountFormatDisplay name="plan_price" value={getPrima()} />
                </Fragment>
            }
            icon="payments" iconColor="primary"
        >
            <h6><strong>Plan:</strong> {plan.descplanprod}</h6>
            {plan.indsumaaseg === 'S' && <h6>
                <strong>Asegurado por: </strong><small>{getSymbolCurrency(plan.codmoneda)} </small>
                <AmountFormatDisplay name="plan_sum" value={plan.sumaaseg} />
            </h6>}

            {info[0].AREA_NAME==="PERSONAS" &&(
                <>
                    {(plan?.indregprima === 'C' && plan?.tipoclibase !="N") &&<h6><strong>Clase de Clínica:</strong> {plan?.tipoclibase}</h6>}
                    {(plan?.indregprima === 'C' && plan?.tipoclibase !="N") &&<h6><strong>Deducible:</strong> {plan?.mtodeducible}</h6>}

                </>
            )}
        </CardPanel>
    )
}
