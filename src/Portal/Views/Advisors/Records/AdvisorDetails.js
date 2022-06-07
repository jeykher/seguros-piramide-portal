import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import AdvisorProfile from 'Portal/Views/Advisors/Records/AdvisorProfile'
import MuiAlert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Tooltip from '@material-ui/core/Tooltip';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import { getIdentificationType } from 'utils/utils'

export default function AdvisorDetails (props) {
    const [customer, setCustomer] = useState(null);
    const [updeteable, setUpdeteable] = useState(false);
    const [updatedData, setUpdatedData] = useState(false);
    const [identityStatus, setIdentityStatus] = useState(false);    
    const [reportId, setReportId] = useState(false);
    const [ disableCI, setDisableCI] = useState(false) 
    const [ disableRIF, setDisableRIF] = useState(false) 
    const [ disablePassp, setDisablePassp] = useState(false) 
    

    async function getProfileData() {
        const { data } = await Axios.post('/dbo/portal_admon/get_profile_broker_data');
        setCustomer(data.p_cur_data[0])
        const booleanUpdate = data.p_updeteable === 'Y' ? false : true
        setUpdeteable(booleanUpdate);
    } 
    async function getIdentityStatus() {
        const { data } = await Axios.post('/dbo/portal_admon/get_identity_status');
        setIdentityStatus(data.result)
    }  
    
    async function downloadDocument(){
        var params = {
            p_report_id: parseInt(reportId),
            p_json_parameters:  JSON.stringify({}) 
        }        
        const response = await Axios.post('/dbo/reports/add_pending_report_execution',params)
        const reportRunId = response.data.result
        window.open(`/reporte?reportRunId=${reportRunId}`,"_blank");
    }

    async function getReportId(){
        const { data } = await Axios.post('/dbo/reports/get_report_id_by_broker');
        setReportId(data.result)
    }  
    
    async function getExpiredDocs() {
        if(getIdentificationType(customer.TIPOID) === 'PERSONAL'){
            checkDisableDates('C')    
            checkDisableDates('P')  
        }   
        checkDisableDates('R')            
    } 

    async function checkDisableDates(docId) {
        const params = {
            p_document_type: docId,
        }
        const { data } = await Axios.post('/dbo/portal_admon/get_document_status',params);
        let value = (data.result==null?false:true);
        switch (docId) {
            case 'C':
                setDisableCI(value); break;
            case 'P':
                setDisablePassp(value); break;
            case 'R':
                setDisableRIF(value); break;
          }
    }

    useEffect(() => {
        if(customer){
            getExpiredDocs()
        }
    }, [identityStatus])

    useEffect(() => {  
        getProfileData()   
        getReportId()     
    }, [])

    useEffect(() => { 
        getIdentityStatus()
    }, [updatedData])

    return (
        <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={8} lg={8}>
                {(identityStatus==1||identityStatus==3||(disableCI||disableRIF||disablePassp))&&
                <>
                    <MuiAlert elevation={6} severity="error">
                    {(identityStatus==1||identityStatus==3)&&  
                        <>Datos de identificación vencidos.<br></br></> 
                    }
                    {(disableCI||disableRIF||disablePassp)&&
                        <>
                            <br></br>
                            Debe digitalizar los siguientes documentos en la opción "Adjuntar Recaudos" antes de actualizar las fechas de Expedición y Vencimiento del mismo:<br></br><br></br>
                            {disableCI&&
                                <><Chip label="Cédula de Identidad" variant="outlined"/> </>
                            } 
                            {disableRIF&&
                                <><Chip label="RIF" variant="outlined"/> </>
                            } 
                            {disablePassp&&
                                <><Chip label="Pasaporte" variant="outlined"/> </>
                            }
                        </> 
                    }
                    </MuiAlert>
                    <br></br>
                </>
                }
                {(identityStatus==2||identityStatus==3)&&
                <>
                    <MuiAlert elevation={6} severity="warning">Datos sin actualizar</MuiAlert>
                    <br></br>
                </>
                }
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>
            { customer && 
            <AdvisorProfile 
                data={customer} 
                updeteable={updeteable} 
                setUpdatedData={setUpdatedData} 
                disableCI={disableCI} 
                disableRIF={disableRIF}
                disablePassp={disablePassp}/>}
            </GridItem>
            {(updatedData&&reportId)&&
            <>
                <GridItem xs={7}>
                    <Card>
                        <CardContent>
                            “Descargue su planilla y complete los datos que se encuentren en blanco, firme y digitalice nuevamente”
                        </CardContent>
                    </Card>
                </GridItem>
                <GridItem xs={1}>
                    <Tooltip title="Descargar Planilla">
                        <IconButton aria-label="delete" color="primary" onClick={downloadDocument}>
                            <CloudDownloadIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </GridItem>
            </>
            }
        </GridContainer>
    )
}