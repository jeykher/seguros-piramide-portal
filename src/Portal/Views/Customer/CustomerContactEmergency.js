import React, { forwardRef, useImperativeHandle }from 'react'
import { makeStyles } from "@material-ui/core/styles"
import { useForm } from "react-hook-form"
import EmailController from 'components/Core/Controller/EmailController'
import PhoneController from 'components/Core/Controller/PhoneController'
import InputController from 'components/Core/Controller/InputController'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
}));

const CustomerContactEmergency = forwardRef((props, ref) => {
    const { index } = props;
    const classes = useStyles();
    const { triggerValidation, ...objForm } = useForm();

    useImperativeHandle(ref, () => ({
        async isValidated() {
            const result = await triggerValidation()
            if (!result) throw "Debe verificar los datos suministrados"
            const objData = {...objForm.getValues() }
            return objData
        }
    }));

    return (
        <form key={index} noValidate autoComplete="off" className={classes.root}>
            <InputController objForm={objForm} label="Nombres y apellidos" name={`p_names_${index}`} />
            <PhoneController objForm={objForm} label="Teléfono celular" name={`p_mobile_phone_${index}`} />
            <EmailController objForm={objForm} label="Correo electrónico" name={`p_email_${index}`} />
        </form>
    )
})
export default CustomerContactEmergency