import React, { useEffect, useState } from "react"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import CardPanel from 'components/Core/Card/CardPanel'
import TextField from '@material-ui/core/TextField';
import { useDialog } from "context/DialogContext"
import Axios from "axios"
import Icon from "@material-ui/core/Icon"
import { Controller, useForm } from "react-hook-form"
import AutoCompleteWithData from "../../../components/Core/Autocomplete/AutoCompleteWithData"
import ServiceWfDetail from "../Workflow/ServiceWfDetail"
import { getProfile } from 'utils/auth'


export default function RequestDocuments(props) {
  const { workflow_id, program_id } = props
  const { handleSubmit, errors, control} = useForm()
  const [documents, setDocuments] = useState([])
  const [paramsPro, setParamsPro] = useState()
  const [apiForAddReqs, setApiForAddReqs] = useState()
  const [idepreadmin, setIdepreadmin] = useState()
  const [numliquid, setNumliquid] = useState()
  const dialog = useDialog()


  function getUrlApis() {
    let programsActionsHealthClaims = ['11', '347', '351', '349', '329', '330', '426', '441','458'];
    let programActionFinancialGuarantee = '421'
    let urlApis
    if (programsActionsHealthClaims.indexOf(program_id) > -1) {
      urlApis = {
        apiForGetReqs : '/dbo/health_claims/get_available_requirements',
        apiForAddReqs : '/dbo/health_claims/add_selected_requirements'
      }
    } else if (program_id === programActionFinancialGuarantee) {
      urlApis = {
        apiForGetReqs : '/dbo/financial_guarantee/get_available_requirements',
        apiForAddReqs : '/dbo/financial_guarantee/add_selected_requirements'
      }
      
    }
    else {
      dialog({
        variant: "info",
        catchOnCancel: false,
        resolve: () => handleReturn(),
        title: "Error",
        description: "No existe configuración de documentos para este servicio",
      })
    }
    return urlApis
  }
  async function getAvailableRequirements(apiForGetReqs, paramsPro) {
    const params = paramsPro
    const { data } = await Axios.post(apiForGetReqs, params)
    const arrayDocuments = data.result.map((fila) => {
      return {
        VALUE: fila.CODREQ,
        NAME: fila.DESCREQ,
      }

    })
    setDocuments(arrayDocuments)
  }

  const getValues = async () => {
    var rest = await Axios.post('/dbo/workflow/get_workflows_values', {
      p_workflow_id: workflow_id,
      p_column_name: "idepreadmin",
      p_column_type: "char"
    })
    setIdepreadmin(rest.data.result)
    rest = await Axios.post('/dbo/workflow/get_workflows_values', {
      p_workflow_id: workflow_id,
      p_column_name: "numliquid",
      p_column_type: "char"
    })
    setNumliquid(rest.data.result)
  }

  async function add_selected_requirements(p_Requirements) {
    const params = {
      ...paramsPro,
      p_string_json_requirements: JSON.stringify(p_Requirements),
    }
    const { data } = await Axios.post(apiForAddReqs, params)
    dialog({
      variant: "info",
      catchOnCancel: false,
      resolve: () => handleReturn(),
      title: "Información",
      description: "Los recaudos han sido solicitado exitosamente",
    })
  }

  async function getParams() {
    const params = { p_workflow_id: workflow_id, p_program_id: program_id }
    const response = await Axios.post('/dbo/workflow/program_to_clob', params)
    const jsonResult = response.data.result
    const paramPro = jsonResult.program_actions[0].parameters[0]
    const urlApis = getUrlApis()
    console.log(urlApis)
    if (urlApis) {      
      getAvailableRequirements(urlApis.apiForGetReqs, paramPro)
      setParamsPro(paramPro)
      setApiForAddReqs(urlApis.apiForAddReqs)
    }
  }

  useEffect(() => {
    getParams()
    getValues()
  }, [])



  function handleReturn() {
    window.history.back()
  }

  async function onSubmit(dataform, e) {
    e.preventDefault()
    try {
      if (dataform.p_documents === undefined || dataform.p_documents.length === 0) {
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Error",
          description: "Debe seleccionar al menos un documento",
        })
        return
      }

      const arrayDocuments = dataform.p_documents.map((fila) => {
        return fila.VALUE

      })
      await add_selected_requirements(arrayDocuments)
      const user = await getProfile()
      const params2 = {
        npnumliquid:numliquid,
        npidepreadmin:idepreadmin,
        cpobservacion : dataform.p_observation,
        cpcodciaseg : process.env.GATSBY_INSURANCE_COMPANY === 'OCEANICA'?"02":"01",
        cpUsrWeb : user.PORTAL_USERNAME,
        cpPerfilWeb : user.PROFILE_CODE,
        cpStsObs: 'LPZ'
      }
      console.log("params2: ", params2)
      await Axios.post('/dbo/health_claims/save_obs_lpas', params2)

    } catch (error) {
      console.error(error)
    }
  }


  return (<>
    <GridContainer>
      <GridItem xs={12} sm={12} md={4} lg={4}>
        <ServiceWfDetail id={workflow_id} />
      </GridItem>
      <GridItem xs={12} sm={12} md={8} lg={8}>
        <CardPanel titulo="Solicitud de recaudos" icon="library_books" iconColor="primary">
          <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
            <GridContainer justify='center'>
              <GridItem xs={12} md={12} sm={12} xl={12}>
                <Controller
                  multiple
                  label="Documentos"
                  options={documents}
                  as={AutoCompleteWithData}
                  noOptionsText="Escriba para seleccionar el documentos"
                  name="p_documents"
                  control={control}
                  fullWidth
                  onChange={([e, value]) => {
                    return value ? value : null
                  }
                  }
                />
              </GridItem>
              <GridItem xs={12} md={12} sm={12} xl={12}>
                <Controller
                  label="Observacion"
                  as={TextField}
                  fullWidth
                  multiline
                  rows="4"
                  name="p_observation"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  helperText={errors.p_mensaje && "Debe escribir un mensaje"}
                />
              </GridItem>
              <Button color="success" type="submit" style={{ marginTop: 50 }}>
                <Icon>send</Icon> Solicitar
                </Button>
            </GridContainer>
          </form>
        </CardPanel>


        <GridContainer justify="center">
          <Button color="secondary" onClick={handleReturn}>
            <Icon>fast_rewind</Icon> Ir al Caso
          </Button>
        </GridContainer>
      </GridItem>
    </GridContainer>
  </>)


}













