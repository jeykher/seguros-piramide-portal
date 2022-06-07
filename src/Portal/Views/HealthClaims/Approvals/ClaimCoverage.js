import React, { Fragment, useEffect, useState } from "react"
import Icon from "@material-ui/core/Icon"
import Accordion from "../../../../components/material-kit-pro-react/components/Accordion/Accordion"
import { Controller, useForm } from "react-hook-form"
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import AccordionComparePanel from "../../../../components/Core/AccordionPanel/AccordionComparePanel"
import SelectSimpleController from "../../../../components/Core/Controller/SelectSimpleController"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Card from "components/material-dashboard-pro-react/components/Card/Card"
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import CardIcon from "components/material-dashboard-pro-react/components/Card/CardIcon.js"
import { currencyValues, formatAmount, getddMMYYYDate, decimalConvert } from "../../../../utils/utils"
import AmountFormatInputController from "../../../../components/Core/Controller/AmountFormatInputController"
import { makeStyles } from "@material-ui/core/styles"
import styles from "components/Core/Card/cardPanelStyle"
import InputController from "../../../../components/Core/Controller/InputController"
import { useDialog } from "context/DialogContext"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import Axios from "axios"
import SelectMultipleChip from "../../../../components/Core/SelectMultiple/SelectMultipleChip"
import { navigate } from "gatsby"
import AutoCompleteWithData from "../../../../components/Core/Autocomplete/AutoCompleteWithData"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import SelectSimple from 'components/Core/SelectSimple/SelectSimple'
import { getDefaultCurrencyCode } from "utils/utils"	

const useStyles = makeStyles((theme) => ({
  ...styles,
  containerGrid: {
    padding: "0 5%",
  },
  containerTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    alignSelf: "flex-end",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    width: "50%",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 2, 2),
  },
}))

export default function ClaimCoverage(props) {
  const { handleRefreshGeneralData } = props
  const classes = useStyles()
  const [generalData, setGeneralData] = useState()
  const [addOrDelete, setAddOrDelete] = useState()
  const [idCobert, setIdeCobert] = useState()
  const [dataSelect, setDataSelect] = useState([])
  const [selectedCode,setSelectedCode] = useState(null);
  const [viewButton, setViewButton] = useState(false)
  const[coveragesLabel,setCoveragesLabel]=useState([])
  const[coverageLabel,setCoverageLabel]=useState()
  const[codMonedaPoliza,setCodMonedaPoliza]=useState()
  const dialog = useDialog()

  async function getClaimCoverage() {
    const params = {
      p_preadmission_id: props.preAdmissionId,
      p_complement_id: props.complementId,
    }
    const { data } = await Axios.post(`/dbo/health_claims/get_coverage_in_reserve_data`, params)
    const dataReserve = data.result[0]
    setAddOrDelete(dataReserve.AGREGAR_ELIMINAR_BENEFICIOS)
    setIdeCobert(dataReserve.IDECOBERT)
    console.log('dataReserve:', dataReserve)
    const dataGeneral = {
      "Código": { value : dataReserve.CODCOBERT, type:( dataSelect.length > 1 /*&& (props.preAdmissionType==='01' || props.preAdmissionType==='03')*/)? "select" : "label",idDesc:'N'},
      //"Código": { value : dataReserve.CODCOBERT, type:"label",idDesc:'N'},
      "Descripción": { value : dataReserve.DESCCOBERT, type: 'label',idDesc:'S'},
      "Moneda": { value : dataReserve.CODMONEDA_POLIZA, type: 'label',idDesc:'N'},
      "Suma Asegurada disponible": { value : formatAmount(dataReserve.SUMA_ASEG_DISPONIBLE_MONEDA), type: 'label',idDesc:'N'}
    }
    setCoverageLabel(dataReserve.DESCCOBERT)
    setGeneralData(Object.entries(dataGeneral))
    setSelectedCode(dataReserve.IDECOBERT)
    setCodMonedaPoliza(dataReserve.CODMONEDA_POLIZA)
  }

  useEffect(() => {
    if (props.preAdmissionId!==undefined && props.complementId!==undefined && props.diseaseId!==undefined) {
      getDataSelect()
    }
  }, [props.preAdmissionId, props.complementId, props.diseaseId, props.treatmentId])

  useEffect(() => {
    if (props.preAdmissionId!==undefined && props.complementId!==undefined && props.diseaseId!==undefined && dataSelect)
      getClaimCoverage()
  }, [props.preAdmissionId, props.complementId, props.diseaseId, props.treatmentId, dataSelect])





  async function getDataSelect(){
    const params = {
      p_preadmission_id: props.preAdmissionId,
      p_complement_id: props.complementId,
    }
    const { data } = await Axios.post(`/dbo/health_claims/get_coverages_beneficiary`, params)

    const resultArray= data.result.map(element=>{
      return {
        value: element.IDECOBERT,
        label: `${element.CODCOBERT} - ${element.DESCCOBERT}`
      }
    })

    const resultLabel= data.result.map(element=>{
      return {
        idecobert:element.IDECOBERT,
        descrip:element.DESCCOBERT
      }
    })
    setDataSelect(resultArray)
    setCoveragesLabel(resultLabel)
  }

  const handleSelectedCode = (value) => {

    if(value===''){
      setViewButton(false)
      setCoverageLabel('');
      setSelectedCode(value)
    }else{
      const labelCoverage=coveragesLabel.find(element=>element.idecobert===value)
      setCoverageLabel(labelCoverage.descrip);
      setSelectedCode(value)
      setViewButton(true)
    }
  }

  async function onSubmit(dataform, e) {
    if (selectedCode === ""){
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Información",
        description: "Debe seleccionar una cobertura",
      })
      return;
    }
    const params = {
      p_preadmission_id: props.preAdmissionId,
      p_complement_id: props.complementId,
      p_coverage_id:selectedCode,
      p_preadmission_type:props.preAdmissionType
    }
    console.log(params)
    const { data } = await Axios.post(`/dbo/health_claims/update_coverage_refund`, params)
    
    getDataSelect()
    getClaimCoverage()
    setViewButton(false);
    handleRefreshGeneralData()
    
    dialog({
      variant: "info",
      catchOnCancel: false,
      title: "Alerta",
      description: "Por favor registrar el desglose de los beneficios para completar el cambio de la suma asegurada de la cobertura.",
    })
    
  }


  return (
    <GridContainer>
      <GridItem item xs={12} sm={12} md={12} lg={12}>
        <Card>
          <CardHeader color="warning" icon={true}>
            <CardIcon color="warning">
              <Icon>rule</Icon>
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Cobertura siniestrada</h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
          {generalData && dataSelect && selectedCode !== null && generalData.map(dato => (
                  dato[1].type === 'select' ? 
                  <>
                    <GridItem key={dato} item xs={12} sm={12} md={12} lg={12}>
                      <SelectSimple
                        label={dato[0]}
                        id="1"
                        value={selectedCode} //Asignar que tome el valor por defecto
                        array={dataSelect}
                        onChange={handleSelectedCode}
                      />
                    </GridItem>
                  </>
                :
                  <>
                    <GridItem key={dato} item xs={12} sm={12} md={4} lg={4}>
                      <h6><strong>{dato[0]}:<br/></strong> {dato[1].idDesc==='S'?coverageLabel:dato[1].value}</h6>
                    </GridItem>
                  </>
              ))
              }
            </GridContainer>
            {viewButton &&
            <GridContainer justify="center">
              <Button color="success" type="button" onClick={onSubmit}>
                <Icon>send</Icon> Cambiar Cobertura
              </Button>
            </GridContainer>}
            {((addOrDelete && idCobert) || generalData)&& codMonedaPoliza &&
            <ReserveModification preAdmissionId={props.preAdmissionId} complementId={props.complementId}   preAdmissionType={props.preAdmissionType}
                                 addOrDelete={addOrDelete} idCobert={idCobert} diseaseId={props.diseaseId}
                                 treatmentId={props.treatmentId} getClaimCoverage={getClaimCoverage}
                                 handleRefreshGeneralData={handleRefreshGeneralData}
                                 codMonedaPoliza={codMonedaPoliza}/>}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>)

}

function ReserveModification(props) {
  const classes = useStyles()
  const [collapses, setCollapses] = useState()
  const dialog = useDialog()

  async function getReserveModifications() {
    setCollapses(null)
    const params = {
      p_preadmission_id: props.preAdmissionId,
      p_complement_id: props.complementId,
    }
    const { data } = await Axios.post(`/dbo/health_claims/get_reserve_modifications`, params)
    const dataReserveModification = data.result

    const collapses = dataReserveModification.map((dato, key) => {
      const first = key === 0 && "S"
      dato.FECMODLIQ = dato.FECMODLIQ.substr(0,dato.FECMODLIQ.length -5)
      return ({
        title: `${dato.DESCRIPCION_RESERVA === null ? "" : dato.DESCRIPCION_RESERVA + ":"} ${dato.NUMMODLIQ}`,
        content: (tabModification(dato, first, props.codMonedaPoliza)),
      })
    })
    setCollapses(collapses)
  }

  async function addReserveAsCopyFromLast() {
    const params = {
      p_preadmission_id: props.preAdmissionId,
      p_complement_id: props.complementId,
    }
    const { data } = await Axios.post(`/dbo/health_claims/add_reserve_as_copy_from_last`, params)
    dialog({
      variant: "info",
      catchOnCancel: false,
      title: "Éxito",
      description: "La modificación se creó exitosamente",
    })

    props.getClaimCoverage()

  }

  function handleReserve() {
    addReserveAsCopyFromLast()
  }
 function updateClaimCoverage() {
    props.getClaimCoverage()
   getReserveModifications()
  }

  useEffect(() => {
    getReserveModifications()

  }, [props.preAdmissionId, props.complementId, props.diseaseId, props.treatmentId,props.idCobert])


  return (
    <GridContainer>
      <GridItem item xs={12} sm={12} md={12} lg={12}>
        <Card>
          <CardHeader color="success" icon={true}>
            <CardIcon color="success">
              <Icon>calculate</Icon>
            </CardIcon>
            <div className={classes.containerTitle}>
              <h4 className={classes.cardIconTitle}>Modificaciones de reserva</h4>
              <Tooltip title="Agregar modificación de reserva" placement="right-start" arrow
                       className={classes.buttonContainer}>
                <IconButton onClick={() => handleReserve()}>
                  <Icon style={{ fontSize: 24, color: "green" }}>add_circle</Icon>
                </IconButton>
              </Tooltip>
            </div>
          </CardHeader>
          <CardBody>
            {collapses && <Accordion active={0} collapses={collapses}/>}

          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>)

  function tabModification(dato, first, codMonedaPoliza) {
    return (
      <><GridContainer>
        <GridItem xs={12} sm={12} md={3} lg={3}>
          <h6><strong>Fecha:<br/></strong> {getddMMYYYDate(new Date(dato.FECMODLIQ))}</h6>
        </GridItem>
        <GridItem xs={12} sm={12} md={3} lg={3}>
          <h6><strong>Estatus:<br/></strong> {dato.STSMODLIQ}</h6>
        </GridItem>
        <GridItem xs={12} sm={12} md={3} lg={3}>
          <h6><strong>Monto facturado:<br/></strong> {formatAmount(dato.MTOFACTLIQMONEDA)}</h6>
        </GridItem>
        <GridItem xs={12} sm={12} md={3} lg={3}>
          <h6><strong>Monto indemnizado:<br/></strong> {formatAmount(dato.MTOINDELIQMONEDA)}</h6>
        </GridItem>
        <GridItem xs={12} sm={12} md={3} lg={3}>
          <h6><strong>Monto deducible:<br/></strong> {formatAmount(dato.MTODEDULIQMONEDA)}</h6>
        </GridItem>
        <GridItem xs={12} sm={12} md={3} lg={3}>
          <h6><strong>Monto razón:<br/></strong> {formatAmount(dato.MTORAZOLIQMONEDA)}</h6>
        </GridItem>
      </GridContainer>
        <Benefits preAdmissionId={props.preAdmissionId} complementId={props.complementId} preAdmissionType={props.preAdmissionType} first={first}
                  addOrDelete={props.addOrDelete} idCobert={props.idCobert} reserveModificationId={dato.NUMMODLIQ}
                  diseaseId={props.diseaseId} treatmentId={props.treatmentId}
                  getClaimCoverage={updateClaimCoverage}
                  handleRefreshGeneralData={props.handleRefreshGeneralData}
                  codMonedaPoliza={codMonedaPoliza}
                  />
      </>
    )
  }


}

function Benefits(props) {
  const classes = useStyles()
  const { handleSubmit, ...objForm } = useForm()
  const [viewAddBenefits, setViewAddBenefits] = useState(false)
  const [generalDataUpdate, setGeneralDataUpdate] = useState()
  const { first, addOrDelete, reserveModificationId, idCobert, handleRefreshGeneralData } = props
  const dialog = useDialog()

  function handleNotes() {
    if (addOrDelete === "N") {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "Usted no puede agregar beneficios porque el tratamiento tiene baremo",
      })
    } else {
      setViewAddBenefits(true)
    }
  }

  function handleClose() {
    setViewAddBenefits(false)
  }

  function onGenerate(dataform) {
   if(checkValidAmount(generalDataUpdate))
    modify_service_breakdown()
    else
     dialog({
       variant: "info",
       catchOnCancel: false,
       title: "Información",
       description: "El monto no amparado no puede ser mayor al monto facturado",
     })
  }

  function handleGeneralDataUpdate(data) {
    setGeneralDataUpdate(data)
  }

  async function modify_service_breakdown() {
    const params = {
      p_string_json_breakdown_items: JSON.stringify(generalDataUpdate),
    }

    const { data } = await Axios.post(`/dbo/health_claims/modify_service_breakdown`, params)
    dialog({
      variant: "info",
      catchOnCancel: false,
      resolve: () => handleClose(),
      title: "Información",
      description: "Los beneficios se ajustaron exitosamente",
    })
    handleRefreshGeneralData()
    props.getClaimCoverage()
  }

  const checkValidAmount = (dataArray) => {
    let flagValue = true;
    if(dataArray.some(element => element.indseleccionado === 'S')){
      dataArray.forEach(element => {
        const difCurrency = parseFloat(element.diferenciamoneda);
        const factCurrency = parseFloat(element.mtofactmoneda);
        if(difCurrency > factCurrency){
          flagValue = false;
        }
      })
    }else{
      flagValue = true;
    }
    return flagValue;
  }


  return (
    <>
      {viewAddBenefits && <AddBenefits preAdmissionId={props.preAdmissionId} complementId={props.complementId}
                                       reserveModificationId={reserveModificationId} idCobert={idCobert}
                                       handleClose={handleClose} getClaimCoverage={props.getClaimCoverage}/>}
      <GridContainer>
        <Card>
          <CardHeader color="primary" icon={true}>
            <CardIcon color="primary">
              <Icon>equalizer</Icon>
            </CardIcon>
            <div className={classes.containerTitle}>
              <h4 className={classes.cardIconTitle}>Desglose de beneficios</h4>
              {first === "S" &&
              <Tooltip title="Agregar beneficio" placement="right-start" arrow className={classes.buttonContainer}>
                <IconButton onClick={() => handleNotes()}>
                  <Icon style={{ fontSize: 24, color: "green" }}>add_circle</Icon>
                </IconButton>
              </Tooltip>}
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onGenerate)} noValidate autoComplete="off">
              <BreakdownCoverages objForm={objForm} first={first} addOrDelete={addOrDelete}
                                  preAdmissionId={props.preAdmissionId} complementId={props.complementId} preAdmissionType={props.preAdmissionType}
                                  reserveModificationId={reserveModificationId} idCobert={idCobert}
                                  setGeneralDataUpdate={handleGeneralDataUpdate} generalDataUpdate={generalDataUpdate}
                                  diseaseId={props.diseaseId} treatmentId={props.treatmentId}
                                  codMonedaPoliza={props.codMonedaPoliza}/>
              {first === "S" && <GridContainer justify={"center"}>
                <Button color="success" type="submit">
                  <Icon>send</Icon> Ajustar
                </Button>
              </GridContainer>}
            </form>
          </CardBody>
        </Card>
      </GridContainer>
    </>
  )


}

function BreakdownCoverages(props) {
  const classes = useStyles()
  const [generalData, setGeneralData] = useState()
  const [selectData, setSelectData] = useState(null)
  const { objForm, first, addOrDelete, reserveModificationId, idCobert, setGeneralDataUpdate, generalDataUpdate } = props
  const [viewConfirm, setViewConfirm] = useState(false)
  const dialog = useDialog()
  const [currency,setCurrency] = useState('')

  async function getCoverageInReservDetails() {
    const params = {
      p_preadmission_id: props.preAdmissionId,
      p_complement_id: props.complementId,
      p_reserve_modification_id: reserveModificationId,
      p_coverage_id: idCobert,
    }
    const { data } = await Axios.post(`/dbo/health_claims/get_coverage_in_reserv_details`, params)
    const dataCoverageInReservDetails = data.result
    const arrayBenefits = dataCoverageInReservDetails.map((fila) => {
      return {
        idepreadmin: props.preAdmissionId,
        numliquid: props.complementId,
        nummodliq: reserveModificationId,
        idecobert: idCobert,
        codbenfcio: fila.CODBENFCIO,
        veces_benfcio: fila.VECESBENFCIO,
        codmoneda_factura: fila.CODMONEDA_FACTURA,
        mtofactmoneda: formatAmount(fila.MTOFACTMONEDA).replace(/\./g, "").replace(/\,/g, "."),
        diferenciamoneda: formatAmount(fila.DIFERENCIAMONEDA).replace(/\./g, "").replace(/\,/g, "."),
        diferencia: formatAmount(fila.DIFERENCIA).replace(/\./g, "").replace(/\,/g, "."),
        indseleccionado: "N",
      }

    })
    setGeneralDataUpdate(arrayBenefits)
    setGeneralData(dataCoverageInReservDetails)
  }

  useEffect(() => {
    getCoverageInReservDetails()
    getDefaultCurrencyCode('03').then(result => setCurrency(result))
    
  }, [props.diseaseId, props.treatmentId])

  function handleCLickIcon(dato) {
    if (addOrDelete === "N") {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "Usted no puede eliminar beneficios porque el tratamiento tiene baremo",
      })
    } else {
      setSelectData(dato)
      setViewConfirm(true)
    }

  }

  async function delete_item_in_breakdown(pCodBenefit) {
    const params = {
      p_preadmission_id: props.preAdmissionId,
      p_complement_id: props.complementId,
      p_reserve_modification_id: reserveModificationId,
      p_coverage_id: idCobert,
      p_item_code: pCodBenefit
    }
    const { data } = await Axios.post(`/dbo/health_claims/delete_item_in_breakdown`, params)
    dialog({
      variant: "info",
      catchOnCancel: false,
      resolve: () =>getCoverageInReservDetails(),
      title: "Información",
      description: "El beneficio se eliminó exitosamente"
    })

  }


  function handleConfirm(e){
    setViewConfirm(false)
    if(e){
      const arrayBenefitsUpdate = generalDataUpdate.filter(fila => fila.codbenfcio !== selectData.codBenefits)
      const arrayBenefits = generalData.filter(fila => fila.CODBENFCIO !== selectData.codBenefits)
      setGeneralDataUpdate(arrayBenefitsUpdate)
      setGeneralData(arrayBenefits)
      delete_item_in_breakdown(selectData.codBenefits);
    }

  }

  function Confirm(props) {
    const { handleConfirm, title, textYes, textNo, text } = props
    return (
      <Dialog open={true}>
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="success" size={"sm"} onClick={() => handleConfirm(true)}>
            {textYes}
          </Button>
          <Button color="primary" size={"sm"} onClick={() => handleConfirm(false)}>
            {textNo}
          </Button>
        </DialogActions>
      </Dialog>)

  }


  function handleAmount(event, data) {
    var newMtoFact = event[0].currentTarget.value
    if (newMtoFact === "")
      return
      const arrayBenefits = generalDataUpdate.map((fila) => {
        if (fila.codbenfcio === data.CODBENFCIO) {
          return {
            ...fila,
            mtofactmoneda: newMtoFact.toString().replace(/\./g, "").replace(/\,/g, "."),
            indseleccionado: "S",
          }
        }else{
          return fila
        }
      })
      setGeneralDataUpdate(arrayBenefits)


  }
  function handleAmountDif(event, data) {
    var newMtoFact = event[0].currentTarget.value
    if (newMtoFact === "")
      return
      const arrayBenefits = generalDataUpdate.map((fila) => {
        if (fila.codbenfcio === data.CODBENFCIO) {
          return {
            ...fila,
            diferencia: newMtoFact.toString().replace(/\./g, "").replace(/\,/g, "."),
            indseleccionado: "S",
          }
        }else{
          return fila
        }
      })
      setGeneralDataUpdate(arrayBenefits)


  }

  function handleBenefits(event, data) {
    var oldBenefit = data.VECESBENFCIO
    var newBenefit = event[0].currentTarget.value
    if (newBenefit === "")
      return
    if (oldBenefit !== newBenefit) {
      const arrayBenefits = generalDataUpdate.map((fila) => {
        if (fila.codbenfcio === data.CODBENFCIO) {
          return {
            ...fila,
            veces_benfcio: parseInt(newBenefit),
            indseleccionado: "S",
          }
        }else{
          return fila
        }

      })
      setGeneralDataUpdate(arrayBenefits)
    }

  }

  function handleSelect(value, data) {
    var oldCurrency = data.CODMONEDA_FACTURA
    var newCurrency = value
    if (newCurrency === "")
      return
    if (oldCurrency !== newCurrency) {
      const arrayBenefits = generalDataUpdate.map((fila) => {
        if (fila.codbenfcio === data.CODBENFCIO) {
          return {
            ...fila,
            codmoneda_factura: newCurrency,
            indseleccionado: "S",
          }
        }else{
          return fila
        }

      })
      setGeneralDataUpdate(arrayBenefits)
    }
  }


  return (

    <>
      {viewConfirm && <Confirm handleConfirm={handleConfirm} title={"Borrar beneficio"} textYes={"Si"} textNo={"No"}
                               text={"¿Está seguro que desea eliminar este beneficio?"}/>}
      {
        generalData && generalData.map((dato, key) => {
          return (
            <AccordionComparePanel id={key} key={key} title={dato.DESCBENFCIO} icon={first === "S"}
                                   defaultExpanded={first === "S" && key === 0}
                                   params={{ codBenefits: dato.CODBENFCIO }} handleClickIcon={handleCLickIcon}>
              <GridContainer justify='center' className={classes.containerGrid}>
                <GridItem md={2}>
                  {first === "S" ?
                    <InputController onBlur={(event) => handleBenefits(event, dato)} rules={{ maxLength: 2 }}
                                     defaultValue={dato.VECESBENFCIO} objForm={objForm}
                                     label="Veces" name={`p_veces`} inputProps={{ type: "number" }}/> :
                    <h6><strong>Veces:<br/></strong> {dato.VECESBENFCIO}</h6>
                  }
                </GridItem>
                <GridItem md={4}>
                  {first === "S" ?
                    <>
                      {currency&&<SelectSimpleController onChange={(value) => handleSelect(value, dato)}
                                              defaultValue={(props.codMonedaPoliza==currency)?currency:dato.CODMONEDA_FACTURA} objForm={objForm}
                                              label="Moneda factura" name={`p_moneda_factura`}
                                              array={currencyValues}
                                              disabled={(props.codMonedaPoliza==currency)?true:false}/>
                      }
                    </> :
                    <h6><strong>Moneda factura:<br/></strong> {dato.CODMONEDA_FACTURA}</h6>
                  }


                </GridItem>
                <GridItem md={3}>
                  {first === "S" ?
                    <AmountFormatInputController onBlur={(value) => handleAmount(value, dato)}
                                                 defaultValue={dato.MTOFACTMONEDA}
                                                 objForm={objForm}
                                                 label="Monto factura" name={`p_monto_factura`}/> :
                    <h6><strong>Monto factura:<br/></strong> {formatAmount(dato.MTOFACTMONEDA)}</h6>
                  }
                  </GridItem>
                  <GridItem md={3}>
                  <AmountFormatInputController onBlur={(value) => handleAmountDif(value, dato)}
                                                 objForm={objForm}                                                 
                                                 label="Monto no amparado" name={`p_monto_no_amparado`}/>
                  {/* defaultValue={dato.DIFERENCIA}
                  
                  (first === "S")  ?
                     :
                    <h6><strong>Monto no amparado:<br/></strong> {formatAmount(dato.DIFERENCIAMONEDA)}</h6>
                  */}

                </GridItem>
              </GridContainer>
              <GridContainer>
              <br/><br/><br/>
                <GridItem xs={6} sm={6} md={2} lg={2}>
                  <h6><strong>Moneda Póliza:<br/></strong> {dato.CODMONEDA_POLIZA}</h6>
                </GridItem>
                <GridItem xs={6} sm={6} md={2} lg={2}>
                  <h6><strong>Monto baremo:<br/></strong> {formatAmount(dato.MTOBARBENFCIOMONEDA)} {dato.CODMONEDA_POLIZA}</h6>
                </GridItem>
                <GridItem xs={6} sm={6} md={2} lg={2}>
                  <h6><strong>Monto facturado:<br/></strong> {formatAmount(dato.MTOFACTBENFCIOMONEDA)} {dato.CODMONEDA_POLIZA}</h6>
                </GridItem>
                <GridItem xs={6} sm={6} md={2} lg={2}>
                  <h6><strong>Monto indemnizado:<br/></strong> {formatAmount(dato.MTOINDEMBENFCIOMONEDA)} {dato.CODMONEDA_POLIZA}</h6>
                </GridItem>
                <GridItem xs={6} sm={6} md={2} lg={4}>
                <h6><strong>Monto no amparado:<br/></strong> {formatAmount(dato.DIFERENCIAMONEDA)} {dato.CODMONEDA_POLIZA}</h6> 
                  
                </GridItem>
                </GridContainer>
                <GridContainer>
                <GridItem xs={12} sm={12} md={4} lg={4}>
                  <h6><strong>Monto presupuesto:<br/></strong> {formatAmount(dato.MTOPRESUPINIBENFCIOMONEDA)} {dato.CODMONEDA_POLIZA}</h6>
                </GridItem>
              </GridContainer>
            </AccordionComparePanel>)
        })
      }
    </>
  )
}

function AddBenefits(props) {
  const { register, handleSubmit, errors, control, ...objForm } = useForm()
  const classes = useStyles()
  const { preAdmissionId, complementId, reserveModificationId, idCobert, handleClose } = props
  const dialog = useDialog()
  const [optionsBenefits, setOptionsBenefits] = useState([])

  async function get_avail_serv_breakdown_items() {
    const params = {
      p_preadmission_id: preAdmissionId,
      p_complement_id: complementId,
      p_reserve_modification_id: reserveModificationId,
      p_coverage_id: idCobert,
    }
    const { data } = await Axios.post(`/dbo/health_claims/get_avail_serv_breakdown_items`, params)
    const arrayTreatments = data.result.map((fila) => {
      return {
        VALUE: fila.CODBENFCIO,
        NAME: fila.DESCBENFCIO,
      }

    })
    setOptionsBenefits(arrayTreatments)
  }

  async function add_service_breakdown(aBenefits) {
    const params = {
      p_string_json_breakdown_items: JSON.stringify(aBenefits),
    }

    const { data } = await Axios.post(`/dbo/health_claims/add_service_breakdown`, params)
    dialog({
      variant: "info",
      catchOnCancel: false,
      resolve: () => handleClose(),
      title: "Información",
      description: "Los beneficios se agregaron exitosamente",
    })

    props.getClaimCoverage()


  }

  async function onSubmit(dataform, e) {
    e.preventDefault()
    try {
      if (dataform.p_benefits === undefined || dataform.p_benefits.length === 0) {
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Error",
          description: "Debe seleccionar al menos un beneficio",
        })
        return
      }

      const arrayBenefits = dataform.p_benefits.map((fila) => {
        return {
          idepreadmin: preAdmissionId,
          numliquid: complementId,
          nummodliq: reserveModificationId,
          idecobert: idCobert,
          codbenfcio: fila.VALUE,
          veces_benfcio: "",
          codmoneda_factura: "",
          mtofactmoneda: "",
          indseleccionado: "",
          diferencia:""
        }

      })
      add_service_breakdown(arrayBenefits)

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {

    get_avail_serv_breakdown_items()

  }, [])

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
        <h4>Agregar beneficios</h4>
        <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          <GridContainer justify='center'>
            <GridItem xs={12} md={12} sm={12} xl={12}>
              <Controller
                multiple
                label="Beneficios"
                options={optionsBenefits}
                as={AutoCompleteWithData}
                noOptionsText="Escriba para seleccionar el beneficio"
                name="p_benefits"
                control={control}
                fullWidth
                onChange={([e, value]) => {
                  console.log(value)
                  return value ? value : null
                }
                }
              />
            </GridItem>
            <Button color="success" type="submit" style={{ marginTop: 50 }}>
              <Icon>send</Icon> Aceptar
            </Button>
          </GridContainer>
        </form>
      </div>
    </Fade>
  </Modal>)

}




