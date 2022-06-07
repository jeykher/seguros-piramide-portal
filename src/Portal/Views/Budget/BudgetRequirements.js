import React, { useState, useEffect, Fragment } from 'react'
import Axios from 'axios'
import BudgetLayout from 'Portal/Views/Budget/BudgetLayout'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import DigitizationView from 'Portal/Views/Digitization/DigitizationView'
import DigitizationOptionalPersons from 'Portal/Views/Digitization/DigitizationOptionalPersons.js'
import MuiAlert from '@material-ui/lab/Alert';
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import { getProfile } from 'utils/auth'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    secondTable:{
        marginTop: '1.5em'
    }
  }));


export default function BudgetRequirements(props) {
    const classes = useStyles();
    const { onFinish, objBudget, isPortal } = props
    const { info } = objBudget
    const [parameters, setParameters] = useState()
    const [refreshTable,setRefreshTable] = useState(false)
    const [ disableNext, setDisableNext ] = useState(false)
    const [ isRequiredAuto, setRequired] = useState(false)

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />
    }

    const onChangeIsRequiredAuto = (value) => setRequired(value);

    useEffect(() => {
        setParameters({ expedientType: 'SUS', policyId: info[0].EMITED_NUMBER, certificateId: info[0].EMITED_CERT,
                        portalUserId: getProfile()?getProfile().P_PORTAL_USER_ID:undefined})
    }, [])

    async function onDownloadReceipt() {
        try {
            const data = { IDREPORTE: 5, IDEPOL: info[0].EMITED_NUMBER, NUMCERT: info[0].EMITED_CERT }
            const params = { p_params: JSON.stringify(data) }
            const response = await Axios.post('/dbo/general_policies/get_report', params)
            window.open(`/reporte?reportRunId=${response.data.p_url}`,"_blank");
        } catch (err) {
            console.error(err)
        }
    }

    async function onDownloadPayroll(flag ) {
        try {
           if (flag === 'PERSONAS'){
            const params = { p_budget_id: info[0].BUDGET_ID }
            const response = await Axios.post('/dbo/budgets/get_insured_document', params)
            window.open(`/reporte?reportRunId=${response.data.p_url}`,"_blank");
           } 
           else {
            const params = { p_budget_id: info[0].BUDGET_ID }
            const response = await Axios.post('/dbo/budgets/get_insured_document', params)
            window.open(`/reporte?reportRunId=${response.data.p_url}`,"_blank");
           } 
        } catch (err) {
            console.error(err)
        }
    }

    async function onNext() {
        setDisableNext(true)
        let profileId = null
        let brokerCode = null
        if (getProfile()) {
          profileId = getProfile().P_PROFILE_ID
        }
        if (info) {
          brokerCode = parseInt(info[0].BUDGET_PARTNER_CODE)
        }
        try {
            const params = { p_budget_id: info[0].BUDGET_ID, p_profile_id: profileId, p_insurance_broker_code: brokerCode }
            const response = await Axios.post('/dbo/budgets/post_requirements', params)
            onFinish()
            info[0].AREA_NAME === 'PERSONAS' && onDownloadReceipt()
        } catch (err) {
            console.error(err)
        }
        setDisableNext(false)
    }

    const handleRefresh = async () => {
        setRefreshTable(!refreshTable)
    }

    return (
        <BudgetLayout title="Consignación de documentos" objBudget={objBudget}>
            <GridContainer>
                <GridItem xs={12} sm={12} md={1}>
                </GridItem>
                <GridItem xs={12} sm={12} md={10}>
                    <Alert severity="success">¡Bienvenido!</Alert>
                    {info[0].AREA_NAME === 'PERSONAS' || (info[0].AREA_NAME === 'AUTOMOVIL' && isRequiredAuto)? <Fragment>
                        <GridItem xs={12} sm={12} md={12} className="sections30">
                            <h5>Para culminar con la compra debe:</h5>
                            <ul>
                                <li>Imprimir y firmar la Planilla de Solicitud de Póliza.</li>
                                <li>Escanear la Planilla de Solicitud de Póliza y adjuntar con el resto de los requisitos.</li>
                            </ul>
                        </GridItem>
                        <GridContainer justify="center" className="sections30">
                            <Button color="primary" onClick={()=>onDownloadPayroll(info[0].AREA_NAME)}>
                                <Icon>cloud_download</Icon> Descargar Planilla de Solicitud de Seguro
                            </Button>
                        </GridContainer>
                    </Fragment>
                    : <></>}
                    <GridContainer className="sections30" spacing={3}>
                        <GridItem xs={12} sm={12} md={12} >
                            Tiene 5 días para completar estos pasos.
                            Puede acceder en cualquier momento mediante el enlace que le enviamos a su correo.
                        </GridItem>
                    </GridContainer>
                    {parameters && <DigitizationView params={parameters} refresh={refreshTable} handleRefresh={handleRefresh} objBudget={objBudget} area={info[0].AREA_NAME} onChangeIsRequiredAuto={onChangeIsRequiredAuto} />}
                    {isPortal && info[0].AREA_NAME === 'PERSONAS' && parameters &&
                        <div className={classes.secondTable}>
                           <DigitizationOptionalPersons params={parameters}  objBudget={objBudget} refresh={refreshTable} handleRefresh={handleRefresh}/>
                        </div>
                    }
                    <GridContainer justify="flex-end" className="sections30">
                        <Button color="primary" type="submit" onClick={onNext} disabled={disableNext}>
                            <Icon>send</Icon> Siguiente
                        </Button>
                    </GridContainer>
                </GridItem>
            </GridContainer>
        </BudgetLayout>
    )
}
