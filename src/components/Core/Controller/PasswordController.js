import React from 'react'
import { Controller } from "react-hook-form";
import Password from '../Password/Password'
import { validatePassword } from 'utils/utils'

export default function PasswordController(props) {
    const { objForm, label } = props;
    const { errors, control } = objForm
    return (
        <Controller
            label={label}
            fullWidth
            as={Password}
            name="p_password"
            control={control}
            rules={{ validate: (value) => validatePassword(value) }}
            helperText={errors.p_password && `Su clave no cumple con las especificaciones mínimas`}
            onChange={([value]) => {
                return value
            }}
        />
    )
}
