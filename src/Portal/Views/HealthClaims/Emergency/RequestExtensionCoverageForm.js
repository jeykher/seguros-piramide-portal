import React , { useState, useEffect } from 'react'
import Axios from 'axios'
import { useForm, Controller } from "react-hook-form";
import TextField from '@material-ui/core/TextField';
import Icon from "@material-ui/core/Icon";
import CardPanel from 'components/Core/Card/CardPanel'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import pendingAction from '../../Workflow/pendingAction'
import AmountFormatInput from 'components/Core/NumberFormat/AmountFormatInput'
import { getDefaultCurrencyCode } from "utils/utils"

export default function RequestExtensionCoverageForm(props) {
    const { register, handleSubmit, errors, control  } = useForm();
    const [currency, setCurrency] = useState([]);

    console.log('props.parameters')
    console.log(props.parameters)
    function handleBack (e){
        e.preventDefault();
        window.history.back()
    }

    useEffect(() => {
        //Se obtiene la moneda por defecto para el service type 02 (Emergencia)
        getDefaultCurrencyCode('02').then(result => setCurrency(result)); 
     }, [])

    async function onSubmit(dataform,e){
        e.preventDefault();
        try{
            const params = {
                p_preadmission_id: props.parameters.p_preadmission_id,
                p_complement_id: props.parameters.p_complement_id,
                p_operation_type: props.parameters.p_operation_type,
                //p_claim_date: new Date().toLocaleString('es-MX'),
                p_service_type: props.parameters.p_service_type,
                p_contact_analyst: dataform.p_contact_analyst,
                p_observation:  dataform.p_observation,
                p_service_amount: dataform.p_service_amount,
                p_currency_code: currency
            }
            await Axios.post('/dbo/health_claims/request_operation_in_a_service',params)
            await pendingAction(props.workflowId)
        }catch(error){
            console.error(error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardPanel titulo="Solicitud de Extensión de Cobertura" icon="playlist_add_check" iconColor="primary" >            
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
                    label="Monto Presupuesto"
                    name="p_service_amount"
                    as={AmountFormatInput}
                    control={control}    
                    rules={{ required: true }}               
                    helperText={errors.p_service_amount && `Debe indicar el Monto del Presupuesto`}
                    prefix={currency+' '}
                    fullWidth ={true}
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
