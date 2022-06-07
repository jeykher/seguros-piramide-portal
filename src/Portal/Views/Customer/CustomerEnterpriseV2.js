import React, { Fragment } from 'react'
import InputController from 'components/Core/Controller/InputController'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'

export default function CustomerEnterprise(props) {
    const { objForm, index, readonly } = props;
    return (
        <Fragment>
            <InputController
                objForm={objForm}
                label="Razón social o nombre"
                name={`p_full_name_${index}`}
                readonly={readonly ? readonly : false}
            />
            <DateMaterialPickerController
                objForm={objForm}
                label="Fecha de constitución"
                name={`p_birthdate_${index}`}
                readonly={readonly ? readonly : false}
            />
        </Fragment>
    )
}


