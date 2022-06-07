import React, { useState, useEffect, Fragment } from 'react'
import Axios from 'axios'
import { useForm, Controller } from "react-hook-form";
import TextField from '@material-ui/core/TextField';
import MenuItem from "@material-ui/core/MenuItem";
import Icon from "@material-ui/core/Icon";
import CardPanel from 'components/Core/Card/CardPanel'
import AutocompleteForm from 'components/Core/Autocomplete/AutocompleteControl'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import pendingAction from '../../Workflow/pendingAction'
import AmountFormatInput from 'components/Core/NumberFormat/AmountFormatInput'
import { getDefaultCurrencyCode } from "utils/utils"
import { getProfileCode } from 'utils/auth'
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController';
import { makeStyles } from "@material-ui/core/styles";
import ValidationServiceRequest from "../ValidationServiceRequest"


const useStyles = makeStyles((theme) => ({
    colorTitle: {
      color: "#999",
      
    },
    alinear: {
        width:"30px",
        display: "inline-block !important'"
      },
    direction: {
        flexDirection: "row !important",
        alignItems : "baseline !important"
    },
    paddingDiv:{
        paddingRight: "60px"
    }    

  }))

export default function RequestEntryForm(props) {
    const { register, handleSubmit, errors, control, ...objForm } = useForm();
    const [currency, setCurrency] = useState([]);
    const [optionRadio, setOptionRadio] = useState("N")
    const [diseaseList, setDiseaseList] = useState([]);
    const [validRequest, setValidRequest] = useState(false)
    const classes = useStyles()

    function handleBack(e) {
        e.preventDefault();
        window.history.back()
    }

    async function setProviderCode (providerCode) {

        const params = {
            p_verification_id: props.id,
            p_provider_code: providerCode
        }
        const response = await Axios.post('/dbo/health_claims/set_provider_on_vertification', params)
    }

    const handleOptionRadio = (e) => {
        setOptionRadio(e.target.value)
    }

    async function getDeseaseListByDetail (val) {

        if (val && val.value && val.value.length > 0) {
            
            const params = {
                p_coddetenfer: val.value
            }
            const response = await Axios.post('/dbo/health_claims/get_diseases_by_coddet', params)
            setDiseaseList(response.data.v_cur_diseases)
        }
    }

    function handleDetailChange (value) { 
        const val = value ? { value: value["VALUE"] } : null
        getDeseaseListByDetail(val)
        return val 
    }

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
            console.log(dataform)
            const diagnosisArray = dataform.p_diagnosis.split('*')
            const params = {
                p_verification_id: props.id,
                //p_claim_date: new Date().toLocaleString('es-MX'),
                p_contact_analyst: dataform.p_contact_analyst,
                p_observation: dataform.p_observation,
                p_codenftit: diagnosisArray[0],
                p_codenfstit: diagnosisArray[1],
                p_codenfer: diagnosisArray[2],
                p_coddetenfer: dataform.p_diagnosis_detail.value || '',
                p_service_amount: dataform.p_service_amount,
                p_currency_code: currency,
                p_indambulatory : optionRadio
            }
            if (dataform.p_provider_code && dataform.p_provider_code !== undefined) {
                await setProviderCode(dataform.p_provider_code.value)            
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

    useEffect(() => {
        //Se obtiene la moneda por defecto para el service type 02 (Emergencia)
        getDefaultCurrencyCode('02').then(result => setCurrency(result));
    }, [])

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardPanel titulo="Solicitud de ingreso" icon="playlist_add_check" iconColor="primary" >
                {getProfileCode() === 'corporate' && <Controller
                    label="Seleccione donde será atendido el asegurado"
                    as={AutocompleteForm}
                    api='/dbo/health_claims/get_health_providers_list'
                    cursor='p_health_providers_list'
                    name="p_provider_code"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    onChange={([e, value]) => { return value ? { value: value["VALUE"] } : null }} 
                    helperText={errors.p_provider_code && "Debe indicar donde será atendido el asegurado"}
                />}
                <Controller
                    label="Detalle"
                    as={AutocompleteForm}
                    api='/dbo/health_claims/get_all_details_diseases'
                    cursor='c_det_diseases'
                    name="p_diagnosis_detail"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    onChange={([e, value]) => handleDetailChange(value)}
                    helperText={errors.p_diagnosis_detail && "Debe indicar el Detalle"}
                />

                <Controller
                    label="Diagnóstico"
                    fullWidth
                    as={TextField}
                    name={`p_diagnosis`}
                    defaultValue=""
                    select
                    rules={{ required: true }}
                    helperText={errors.p_diagnosis && "Debe indicar también la enfermedad"}
                    control={control}
                    >
                        {diseaseList && diseaseList.map(opc => {
                            let obj = Object.entries(opc)
                            return (
                                <MenuItem key={obj[0][1]} value={obj[0][1]}>
                                    {obj[1][1]}
                                </MenuItem>
                            )
                        })}
                </Controller>

                <Controller
                    label="Monto Presupuesto"
                    name="p_service_amount"
                    as={AmountFormatInput}
                    control={control}
                    rules={{ required: true }}
                    helperText={errors.p_service_amount && `Debe indicar el Monto del Presupuesto`}
                    prefix={currency + ' '}
                    fullWidth={true}
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
                <Fragment>
                <h5 className={classes.colorTitle}>Solicitud por:</h5>    
                <RadioGroup
                    aria-label="Options"
                    value={optionRadio}
                    onChange={handleOptionRadio}
                    className={classes.direction}
                  >
                    <div className={classes.paddingDiv}>
                        <FormControlLabel
                        value="S"
                        control={<Radio color="primary"/>}
                        label="Ambulatorio"
                        />
                    </div>  
                    <div className={classes.alinear}>
                        <FormControlLabel
                        value="N"
                        control={<Radio color="primary"/>}
                        label="Hospitalización"
                        />
                    </div>                    
                </RadioGroup>

                </Fragment> 
                  

                <Controller
                    label="Observación"
                    as={TextField}
                    fullWidth
                    multiline
                    rows="4"
                    name="p_observation"
                    control={control}
                    defaultValue=""
                />
                 {(validRequest) &&
                    <ValidationServiceRequest handleQuestion={handleQuestion}/>
                    }
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
