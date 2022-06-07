import React, { Fragment } from 'react'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import InputController from 'components/Core/Controller/InputController'

export default function BudgetPortafolioTransfer(props) {
    const { objForm, listsTransfer } = props
    return (
        <Fragment>
            <DateMaterialPickerController
                objForm={objForm}
                label="Fin de Póliza Anterior"
                name={`veh_before_date`}
                fullWidth
            />
            <SelectSimpleController
                objForm={objForm}
                label="Compañia Aseguradora Anterior"
                name={`veh_before_insurance`}
                array={listsTransfer.ASEGURADORAS}
            />
            <SelectSimpleController
                objForm={objForm}
                label="Ramo de Póliza Anterior"
                name={`veh_before_prod`}
                array={listsTransfer.PRODUCTOS}
            />
            <InputController
                objForm={objForm}
                label="Sucursal de Póliza Anterior"
                name="veh_before_office"
                fullWidth
                inputProps={{ maxLength: 10 }} />
            <InputController
                objForm={objForm}
                label="Número de Póliza Anterior"
                name="veh_before_number"
                fullWidth
                inputProps={{ maxLength: 20 }} />
        </Fragment>
    )
}
