import React, { Fragment, useEffect, useState } from "react"
import { navigate } from 'gatsby'
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import SnackbarContent from "components/material-dashboard-pro-react/components/Snackbar/SnackbarContent.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import GridContainer from "../../../components/material-dashboard-pro-react/components/Grid/GridContainer"
import VerificationsCard from './VerificationsCard'

export default function VerificationsCardView() {
    const dialog = useDialog(); 
    const [openClient, setOpenClient] = useState(false)
    const [dataClient, setdataClient] = useState(null)
    const [actualIndex, setactualIndex] = useState(null)
    const [cards, setCards] = useState([])

    const [openLetter, setopenLetter] = useState(false)
    const [dataLetter, setdataLetter] = useState(null)
    const [insuredLetter, setInsuredLetter] = useState(false)
    const [actualIndexLetter, setactualIndexLetter] = useState(null)

    function handleCloseClient() {
        setOpenClient(false);
    };

    const onSelectionClient = (event, rowData) => {
        const dataIdentification = {
            p_identification_type: null,
            p_identification_number: null,
            p_client_code: rowData.clientCode
        }
        onVerify(dataIdentification, actualIndex)
        setOpenClient(false);
    };


    function handleCloseLetter() {
        setopenLetter(false);
    };

    const onSelectionLetter = (event, rowData) => {
        postVerifyLetter(actualIndexLetter, rowData.IDEPREADMIN, rowData.NUMLIQUID)
        setopenLetter(false);
    };

    async function onVerify(dataIdentification, index) {
        const params = {
            ...dataIdentification,
            p_service_type: cards[index].service_type
        }
        //navigate('/app/siniestro_salud/verificacion_emergencia/1104');
        const response = await Axios.post('/dbo/health_claims/verify_insurability', params)
        const jsonResult = response.data.result
        if (jsonResult.resultType === "oneInsuredPersonFound") {
            navigate(`${cards[index].posturl}${jsonResult.verificationId}`);
        } else if (jsonResult.resultType === "selectOneforClientsList") {
            setactualIndex(index)
            setdataClient(jsonResult.clients)
            setOpenClient(true)
        }
    }

    async function onVerifyLetter(dataIdentification, index) {
        const params = {
            ...dataIdentification,
            p_service_type: cards[index].service_type
        }
        const response = await Axios.post('/dbo/health_claims/get_services_by_person', params)
        const arrayResult = response.data.result
        if(arrayResult.length === 0){
            dialog({
                variant: "info",
                catchOnCancel: false,
                title: "Alerta",
                description: "La persona no posee Carta Aval activa"
            })
        }else if(arrayResult.length > 1){
            setactualIndexLetter(index)
            setdataLetter(arrayResult)
            setInsuredLetter(arrayResult[0].NOM_ASEGURADO)
            setopenLetter(true)
        }else{
            postVerifyLetter(index,arrayResult[0].IDEPREADMIN,arrayResult[0].NUMLIQUID)
        }
    }

    function postVerifyLetter(index, p_preadmission_id, p_complement_id) {
        navigate(`${cards[index].posturl}${p_preadmission_id}/${p_complement_id}`);
    }

    // Service Notification Process for clinic profile
    const onProcessServiceNotifications = async (dataIdentification, index) => {
        let serviceType = cards[index].service_type
        let postUrl = cards[index].posturl
        try {
            let params = {
                p_client_code: dataIdentification.p_client_code,
                p_identification_number: dataIdentification.p_identification_number,
                p_identification_type: dataIdentification.p_identification_type,
                p_service_type: serviceType
            }
            let service = '/dbo/health_claims/verify_insurability'
            let response = await Axios.post(service, params)
            if(response.status === 200) {
                let jsonResult = response.data.result
                let dataJson = jsonResult.clientData
                dataJson.verificationId = jsonResult.verificationId
                dataJson.contactPhoneNumber = dataJson.phoneNumber
                dataJson.service_type = serviceType
                navigate(`${postUrl}`, { state: { dataJson } })
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

    function onSubmit(data, index, cardCode) {
        const dataIdentification = {
            p_identification_type: data[`p_identification_type_${index}`],
            p_identification_number: data[`p_identification_number_${index}`],
            p_client_code: ''
        }
        switch(cardCode) {
            case 'letter_guarantee_activation_clinic':
                onVerifyLetter(dataIdentification, index)
                break
            case 'service_notifications_clinic':
                onProcessServiceNotifications(dataIdentification, index)
                break
            default:
                onVerify(dataIdentification, index)
                break
        }
        // cardCode === 'letter_guarantee_activation_clinic' ? onVerifyLetter(dataIdentification, index) : onVerify(dataIdentification, index)
    }

    async function dashboards_to_json(){
        const response = await Axios.post('/dbo/security/dashboards_to_json')
        setCards(response.data.result)
    }

    useEffect(() => {
        dashboards_to_json()
    }, [])


    return (
        <Fragment>
            <GridContainer>
            {cards.map((data, key) => (
                <GridItem key={key} item xs={12} sm={12} md={6} lg={3}>
                    <VerificationsCard
                        key={key}
                        onSubmit={onSubmit}
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

            ))}
            </GridContainer>
            <Dialog open={openClient}>
                <DialogTitle id="alert-dialog-client">Asegurados</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <SnackbarContent
                            message={"Seleccione el asegurado que requiere el servicio: "}
                            color="warning"
                        />
                        <TableMaterial
                            options={{ actionsColumnIndex: -1, paging: false, search: false, toolbar: false, sorting: false, }}
                            columns={[
                                { title: 'Asegurado', field: 'nameAndLastName' },
                                { title: 'F. Nacimiento', field: 'birthDate' }
                            ]}
                            data={dataClient}
                            onRowClick={(event, rowData) => onSelectionClient(event, rowData)}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => handleCloseClient()}>
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openLetter}>
                <DialogTitle id="alert-dialog-letter">Cartas Avales</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <SnackbarContent
                            message={"Seleccione la carta aval del Asegurado: " + insuredLetter}
                            color="warning"
                        />
                        <TableMaterial
                            options={{ actionsColumnIndex: -1, paging: false, search: false, toolbar: false, sorting: false, }}
                            columns={[
                                { title: 'Nro. Carta', field: 'NRO_LIQUIDACION' },
                                { title: 'Fecha Aprobación', field: 'FECAPROBCARTA' },
                                { title: 'Monto', field: 'MTOFACTMONEDA' },
                                { title: 'Moneda', field: 'CODMONEDAPOLIZA' },
                                { title: 'Tratamiento', field: 'DESCTRATA' }
                            ]}
                            data={dataLetter}
                            onRowClick={(event, rowData) => onSelectionLetter(event, rowData)}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => handleCloseLetter()}>
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}
