import React, { Fragment, useState, useEffect } from 'react'
import InputController from 'components/Core/Controller/InputController'
import { listSex } from 'utils/utils'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController';

export default function CustomerPersonalDriver(props) {
    const { objForm, index,  customer,disabledInfo } = props;
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
                label="Nombre" 
                name={`p_name_one_${index}`}
                disabled={disabledInfo ? disabledInfo : false}
            />
            <InputController 
                objForm={objForm} 
                label="Apellido" 
                name={`p_surmane_one_${index}`}
                disabled={disabledInfo ? disabledInfo : false}
            />
            <SelectSimpleController objForm={objForm} label="Sexo" name={`p_sex_${index}`} array={listSex} onChange={handleChangeSex} />
        </Fragment>
    )
}


