import React, { forwardRef, useImperativeHandle }from 'react'
import { makeStyles } from "@material-ui/core/styles"
import { useForm } from "react-hook-form"
import EmailController from 'components/Core/Controller/EmailController'
import PhoneController from 'components/Core/Controller/PhoneController'
import PhoneInternationalController from 'components/Core/Controller/PhoneInternationalController'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
}));

const CustomerContactInternational = forwardRef((props, ref) => {
    const { index } = props;
    const classes = useStyles();
    const { triggerValidation, ...objForm } = useForm();

    useImperativeHandle(ref, () => ({
        async isValidated() {
            const result = await triggerValidation()
            if (!result) throw "Debe verificar los datos suministrados"
            const objData = { ...objForm.getValues() }
            return objData
        }
    }));

    return (
        <form key={index} noValidate autoComplete="off" className={classes.root}>
            <EmailController objForm={objForm} label="Correo Electrónico" name={`p_email_${index}`} />
            <PhoneController objForm={objForm} label="Teléfono en Venezuela" name={`p_mobile_phone_${index}`} />
            <PhoneInternationalController objForm={objForm} label="Teléfono en el viaje" name={`p_international_phone_${index}`} />
        </form>
    )
})
export default CustomerContactInternational
