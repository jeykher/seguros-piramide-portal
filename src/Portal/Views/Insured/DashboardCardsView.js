import React, { Fragment, useEffect, useState } from "react"
import { navigate } from "gatsby"
import Axios from "axios"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import GridContainer from "../../../components/material-dashboard-pro-react/components/Grid/GridContainer"
import DashboardCard from "./DashboardCard"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@material-ui/core"
import SnackbarContent from "../../../components/material-dashboard-pro-react/components/Snackbar/SnackbarContent"
import ListItemWithAvatar from "../../../components/Core/ListItemWithAvatar/ListItemWithAvatar"
import List from '@material-ui/core/List';
import PersonIcon from '@material-ui/icons/Person';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import ButtonReact from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import SelectPolicyTable from 'Portal/Views/Policies/SelectPolicyTable'
import { useDialog } from "context/DialogContext"


export default function DashboardCardsView() {
  const [openVehicle, setopenVehicle] = useState(false)
  const [dataVehicle, setdataVehicle] = useState(null)
  const [openClient, setopenClient] = useState(false)
  const [dataClient, setdataClient] = useState(null)
  const [actualIndex, setactualIndex] = useState(null)
  const [openFamilyGroup, setopenFamilyGroup] = useState(false)
  const [openPolicies, setOpenPolicies] = useState(false)
  const [openPoliciesTransp, setOpenPoliciesTransp] = useState(false)
  const [searchPoliciesData, setSearchPoliciesData] = useState(null)
  const [cards, setCards] = useState([])
  const [clientIdentification, setClientIdentification] = useState(null)
  const dialog = useDialog()

  async function onVehicleClaimDeclaration(index) {
    const response = await Axios.post("/dbo/auto_claims/get_list_of_vehicules")
    const arrayResult = response.data.p_cursor
    if (arrayResult.length > 1) {
      setactualIndex(index)
      setdataVehicle(arrayResult)
      setopenVehicle(true)
    } else {
      onGo(arrayResult[0], 0);
    }

  }

  function handleCloseVehicle() {
    setopenVehicle(false);
  };

  const onSelectionVehicle = (rowData) => {
    onGo(rowData, actualIndex);
    setopenVehicle(false);
  };

  function onGo(rowData, index) {
    const Datavehicle = rowData
    navigate(`${cards[index].posturl}`, { state: { Datavehicle } })
  }

  async function onHealthClaimRequest(index) { 
    const params = {
      p_service_type: cards[index].service_type
    }
    const response = await Axios.post('/dbo/health_claims/get_client_family_group_info', params)
    const jsonResult = response.data.result;   
    if (jsonResult.resultType === "clientWithoutFamilyGroup") {
  
      await onHealthClaimRequestWithoutFamilyGroup( cards[index].service_type, index)
      // navigate(`${cards[index].posturl}${params.p_service_type}`);
    } else if (jsonResult.resultType === "clientWithFamilyGroup") {
      
      setactualIndex(index)
      setdataClient(jsonResult.familyGroup)
      setopenClient(true)
    }
  }

  // async function onHealthClaimRequestForASelectedClient(clientCodeSelected, index) {
     
  //    const params = {
  //     p_code_customer: clientCodeSelected
  //   }
  //   const service = '/dbo/customers/get_customer_code'; 
  //   const response =  await Axios.post(service, params);
  //   console.log(response);
  //   const jsonResult = response.data.p_cursor;
  //   let identificationType = jsonResult[0].TIPOID;
  //   let identificationNumber = jsonResult[0].NUMID;
  //   const serviceType = cards[index].service_type
 
  //   await onVerifyInsurabilityAsBrokerForASelectedClient (identificationType,identificationNumber,serviceType,clientCodeSelected,index) ;
    
  // }

  async function onHealthClaimRequestForASelectedClient(clientCodeSelected, index) {
    const serviceType = cards[index].service_type
    const params = {
      p_client_code_request: clientCodeSelected,
      p_service_type: serviceType,
      // p_provider_code: providerCode
  }
  const response = await Axios.post('/dbo/health_claims/verify_insurability_as_insured', params)
        const jsonResult = response.data.result
        navigate(`${cards[index].posturl}${serviceType}/${clientCodeSelected}/${jsonResult.verificationId}`, {state: jsonResult.policies[0]}); 
  }

  async function onHealthClaimRequestForHimself() {
    const serviceType = cards[actualIndex].service_type
    if (cards[actualIndex].dashboard_code==="insured_terrestrial_transport_declaration"){
      setopenClient(false)
     let clientCode = await getClientCode(actualIndex)
     let clientInfo = await getCLientInfo(clientCode)
     onShowModalToSelectPolicyInsured(clientInfo)
     
    }else{
      navigate(`${cards[actualIndex].posturl}${serviceType}`);
      setopenClient(false);
    }
  }
  
  async function onVerifyInsurabilityAsBrokerForASelectedClient(identificationType,identificationNumber,serviceType,clientCodeSelected,index) {
    const params = {
      p_identification_type: identificationType,
      p_identification_number: identificationNumber,
      p_service_type: serviceType,
      p_client_code:null
    }
    const response = await Axios.post('/dbo/health_claims/verify_insurability_as_insured', params)
    const jsonResult = response.data.result;   
    navigate(`${cards[index].posturl}${serviceType}/${clientCodeSelected}/${jsonResult.verificationId}`, {state: jsonResult.policies[0]});     
  }

  async function onHealthClaimRequestWithoutFamilyGroup (service_type, index) {

    let userSession = JSON.parse(sessionStorage.getItem('PROFILE'));
    let clientCode =  userSession.p_client_code;
    const serviceType = service_type;
    await onGetCustomerCodeWithoutFamilyGroup(clientCode,serviceType, index)  
  }

   async function onGetCustomerCodeWithoutFamilyGroup(clientCode,serviceType,index) {
    const params = {
      p_code_customer: clientCode
    }
    const service = '/dbo/customers/get_customer_code'; 
    const response =  await Axios.post(service, params);
    const jsonResult = response.data.p_cursor;   
    let identificationType = jsonResult[0].TIPOID;
    let identificationNumber = jsonResult[0].NUMID 
    
   // console.log(identificationType + '****' + identificationNumber)
    await onVerifyInsurabilityAsBrokerWithoutFamilyGroup(identificationType,identificationNumber,serviceType,index)

   }

   async function onVerifyInsurabilityAsBrokerWithoutFamilyGroup(identificationType,identificationNumber,serviceType,index) {

    const params = {
      p_identification_type: identificationType,
      p_identification_number: identificationNumber,
      p_service_type: serviceType,
      p_client_code:null
    }
    const response = await Axios.post('/dbo/health_claims/verify_insurability_as_insured', params)
    const jsonResult = response.data.result

      navigate(`${cards[index].posturl}${serviceType}/${jsonResult.verificationId}`, {state: jsonResult.policies[0]});
    }
  
  async function onHealthClaimRequestForHimself() {    
    //alert('toco el mismo')
    let userSession = JSON.parse(sessionStorage.getItem('PROFILE'));
    let clientCode =  userSession.p_client_code;
    const serviceType = cards[actualIndex].service_type  
    await onGetCustomerCode(clientCode,serviceType)    
  };


  async function onGetCustomerCode(clientCode,serviceType){
    const params = {
      p_code_customer: clientCode
    }
    const service = '/dbo/customers/get_customer_code'; 
    const response =  await Axios.post(service, params);
    const jsonResult = response.data.p_cursor;   
    let identificationType = jsonResult[0].TIPOID;
    let identificationNumber = jsonResult[0].NUMID   
    await onVerifyInsurabilityAsBroker (identificationType,identificationNumber,serviceType) ;
  }

  async function onVerifyInsurabilityAsBroker(identificationType,identificationNumber,serviceType) {
    const params = {
      p_identification_type: identificationType,
      p_identification_number: identificationNumber,
      p_service_type: serviceType,
      p_client_code:null
    }
    const response = await Axios.post('/dbo/health_claims/verify_insurability_as_insured', params)
    const jsonResult = response.data.result

      navigate(`${cards[actualIndex].posturl}${serviceType}/${jsonResult.verificationId}`, {state: jsonResult.policies[0]});
     setopenClient(false);
  }

  async function onShowModalToSelectPolicy(index) {

    const searchData = {
      postUrl: `${cards[index].posturl}`,
      apiUrl: '/dbo/ground_transportation/get_ground_transp_policies'
    }

    console.log('searchData: ',searchData)
    setSearchPoliciesData(searchData)
    setOpenPolicies(true)
  }

  async function onShowModalToSelectPolicyInsured(clientInfo) {

    try {
      let params = {
        p_identification_number: clientInfo.NUMID.toString(),
        p_identification_type: clientInfo.TIPOID
      }
      let service = '/dbo/patrimonial/get_ground_transp_policies'
      let response = await Axios.post(service, params)
      const searchData = response.result
      setSearchPoliciesData(searchData)
      setOpenPolicies(true)
    }
    catch(error) {
      console.log(error)
    }

 
  }

  async function getClientCode(index) {
    try {
      let params = {
        p_client_code_request: ""
      }

      let service = '/dbo/health_claims/get_client_info'
      let response = await Axios.post(service, params)
      const clientCode = response.data.result.clientCode
      return (clientCode)
    }
    catch (error){
      console.log(error)
    }

  }
  
  async function getCLientInfo(clientCode) {

    try {
      let params = {
        p_code_customer: clientCode
      }
   
      let service = '/dbo/customers/get_customer_code'
      let response = await Axios.post(service, params)
      return(response.data.p_cursor[0])
    }
    catch (error){
      console.log(error)
    }
  
  }

  function handleCloseClient() {
    setopenClient(false);
    if (openFamilyGroup) {
      setopenFamilyGroup(false)
    }
  };

  const onSelectionClient = (rowData) => {
    console.log(rowData)     
    /*Aqui es cuando seleccionas para uno de mis dependientes*/
    onHealthClaimRequestForASelectedClient(rowData.clientCode, actualIndex)
    setopenClient(false);
  };

  const HandleTrasnportDeclaration = (index, data) => {

   // alert('entro a la funcion')
    verifyInsured(index,data)
  };

  const processServiceNotificationWithoutFamilyGroup = async () => {
      try {
          let params = {
              p_client_code_request: ""
          }
          let service = '/dbo/health_claims/get_client_info'
          let response = await Axios.post(service, params)
          if(response.status === 200) {
              return response.data.result
          }
          else {
              dialog({
                variant: "info",
                catchOnCancel: false,
                title: "Alerta",
                description: "No se ha podido obtener información del usuario asegurado. Por favor intente de nuevo o más tarde."
              })
          }
      }
      catch(error) {
          console.log(error)
          dialog({
            variant: "info",
            catchOnCancel: false,
            title: "Alerta",
            description: "No se ha podido obtener información del usuario asegurado. Por favor intente de nuevo o más tarde."
          })
      }
  }

  // Service Notification Process for insured profile
  const onProcessServiceNotifications = async (index) => {
      let serviceType = cards[index].service_type
      let postUrl = cards[index].posturl
      try {
          let params = {
              p_service_type: serviceType
          }
          let service = '/dbo/health_claims/get_client_family_group_info'
          let response = await Axios.post(service, params)
          if(response.status === 200) {
              let jsonResult = response.data.result
              if(jsonResult.resultType === "clientWithoutFamilyGroup") {
                  console.log("sin carga familiar")
                  let userDataResponse = await processServiceNotificationWithoutFamilyGroup()
                  if(userDataResponse) {
                      console.log(userDataResponse)
                      // navigate(`${postUrl}`, { state: { userDataResponse } })
                  }
                  else {
                      dialog({
                          variant: "info",
                          catchOnCancel: false,
                          title: "Alerta",
                          description: "Ha fallado la solicitud de servicio. Por favor intente de nuevo o más tarde."
                      })
                  }
              }
              else {
                  console.log("con carga familiar")
              }
          }
          else {
              dialog({
                variant: "info",
                catchOnCancel: false,
                title: "Alerta",
                description: "Ha fallado la solicitud de servicio. Por favor intente de nuevo o más tarde."
              })
          }
      }
      catch(error) {
          console.log(error)
          dialog({
              variant: "info",
              catchOnCancel: false,
              title: "Alerta",
              description: "Ha fallado la solicitud de servicio. Por favor intente de nuevo o más tarde."
          })
      }
  }

    // Service Notification Process for insured profile
    const verifyInsured = async (index,data) => {

        let dataSession = JSON.parse(sessionStorage.getItem('PROFILE')).p_client_code;  
        const apisUrlToGetPoliciesByClientIdentification = '/dbo/patrimonial/get_ground_transp_policies';     
        try{
          let params = {
                 p_code_customer: dataSession
          }
          let service = '/dbo/customers/get_customer_code'
          let response = await Axios.post(service, params)
          let dataInsured = response.data.p_cursor;

         onShowModalToSelectPolicy(data,index,dataInsured,apisUrlToGetPoliciesByClientIdentification)

        }catch(error) {
          console.log(error)
          dialog({
              variant: "info",
              catchOnCancel: false,
              title: "Alerta",
              description: "Ha fallado la verificación de usuario."
          })
      }

 
      // try {
      //     let params = {
      //         p_service_type: serviceType
      //     }
      //     let service = '/dbo/health_claims/get_client_family_group_info'
      //     let response = await Axios.post(service, params)
      //     console.log(response)
      //     if(response.status === 200) {
      //         let jsonResult = response.data.result
      //         if(jsonResult.resultType === "clientWithoutFamilyGroup") {
              

      //         }
      //         else {
      //           setactualIndex(index)
      //           setdataClient(jsonResult.familyGroup)
      //           setopenClient(true)
      //         }
      //     }
      //     else {
      //         dialog({
      //           variant: "info",
      //           catchOnCancel: false,
      //           title: "Alerta",
      //           description: "Ha fallado la verificación de usuario."
      //         })
      //     }
      // }
      // catch(error) {
      //     console.log(error)
      //     dialog({
      //         variant: "info",
      //         catchOnCancel: false,
      //         title: "Alerta",
      //         description: "Ha fallado la verificación de usuario."
      //     })
      // }
  }

  async function onShowModalToSelectPolicy(data,index,dataInsured,apisUrlToGetPoliciesByClientIdentification){
   
    
    const clientIdentificationData = {
      identificationType: dataInsured[0].TIPOID,
      identificationNumber: dataInsured[0].NUMID.toString(),
      postUrl: data.posturl,
      apiUrl: apisUrlToGetPoliciesByClientIdentification
    } 

    //console.log(2,clientIdentificationData)

    setOpenPoliciesTransp(true);
    setClientIdentification(clientIdentificationData);
  }

  function handleClosePoliciesTransp() {
    setOpenPoliciesTransp(false);
    setClientIdentification(null)
  };


     

  function onSubmit(data, index, cardCode) {
    
    //cardCode === 'vehicle_claim_declaration' ? onVehicleClaimDeclaration(index) : onHealthClaimRequest(index)
    switch (cardCode) {
        case 'vehicle_claim_declaration':
            onVehicleClaimDeclaration(index)
            break
        case 'ground_transport_declaration_insured':
            onShowModalToSelectPolicy(index)
            break
        case 'service_notifications_insured':
            onProcessServiceNotifications(index)
            break
        case 'insured_terrestrial_transport_declaration':
            HandleTrasnportDeclaration(index,data)
            break
        default:
            onHealthClaimRequest(index)
            break
    }    
  }

  function handleClosePolicies() {
    setOpenPolicies(false);
    setSearchPoliciesData(null)
  };

  function handleChangeOpenFamilyGroup() {
    openFamilyGroup ? setopenFamilyGroup(false) : setopenFamilyGroup(true);

  };

  async function dashboards_to_json() {
    //alert('entroooo')
    const response = await Axios.post('/dbo/security/dashboards_to_json')
    response.data.result &&  setCards(response.data.result)
  }

  useEffect(() => {
    dashboards_to_json()
  }, [])
  return (
    <>
      <>
        {cards.map((data, key) => {
          return( 
            <GridItem key={key} item xs={12} sm={12} md={6} lg={3}>
              <DashboardCard
                key={key}
                onSubmit={()=>onSubmit(data,key,data.dashboard_code)}
                index={key}
                cardCode={data.dashboard_code}
                id={data.dashboard_id}
                title={data.title}
                icon={data.icon}
                color={data.color}
                iconcolor={data.color}
                action={data.action}
                iconaction={data.iconaction}
                posturl={data.posturl}
              />       
          </GridItem>

        )})}
      </>
      <Dialog open={openVehicle}>
        <DialogContent>
            <SnackbarContent
              message={"Seleccione un Vehículo:"}
              color="warning"
            />
            {openVehicle && <List>
              {dataVehicle.map((vehicle) => (
                <ListItemWithAvatar
                  theElement={vehicle}
                  elementKey={vehicle.PLATE_NUMBER}
                  text={vehicle.MARK_OF_VEHICLE + ' ' + vehicle.VEHICLE_MODEL + ' ' + vehicle.VEHICLE_YEAR + '(Placa: ' + vehicle.PLATE_NUMBER + ')'}
                  onListItemClick={onSelectionVehicle}
                >
                  <DriveEtaIcon />
                </ListItemWithAvatar>
              ))}
            </List>}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => handleCloseVehicle()}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openClient}>
        <DialogTitle id="alert-dialog-client"></DialogTitle>
        <DialogContent>
          <DialogContentText>
           <GridContainer style={{ maxWidth: "400px" }}>
             <GridItem xs={12}>
               <ButtonReact
                 type="button"
                 color="danger"
                 fullWidth
                 size="lg"
                 onClick={onHealthClaimRequestForHimself}
               >Solicitar un servicio para mí
               </ButtonReact>
             </GridItem>
             <GridItem xs={12}>
               <ButtonReact
                 type="button"
                 color="warning"
                 fullWidth
                 size="lg"
                 onClick={handleChangeOpenFamilyGroup}
               >O para uno de mis dependientes
             </ButtonReact>
             </GridItem>
           </GridContainer>
           {openFamilyGroup && <List>
             {dataClient.map((client) => (
               <ListItemWithAvatar
                 theElement={client}
                 elementKey={client.clientCode}
                 text={client.nameAndLastName}
                 secondText={'Fecha Nacimiento: ' + client.birthDate}
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
            {searchPoliciesData &&
              <SelectPolicyTable
                apiUrl={searchPoliciesData.apiUrl}
                urlAfterSelectPolicy={searchPoliciesData.postUrl}
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
      <Dialog open={openPoliciesTransp}>
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
          <Button color="primary" onClick={() => handleClosePoliciesTransp()}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>

  )
}
