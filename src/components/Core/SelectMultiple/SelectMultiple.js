import React from 'react'
import SelectMultipleDash from 'components/material-dashboard-pro-react/components/Select/SelectMultiple'

export default function SelectMultiple(props) {
    const { name, label, arrayValues, idvalue, descrip, onChange, arraySelected } = props
    return (
        <SelectMultipleDash
            name={name}
            label={label}
            arrayValues={arrayValues}
            idvalue={idvalue}
            descrip={descrip}
            onChange={onChange}
            arraySelected={arraySelected}
        />
    )
}
