import React, { Fragment } from 'react'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import IdentificationController from 'components/Core/Controller/IdentificationController'
import { indentificationTypeAll, indentificationTypeNaturalMayor, indentificationTypeCliente } from 'utils/utils'

export default function UserIdentification(props) {
    const { index, objForm, onChangeType, onChangeNumber, customerType, budgetArea, readonly, required } = props

    function getValuesIdentificationType() {
        if (customerType === "INVOICEER") return indentificationTypeAll
        if (customerType === "CUSTOMER") return indentificationTypeCliente
        if (budgetArea === 'AUTOMOVIL' || budgetArea === 'PYME') return indentificationTypeAll
        return indentificationTypeNaturalMayor
    }

    return (
        <Fragment>
            <SelectSimpleController
                onChange={(e) => onChangeType && onChangeType(e, "identificationType")}
                objForm={objForm}
                label="Tipo de identificación"
                name={`p_identification_type_${index}`}
                array={getValuesIdentificationType()}
                readonly={readonly ? readonly : false}
                required={required}
            />
            <IdentificationController
                onChange={(e) => onChangeNumber && onChangeNumber(e, "identificationNumber")}
                objForm={objForm}
                label="Número de identificación"
                index={index}
                readonly={readonly ? readonly : false}
                required={required}
            />
        </Fragment>
    )
}
