import React from 'react'
import InputController from 'components/Core/Controller/InputController'
import AmountFormatInputController from 'components/Core/Controller/AmountFormatInputController'
import NumberController from 'components/Core/Controller/NumberController'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'

export default function AgreementInfo(props){
    const { objForm } = props;
    const executionType = [
        { value: "AÑO", label: "Años" },
        { value: "MES", label: "Meses" },
        { value: "SEMANA", label: "Semanas" },
        { value: "DIA", label: "Días" },
        { value: "HORA", label: "Horas" }
    ]

    return (
        <>
            <InputController objForm={objForm} label="N° Contrato" name={'p_agreement_number'} />
            <AmountFormatInputController 
                objForm={objForm} 
                label="Monto Contrato" 
                name={'p_agreement_amount'} 
                isAllowed={(values) => {
                    const {floatValue} = values;
                    return floatValue >= 0 &&  floatValue <= 99999999999999.99;
                  }}
                />
            <InputController objForm={objForm} label="Objeto Contrato" name={'p_agreement_object'} />
            <SelectSimpleController
                objForm={objForm}
                label="Período de Ejecución"
                name="p_agreement_execution_type"
                array={executionType}
            />
            <NumberController objForm={objForm} label="Tiempo de Ejecución" name={'p_agreement_execution_time'} />
        </>
    )

}
