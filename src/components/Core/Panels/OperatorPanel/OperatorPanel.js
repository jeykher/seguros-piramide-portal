import React, { useState, useEffect } from "react"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import TabAreas from "./TabsAreas"
import Axios from "axios"
import { makeStyles } from "@material-ui/core/styles"
import ReasonDialog from "./Dialogs/ReasonDialog"
import { format } from "date-fns"
import { useDialog } from "context/DialogContext"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import SearchIcon from "@material-ui/icons/Search"
import Switch from "components/Core/Switch/Switch"
import IdentificationController from "components/Core/Controller/IdentificationController"
import DateMaterialPickerController from "components/Core/Controller/DateMaterialPickerController"
import NumberController from "components/Core/Controller/NumberController"
import SelectSimpleController from "components/Core/Controller/SelectSimpleController"
import { useForm } from "react-hook-form"
import AdvisorController from "components/Core/Controller/AdvisorController"
import ContractingController from "components/Core/Controller/ContractingController"
import ProvidersController from "components/Core/Controller/ProvidersController"

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  containerSwitchers: {
    display: "flex",
    justifyContent: "flex-end",
    justifyItems: "center",
  },
  containerSwitch: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    margin: "0 1.5em",
  },
  containerInputs: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1em",
  },
  containerFilters: {
    marginBottom: "1.75em",
  },
}))

const dateFormat = "dd/MM/yyyy"
const date = new Date()
const dateEnd = format(new Date(), dateFormat)
const dateStart = format(
  new Date(date.setMonth(date.getMonth() - 1)),
  dateFormat
)

const OperatorPanel = () => {
  const [allProcesses, setAllProcesses] = useState([])
  const [statusPause, setStatusPause] = useState(false)
  const [openReasonDialog, setOpenReasonDialog] = useState(false)
  const [brokerSelected, setBrokerSelected] = useState(null)
  const [contractingSelected, setContractingSelected] = useState(null)
  const [providerSelected, setProviderSelected] = useState(null)
  const [showFilters, setShowFilters] = useState(true)
  const classes = useStyles()
  const dialog = useDialog()
  const [searching, setSearching] = useState(false)
  const { handleSubmit, ...objForm } = useForm()

  const getTabPanels = async () => {
    try {
      const { data } = await Axios.post("/dbo/workflow/get_operator_processes")
      setAllProcesses(data.p_cursor)
    } catch (error) {
      console.error(error)
    }
  }

  const getStatusUser = async () => {
    try {
      const { data } = await Axios.post(
        "/dbo/workflow/get_status_user_workflow"
      )
      setStatusPause(data.result)
    } catch (error) {
      console.error(error)
    }
  }

  const onCloseReason = () => {
    setOpenReasonDialog(false)
  }

  const handleOpenReasonDialog = value => {
    setOpenReasonDialog(value)
  }

  const handleSubmitSuspension = async dataform => {
    const params = {
      p_observation: dataform.p_observation,
    }
    try {
      const { data } = await Axios.post(
        "/dbo/workflow/pause_action_group_user",
        params
      )
      await getStatusUser()
      dialog({
        variant: "info",
        title: "Notificación",
        description: data.p_result,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handlePauseUser = async () => {
    if (statusPause === "ENABLED") {
      handleOpenReasonDialog(true)
    } else {
      await handleActivateUser()
    }
  }

  const handleActivateUser = async () => {
    try {
      const { data } = await Axios.post("/dbo/workflow/start_action_group_user")
      await getStatusUser()
      dialog({
        variant: "info",
        title: "Notificación",
        description: data.p_result,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const getPanelCards = async (process, level, parent = null) => {
    const dataform = objForm.getValues()
    try {
      const params = {
        start_date: dataform.start_date,
        end_date: dataform.end_date,
        process_id: process,
        identification: dataform.identification,
        idepreadmin: dataform.idepreadmin,
        type_panel: 3,
        codproveedor: dataform.codproveedor,
        contratante: dataform.contratante,
        tiposusc: dataform.tiposusc,
        codinter: dataform.codinter,
        level: level,
        parent: parent,
      }
      const result = {
        p_json_params: JSON.stringify(params),
      }
      const { data } = await Axios.post("/dbo/workflow/get_panel_cards", result)
      return data
    } catch (error) {
      console.error(error)
    }
  }

  async function getCardDetail(process, idDetail) {
    const dataform = objForm.getValues()
    const params = {
      start_date: dataform.start_date,
      end_date: dataform.end_date,
      process_id: process,
      detail: idDetail,
      identification: dataform.identification,
      idepreadmin: dataform.idepreadmin,
      type_panel: 3,
      codproveedor: dataform.codproveedor,
      contratante: dataform.contratante,
      tiposusc: dataform.tiposusc,
      codinter: dataform.codinter,
    }
    const result = {
      p_json_params: JSON.stringify(params),
    }
    const { data } = await Axios.post(
      "/dbo/workflow/get_card_panel_detail",
      result
    )
    return data
  }

  async function handleTriggerParams() {
    setSearching(searching === false ? true : false)
  }

  const resetForm = () => {
    setShowFilters(false)
    setBrokerSelected(null)
    setProviderSelected(null)
    setContractingSelected(null)
    objForm.reset({})
  }

  // efectos

  useEffect(() => {
    getTabPanels()
    getStatusUser()
  }, [])

  useEffect(() => {
    if (showFilters === false) {
      setShowFilters(true)
    }
  }, [showFilters])

  return (
    <>
      <GridContainer>
        <GridItem xs={6}>
          <h3>Solicitudes por servicio</h3>
        </GridItem>
        <GridItem xs={6} className={classes.containerSwitchers}>
          <div className={classes.containerSwitch}>
            <p>Pausa de trabajo</p>
            <Switch
              size="medium"
              checked={statusPause === "ENABLED" ? false : true}
              name="STATUS_USER"
              onClick={handlePauseUser}
            />
          </div>
        </GridItem>
        <GridItem xs={12} md={6} lg={12}>
          <h4>Tablero servicios</h4>
        </GridItem>
        {showFilters ? (
          <GridContainer justify="center" className={classes.containerFilters}>
            <GridItem xs={12} md={6} lg={4} className={classes.container}>
              <DateMaterialPickerController
                fullWidth
                objForm={objForm}
                label="Fecha desde"
                name="start_date"
                defaultValue={dateStart}
                required={false}
              />
              <DateMaterialPickerController
                fullWidth
                objForm={objForm}
                label="Fecha hasta"
                name="end_date"
                defaultValue={dateEnd}
                required={false}
              />
            </GridItem>
            <GridItem xs={12} md={6} lg={2} className={classes.containerInputs}>
              <NumberController
                objForm={objForm}
                label="N° Liquidación"
                name="idepreadmin"
                required={false}
              />
            </GridItem>
            <GridItem xs={12} md={6} lg={2} className={classes.containerInputs}>
              <IdentificationController
                objForm={objForm}
                label="N° Identif."
                name="identification"
                required={false}
              />
            </GridItem>
            <GridItem xs={12} md={6} lg={2} className={classes.containerInputs}>
              <SelectSimpleController
                objForm={objForm}
                label="T. de Poliza"
                name={`tiposusc`}
                array={[
                  {
                    value: "I",
                    label: "Individual",
                  },
                  {
                    value: "C",
                    label: "Colectiva",
                  },
                ]}
                required={false}
              />
            </GridItem>
            <GridItem xs={12} md={6} lg={3} className={classes.containerInputs}>
              <ProvidersController
                objForm={objForm}
                label="Proveedor"
                name={"codproveedor"}
                onChange={e => setProviderSelected(e)}
                codContracting={providerSelected}
              />
            </GridItem>
            <GridItem xs={12} md={6} lg={3} className={classes.containerInputs}>
              <ContractingController
                objForm={objForm}
                label="Contratante"
                name={"contratante"}
                onChange={e => setContractingSelected(e)}
                codContracting={contractingSelected}
              />
            </GridItem>
            <GridItem xs={12} md={6} lg={2} className={classes.containerInputs}>
              <AdvisorController
                objForm={objForm}
                label="Asesor"
                name={"codinter"}
                onChange={e => setBrokerSelected(e)}
                codBroker={brokerSelected}
              />
            </GridItem>
            <GridItem xs={12} lg={1} className={classes.containerInputs}>
              <GridContainer justify="center">
                <Button color="primary" onClick={() => handleTriggerParams()}>
                  Buscar
                </Button>
              </GridContainer>
            </GridItem>
            <GridItem xs={12} lg={1} className={classes.containerInputs}>
              <GridContainer justify="center">
                <Button color="warning" onClick={() => resetForm()}>
                  Borrar
                </Button>
              </GridContainer>
            </GridItem>
          </GridContainer>
        ) : null}

        {allProcesses.length > 0 && (
          <GridItem xs={12}>
            <TabAreas
              allProcesses={allProcesses}
              parameters={objForm}
              getPanelCards={getPanelCards}
              getCardDetail={getCardDetail}
              searching={searching}
            />
          </GridItem>
        )}
      </GridContainer>
      {openReasonDialog && (
        <ReasonDialog
          openDialog={openReasonDialog}
          onSubmit={handleSubmitSuspension}
          handleOpenDialog={handleOpenReasonDialog}
          onClose={onCloseReason}
        />
      )}
    </>
  )
}

export default OperatorPanel
