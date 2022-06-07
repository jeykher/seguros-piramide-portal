import React, { Fragment } from 'react'
import CheckBoxController from 'components/Core/Controller/CheckBoxController'

export default function CustomerYounger(props) {
    const { index, objForm, onChange } = props
    return (
        <Fragment>
            <CheckBoxController
                objForm={objForm}
                label={"Soy menor de edad sin numero de identificación"}
                name={`p_check_younger_${index}`}
                onChange={onChange}
            />
        </Fragment>
    )
}
