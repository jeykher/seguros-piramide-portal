import React from 'react'
import CardPanel from 'components/Core/Card/CardPanel'

export default function BudgetCard({ info, budgetInfo }) {
    return (
        <CardPanel titulo={`Cotización: ${info[0].BUDGET_ID}`} icon="apps" iconColor="primary" >
            <h6><strong>Fecha:</strong> {info[0].DATE_CREATION}</h6>
            <h6><strong>Vence:</strong> {info[0].EXPIRED_ON}</h6>
            <h6><strong>Solicitante:</strong> {(info[0].APPLICANT_NAME) ? info[0].APPLICANT_NAME : (budgetInfo) ? budgetInfo.p_name_one_1 + ' ' + budgetInfo.p_surmane_one_1 : null}</h6>
            <h6><strong>Email:</strong> {(info[0].APPLICANT_EMAIL) ? info[0].APPLICANT_EMAIL : (budgetInfo) ? budgetInfo.p_email_1 : null}</h6>
            <h6><strong>Teléfono:</strong> {info[0].APPLICANT_PHONE_NUMBER}</h6>
        </CardPanel>
    )
}
