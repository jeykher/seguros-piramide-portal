import React , { useState, useEffect } from 'react'
import Axios from 'axios'
import { useForm, Controller } from "react-hook-form";
import Icon from "@material-ui/core/Icon";
import CardPanel from 'components/Core/Card/CardPanel'
import AutocompleteForm from 'components/Core/Autocomplete/AutocompleteControl'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import pendingAction from '../../Workflow/pendingAction'
import AmountFormatInput from 'components/Core/NumberFormat/AmountFormatInput'
import { getDefaultCurrencyCode } from "utils/utils"
import ValidationServiceRequest from "../ValidationServiceRequest"

export default function RequestLetterGuaranteeForm(props) {
    const { id: idVerification } = props
    const { handleSubmit, errors, control } = useForm();
    const [currency, setCurrency] = useState([]);
    const [validRequest, setValidRequest] = useState(false)

    function handleBack(e) {
        e.preventDefault();
        window.history.back()
    }

    useEffect(() => {
        //Se obtiene la moneda por defecto para el service type 01
        getDefaultCurrencyCode('01').then(result => setCurrency(result));
        
     }, [])

     async function validRequestInProgress(data) {
        let params = {
          p_verification_id: props.id,
          p_title_disease_code: data[0],
          p_subtitle_disease_code: data[1],
          p_disease_code: data[2],
        }
        console.log(`params:`, params)
        const response = await Axios.post('/dbo/health_claims/valid_amp_request_in_progress', params)
        console.log(`response.data:`, response.data.result)
        return response.data.result;    
    }
    
    const handleQuestion = (v) => {
        if (v)
            window.history.back()
        else
        setValidRequest(false)
    }

    async function onSubmit(dataform, e) {
        e.preventDefault();
        try {
            const diagnosisArray = dataform.p_diagnosis.value.split('*')
            const serviceAmount = dataform.p_service_amount
            console.log(dataform)
            const params = {
                p_verification_id: idVerification,
                //p_claim_date: new Date().toLocaleString('es-MX'),
                p_codenftit: diagnosisArray[0],
                p_codenfstit: diagnosisArray[1],
                p_codenfer: diagnosisArray[2],
                p_coddetenfer: diagnosisArray[3],
                p_observation: null,
                p_contact_analyst: null,
                p_currency_code: currency,
                p_service_item: null,
                p_service_amount: serviceAmount
            }
            let validService = await validRequestInProgress(diagnosisArray)
            if(validService === 0){
                const response = await Axios.post('/dbo/health_claims/request_a_service_after_verify', params)
                const jsonResult = response.data.result
                await pendingAction(jsonResult.workflowId)
            } else {
                setValidRequest(true) 
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardPanel titulo="Solicitud de Carta Aval" icon="playlist_add_check" iconColor="primary" >
                <Controller
                    label="Diagnóstico"
                    as={AutocompleteForm}
                    api='/dbo/health_claims/get_details_diseases_allcode'
                    cursor='c_det_diseases'
                    name="p_diagnosis"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    onChange={([e, value]) => { return value ? { value: value["VALUE"] } : null }}
                    helperText={errors.p_diagnosis && "Debe indicar el Diagnóstico"}
                />
                <Controller
                    label={"Monto Presupuesto"}
                    name="p_service_amount"
                    as={AmountFormatInput}
                    control={control}     
                    rules={{ required: true }}              
                    helperText={errors.p_service_amount && `Debe indicar el Monto del Presupuesto`}
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
                    {(validRequest) &&
                    <ValidationServiceRequest handleQuestion={handleQuestion}/>
                    }
                </CardFooter>
            </CardPanel>
        </form>
    )
}
