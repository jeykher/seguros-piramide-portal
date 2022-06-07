import React from 'react'
import PhoneInternationalFormat from 'components/Core/NumberFormat/PhoneInternationalFormat'
import { Controller } from "react-hook-form";

export default function PhoneInternationalController(props) {
    const { objForm, label, ...rest } = props;
    const { errors, control} = objForm
    return (
        <Controller
            {...rest}
            label={label}
            name={props.name}
            as={PhoneInternationalFormat}
            control={control}
            rules={{ required: true, minLength: 9, maxLength: 13 }}
            helperText={errors[`${props.name}`] && `Debe indicar ${label}`}
        />
    )
}
