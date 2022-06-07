import React , { useState, useEffect } from 'react'
import Axios from 'axios'
import {navigate} from 'gatsby'
import { useForm, Controller } from "react-hook-form";
import TextField from '@material-ui/core/TextField';
import Icon from "@material-ui/core/Icon";
import CardPanel from 'components/Core/Card/CardPanel'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import CurrencyFormat from 'components/Core/NumberFormat/CurrencyFormat'
import {currencyValues} from 'utils/utils'
import pendingAction from '../../Workflow/pendingAction'
import AmountFormatInput from 'components/Core/NumberFormat/AmountFormatInput'
import { getDefaultCurrencyCode } from "utils/utils"

export default function RequestEgressForm(props) {
    const { register, handleSubmit, errors, control  } = useForm();
    const [currency, setCurrency] = useState([]);

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
        console.log(props.parameters)
        console.log(dataform)
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
            const response = await Axios.post('/dbo/health_claims/request_operation_in_a_service',params)
            const jsonResult = response.data.result
            await pendingAction(props.workflowId)
            //await pendingAction(jsonResult.workflowId)
        }catch(error){
            console.error(error)
        }
    }

    return (
        <CardPanel titulo="Solicitud de Egreso" icon="playlist_add_check" iconColor="primary" >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                {/*<Controller
                    name="p_mount_protected"
                    label="Monto Amparado"
                    control={control}
                    rules={{ required: true }}
                    as={CurrencyFormat}
                    helperText={errors.p_claim_date && 'Debe indicar el Monto Amparado'}
                />*/}
                <Controller
                    label="Monto Factura"
                    name="p_service_amount"
                    as={AmountFormatInput}
                    control={control}    
                    rules={{ required: true }}               
                    helperText={errors.p_service_amount && `Debe indicar el Monto de la Factura`}
                    prefix={currency+' '}
                    fullWidth ={true}
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
            </form>
        </CardPanel>
    )
}
