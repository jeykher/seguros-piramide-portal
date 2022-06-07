import React from 'react'
import NumberOnlyFormat from 'components/Core/NumberFormat/NumberOnlyFormat'
import { Controller } from "react-hook-form";

export default function NumberController(props) {
    const { objForm, label, ...rest } = props;
    const { errors, control} = objForm
    return (
        <Controller
            {...rest}
            label={label}
            name={props.name}
            as={NumberOnlyFormat}
            control={control}
            rules={{ required: props.required !== undefined ? props.required : true }}
            helperText={errors[`${props.name}`] && `Debe indicar ${label}`}
        />
    )
}
