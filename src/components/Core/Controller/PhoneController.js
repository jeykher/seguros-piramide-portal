import React from 'react'
import PhoneMobileFormat from 'components/Core/NumberFormat/PhoneMobileFormat'
import { Controller } from "react-hook-form";

export default function PhoneController(props) {
    const { objForm, label,readonly, ...rest } = props;
    const { errors, control} = objForm
    return (
        <Controller
            {...rest}
            label={label}
            name={props.name}
            as={PhoneMobileFormat}
            control={control}
            InputProps={{
                readOnly: readonly ? readonly : false
            }}
            rules={{ required: true, minLength: 11 }}
            helperText={errors[`${props.name}`] && `Debe indicar ${label}`}
        />
    )
}
