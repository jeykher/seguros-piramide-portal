import React from 'react'
import Axios from 'axios'
import { navigate } from 'gatsby'
import { useForm, Controller } from "react-hook-form";
import Icon from "@material-ui/core/Icon";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import TextField from '@material-ui/core/TextField';
import SnackbarContent from "components/material-dashboard-pro-react/components/Snackbar/SnackbarContent.js";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import CardPanel from 'components/Core/Card/CardPanel'
import PhoneMobileFormat from 'components/Core/NumberFormat/PhoneMobileFormat'
import {formatPhoneNumber} from '../../../../utils/utils'

export default function VerificationLetterGuaranteeForm(props) {
    const { register, handleSubmit, errors, control } = useForm();
    const { data } = props
    console.log('data')
    console.log(data)
    
    function handleBack (e){
        e.preventDefault();
        window.history.back()
    }

    async function onSubmit(dataform,e){
        e.preventDefault();
        try{
            const p_contact_phone_number = formatPhoneNumber(dataform.p_contact_phone_number)
            const params = {
                p_preadmission_id: data.IDEPREADMIN,
                p_complement_id: data.NUMLIQUID,
                p_operation_type: 'ACA',
                p_contact_analyst: dataform.p_contact_analyst,
                p_observation:  dataform.p_observation,
                p_contact_phone_number: p_contact_phone_number
            }
            await Axios.post('/dbo/health_claims/request_operation_in_a_service_p',params)
            navigate(`/app/home_proveedores_salud`);
        }catch(error){
            console.error(error)
        }
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardPanel titulo="Verificación de Carta Aval" icon="post_add" iconColor="primary">
                {props.verificar  && 
                    <SnackbarContent message={"Carta Aval verificada exitosamente"} color="success"/>
                }
                <Controller
                    label="Teléfono de Contacto"
                    fullWidth
                    as={PhoneMobileFormat}
                    name="p_contact_phone_number"
                    control={control}
                    inputRef={register({ required: true, minLength: 11 })}
                    helperText={errors.p_contact_phone_number && "Debe indicar el teléfono de contacto"}
                    rules={{ required: true, minLength: 11 }}
                />            
                <Controller 
                    label="Analista Contacto"
                    fullWidth
                    as={TextField} 
                    name="p_contact_analyst" 
                    control={control} 
                    inputRef={register({ required: true })}
                    helperText={errors.p_contact_analyst && "Debe indicar el Analista Contacto"}
                />
                <Controller 
                    label="Observacion"
                    as={TextField} 
                    fullWidth
                    multiline 
                    rows="4" 
                    name="p_observation" 
                    control={control} 
                    defaultValue="" 
                />
                <CardFooter>
                    <GridContainer justify="center">
                    <Button color="secondary" onClick={handleBack}>
                        <Icon>fast_rewind</Icon> Regresar
                    </Button>
                    <Button color="primary" type="submit">
                        <Icon>send</Icon> Enviar
                    </Button>
                    </GridContainer>
                </CardFooter>
            </CardPanel>
        </form>
    )
}
