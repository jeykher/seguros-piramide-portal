import React from 'react'
import { Controller } from "react-hook-form";
import SelectMultipleChip from 'components/Core/SelectMultiple/SelectMultipleChip';

export default function SelectSimpleController(props) {
    const { objForm, label, onChange, array, required, ...rest} = props; 
    const { errors, control } = objForm
    return (
        <Controller
            label={label}
            fullWidth
            as={SelectMultipleChip}
            name={props.name}
            control={control}
            idvalue={props.idvalue}
            descrip={props.descrip}
            arrayValues={props.arrayValues}
            helperText={errors[`${props.name}`] && `Debe indicar ${label}`}
            rules={{ required: required !== undefined ? required : true }}
            {...rest}
            onChange={([selected]) => {
                onChange && onChange(selected.target.value)
                return selected.target.value
            }}
        >
        </Controller>
    )
}
