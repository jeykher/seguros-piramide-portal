import React, { Fragment, useState } from "react"
import DriverForm from "./DriverForm"
import PlaceForm from "./PlaceForm"
import { useForm } from "react-hook-form"
import Icon from "@material-ui/core/Icon"
import Button from "../../../../components/material-kit-pro-react/components/CustomButtons/Button"
import Card from "components/material-dashboard-pro-react/components/Card/Card"
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import styles from "components/Core/Card/cardPanelStyle"
import Axios from "axios"
import { makeStyles } from "@material-ui/core/styles"
import CauseForm from "./CauseForm"
import { useDialog } from "context/DialogContext"
import { cardTitle } from "../../../../components/material-kit-pro-react/material-kit-pro-react"
import CardPanel from "../../../../components/Core/Card/CardPanel"
import Switch from "@material-ui/core/Switch/Switch"
import GridContainer from "../../../../components/material-dashboard-pro-react/components/Grid/GridContainer"
import GridItem from "../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import SelectSimpleController from "../../../../components/Core/Controller/SelectSimpleController"
import { getAgeFromDDMMYYYYDate, indentificationTypeNaturalMayor } from "../../../../utils/utils"
import IdentificationController from "../../../../components/Core/Controller/IdentificationController"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import {navigate} from 'gatsby'


const useStyles = makeStyles((theme) => ({
  styles,
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  cardTitle,
  textCenter: {
    textAlign: "center",
  },
}))

export default function ClaimViewForms(props) {
  const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
  const { identification, index} = props
  const { handleSubmit, ...objForm } = useForm()
  const [showForm, setShowForm] = useState(false)
  const [questions, setQuestions] = useState([])
  const [parts, setParts] = useState([])
  const [driverInsured, setDriverInsured] = useState(true)
  const [identificationType, setIdentificationType] = useState("")
  const [identificationNumber, setIdentificationNumber] = useState("")
  const [openAgree, setOpenAgree] = useState(false)
  const [declarationParams, setDeclarationParams] = useState([])
  const dialog = useDialog()
  function handleIndetificationType(value){
    setIdentificationType(value)
  }
  function handleIndetificationNumber(val){
    setIdentificationNumber(val)
  }
  function dataDriver() {
    if(identificationType!=='' && identificationNumber!==''){
      getDataDriver(identificationType,identificationNumber)
    }
  }

  function handleSi() {
    setDriverInsured(true)
    setShowForm(false)
  }

  function handleNo() {
    setDriverInsured(false)
    objForm.reset({});
    setShowForm(true)
  }

  async function onGenerate(dataform) {

    if(parts.length>0)
     if(!parts.some(elem => elem.INDSEL === 'S')){
       dialog({
         variant: "info",
         catchOnCancel: false,
         title: "Alerta",
         description: "Debe seleccionar al menos una pieza para el tipo de siniestro",
       })
       return
     }





    //console.log(JSON.stringify(dataform));
    try {
      const dataClaim={
        "fecocurr":dataform.p_fecha_siniestro_CLAIM,
        "danos_sin_prop":dataform.p_danos_sin_CLAIM,
        "relatosin" :dataform.p_descripcion_sin_CLAIM ,
        "lugarsin" : dataform.p_direccion_CLAIM+ ' '+dataform.p_referencia_CLAIM,
        "codestado" : dataform.p_state_id_CLAIM,
        "codciudad" : dataform.p_city_id_CLAIM,
        "codmunicipio" :dataform.p_municipality_id_CLAIM,
        "numidcond" : driverInsured?identification.NumId:dataform.p_identification_number_CLAIM,
        "telefcond" : driverInsured?identification.Phone:dataform.p_telefono_CLAIM,
        "emailcond" : driverInsured?identification.Email:dataform.p_email_CLAIM,
        "nomapelcond" : driverInsured?identification.Propietario:dataform.p_nombre_CLAIM+' '+dataform.p_apellido_CLAIM,
        "edadcond" : (driverInsured&&identification.Edad)?identification.Edad:getAgeFromDDMMYYYYDate(dataform.p_fecnac_CLAIM),
        "sexocond" : driverInsured?identification.Sexo:dataform.p_sexo_CLAIM,
        "causa_sin" : dataform.p_causa_CLAIM

      }
      const dataWorkShop={
        "localidad_taller":dataform.p_localidad_WORKSHOP,
        "codigo_taller":dataform.p_taller_WORKSHOP,
        'nombre_taller':dataform.p_nombre_taller_WORKSHOP,
        'nombre_contacto_taller':dataform.p_nombre_contacto_WORKSHOP,
        'telefono_taller':dataform.p_telefono_WORKSHOP,
        'movil_taller':dataform.p_movil_WORKSHOP,
        'estado_taller':dataform.p_state_id_WORKSHOP,
        'ciudad_taller':dataform.p_city_id_WORKSHOP,
        'municipio_taller':dataform.p_municipality_id_WORKSHOP,
        'direccion_taller':dataform.p_direccion_taller_WORKSHOP,
        'referencia_taller':dataform.p_referencia_taller_WORKSHOP
      }
      const params = {
        p_idepol: identification.Idepol,
        p_numcert: identification.Numcert,
        p_statement_info:JSON.stringify(dataClaim),
        p_statement_parts:JSON.stringify(parts),
        p_statement_questions:JSON.stringify(questions),
        p_automotive_workshop:JSON.stringify(dataWorkShop)
      }
      //console.log(JSON.stringify(params));
      setDeclarationParams(params);
      setOpenAgree(true);
    } catch (error) {
      console.error(error)
    }
  }

  const classes = useStyles()
  async function getDataDriver(type, number) {
    setShowForm(false)
    try {
      const params = {
        p_identification_type: type,
        p_identification_number: number,
      }
      const response = await Axios.post(`/dbo/auto_claims/get_driver_statement_card`, params)
      if (response.data.result!==null) {
        setConductorForm(response.data.result)

      }else{
        objForm.reset({});
        setShowForm(true)
      }
    } catch(error) {
      console.log(error)

    }

  }
  async function set_statement() {
    try {
      const response = await Axios.post(`/dbo/auto_claims/set_statement`, declarationParams)
      navigate(`/app/asegurado/declaracion_siniestros/declaration/${response.data.result.numdecla}/${response.data.result.workflowId}/${response.data.result.status}/${response.data.result.daysdecla}`);
    } catch(error) {
      console.log(error)

    }

  }

  function setConductorForm(driver) {
    setShowForm(false)
    objForm.reset({
      [`p_nombre_${index}`]: driver.Nomter,
      [`p_apellido_${index}`]: driver.Apeter,
      [`p_fecnac_${index}`]: driver.Fecnac,
      [`p_sexo_${index}`]: driver.Sexo,
      [`p_email_${index}`]: driver.Email,
      [`p_telefono_${index}`]: driver.Codarea3 + driver.Telef3,
    })
    setShowForm(true)

  }

  function updateQuestions(questions) {
    setQuestions(questions)
  }

  function updatesParts(parts) {
    setParts(parts)
  }
  function handleDelaration(v) {
    setOpenAgree(false);
    if(v)
      set_statement()

  }


  return (
    <Fragment>
      {openAgree && <Agree handleDelaration={handleDelaration}/>}
      <Card>
        <CardHeader color={insuranceCompany==="PIRAMIDE"?"warning":"primary"} className="text-center">
          <h5>INFORMACIÓN DEL SINIESTRO</h5>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onGenerate)} noValidate autoComplete="off" className={classes.root}>
            <>
              <CardPanel titulo="Datos del Conductor" icon="airline_seat_recline_normal" iconColor="primary">
                <GridContainer>
                  <InsuredDriver si={handleSi} no={handleNo} identification={identification}/>
                  <GridItem className="flex-col-scroll" item xs={12} sm={12} md={12} lg={12}>

                  {!driverInsured &&
                  <>
                  <SelectSimpleController onChange={(e) => handleIndetificationType(e)} objForm={objForm} label="Tipo de identificación" name={`p_identification_type_${index}`} array={indentificationTypeNaturalMayor} />
                  <IdentificationController onBlur={(e) =>dataDriver(e)}  onChange={(e) =>handleIndetificationNumber(e)} objForm={objForm} label="Número de identificación" index={index}/>
                  </>}
                  {showForm && <DriverForm objForm={objForm} index={index}/>}
                  </GridItem>
                </GridContainer>
              </CardPanel>
              <CardPanel titulo="Fecha y Lugar de Ocurrencia" icon="place" iconColor="warning">
                <PlaceForm objForm={objForm} index={index}/>
              </CardPanel>
              <CauseForm objForm={objForm} identification={identification}  index={index}
                         updatesQuestions={updateQuestions} updatesParts={updatesParts}/>
              <GridContainer className={classes.textCenter}>
                <GridItem className="text-center flex-col-scroll" item xs={12} sm={12} md={12} lg={12}>
                  <Button color="primary" type="submit">
                    <Icon>description</Icon> Declarar
                  </Button>
                </GridItem>
              </GridContainer>
            </>
          </form>
        </CardBody>
      </Card>
    </Fragment>)
}


export function InsuredDriver({ si, no, identification }) {
  const [sDriver, setSDriver] = useState(true)
  const classes = useStyles()

  const handleChange = (event) => {
    setSDriver(event.target.checked)
    if (event.target.checked)
      handleSi()
    else
      handleNo()

  }

  function handleSi() {
    si()

  }

  function handleNo() {
    no()
  }


  return (<GridContainer spacing={0} className="text-center">
      <GridItem>¿{identification.Propietario} conducía el vehículo al momento del siniestro?</GridItem>
      <GridItem>
        No
        <Switch size="small" checked={sDriver} onChange={event => handleChange(event)}
                name="chkdriver"
                color="secondary"
        />
        Si
      </GridItem>
    </GridContainer>
  )
}

function Agree(props){
  const {handleDelaration} = props
  function handleAgree(v) {
    handleDelaration(v);
  };
  return(
    <Dialog open={true}>
    <DialogTitle id="alert-dialog-title">Acuerdo</DialogTitle>
    <DialogContent>
      <DialogContentText>
        ¿Está de acuerdo con la declaración?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button color="success" size={"sm"} onClick={() => handleAgree(true)} autoFocus>
        Si
      </Button>
      <Button color="primary" size={"sm"} onClick={() => handleAgree(false)} autoFocus>
        No
      </Button>
    </DialogActions>
  </Dialog>)

}