import React from 'react'
import { Controller } from "react-hook-form";
import Password from '../Password/Password'

export default function PasswordConfirmController(props) {
    const { objForm, label } = props;
    const { errors, control, watch} = objForm
    return (
        <Controller 
            label={label}
            fullWidth
            confirm
            as={Password} 
            name="p_password_confirm"
            control={control} 
            rules={{ required: true, validate: (value) => value === watch('p_password') }}
            helperText={
            (errors.p_password_confirm && errors.p_password_confirm.type === "required" && "Debe indicar su confirmacion de clave") ||
            (errors.p_password_confirm && errors.p_password_confirm.type === "validate" && "Las claves no coinciden")}
            onChange={([value]) => {
                return value
            }}
        />
    )
}
