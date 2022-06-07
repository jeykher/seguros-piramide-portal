import React, { useEffect, useState } from "react"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Dropdown from "components/material-kit-pro-react/components/CustomDropdown/CustomDropdown.js";
import Card from "components/material-dashboard-pro-react/components/Card/Card"
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import CardIcon from "components/material-dashboard-pro-react/components/Card/CardIcon.js"
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter.js"
import Axios from "axios"
import moment from "moment"
import { makeStyles } from "@material-ui/core/styles"
import styles from "components/Core/Card/cardPanelStyle"
import DiseasesForm from "./DiseasesForm"
import ClaimCoverage from "./ClaimCoverage"
import { getddMMYYYDate, formatAmount,getddMMYYYYDate } from "../../../../utils/utils"
import { Controller, useForm } from "react-hook-form"
import { getProfile } from 'utils/auth'
import { useDialog } from "context/DialogContext"
import SelectSimple from "components/Core/SelectSimple/SelectSimple"
import UpdateBeneficiaryAccount from './UpdateBeneficiaryAccount';
import ButtonIconText from 'components/Core/ButtonIcon/ButtonIconText'
import DateMaterialPicker from 'components/Core/Datetime/DateMaterialPicker'
import { Fade, TextField, Backdrop, Modal, Zoom, Tooltip, Icon, Radio, FormControlLabel, RadioGroup} from "@material-ui/core";
import ModalAnnexes from "./ModalAnnexes";
import AutoCompleteWithData from "../../../../components/Core/Autocomplete/AutoCompleteWithData"

const useStyles = makeStyles((theme) => ({
  ...styles,
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    width: "50%",
    minHeight: '45vh',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 2, 2),
  },

  paper2: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "2px",
    width: "40%",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 2, 2),
  },
  titleModal: {
    textAlign: 'center',
  },
  actionButtonRound: {
    width: "30px",
    height: "30px",
    minWidth: "auto"
  },
  actionButton: {
      margin: "0 0 0 5px",
      padding: "5px",
      "& svg,& .fab,& .fas,& .far,& .fal,& .material-icons": {
          marginRight: "0px"
      }
  },
  icon: {
      verticalAlign: "middle",
      width: "17px",
      height: "17px",
      top: "-1px",
      position: "relative"
  },
  hideContent: {
    display: "none"
  },
  showContent: {
    display: "block"
  },
}))

export default function RequestApproval(props) {
  const classes = useStyles()
  const { workflow_id, program_id } = props
  const [preAdmissionId, setPreAdmissionId] = useState()
  const [complementId, setComplementId] = useState()
  const [operType, setOperType] = useState()
  const [preAdmissionType, setPreAdmissionType] = useState()
  const [actionType, setActionType] = useState()
  const [diseaseId, setDiseaseId] = useState()
  const [treatmentId, setTreatmentId] = useState()
  const [viewApprove, setViewApprove] = useState(false)
  const [refresh, setRefresh] = useState(true)
  const [refreshGeneralData, setRefreshGeneralData] = useState(true)

  async function getDiagnosisTreatmentInfo(p_preAdmissionId, p_complementId) {
    const params = {
      p_preadmission_id: p_preAdmissionId,
      p_complement_id: p_complementId,
    }
    const { data } = await Axios.post(`/dbo/health_claims/get_diagnosis_treatment_info`, params)
    const  datadet  = await Axios.post(`/dbo/health_claims/get_detail_diagnosis`, params)
    console.log(datadet)
    const diseaseCode = data.result.title_disease_code + "*" + data.result.subtitle_disease_code + "*" + data.result.disease_code + "*" + datadet.data.result.detail_disease_code
    const treatmentCode = data.result.treatment_code
    setDiseaseId(diseaseCode)
    setTreatmentId(treatmentCode)
  }

  async function getParams() {
    const params = { p_workflow_id: workflow_id, p_program_id: program_id }
    const response = await Axios.post("/dbo/workflow/program_to_clob", params)
    const jsonResult = response.data.result
    const paramPro = jsonResult.program_actions[0].parameters[0]
    setPreAdmissionId(paramPro.p_idepreadmin)
    setComplementId(paramPro.p_numliquid)
    setPreAdmissionType(paramPro.p_tipopreadmin)
    setOperType(paramPro.p_tipoper)
    getDiagnosisTreatmentInfo(paramPro.p_idepreadmin, paramPro.p_numliquid)
  }

  useEffect(() => {
    getParams()
  }, [])


  function updateDisease() {
    getDiagnosisTreatmentInfo(preAdmissionId, complementId)
  }

  function handleApprove() {
    setViewApprove(true)
  }

  function handleClose() {
    setViewApprove(false)
  }

  function handleReturn() {
    window.history.back()
  }

  function handleRefresh() {
    setRefresh(false);

  }
  function handleRefreshGeneralData() {
    setRefreshGeneralData(false);

  }
  useEffect(()=>{

    if(refresh===false)
      setRefresh(true);


  },[refresh])
  
  useEffect(()=>{

    if(refreshGeneralData===false)
    setRefreshGeneralData(true);


  },[refreshGeneralData])

  return (<>
    {viewApprove && <Approve preAdmissionId={preAdmissionId} 
                             complementId={complementId} 
                             operType={operType}
                             preAdmissionType={preAdmissionType}
                             programId={program_id}
                             handleClose={handleClose}/>
    }
                             
    <Card>
      <CardHeader color="primary" className="text-center">
        {preAdmissionType === '01'?
          <h5> ACTIVACIÓN DE CASOS</h5>
          :
          <h5> APROBACIÓN DE CASOS</h5>
        }
      </CardHeader>
      <CardBody>
        { refreshGeneralData &&
        <GeneralData workflowId={workflow_id} preAdmissionId={preAdmissionId} complementId={complementId} operType={operType} preAdmissionType={preAdmissionType} handleRefresh={handleRefresh}/>
        }
        {(diseaseId || refresh)  &&
        <DiseasesForm preAdmissionId={preAdmissionId} complementId={complementId} diseaseId={diseaseId}
                      treatmentId={treatmentId} updateDisease={updateDisease}/>
        }
        {refresh  &&
        <ClaimCoverage preAdmissionId={preAdmissionId} complementId={complementId} preAdmissionType={preAdmissionType} diseaseId={diseaseId}
                       treatmentId={treatmentId} handleRefreshGeneralData={handleRefreshGeneralData}/>}
      </CardBody>
      <CardFooter>
        <GridContainer justify={"center"}>
          <Button color="secondary" type="submit" onClick={handleReturn}>
            <Icon>fast_rewind</Icon> Regresar
          </Button>
          <Button color="success"  type="submit" style={{ height: '40px'}} onClick={handleApprove}>
            <Icon>send</Icon> {preAdmissionType === '01'?
                                <h6> Activar</h6>
                                :
                                <h6> Aprobar</h6>
                              }
          </Button>
        </GridContainer>
      </CardFooter>
    </Card>
  </>)


}

export function GeneralData(props) {
  const classes = useStyles()
  const { register, handleSubmit, errors, control, ...objForm } = useForm()
  const [generalData, setGeneralData] = useState()
  const [dataSelect, setDataSelect] = useState([])
  const [dataProviders, setDataProviders] = useState([])
  const [dateSelected, setDateSelected] = useState('')
  const [selectedPolicy, setSelectedPolicy] = useState(null)
  const [defaultPolicy, setDefaultPolicy] = useState(null)
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [defaultProvider, setDefaultProvider] = useState(null)
  const [defaultProviderInput, setDefaultProviderInput] = useState("")
  const [selectedProviderInput, setSelectedProviderInput] = useState("")
  const [viewButton, setViewButton] = useState(false)
  const [openModal, setOpenModal] = useState(false);
  const [showProvidersList, setShowProvidersList] = useState(false);
  const [openModalAnexos, setOpenModalAnexos] = useState(false);
  const [modalHist, setModalHist] = useState(false)
  const dialog = useDialog()

  async function getHealtProvider() {
    const response = await Axios.post('/dbo/health_claims/get_health_providers_list');
    const jsonCursor = response.data['p_health_providers_list']
    setDataProviders(jsonCursor)
  }

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  } 
  const handleOpenModalAnexos = async(data) => {
    setOpenModalAnexos(data);
  }  

  const handleOpenModalHist = async(data) => {
    setModalHist(data);
  } 

  async function getGeneralData(preAdmissionId, complementId) {

    const params = {
      p_preadmission_id: preAdmissionId,
      p_complement_id: complementId,
    }
    const { data } = await Axios.post(`/dbo/health_claims/get_service_info`, params)
    const dataInfo = data.result[0]
    //console.log(dataInfo.FECOCURR, new Date(dataInfo.FECOCURR.split('T')[0]), getddMMYYYDate(new Date(dataInfo.FECOCURR)),moment(dataInfo.FECOCURR.split('T')[0]).format('DD/MM/YYYY'));
    setDateSelected(dataInfo.FECEGRESO)
    const dataGeneral = {
      "Nro liquidación": { value: dataInfo.NRO_LIQUIDACION, type: "label" },
      "Fecha ocurrencia": { value: moment(dataInfo.FECOCURR.split('T')[0]).format('DD/MM/YYYY'), type: "label" }, // pendiente con el formato de la fecha actualmente esta mal
      "Estatus liquidación": { value: dataInfo.STSLIQUID, type: "label" },
      "Nro póliza": { value: dataInfo.NRO_POLIZA, type:( dataSelect.length > 1 /*&& (props.preAdmissionType==='01' || props.preAdmissionType==='03')*/)? "select" : "label" }, //Aqui agregas la logica para cambiar el type dependiendo de lo que necesites.
      "Fecha Inicio de la Póliza": { value: dataInfo.FECHA_INICIO_POL, type: "label" },
      "Vigencia": {
        value: `${dataInfo.FECINIVIG} - ${dataInfo.FECFINVIG}`,
        type: "label",
      },
      "Nombre contratante": { value: dataInfo.NOM_CONTRATANTE, type: "label" },
      "Nombre titular": { value: dataInfo.NOM_TITULAR, type: "label" },
      "Nombre asegurado": { value: dataInfo.NOM_ASEGURADO, type: "label" },
      "Cédula de identidad": { value: dataInfo.CEDULAPACIENTE, type: "label" },
      "Plazo espera": { value: dataInfo.PLAZO_ESPERA, type: "label" },
      "Nombre proveedor": { value: dataInfo.NOM_PROVEEDOR, type: (dataProviders.length > 1 && props.preAdmissionType==='01')? "select" : "label" },
      "Moneda póliza": { value: dataInfo.CODMONEDAPOLIZA, type: "label" },
      "Monto facturado": { value: formatAmount(dataInfo.MTOFACTMONEDA), type: "label" },
      "Monto amparado": { value: formatAmount(dataInfo.MTOAMPARADOMONEDA), type: "label" },
      "Monto deducible": { value: formatAmount(dataInfo.MTODEDU), type: "label" },
      "Monto indemnizado": { value: formatAmount(dataInfo.MTOINDEMNIZADOMONEDA), type: "label" },
      "Suma Asegurada": { value: formatAmount(dataInfo.MTOSUMAASEGTOTAL), type: "label" },
      "Suma Asegurada Disponible": { value: formatAmount(dataInfo.MTOSUMAASEGDISP), type: "label" },
      ...(props.preAdmissionType==='03') && {"": { value: '', type: "div" }},      
      ...(props.preAdmissionType==='02' || dataInfo.TIPOPREADMIN === '02') && {"Fecha Egreso": { value: dataInfo.FECEGRESO, type: "date" }},
      ...(props.preAdmissionType==='03') && {"Datos de la cuenta bancaria": { value: dataInfo.NUMCUENTAPAGO, type: "label" }},
      ...(props.preAdmissionType==='03') &&{"Cédula del beneficiario del pago": { value: dataInfo.CEDULABENEFPAGO, type: "label" }},
      ...(props.preAdmissionType==='03') &&{"Nombre del beneficiario del pago": { value: dataInfo.NOM_PROVEEDOR, type: "label" }},
    }
    setGeneralData(Object.entries(dataGeneral))
    setSelectedPolicy(dataInfo.IDEPOL)
    setDefaultPolicy(dataInfo.IDEPOL)
    setSelectedProvider(dataInfo.CODPROVEEDOR)

    console.log('dataProviders :>> ', dataProviders);
    const defaultV = dataProviders.filter(option => option.VALUE === dataInfo.CODPROVEEDOR)[0]
    console.log('defaultV :>> ', defaultV);
    setSelectedProviderInput(defaultV)//dataInfo.NOM_PROVEEDOR
    setDefaultProvider(dataInfo.CODPROVEEDOR)
    setDefaultProviderInput(dataInfo.NOM_PROVEEDOR)
  }


  useEffect(() => {
    if (props.preAdmissionId !== undefined && props.complementId !== undefined) {
      getDataSelect()
      getHealtProvider()
    }
  }, [props.preAdmissionId, props.complementId])

  useEffect(() => {
    if (props.preAdmissionId !== undefined && props.complementId !== undefined && dataSelect)
      getGeneralData(props.preAdmissionId, props.complementId)
  }, [props.preAdmissionId, props.complementId, dataSelect,dataProviders])  

  useEffect(() => {
    setShowProvidersList(false)
    if (selectedProviderInput !== undefined && selectedProviderInput !== null)
       setShowProvidersList(true)
  }, [selectedProviderInput])

  async function getDataSelect() {
    const params = {
      p_preadmission_id: props.preAdmissionId,
      p_complement_id: props.complementId,
    }
    const { data } = await Axios.post(`/dbo/health_claims/get_policies_beneficiary`, params)
    setDataSelect(data.result)
  }

  const handleSelectedPolicy = (value) => {
    if(value===''){
      setViewButton(false)
      setSelectedPolicy(defaultPolicy)
    }else{
      setSelectedPolicy(value)
      value !== defaultPolicy ? setViewButton(true) : defaultProvider !== selectedProvider ? setViewButton(true) : setViewButton(false)
      
    }
  }
  
  const handleSelectedProvider = (value) => {
    if(value === null){
      setViewButton(false)
      setSelectedProvider(defaultProvider)
      setSelectedProviderInput(defaultProviderInput)
    }else{      
      setSelectedProvider(value.VALUE)
      setSelectedProviderInput(value)
      value.VALUE !== defaultProvider ? setViewButton(true) : defaultPolicy !== selectedPolicy ? setViewButton(true) : setViewButton(false)
    }
    
  }


  const handleUpdateAccountBeneficiary = () => {
    getDataSelect()
    getGeneralData(props.preAdmissionId, props.complementId)
  }
  
  async function update_policy_refund() {
    
      if (selectedPolicy === ""){
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Información",
          description: "Debe seleccionar una póliza",
        })
        return;
      }else{ 
        const params = {
          p_preadmission_id: props.preAdmissionId,
          p_complement_id: props.complementId,
          p_policy_id:selectedPolicy,
          p_preadmission_type:props.preAdmissionType
        }
        const { data } = await Axios.post(`/dbo/health_claims/update_policy_refund`, params)
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Información",
          description: "su póliza fue modificada exitosamente",
        })
      }          
  }

  async function update_service_provider() {
    if (selectedProvider === ""){
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Información",
        description: "Debe seleccionar un proveedor",
      })
      return;
    }else{ 
      const params = {
        p_preadmission_id: props.preAdmissionId,
        p_complement_id: props.complementId,
        p_provider_code:selectedProvider
      }
      const { data } = await Axios.post(`/dbo/health_claims/update_service_provider`, params)
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Información",
        description: "El proveedor fué modificado exitosamente",
      })
    }
  }
  async function onSubmit(dataform, e) {
    
    if(defaultPolicy !== selectedPolicy)
        await update_policy_refund()
    if(defaultProvider !== selectedProvider)
        await update_service_provider()    
    getDataSelect()
    getGeneralData(props.preAdmissionId, props.complementId)
    setViewButton(false);
    props.handleRefresh();
    try {

    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdateFecEgre = async (value) => {
    setDateSelected(value)
    const params = {
      p_preadmission_id: props.preAdmissionId,
      p_complement_id: props.complementId,
      p_dateegress: getddMMYYYYDate(value)
    }

    const { data } = await Axios.post(`/dbo/health_claims/modify_discharge_date`, params)

    handleUpdateAccountBeneficiary();
  }

  const getReport = async(tipoObs = '') => {
    let data = {
      IDREPORTE: tipoObs === ''?542:555,
      P_IDEPREADMIN: props.preAdmissionId,
      P_NUMLIQUID: props.complementId,
      P_TIPOOBS: tipoObs
    }
    let params = {
      p_params: JSON.stringify(data)
    }
    const res = await Axios.post("/dbo/toolkit/get_reports", params)
    console.log(res)
    window.open(`/reporte?reportRunId=${res.data.p_url}`,"_blank");

  }
  return (
    <>
    <GridContainer>
      <GridItem item xs={12} sm={12} md={12} lg={12}>
        <Card>
          <CardHeader color="warning" icon={true}>
            <CardIcon color="warning">
              <Icon>description</Icon>
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Datos generales del caso</h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              {generalData && dataSelect && selectedPolicy !== null && generalData.map(dato => (
                dato[1].type === "select" ?
                  <>
                  {dato[0] === 'Nro póliza' &&
                      <>
                      <GridContainer></GridContainer> 
                      <GridItem key={dato} item xs={12} sm={12} md={3} lg={3}>
                        <SelectSimple
                          label={dato[0]}
                          id="s_policy"
                          value={selectedPolicy} //Asignar que tome el valor por defecto
                          array={dataSelect}
                          onChange={handleSelectedPolicy}
                        />
                      </GridItem>
                      </>
                   }

                    {dato[0] === 'Nombre proveedor' && showProvidersList &&
                      <>
                      <GridContainer></GridContainer> 
                      <GridItem key={dato} item xs={12} sm={12} md={3} lg={3}>
                      <Controller
                        label={`Nombre Proveedor`}
                        options={dataProviders}
                        as={AutoCompleteWithData}
                        noOptionsText="Cargando"
                        defaultValue = {selectedProvider}
                        inputValue={selectedProviderInput}
                        name="s_provider"
                        control={control}
                        rules={{ required: true }}
                        onChange={([e, value]) => {
                          //setInputValueProvider(value)
                          handleSelectedProvider(value)
                          return value ? value["VALUE"] : null
                        }}
                        helperText={errors.s_provider && "Debe indicar un proveedor"}
                      />

                      </GridItem>
                      </>
                    }
                  </>
                  :
                  dato[1].type === "label" ?
                    <>
                      <GridItem key={dato} item xs={12} sm={12} md={3} lg={3}>                        
                            <h6><strong>{dato[0]}:<br/></strong> {dato[1].value}</h6>                                                                     
                      </GridItem>
                    </>
                    :
                    dato[1].type === "date"?
                    <>
                     <GridItem key={dato} item xs={12} sm={12} md={3} lg={3}>  
                     <h6><strong>{dato[0]}:<br/></strong></h6>
                      <DateMaterialPicker
                        fullWidth
                        style={{margin: '15px 0 30px 0', fontSize: 8}}
                        placeholder="dd/MM/yyyy"
                        format={"dd/MM/yyyy"}
                        value = {dateSelected}
                        onChange={ date => handleUpdateFecEgre(date)}
                        invalidDateMessage={'Formato de fecha invalido'}
                      /> 
                     </GridItem> 
                    </>
                    :
                    <>
                     <GridItem key={dato} item xs={12} sm={12} md={3} lg={3}>
                       <div style={{minWidth:"200px"}}></div>
                     </GridItem>
                    </>
              ))
              }
              {viewButton &&
              <GridContainer justify="center">
                <Button color="success" type="button" onClick={onSubmit}>
                  <Icon>send</Icon> Confirmar Cambios
                </Button>
              </GridContainer>}
              {props.preAdmissionType=='03' &&  
              <Tooltip title="Editar Beneficiario" placement="right-start" arrow TransitionComponent={Zoom}>
                <Button round color="primary" 
                        type="button" 
                        onClick={()=> handleOpenModal()}
                        className={classes.actionButton + " " + classes.actionButtonRound}>
                       <Icon className={classes.icon}>edit</Icon> 
                </Button> 
              </Tooltip>
              }
                <div style={{marginLeft: '10px'}}>
                  <Dropdown
                    style={{backgroundColor: process.env.GATSBY_INSURANCE_COMPANY==='OCEANICA'?'#47C0B6':'#e39b30'}}
                    dropup
                    dropPlacement="top"
                    buttonText="Acciones"
                    dropdownList={[
                      (
                        <div onClick={() => handleOpenModalAnexos(true)}>
                          Anexos
                        </div>
                      ),
                      (
                        <div onClick={()=>getReport()}>
                          Historial del asegurado
                        </div>
                      ),
                      (
                        <div onClick={()=>handleOpenModalHist(true)}>
                          Historial del caso
                        </div>
                      ),
                    ]}
                  />
                </div>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
      <UpdateBeneficiaryAccount 
        handleClose={handleOpenModal} 
        openModal={openModal}
        workflowId={props.workflowId} 
        preAdmissionId={props.preAdmissionId} 
        complementId={props.complementId} 
        handleUpdateAccountBeneficiary={handleUpdateAccountBeneficiary}
      />
      {
        openModalAnexos &&
        <ModalAnnexes
        handleClose={handleOpenModalAnexos}
        preAdmissionId={props.preAdmissionId} 
        complementId={props.complementId} 
        openModal={openModalAnexos}
      />
      }
     {
       modalHist && 
        <Modal
          className={classes.modal}
          open={modalHist}
          onClose={()=>handleOpenModalHist(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={true}>
            <div className={classes.paper2}>
              <h4 className={classes.titleModal}>Tipo de observacion a consultar</h4>
                <GridContainer justify='center'>
                  <GridItem xs={12} md={12} sm={12} xl={12}>
                    <div style={{display:'flex', justifyContent:'center', paddingBottom: 10}}>
                      <Controller
                        as={
                          <RadioGroup
                            row
                            defaultValue="T"
                          >
                            <FormControlLabel value="T" control={<Radio />} label="Técnica" />
                            <FormControlLabel value="M" control={<Radio />} label="Médica" />
                            <FormControlLabel value="A" control={<Radio />} label="Ambas" />
                          </RadioGroup>
                        }
                        fullWidth
                        control={control}
                        defaultValue="T"
                        name='obs'
                      />
                    </div>

                    
                  </GridItem>
                   
                  <Button color="success" type="submit" onClick={()=> {getReport(objForm.getValues().obs);handleOpenModalHist(false);}}>
                    <Icon>send</Icon> Aceptar
                  </Button>
                </GridContainer>
            </div>
          </Fade>
        </Modal>
     }
    </>  
    )


}

export function Approve(props) {
  const { register, handleSubmit, errors, control, ...objForm } = useForm()
  const classes = useStyles()
  const { preAdmissionId, complementId, handleClose, operType, programId } = props
  const dialog = useDialog()
  console.log(props, "aprobado")

  async function approveOperationInAService(p_observation) {
    const params = {
      p_preadmission_id: preAdmissionId,
      p_complement_id: complementId,
      p_operation_type: operType,
      p_observation: p_observation,

    }
    try {
      const { data } = await Axios.post(`/dbo/health_claims/approve_operation_in_a_service`, params)
      const user = await getProfile()
      const params2 = {
        npnumliquid:complementId,
        npidepreadmin:preAdmissionId,
        cpobservacion : p_observation,
        cpcodciaseg : process.env.GATSBY_INSURANCE_COMPANY === 'OCEANICA'?"02":"01",
        cpUsrWeb : user.PORTAL_USERNAME,
        cpPerfilWeb : user.PROFILE_CODE,
        cpStsObs: ['348', '380', '381', '327'].includes(programId)?'ACT':'LPZ'
    }
    await Axios.post('/dbo/health_claims/save_obs_lpas', params2)
      handleClose()
      if (props.preAdmissionType === '01'){
        dialog({
          variant: "info",
          catchOnCancel: false,
          resolve: () => window.history.back(),
          title: "Información",
          description: "La activación fue ejecutada exitosamente",
        })
      }else{
        dialog({
          variant: "info",
          catchOnCancel: false,
          resolve: () => window.history.back(),
          title: "Información",
          description: "La aprobación fue ejecutada exitosamente",
        })
      } 

    } catch (error) {
      console.error(error)
      handleClose()
    }

  }


  async function onSubmit(dataform, e) {
    e.preventDefault()
    try {

      approveOperationInAService(dataform.p_observation)

    } catch (error) {
      console.error(error)
    }
  }


  return (<Modal
    className={classes.modal}
    open={true}
    onClose={handleClose}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{
      timeout: 500,
    }}
  >
    <Fade in={true}>
      <div className={classes.paper}>
        {props.preAdmissionType === '01'?
          <h4>Activación</h4>
          :
          <h4>Aprobación</h4>
        }
        <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          <GridContainer justify='center'>
            <GridItem xs={12} md={12} sm={12} xl={12}>
              <Controller
                label="Observacion"
                as={TextField}
                fullWidth
                multiline
                rows="25"
                name="p_observation"
                inputRef={register({ required: true })}
                helperText={errors.p_observation && "Debe indicar la Obervación"}
                control={control}
                defaultValue=""
              />
            </GridItem>
            <Button color="success" type="submit">
              <Icon>send</Icon> Aceptar
            </Button>
          </GridContainer>
        </form>
      </div>
    </Fade>
  </Modal>)

}










