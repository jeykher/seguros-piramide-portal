import React from 'react'
import AgesFormat from 'components/Core/NumberFormat/AgesFormat'
import { Controller } from "react-hook-form";

export default function AgesController(props) {
    const { objForm, label, ...rest } = props;
    const { errors, control} = objForm
    return (
        <Controller
            {...rest}
            label={label}
            name={props.name}
            as={AgesFormat}
            control={control}
            rules={{ required: props.required !== undefined ? props.required : true }}
            helperText={errors[`${props.name}`] && `Debe indicar ${label}`}
        />
    )
}
