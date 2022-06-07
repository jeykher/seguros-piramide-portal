import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
import { useForm, Controller } from "react-hook-form";
import Icon from "@material-ui/core/Icon";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import CardPanel from 'components/Core/Card/CardPanel'
import TextField from '@material-ui/core/TextField';
import MenuItem from "@material-ui/core/MenuItem";
import pendingAction from '../../Workflow/pendingAction'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import SelectMultipleChip from 'components/Core/SelectMultiple/SelectMultipleChip';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import AutocompleteForm from 'components/Core/Autocomplete/AutocompleteControl'
import AutoCompleteWithData from "../../../../components/Core/Autocomplete/AutoCompleteWithData"

export default function RequestMedicalAttentionForm(props) {
    const { handleSubmit, errors, control, setValue } = useForm();
    const dialog = useDialog();
    const [hasHistory, sethasHistory] = useState(null)
    const [defaultType, setdefaultType] = useState(null)
    const [servicesType, setServicesType] = useState(null)
    const [serviceTypeSel, setServiceTypeSel] = useState(null)
    const [kindOfServiceSubType, setKindOfServiceSubType] = useState(null)
    const [specialties, setSpecialties] = useState(null)
    const [attetionPrevious, setAttetionPrevious] = useState(null)
    const [externalDoctor, setExternalDoctor] = useState(false)
    const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
    const nameInsuranceCompany = (insuranceCompany == 'OCEANICA') ? 'Oceánica de Seguros' : 'Pirámide Seguros'
    const [diseases, setDiseases] = useState(null)
    const [diseasesDetail, setDiseasesDetail] = useState(null)
    const [dataDisease, setDataDisease] = useState([])
    const [requestType, setRequestType] = useState([])
    const [validRequestAmp, setValidRequestAmp] = useState(null)
    function handleBack(e) {
        e.preventDefault();
        window.history.back()
    }

    function getAttentionChecked() {
        let arrayDis = []
        let infoAttention = {}

        if(externalDoctor){
            arrayDis[0] = dataDisease[0]
            arrayDis[1] = dataDisease[1]
            arrayDis[2] = dataDisease[2]
            arrayDis[3] = dataDisease[3]
        }else{
            attetionPrevious.map((reg) => {
                if (reg.tableData.checked === true) {
                    arrayDis[0] = reg.CODENFTIT
                    arrayDis[1] = reg.CODENFSTIT
                    arrayDis[2] = reg.CODENFER
                    arrayDis[3] = reg.CODDETENFER
                    infoAttention.idpreadmission = reg.IDEPREADMIN
                }
            })
        }

        if (arrayDis.length === 0) {
            dialog({
                variant: "info",
                catchOnCancel: false,
                title: "Alerta",
                description: "Debe seleccionar la atención previa"
            })
            throw "Debe seleccionar la atención previa"
        }

        infoAttention.infodisease = arrayDis
        
        return infoAttention
    }
    function isTypeAttentionSelected(dataform){
        let subtype = null;
        if(kindOfServiceSubType=='simple'){
            subtype = dataform.p_service_subtype_simple;
            if(subtype != undefined &&(subtype==null || subtype.length==0)){
                return false
            }
        }else{
            if(dataform.p_service_subtype_multiple.length==0){
                return false
            }
        }
        return true
    }

    async function validRequestInProgress(params) {
        console.log(`params:`, params)
        const response = await Axios.post('/dbo/health_claims/valid_amp_request_in_progress', params)
        console.log(`response.data:`, response.data.result)
        return response.data.result;    
    }

    async function onSubmit(dataform, e) {
        e.preventDefault();
        try {
            
            let objInfoAtettion = {infodisease:[],idpreadmission:null}
            if (!defaultType) objInfoAtettion = getAttentionChecked()

            if(!isTypeAttentionSelected(dataform)){
                dialog({
                    variant: "info",
                    catchOnCancel: false,
                    title: "Alerta",
                    description: "Debe seleccionar el Tipo de Atención"
                })
                throw "Debe seleccionar el Tipo de Atención"
            }
            const params = {
                p_verification_id: props.id,
                p_service_subtype: (kindOfServiceSubType === 'simple') ? JSON.stringify([dataform.p_service_subtype_simple]) : JSON.stringify(dataform.p_service_subtype_multiple),
                p_specialty_code: dataform.p_specialty_code === undefined ? null : dataform.p_specialty_code,
                p_title_disease_code: dataform.p_title_disease_code === defaultType ? null : objInfoAtettion.infodisease[0],
                p_subtitle_disease_code: dataform.p_subtitle_disease_code === defaultType ? null : objInfoAtettion.infodisease[1],
                p_disease_code: dataform.p_disease_code === defaultType ? null : objInfoAtettion.infodisease[2],
                p_det_disease_code: dataform.p_disease_code === defaultType ? null : objInfoAtettion.infodisease[3],
                p_preadmission_id: dataform.p_disease_code === defaultType ? null : objInfoAtettion.idpreadmission,
                p_external_medical_referral: externalDoctor? 'S' : 'N'
            }

            let validRequest = await validRequestInProgress(params)

             if (validRequest === 0){ 
                console.log(`params RequestMedicalAttentionForm:`, params)
                const response = await Axios.post('/dbo/health_claims/request_a_service_after_verify_amp', params)
                const jsonResult = response.data.result
                if(jsonResult.indtimesbenefit === 'S' ){
                    dialog({ 
                        variant: "info",
                        catchOnCancel: false,
                        title: "Alerta",
                        description: "El asegurado ha superado el número de órdenes autorizadas. La solicitud será evaluada por nuestros analistas en un lapso de 24 horas."
                    })                 
                }
                await pendingAction(jsonResult.workflowId)
              }else{
                  setValidRequestAmp(true)
              }
        } catch (error) {
            console.error(error)
        }
    }

    // const requestType = [
    //     { type: "Y", description: "Solicitar sobre una especialidad por primera vez" },
    //     { type: "N", description: "Solicitar complemento asociado a un diagnóstico previo" },
    //     { type: "M", description: "Solicitar sobre recomendación de médico externo" }
    // ]

    useEffect(() => {
        getHasHistory()
    }, [])

    async function getHasHistory() {
        const params = { p_verification_id: props.id }
        const response = await Axios.post('/dbo/health_claims/has_clinic_history_in_service', params)
        if (response.data.p_has_clinic_history === "Y") {
            sethasHistory(true)
            setRequestType ([
                { type: "Y", description: "Solicitar sobre una especialidad por primera vez" },
                { type: "N", description: "Solicitar complemento asociado a un diagnóstico previo" },
                { type: "M", description: "Solicitar sobre recomendación de médico externo" }
            ])
        } else {
            sethasHistory(false)
            setdefaultType(false)
            setRequestType ([
                { type: "Y", description: "Solicitar sobre una especialidad por primera vez" },            
                { type: "M", description: "Solicitar sobre recomendación de médico externo" }
            ])
        }
    }

    useEffect(() => {
        if (defaultType === null) return
        getSubtypes()
    }, [defaultType])

    async function getSubtypes() {
        const params = { p_verification_id: props.id, p_default_subtype: defaultType ? "Y" : null }
        console.log(`params:`, params)
        const response = await Axios.post('/dbo/health_claims/get_subtypes_serv', params)
 
        if(!response||!response.data||!response.data.result||response.data.result.length==0){        
            dialog({
                variant: "info",
                catchOnCancel: false,
                title: "Alerta",
                description: `No puede completar solicitudes de AMP porque no posee baremos acordados. Por favor comuníquese con ${nameInsuranceCompany}`
            })
            setServicesType(null)
        }else{
            setServicesType(response.data.result)
        }
    }

    useEffect(() => {
        if (!externalDoctor) return
            get_diseases()
            get_diseases_detail()
            getSubtypes()
    }, [externalDoctor])

    async function get_diseases() {
        const { data } = await Axios.post("/dbo/health_claims/get_diseases")
        setDiseases(data.v_cur_diseases)        
    }

    async function get_diseases_detail() {
        const { data } = await Axios.post("/dbo/health_claims/get_details_diseases_allcode")
        setDiseasesDetail(data.c_det_diseases)        
    }

    useEffect(() => {
        if (!defaultType) return
        if (serviceTypeSel === null) return
        getSpecialties()
    }, [serviceTypeSel])

    async function getSpecialties() {
        const params = { p_verification_id: props.id, p_service_subtype: serviceTypeSel }
        const response = await Axios.post('/dbo/health_claims/get_specialties_after_verify', params)
        setSpecialties(response.data.result)
    }

    useEffect(() => {
        if (!hasHistory) return
        if (defaultType) return
        if (attetionPrevious) return
        getAttentionPrevious()
    }, [defaultType])

    let jsonAttetion = []
    async function getAttentionPrevious() {
        const params = { p_verification_id: props.id }
        const response = await Axios.post('/dbo/health_claims/get_previous_attentions', params)
        console.log('getAttentionPrevious')
        console.log(response.data.result)
        setAttetionPrevious(response.data.result)
    }

    function handleChangeRequestType(value) {
        if(value === "Y"){
            setdefaultType(true)
            setKindOfServiceSubType('simple')
        }else{
            
            setdefaultType(false)
            setKindOfServiceSubType('multiple')                
                    
        }        

        value === "M" ? setExternalDoctor(true) : setExternalDoctor(false)
       
        setValue("p_service_subtype_simple", null)
        setValue("p_service_subtype_multiple", null)
        setServiceTypeSel(null)
    }
    
    function onChangeDisease(value) {
        setDataDisease(value.split("*"))        
    }

    function onChangeDiseaseDetail(value) {
        setDataDisease(value.split("*"))        
    }

    const handleQuestion = (v) => {
        if (v)
            window.history.back()
        else
        setValidRequestAmp(false)
    }

    return (
        <CardPanel titulo="Solicitud de Atención Médica" icon="playlist_add_check" iconColor="primary" >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* {hasHistory && */}
                    <Controller
                        label="Tipo de Solicitud"
                        fullWidth
                        select
                        as={TextField}
                        name="p_request_type"
                        control={control}
                        helperText={errors.p_request_type && "Debe indicar el Tipo de Solicitud"}
                        rules={{ required: true }}
                        onChange={([selected]) => {
                            handleChangeRequestType(selected.target.value)
                            return selected.target.value
                        }}
                    >
                        {requestType.map(option => (
                            <MenuItem key={option.type} value={option.type}>
                                {option.description}
                            </MenuItem>
                        ))}
                    </Controller>
                    {/* } */}
                <br />
                {hasHistory && (!defaultType) && (!externalDoctor) && attetionPrevious && <TableMaterial
                    options={{ selection: true, showSelectAllCheckbox: false, paging: false, search: false, toolbar: false, sorting: false, }}
                    columns={[
                        { title: 'Fecha', field: 'FECOCURR' },
                        { title: 'Diagnóstico', field: 'DESCDETENFER' },
                        { title: 'Especialidad', field: 'DESCESPE' }
                    ]}
                    data={attetionPrevious}
                    onSelectionChange={(data, rowData) => {
                        jsonAttetion = attetionPrevious.map((reg) => {
                            if (reg.IDEPREADMIN !== rowData.IDEPREADMIN) reg.tableData.checked = false
                            return reg
                        })
                        setAttetionPrevious(jsonAttetion)
                    }}
                />}
                <br />
                {((!hasHistory && defaultType) && servicesType) ?
                    <Controller
                        label="Tipo de Atención"
                        fullWidth
                        select
                        as={TextField}
                        name="p_service_subtype_simple"
                        control={control}
                        helperText={errors.p_service_subtype_simple && "Debe indicar el Tipo de Atención"}
                        rules={{ required: true }}
                        onChange={([selected]) => {
                            setServiceTypeSel(JSON.stringify([selected.target.value]))
                            setKindOfServiceSubType('simple')
                            return selected.target.value
                        }}
                    >
                        {servicesType.map(option => (
                            <MenuItem key={option.SERVICE_SUBTYPE} value={option.SERVICE_SUBTYPE}>
                                {option.SERVICE_SUBTYPE_DESCRIPTION}
                            </MenuItem>
                        ))}
                    </Controller> :
                    ((hasHistory && defaultType !== null) && (!externalDoctor)) && servicesType &&
                    <Controller
                        label="Tipo de Atención"
                        fullWidth
                        as={SelectMultipleChip}
                        arrayValues={servicesType}
                        idvalue="SERVICE_SUBTYPE"
                        descrip="SERVICE_SUBTYPE_DESCRIPTION"
                        name="p_service_subtype_multiple"
                        control={control}
                        helperText={errors.p_service_subtype_multiple && "Debe indicar el Tipo de Atención"}
                        rules={{ required: true }}
                        onChange={([selected]) => {
                            setKindOfServiceSubType('multiple')
                            setServiceTypeSel(JSON.stringify(selected.target.value))
                            return selected.target.value
                        }}
                    />}
                {(defaultType) && specialties &&
                    <Controller
                        label="Especialidad"
                        fullWidth
                        select
                        as={TextField}
                        name="p_specialty_code"
                        control={control}
                        helperText={errors.p_specialty_code && "Debe indicar la Especialidad"}
                        rules={{ required: true }}
                    >
                        {specialties.map(option => (
                            <MenuItem key={option.SPECIALTY_CODE} value={option.SPECIALTY_CODE}>
                                {option.SPECIALTY_DESCRIPTION}
                            </MenuItem>
                        ))}
                    </Controller>}  

                    {(externalDoctor) && diseases &&
                        <>
                        <Controller
                            label="Diagnóstico"
                            options={diseasesDetail}
                            as={AutoCompleteWithData}
                            noOptionsText="Escriba para seleccionar el diagnóstico"
                           // defaultValue={props.diseaseId}
                           // inputValue={inputValueDiase}
                            name="p_diseases_code"
                            control={control}
                            rules={{ required: true }}
                            onChange={([e, value]) => {
                                onChangeDiseaseDetail(value.VALUE) 
                                return value ? value.VALUE : null }
                            }
                            
                            helperText={errors.p_diseases_code && "Debe indicar el Diagnóstico"}
                        />

                        {/* <Controller
                            label="Diagnóstico"
                            as={AutocompleteForm}
                            api='/dbo/health_claims/get_diseases'
                            cursor='v_cur_diseases'
                            name="p_diseases_code"
                            control={control}
                            defaultValue=""
                            rules={{ required: true }}
                            onChange={([e, value]) => {   
                                onChangeDisease(value.VALUE) 
                                return value ? value.VALUE : null }
                            }
                            helperText={errors.p_diseases_code && "Debe indicar el Diagnóstico"}
                        /> */}

                        <Controller
                            label="Tipo de Atención"
                            fullWidth
                            as={SelectMultipleChip}
                            arrayValues={servicesType}
                            idvalue="SERVICE_SUBTYPE"
                            descrip="SERVICE_SUBTYPE_DESCRIPTION"
                            name="p_service_subtype_multiple"
                            control={control}
                            helperText={errors.p_service_subtype_multiple && "Debe indicar el Tipo de Atención"}
                            rules={{ required: true }}
                            onChange={([selected]) => {
                                setKindOfServiceSubType('multiple')
                                setServiceTypeSel(JSON.stringify(selected.target.value))
                                return selected.target.value
                            }}
                        />        
                        </>
                        }               
                        {(validRequestAmp) &&
                            <CotinueValidation handleQuestion={handleQuestion}/>
                        }   
                <CardFooter>
                    <GridContainer justify="center">
                        <Button color="secondary" onClick={handleBack}>
                            <Icon>fast_rewind</Icon> Regresar
                        </Button>
                        {servicesType&&
                        <Button color="primary" type="submit">
                            <Icon>send</Icon> Enviar
                        </Button>
                        }
                    </GridContainer>
                </CardFooter>
            </form>
        </CardPanel>
    )

    function CotinueValidation(props) {
         const { handleQuestion } = props
     

         function handleCotinueValidation(v) {
            handleQuestion(v)
          }
         return (
           <Dialog open={true}>
             <DialogTitle id="alert-dialog-title">Alerta</DialogTitle>
             <DialogContent>
               <DialogContentText>
               El asegurado posee una solicitud con la misma patología, se encuentra disponible en la sección "Solicitudes Activas".
               </DialogContentText>
               <DialogContentText>
                    ¿Desea continuar?
               </DialogContentText>
             </DialogContent>
             <DialogActions>
               <Button color="success" size={"sm"} onClick={() => handleCotinueValidation(true)} autoFocus>
                 Si
               </Button>
               <Button color="primary" size={"sm"} onClick={() => handleCotinueValidation(false)}  autoFocus>
                 No
               </Button>
             </DialogActions>
           </Dialog>)
     
       }
}
