import React, { useState, useEffect } from 'react';
import CardsDashboard from './CardsDashboard';
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import { makeStyles } from '@material-ui/styles';
import CustomButton from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import { navigate } from 'gatsby'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@material-ui/core"
import SnackbarContent from "components/material-dashboard-pro-react/components/Snackbar/SnackbarContent"
import ListItemWithAvatar from "components/Core/ListItemWithAvatar/ListItemWithAvatar"
import List from '@material-ui/core/List';
import PersonIcon from '@material-ui/icons/Person';
import SelectPolicyTable from 'Portal/Views/Policies/SelectPolicyTable'
import { useDialog } from "context/DialogContext"

const useStyles = makeStyles(() => ({
  containerButton: {
    padding: '0 2.1em'
  }
}))

const Dashboard = () => {
  const classes = useStyles()
  const [activateTransition, setActivateTransition] = useState(true);
  const [cards, setCards] = useState([]);
  const [levelsId, setLevelsId] = useState([null]);
  const [openClient, setopenClient] = useState(false)
  const [dataClient, setdataClient] = useState(null)
  const [actualIndex, setactualIndex] = useState(null)
  const [openPolicies, setOpenPolicies] = useState(false)
  const [clientIdentification, setClientIdentification] = useState(null)
  const dialog = useDialog()

  function onJustCallWithoutExtraProcess(data) {
    navigate(`${data.posturl}`)
  }

  function handleCloseClient() {
    setopenClient(false);
  };

  function handleClosePolicies() {
    setOpenPolicies(false);
    setClientIdentification(null)
  };

  const onSelectionClient = (rowData) => {
    const card = cards[actualIndex]
    const dataIdentification = {
      identification_type: '',
      identification_number: '',
      client_code: rowData.clientCode
    }
    const cardData = {
      ...card,
      ...dataIdentification,
      cardIndex: actualIndex
    }
    setopenClient(false);
    onHealthClaimRequest(cardData)
  }

  async function onHealthClaimRequest(data) {
    const params = {
      p_identification_type: data.identification_type,
      p_identification_number: data.identification_number === ""? 0: data.identification_number,
      p_service_type: data.service_type,
      p_client_code: data.client_code
    }
    const response = await Axios.post('/dbo/health_claims/verify_insurability_as_broker', params)
    const jsonResult = response.data.result
    if (jsonResult.resultType === "oneInsuredPersonFound") {
      navigate(`${data.posturl}${data.service_type}/${jsonResult.verificationId}`, {state: params})
    } else if (jsonResult.resultType === "selectOneforClientsList") {
      setdataClient(jsonResult.clients)
      setopenClient(true)
      setactualIndex(data.cardIndex)
    }
  }

  // Service Notification Process for insured broker profile
  const onProcessServiceNotifications = async (data) => {
      try {
          let params = {
              p_identification_type: data.identification_type,
              p_identification_number: data.identification_number,
              p_service_type: data.service_type,
              p_client_code: data.client_code
          }
          let service = '/dbo/health_claims/verify_insurability_as_broker'
          const response = await Axios.post(service, params)
          if(response.status === 200) {
              const jsonResult = response.data.result
              const dataJson = jsonResult.clientData
              dataJson.verificationId = jsonResult.verificationId
              dataJson.contactPhoneNumber = dataJson.phoneNumber
              dataJson.service_type = data.service_type
              navigate(`${data.posturl}`, { state: { dataJson} })
          }
          else {
              dialog({
                  variant: "info",
                  catchOnCancel: false,
                  title: "Alerta",
                  description: "Ha ocurrido un error al verificar al usuario consultado."
              })
          }
      }
      catch(error) {
          console.log(error)
          dialog({
              variant: "info",
              catchOnCancel: false,
              title: "Alerta",
              description: "No se ha podido verificar al usuario consultado. Por favor intente de nuevo o más tarde."
          })
      }
  }

  async function onShowModalToSelectPolicy(data, apisUrlToGetPoliciesByClientIdentification) {

    const clientIdentificationData = {
      identificationType: data.identification_type,
      identificationNumber: data.identification_number,
      postUrl: data.posturl,
      apiUrl: apisUrlToGetPoliciesByClientIdentification
    }
    setOpenPolicies(true)
    setClientIdentification(clientIdentificationData)
  }

  const getSublevelCard = async (card) => {
    setActivateTransition(false);
    if (card !== undefined) {
      const params = {
        P_MASTER_DASHBOARD_ID: card.dashboard_id
      }
      const response = await Axios.post('/dbo/security/dashboards_to_json', params);
      setCards(response.data.result);
      const arrayLevel = [...levelsId];
      arrayLevel.push(card.dashboard_id);
      setLevelsId(arrayLevel);
    } else {
      const lastLevel = levelsId.length > 1 ? levelsId[levelsId.length - 2] : levelsId[levelsId.length - 1];
      const params = {
        P_MASTER_DASHBOARD_ID: lastLevel
      }
      const response = await Axios.post('/dbo/security/dashboards_to_json', params);
      setCards(response.data.result);
      const arrayLevel = [...levelsId];
      arrayLevel.pop()
      setLevelsId(arrayLevel);
    }
    setActivateTransition(true);

  }

  function onClickButtonCard(data) {
    const optionsJustCallWithoutExtraProcess = ['vehicle_claim_declaration_broker', 'financial_guarantee_request_broker']
    const optionsShowModalToSelectPolicy = ['ground_transport_declaration_broker']
    const optionServiceNotifications = ['service_notifications_insured_broker']
    /*This apisUrlToGetPoliciesByClientIdentification is related to optionsShowModalToSelectPolicy (dashboard_code in configuration)
      In future the data apisUrlToGetPoliciesByClientIdentification could come from configuration as dashboard_code does
    */
    const apisUrlToGetPoliciesByClientIdentification = ['/dbo/patrimonial/get_ground_transp_policies']
    if (optionsJustCallWithoutExtraProcess.indexOf(data.dashboard_code) > -1) {
      onJustCallWithoutExtraProcess(data)
    } else if (optionsShowModalToSelectPolicy.indexOf(data.dashboard_code) > -1) {
      onShowModalToSelectPolicy(data, apisUrlToGetPoliciesByClientIdentification[optionsShowModalToSelectPolicy.indexOf(data.dashboard_code)])
    } 
    else if(optionServiceNotifications.indexOf(data.dashboard_code) > -1) {
        onProcessServiceNotifications(data)
    } 
    else {
      onHealthClaimRequest(data)
    }
  }

  const handleButton = (card) => card.posturl === 'drilldown' ? getSublevelCard(card) : onClickButtonCard(card);

  useEffect(() => {

    async function getData() {
      const response = await Axios.post('/dbo/security/dashboards_to_json')
      setCards(response.data.result)
    }
    getData();
  }, [])

  return (
    <>
      <CardsDashboard cards={cards} activateTransition={activateTransition} handleButton={handleButton} />
      {levelsId[levelsId.length - 1] !== null &&
        <>
          <GridContainer justify='flex-start' alignItems='center' className={classes.containerButton}>
            <CustomButton color='primary' onClick={() => getSublevelCard()}>
              <Icon>keyboard_arrow_left</Icon>
            Volver
          </CustomButton>
          </GridContainer>
        </>}

      <Dialog open={openClient}>
        <DialogTitle id="alert-dialog-client"></DialogTitle>
        <DialogContent>
          <DialogContentText>
            <SnackbarContent
              message={"Seleccione el asegurado que requiere el servicio:"}
              color="warning"
            />
            {openClient && <List>
              {dataClient.map((client) => (
                <ListItemWithAvatar
                  theElement={client}
                  elementKey={client.clientCode}
                  text={client.nameAndLastName + ' (Fecha Nacimiento: ' + client.birthDate + ')'}
                  onListItemClick={onSelectionClient}
                >
                  <PersonIcon />
                </ListItemWithAvatar>
              ))}
            </List>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => handleCloseClient()}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPolicies}>
        <DialogTitle id="alert-dialog-client"></DialogTitle>
        <DialogContent>
          <DialogContentText>
            <SnackbarContent
              message={"Seleccione la póliza para hacer la declaración: "}
              color="warning"
            />
            {clientIdentification &&
              <SelectPolicyTable
                clientIdType={clientIdentification.identificationType}
                clientIdNumber={clientIdentification.identificationNumber}
                apiUrl={clientIdentification.apiUrl}
                urlAfterSelectPolicy={clientIdentification.postUrl}
              />
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => handleClosePolicies()}>
            Cancelar
                    </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}


export default Dashboard;