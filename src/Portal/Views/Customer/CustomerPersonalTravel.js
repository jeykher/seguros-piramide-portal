import React, { Fragment, useState, useEffect } from 'react'
import InputController from 'components/Core/Controller/InputController'
import { listSex } from 'utils/utils'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController';
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'

export default function CustomerPersonalTravel(props) {
    const { objForm, index, customer, disabledInfo } = props;
    const [sex, setSex] = useState(null)

    function handleChangeSex(value) {
        setSex(value)
    }

    useEffect(() => {
        customer ? setSex(customer.SEXO) : setSex(null)
    }, [])

    return (
        <Fragment>
            <InputController 
                objForm={objForm} 
                label="Nombres" 
                name={`p_name_one_${index}`}
                disabled={disabledInfo ? disabledInfo : false}
            />
            <InputController 
                objForm={objForm} 
                label="Apellidos" 
                name={`p_surmane_one_${index}`}
                disabled={disabledInfo ? disabledInfo : false}
            />
            <DateMaterialPickerController 
                objForm={objForm} 
                label="Fecha de nacimiento" 
                name={`p_birthdate_${index}`} 
                disabled={disabledInfo ? disabledInfo : false}
            />
            <SelectSimpleController objForm={objForm} label="Sexo" name={`p_sex_${index}`} array={listSex} onChange={handleChangeSex} />
            <InputController objForm={objForm} label="Pasaporte" name={`p_passport_${index}`} inputProps={{ maxLength: 12 }} />
        </Fragment>
    )
}


