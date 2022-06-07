import React from 'react'
import { Controller } from "react-hook-form";
import IdentificationFormat from '../NumberFormat/IdentificationFormat'

export default function IdentificationController(props) {
    const { objForm, index, label, onChange, onBlur, required, ...rest } = props;
    const { errors, control } = objForm
    return (
        <Controller
            label={label}
            name={`p_identification_number_${index}`}
            {...rest}
            control={control}
            rules={{ required: required !== undefined ? required : true }}
            as={IdentificationFormat}
            onChange={([value]) => {
                onChange && onChange(value)
                return value
            }}
            onBlur={([value]) => {
                onBlur && onBlur(value)
                return value
            }}
            format={props.format}
            helperText={errors[`p_identification_number_${index}`] && 'Debe introducir la Identificación'}
        />
    )
}
