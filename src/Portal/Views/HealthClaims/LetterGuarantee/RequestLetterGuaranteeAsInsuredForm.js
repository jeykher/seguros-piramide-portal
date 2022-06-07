import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useForm, Controller } from "react-hook-form";
import Icon from "@material-ui/core/Icon";
import CardPanel from 'components/Core/Card/CardPanel'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import pendingAction from '../../Workflow/pendingAction'
import AmountFormatInput from 'components/Core/NumberFormat/AmountFormatInput'
import IconButton from '@material-ui/core/IconButton';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import Tooltip from '@material-ui/core/Tooltip';
import ProviderLocationsController from "components/Core/ProviderLocationsController/ProviderLocationsController"
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import insuredFormStyle from "./requestLetterGuaranteeAsInsuredFormStyle.js";
import { makeStyles } from '@material-ui/core/styles';
import { getDefaultCurrencyCode } from "utils/utils";
import AutoCompleteWithData from 'components/Core/Autocomplete/AutoCompleteWithData'
import ValidationServiceRequest from '../ValidationServiceRequest';
import SelectSimple from 'components/Core/SelectSimple/SelectSimple'
import { getProfileCode } from 'utils/auth'
const useStyles = makeStyles(insuredFormStyle); 

export default function RequestLetterGuaranteeAsInsuredForm(props) {

  const classes = useStyles();
  const { serviceType, clientCodeRequest, verificationId } = props
  const { handleSubmit, errors, control } = useForm();
  const [currency, setCurrency] = useState([]);
  const [toggleFormMap, setToggleFormMap] = useState(true);
  const [optionsProvider, setOptionsProvider] = useState([])
  const [optionsDiagnoses, setOptionsDiagnoses] = useState([])
  const [inputValueProvider, setInputValueProvider] = useState("")
  const [inputValueDiagnose, setInputValueDiagnose] = useState("")
  const [defaultValueProvider, setDefaultValueProvider] = useState("")
  const [viewProvider, setViewProvider ] = useState(true)
  const [validRequest, setValidRequest] = useState(false)
  const [ prefix, setPrefix ] = useState(null)
  const [ disabledAmount, setDisabledAmount ] = useState(true)

  const currencies = [
    { value: "BS", label: "Bolívares" },
    { value: "DL", label: "Dólares" },
  ]
  
  function handleCurrency(value){
    if(value){
        setDisabledAmount(false)
        setPrefix(value)
        //v_data_request.p_currency_code = value
      /*  setDataRequest({
          ...dataRequest,
          currency_code : value,
          
        })*/
    }else{         
        setPrefix(currencies[0].value)
        //v_data_request.p_currency_code = currencies[0].value
        /*setDataRequest({
          ...dataRequest,
          currency_code : currencies[0].value,          
        })*/
    }
  }
   
  function handleBack(e) {
    e.preventDefault();
    window.history.back()
  }

  function handleCallMap(e) {
    e.preventDefault()
    if (toggleFormMap) {
      setToggleFormMap(false)
    }else{
      setToggleFormMap(true)
    }
  }

  useEffect(() => {
    //Se obtiene la moneda por defecto para el service type 01 (Carta Aval)
    getDefaultCurrencyCode(serviceType).then(result => setCurrency(result));
    getHealtProvider()
    getDiagnoses()
  }, [])

  async function request_as_broker(baseParams) {
    const params = {
      ...baseParams,
      p_verification_id: verificationId,

    }
    const response = await Axios.post('/dbo/health_claims/request_service_after_verify_as_broker', params)
    return response.data.result
  }

  async function request_as_insured(baseParams) {
    const params = {
      ...baseParams,
      p_client_code_request: clientCodeRequest !== undefined ? clientCodeRequest : null,

    }
    const response = await Axios.post('/dbo/health_claims/request_service_as_insured', params)
    return response.data.result
  }


  async function validRequestInProgress(data) {
    let params = {
      p_verification_id: verificationId,
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
    e.preventDefault()
    try {
      const diagnosisArray = dataform.p_diagnosis.split('*')
      const serviceAmount = dataform.p_service_amount
      const params = {
        p_service_type: serviceType,
        p_provider_code: dataform.p_provider_code,
        p_title_disease_code: diagnosisArray[0],
        p_subtitle_disease_code: diagnosisArray[1],
        p_disease_code: diagnosisArray[2],
        p_det_disease_code: diagnosisArray[3],
        p_service_amount: serviceAmount,
        p_currency_code: prefix
      }
      let validService = await validRequestInProgress(diagnosisArray)
      if(validService === 0){
        const jsonResult = (getProfileCode() !== 'insured') ? await request_as_broker(params) : await request_as_insured(params)
        await pendingAction(jsonResult.workflowId)
      } else {
        setValidRequest(true) 
      }

    } catch (error) {
      console.error(error)
    }
  }

  const returnToForm = (dataProvider) => {
    setViewProvider(false)
    setViewProvider(true)
    setInputValueDiagnose([])
    if (dataProvider) {
      setInputValueProvider({VALUE: dataProvider.codProvider.toString().toUpperCase(), NAME:dataProvider.nameProvider.toString().toUpperCase()})
      setDefaultValueProvider(dataProvider.codProvider)
    }else{
      setInputValueProvider(null)
      setDefaultValueProvider(null)
    }
    setToggleFormMap(true)
   }

   async function getHealtProvider() {
      const response = await Axios.post('/dbo/health_claims/get_health_providers_list');
      const jsonCursor = response.data['p_health_providers_list']
      setOptionsProvider(jsonCursor)
   }

   async function getDiagnoses() {
       const response = await Axios.post('/dbo/health_claims/get_details_diseases_allcode');
       const jsonCursor = response.data['c_det_diseases']
       setOptionsDiagnoses(jsonCursor)
   }

  return (
    <>
      { toggleFormMap
        ? <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardPanel titulo="Solicitud de Carta Aval" icon="playlist_add_check" iconColor="primary">
              <GridContainer justify="center">
                <GridItem xs={10} sm={10} md={11} style={{ padding: "0 0 0 15px" }}>
                  { viewProvider &&
                    <>
                      <Controller
                        label="Seleccione donde desea ser atendido"
                        options={optionsProvider}
                        as={AutoCompleteWithData}
                        noOptionsText="Cargando"
                        defaultValue = { defaultValueProvider ? defaultValueProvider : undefined }
                        inputValue={inputValueProvider}
                        name="p_provider_code"
                        control={control}
                        rules={{ required: true }}
                        onChange={([e, value]) => {
                          setInputValueProvider(value)
                          return value ? value["VALUE"] : null
                        }}
                        helperText={errors.p_provider_code && "Debe indicar un proveedor"}
                      />
                      <Controller
                        label="Diagnóstico"
                        options={optionsDiagnoses}
                        as={AutoCompleteWithData}
                        noOptionsText="Cargando"
                        defaultValue = ''
                        inputValue={inputValueDiagnose}
                        name="p_diagnosis"
                        control={control}
                        rules={{ required: true }}
                        onChange={([e, value]) => {
                          setInputValueDiagnose(value)
                          return value ? value["VALUE"] : null
                        }}
                        helperText={errors.p_diagnosis && "Debe indicar un diagnóstico"}
                      />
                    </>
                  }
                </GridItem>
                <GridItem xs={2} sm={2} md={1} style={{ padding: "0" }}>
                  <Tooltip title="Buscar en el mapa un centro de atención" placement="right-start" arrow style={{ fontSize: "70px" }}>
                    <IconButton color="primary" onClick={handleCallMap}>
                      <AddLocationIcon className={classes.iconStyle} />
                    </IconButton>
                  </Tooltip>
                </GridItem>
                <GridItem xs={12} md={3} style={{ padding: "0 0 0 8px" }}>
                <SelectSimple
                        label={'Moneda'}
                        id="p_moneda"
                        array={currencies}
                        onChange={handleCurrency}
                      />
                </GridItem>
                <GridItem xs={12} md={9} style={{ padding: "8px 0 0 0" }}>
                <Controller
                        label={"Monto Presupuesto "}
                        name="p_service_amount"
                        as={AmountFormatInput}
                        control={control}
                        rules={{ required: true }}
                        disabled={disabledAmount}
                        prefix={prefix + " "}
                        helperText={errors.p_service_amount && `Debe indicar el Monto del Presupuesto`}
                        
                      />
                </GridItem>
                
              </GridContainer>
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
        : <CardPanel titulo="Solicitud de Carta Aval" icon="playlist_add_check" iconColor="primary">
            <ProviderLocationsController
              serviceTypeForValidate={serviceType}
              callFrom={"RequestLetterGuaranteeAsInsuredForm"}
              returnToForm={returnToForm}
            />
          </CardPanel>
       }
        {(validRequest) &&
          <ValidationServiceRequest handleQuestion={handleQuestion}/>
        }  
    </>
  )
}
