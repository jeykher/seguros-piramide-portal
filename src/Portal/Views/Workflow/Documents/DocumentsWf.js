import React, { useState, useEffect } from 'react'
import { navigate } from '@reach/router'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Icon from "@material-ui/core/Icon";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import DocumentsLists from './DocumentsLists'
import DocumentsOnLineList from './DocumentsOnLineList'
import PdfViewer from '../../Digitization/PdfViewer'

export default function DocumentsWf(props) {
    const { workflow_id, program_id } = props
    const [documents, setDocuments] = useState([]);
    const [documentsOnLine, setDocumentsOnLine] = useState([]);
    const [apiUrl, setApiUrl] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);

    function handleBack(e) {
        e.preventDefault();
        navigate(-1)
    }

    async function getDocuments() {
        const params = { p_workflow_id: workflow_id, p_program_id: program_id }
        const response = await Axios.post('/dbo/workflow/get_list_of_docs', params)
        setDocuments(response.data.result)
    }

    async function getOnLineDocuments() {
        const params = { p_workflow_id: workflow_id }
        const response = await Axios.post('/dbo/reports/get_wf_online_reports_list', params)
        setDocumentsOnLine(response.data.result)
    }

    async function handleSelectList(reg) {
        const params = { p_doc_values: JSON.stringify(reg) }
        const response = await Axios.post('/get_blob', params, {
            responseType: 'arraybuffer',
            responseEncoding: 'binary'
        });
        toBlob(response.data, reg.content_type)
    }

    async function handleSelectOnLineList(reg) {
        const params = { 
            p_workflow_id: workflow_id,
            p_process_id: reg.PROCESS_ID,
            p_report_id: reg.REPORT_ID
        }
        
        const response = await Axios.post('/dbo/reports/add_pending_wf_rep_execution',params)
        const reportRunId = response.data.result
        setPdfUrl(null)
        setApiUrl(null)
        setApiUrl(`reports/get_url_from_report_run_id/${reportRunId}`)
    }

    useEffect(() => {
        getDocuments()
        getOnLineDocuments()
    }, [])

    function toBlob(buffer, contentType) {
        const file = new Blob([buffer], { type: contentType});
        const fileURL = URL.createObjectURL(file);
        setApiUrl(null)
        setPdfUrl(null)
        setPdfUrl(fileURL)
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={4} lg={4}>                
                {(documentsOnLine&&documentsOnLine.length>0)&&<DocumentsOnLineList documents={documentsOnLine} eventSelectList={handleSelectOnLineList} />}
                {(documents&&documents.length>0)&&<DocumentsLists documents={documents} eventSelectList={handleSelectList} />}
                <Button color="secondary" onClick={handleBack}>
                    <Icon>fast_rewind</Icon> Regresar 
                </Button>
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8} style={{ style: "margin:0px;padding:0px;overflow:hidden" }}>
                {apiUrl&&<PdfViewer apiUrl={apiUrl}/>}
                {pdfUrl&&<PdfViewer pdfUrl={pdfUrl}/>}
            </GridItem>        
        </GridContainer>
    )
}
