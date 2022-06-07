import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"
import { useForm, Controller } from "react-hook-form"

import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import TextField from '@material-ui/core/TextField'
import MenuItem from "@material-ui/core/MenuItem"

import InsuredInfo from "../HealthClaims/InsuredInfo"
import CardPanel from "../../../components/Core/Card/CardPanel"
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import DateMaterialPicker from "components/Core/Datetime/DateMaterialPicker"
import AmountFormatInput from "components/Core/NumberFormat/AmountFormatInput"
import NumberOnlyFormat from "components/Core/NumberFormat/NumberOnlyFormat"
import "./ServiceNotificationPage.scss"
import CollectionManagement from "./collectionManagement";

import { useDialog } from "context/DialogContext"
import useServiceNotifications from "./useServiceNotifications"

const ServiceNotificationPage = (props) => {
    // Variables & constans
    const currencies = [
        { value: "BS", label: "Bolívares" },
        { value: "DL", label: "Dólares" },
    ]
    const reasons = [
        { value: "EM", label: "Emergencia Médica" },
        { value: "UM", label: "Urgencia Médica" },
    ]
    const attentions = [
        { value: "AM", label: "Ambulatorio" },
        { value: "HO", label: "Hospitalización" },
    ]
    // Props
    const userData = props.location.state.dataJson
    // States
    const [serviceTypes, setServiceTypes] = useState([])
    const [serviceSelected, setServiceSelected] = useState(null)
    const [reasonAdmission, setReasonAdmission] = useState("")
    const [showPlacesAttention, setShowPlacesAttention] = useState(false)
    const [masterId, setMasterId] = useState(null)
    const [placesAttention, setPlacesAttention] = useState([])
    const [showCurrentData, setShowCurrentData] = useState(false)
    const [ disabledAmount, setDisabledAmount ] = useState(true)
    const [ prefix, setPrefix ] = useState(null)
    // Hooks
    const { handleSubmit, ...objForm } = useForm()
    const dialog = useDialog()
    const { getDashboardService, getPlacesAttention } = useServiceNotifications()
    // General methods
    const cleanInputs = () => {
        setPlacesAttention([])
        setShowPlacesAttention(false)
        setShowCurrentData(false)
        setReasonAdmission("")
    }
    // Verifier methods
    const verifyUserProfile = () => {
        let sessionData = JSON.parse(sessionStorage.getItem('PROFILE'))
        if(!sessionData) {
            dialog({
                variant: "info",
                catchOnCancel: false,
                title: "Alerta",
                description: "La sesión de usuario no es valida. Ingrese de nuevo."
            })
            navigate(`${sessionData.HOME}`)           
        }
        if(sessionData.PROFILE_CODE==="insurance_broker") {
            setMasterId(21) 
        }else {
            setMasterId(30) 
        }

    }
    // Handler methods
    const handleChangeServiceType = async (selected) => {
        cleanInputs()
        setServiceSelected(selected)
        if(selected != null && selected != '' && selected != undefined && selected != 36 && selected != 26) {
            let response = await getPlacesAttention(userData.service_type)
            setPlacesAttention(response)
            setShowPlacesAttention(true)
            setShowCurrentData(false)
        }
        if(selected === 36 || selected === 26) {
            setShowPlacesAttention(false)
            setShowCurrentData(true)
        }
    }
    const handleChangePlacesAttention = (selected) => {
        if(selected != null && selected != '' && selected != undefined) {
            setShowCurrentData(true)
        }
        else {
            setShowCurrentData(false)
        }
    }
    const handleCurrency = (value) => {
        if(value){
            setDisabledAmount(false)
            setPrefix(value)
        }else{         
            setPrefix(null)
            setDisabledAmount(true)
        }
    }
    async function onSubmit(dataform, e) {
        console.log("Has enviado el form")
       console.log(dataform)
    }
    // Fetch methods
    const fetchDashboardService = async () => {
        let response = await getDashboardService(masterId);
        setServiceTypes(response)
    }
    // Effects
    useEffect(() => {
        verifyUserProfile()
    }, [])

    useEffect(() => {
        if(masterId!=null){
            fetchDashboardService()
        }
    }, [masterId])
    // Rendering

    return (
      <>
        <GridContainer className="services-notification-page-container">
            <GridItem item xs={12} sm={12} md={12} lg={4}>
                {userData !== null &&
                    <InsuredInfo data={userData} />
                }
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={8}>
                <CardPanel titulo="Solicitud de Servicio" icon="playlist_add_check" iconColor="primary">
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="form-info-services">
                    <Controller
                        label="Tipo de Solicitud"
                        className="input-form-service"
                        fullWidth
                        select
                        as={TextField}
                        name="p_service_type"
                        control={objForm.control}
                        helperText={objForm.errors.p_service_type && "Debe indicar el Tipo de Solicitud"}
                        rules={{ required: true }}
                        onChange={([selected]) => {
                            handleChangeServiceType(selected.target.value)
                            return selected.target.value
                        }}
                    >
                            {
                                serviceTypes.map(option => (
                                    <MenuItem
                                        key={option.dashboard_id}
                                        value={option.dashboard_id}
                                    >
                                        {option.title}
                                    </MenuItem>
                                ))
                            }
                    </Controller>
                    {
                        showPlacesAttention && (
                            <Controller
                                label="Seleccione donde desea ser Atendido"
                                className="input-form-service"
                                fullWidth
                                select
                                as={TextField}
                                name="p_place_attention"
                                control={objForm.control}
                                helperText={objForm.errors.p_place_attention && "Debe indicar donde quiere ser atendido"}
                                rules={{ required: true }}
                                onChange={([selected]) => {
                                    handleChangePlacesAttention(selected.target.value)
                                    return selected.target.value
                                }}
                            >
                                {
                                    placesAttention.map(option => (
                                        <MenuItem
                                            key={option.VALUE}
                                            value={option.VALUE}
                                        >
                                            {option.NAME}
                                        </MenuItem>
                                    ))
                                }
                            </Controller>
                        )
                    }
                    {
                        showCurrentData && (
                            <>
                            {serviceSelected === 38 &&(
                                   <Controller
                                   label="Motivo de Ingreso"
                                   className="input-form-service"
                                   fullWidth
                                   select
                                   as={TextField}
                                   name="p_reason_admission"
                                   control={objForm.control}
                                   helperText={objForm.errors.p_place_attention && "Debe indicar el motivo de Ingreso"}
                                   rules={{ required: true }}
                                   onChange={([selected]) => {
                                       setReasonAdmission(selected.target.value)
                                       return selected.target.value
                                   }}
                               >
                                   {
                                       reasons.map(option => (
                                           <MenuItem
                                               key={option.value}
                                               value={option.value}
                                           >
                                               {option.label}
                                           </MenuItem>
                                       ))
                                   }
                               </Controller>
                            )}
                             
                                {reasonAdmission==="EM"&&(
                                      <Controller
                                      label="Tipo Atención"
                                      className="input-form-service"
                                      fullWidth
                                      select
                                      as={TextField}
                                      name="p_reason_attention"
                                      control={objForm.control}
                                      helperText={objForm.errors.p_place_attention && "Debe indicar el tipo de Atención"}
                                      rules={{ required: true }}
                                      onChange={([selected]) => {
                                          return selected.target.value
                                      }}
                                  >
                                      {
                                          attentions.map(option => (
                                              <MenuItem
                                                  key={option.value}
                                                  value={option.value}
                                              >
                                                  {option.label}
                                              </MenuItem>
                                          ))
                                      }
                                  </Controller>
                                )}
                                <GridContainer justify="left">
                                    <GridItem xs={12} md={6}>
                                        <Controller
                                            className="input-form-service"
                                            label={"Fecha de Solicitud"}
                                            name="p_request_date"
                                            as={DateMaterialPicker}
                                            // control={objForm.control}
                                            control={objForm.control}
                                            rules={{ required: true }}
                                            helperText={objForm.errors.p_request_date && `Debe indicar la Fecha de Solicitud`}
                                            disableFuture
                                            fullWidth
                                            // style={{ width: "200px" }}
                                            // onChange={([value]) => {
                                            //     setDataRequest({
                                            //     ...dataRequest,
                                            //     claim_date_as_string  : getddMMYYYDate(value)                    
                                            //     })
                                            //     return value
                                            // }}              
                                        />
                                    </GridItem>
                                    <GridItem xs={12} md={6} >
                                        <Controller
                                            className="input-form-service"
                                            label={"Fecha de Ocurrencia"}
                                            name="p_ocurr_date"
                                            as={DateMaterialPicker}
                                            // control={objForm.control}
                                            control={objForm.control}
                                            rules={{ required: true }}
                                            helperText={objForm.errors.p_ocurr_date && `Debe indicar la Fecha de Ocurrencia`}
                                            disableFuture
                                            fullWidth
                                            // style={{ width: "200px" }}
                                            // onChange={([value]) => {
                                            //     setDataRequest({
                                            //     ...dataRequest,
                                            //     claim_date_as_string  : getddMMYYYDate(value)                    
                                            //     })
                                            //     return value
                                            // }}              
                                        />
                                    </GridItem>
                                </GridContainer>
                                <GridContainer justify="left">
                                    <GridItem xs={12} md={3}>
                                        <SelectSimpleController 
                                            className="input-form-service"
                                            objForm={objForm} 
                                            label="Moneda"  
                                            name="p_currency" 
                                            array={currencies}
                                            onChange={handleCurrency}
                                        />
                                    </GridItem>
                                        <GridItem xs={12} md={3}>
                                            <Controller
                                                className="input-form-service"
                                                label={"Monto Servicio"}
                                                name="p_service_amount"
                                                as={AmountFormatInput}
                                                control={objForm.control}
                                                rules={{ required: true }}
                                                helperText={objForm.errors.p_service_amount && `Debe indicar el Monto de Servicio`}
                                                prefix={prefix + " "}
                                                fullWidth={true}
                                                disabled={disabledAmount}
                                                // onChange={
                                                
                                                // ([value]) => {
                                                //     setDataRequest({
                                                //     ...dataRequest,
                                                //     service_amount  : value                    
                                                //     })
                                
                                                //     return value
                                                // }
                                                    
                                                // }
                                            />
                                        </GridItem>
                                        <GridItem xs={12} md={6}>
                                            <Controller
                                                className="input-form-service"
                                                label={"Nro Factura/Nro Presupuesto"}
                                                name="p_invoice_number"
                                                as={NumberOnlyFormat}
                                                control={objForm.control}
                                                rules={{ required: true }}
                                                helperText={objForm.errors.p_invoice_number && `Debe indicar el número de factura o presupuesto`}
                                            />
                                        </GridItem>
                                </GridContainer>
                            </>
                        )
                    }
                    {/* <button type="submit">Enviar</button> */}
                    </form>
                </CardPanel>
                {serviceSelected!=null&&(
                    <CollectionManagement serviceSelected={serviceSelected}/>
                )}
            </GridItem>         
        </GridContainer>
      </>
    )
}

export default ServiceNotificationPage
