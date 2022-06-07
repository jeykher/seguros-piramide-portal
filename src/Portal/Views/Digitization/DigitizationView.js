import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import IconButton from '@material-ui/core/IconButton';
import BackupIcon from '@material-ui/icons/Backup';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';

import ModalDocumentViewer from '../Digitization/ModalDocumentViewer'

export default function DigitizationView(props) {
    const { params, refresh, handleRefresh, objBudget, area,onChangeIsRequiredAuto,workflowId, setComplete=null, pageClient=false } = props
    const [requirement, setRequirement] = useState([])
    const dialog = useDialog();
    const [openModalDocumentViewer, setOpenModalDocumentViewer] = useState(false);
    const [urlApiGetDocument, setUrlApiGetDocument] = useState('/dbo/general_policies/get_document_suscription/get_blob/result/BLOB_F');
    const [paramsModal, setParamsModal] = useState()
    const [parametros, setParametros] = useState()
    const documentTitle = 'Factura de Servicio'
    let parameters = {}

    async function getRequirement() {
        try {
            const data = { p_json_params: JSON.stringify(params) }
            const jsonRequirement = await Axios.post('/dbo/documents/get_documents', data);
            if (area === 'AUTOMOVIL') {
                onChangeIsRequiredAuto(jsonRequirement.data.p_documents.find(key => key.CODREQ === '0702'))

            }
            if(setComplete){
                var valid = jsonRequirement.data.p_documents.find(key => key.STSREQ === 'PEN' || key.STSREQ === 'ANU')
                setComplete(valid?false:true);
            }
            setRequirement(jsonRequirement.data.p_documents)
        } catch (error) {
            console.log(error)
        }
    }

    async function proccessRequirement(e, row) {
        try {
            if (e.target.files[0].type != "application/pdf") {
                dialog({
                    variant: "info",
                    catchOnCancel: false,
                    title: "Alerta",
                    description: "El documento debe estar en formato PDF"
                })
                throw "El documento debe estar en formato PDF"
            }
            const data = new FormData()
            data.append('file', e.target.files[0])
            params.documentType = row.CODREQ
            params.documentId = row.IDREQ

            data.append('parameters', JSON.stringify(params))
            const resp = await Axios.post("/uploadfile_docuware_blob", data)
            getRequirement()
            handleRefresh !== undefined && refresh !== undefined && handleRefresh()
        } catch (error) {
            console.error(error.statusText)
        }
    }

    async function showRequirement(e, row, isDocuware) {
        let url = ''
        try {
            params.documentType = row.CODREQ
            params.documentId = row.IDREQ
            const data = { p_json_params: JSON.stringify(params) }
            if (row.NBLOB == 'S' && params.expedientType === 'SUS') {
                let modalParams = {}
                modalParams.p_document_type = row.CODREQ;
                modalParams.p_policy_id = props.params.policyId;
                modalParams.p_certificate_id = props.params.certificateId;
                parameters = {
                    p_json_params: JSON.stringify(modalParams),
                    responseContentType: 'application/pdf'
                }
                setParametros(parameters);
                setOpenModalDocumentViewer(true);
            } else if (params.expedientType === 'IEX') {
                setUrlApiGetDocument('/dbo/documents/get_document_register/get_blob/result/BLOB_F')
                let modalParams = {}
                modalParams.p_id_req = row.IDREQ;

                parameters = {
                    p_json_params: JSON.stringify(modalParams),
                    responseContentType: 'application/pdf'
                }
                setParametros(parameters);
                setOpenModalDocumentViewer(true);
            } else if (params.expedientType === 'SIP' || params.expedientType === 'SIN' || params.expedientType === 'SOF') {

                switch (params.expedientType) {
                    case 'SIP':
                        params.p_workflow_id = workflowId.toString();
                        params.p_idreq = row.IDREQ.toString();
                        break;
                    case 'SIN':
                        params.p_workflow_id = workflowId.toString();
                        params.p_codreq = row.CODREQ.toString();
                    case 'SOF':
                        params.p_workflow_id = workflowId.toString();
                        params.p_codreq = row.CODREQ.toString();
                        break;
                }

                const newJson = {
                    p_json_params: JSON.stringify(params)
                }
                const jsonToGetBlob = await Axios.post('/dbo/documents/get_documents_new', newJson);

                if (!jsonToGetBlob.data.result.length) {
                    url = await Axios.post("/dbo/documents/get_document_url", data)
                    window.open(url.data.result, "_blank")
                    return;
                }

                const paramsGetBlob = { p_doc_values: JSON.stringify(jsonToGetBlob.data.result[0]) }

                parameters = {
                    p_json_params: paramsGetBlob,
                    responseContentType: 'application/pdf',
                    expedientType: params.expedientType
                }

                setUrlApiGetDocument('/get_blob')
                setParametros(parameters);
                setOpenModalDocumentViewer(true);
            } else {
                url = await Axios.post("/dbo/documents/get_document_url", data)
                window.open(url.data.result, "_blank")
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function removeRequirement(e, row) {
        try {
            params.documentType = row.CODREQ
            params.documentId = row.IDREQ
            const data = { p_json_params: JSON.stringify(params) }
            const resp = await Axios.post("/dbo/documents/remove_document", data)
            getRequirement()
        } catch (error) {
            console.error(error)
        }
    }

    async function removeOptionalRequirement(e, row) {
        const dataPlan = objBudget.getPlanBuy();
        try {
            const data = {
                documentType: row.CODREQ,
                documentId: row.IDREQ,
                codPlan: dataPlan.codplan,
                revPlan: dataPlan.revplan,
                codramo: row.CODRAMO,
                indOblig: 'N',
                policyId: params.policyId,
                certificateId: params.certificateId
            }
            const jsonParam = { p_json_params: JSON.stringify(data) }
            await Axios.post("/dbo/budgets/delete_upload_req_optional", jsonParam)
            getRequirement();
            handleRefresh();
        } catch (error) {
            console.log(error.statusText)
        }

    }

    const handleCloseModalDocumentViewer = () => {
        setOpenModalDocumentViewer(false);
        setParametros({});
    };

    useEffect(() => {
        getRequirement()
    }, [])

    useEffect(() => {
        if (refresh !== undefined && requirement.length > 0) {
            getRequirement()
        }
    }, [refresh])

    return (
        <>
            <TableMaterial
                data={requirement}
                columns={[
                    { title: 'Recaudos', field: 'DESCREQ' },
                    {
                        title: 'Estatus', field: 'STSREQ', render: rowData =>
                            <Badge color={(rowData.STSREQ === 'PEN' && "primary") || (rowData.STSREQ === 'ENT' && "success")}>{(rowData.STSREQ === 'PEN' && "pendiente") || (rowData.STSREQ === 'ENT' && "entregado")}</Badge>
                    }
                ]}
                actions={[
                    rowData => ({
                        icon: () =>
                            <React.Fragment>
                                <input className="input-file" accept="application/pdf" id={`icon-button-file-${rowData.CODREQ}`} onChange={(e) => proccessRequirement(e, rowData)} type="file" />
                                <label htmlFor={`icon-button-file-${rowData.CODREQ}`}>
                                    <IconButton color="primary" aria-label="upload picture" component="span">
                                        <BackupIcon />
                                    </IconButton>
                                </label>
                            </React.Fragment>,
                        tooltip: 'Adjuntar',
                        hidden: rowData.STSREQ === 'ENT'
                    }),
                    rowData => ({
                        icon: () =>
                            <IconButton color="secondary" component="span">
                                <SearchIcon />
                            </IconButton>,
                        tooltip: 'Ver documento',
                        onClick: async (event, rowData) => showRequirement(event, rowData, false),
                        hidden: rowData.STSREQ === 'PEN'
                    }),
                    rowData => ({
                        icon: () =>
                            (params.expedientType === 'SUS' || params.expedientType === 'IEX') && !pageClient &&
                            <IconButton color="primary" component="span">
                                <DeleteIcon />
                            </IconButton>,
                        tooltip: 'Reversar Documento',
                        onClick: (event, rowData) => removeRequirement(event, rowData),
                        hidden: (rowData.STSREQ === 'PEN' || (rowData.INDREQPOLACT === 'S' && params.valReqPolACT === 'S'))
                    }),
                    rowData => ({
                        icon: () =>
                            params.expedientType === 'SUS' && rowData.ESOBLIG === 'N' && !pageClient &&
                            <IconButton color="primary" component="span">
                                <ClearIcon />
                            </IconButton>,
                        tooltip: 'Eliminar recaudo opcional',
                        onClick: (event, rowData) => removeOptionalRequirement(event, rowData)
                    }),
                ]}
                options={{
                    actionsColumnIndex: -1,
                    paging: false,
                    search: false,
                    toolbar: false,
                    sorting: false,
                }}
            />
            <ModalDocumentViewer
                open={openModalDocumentViewer}
                handleClose={handleCloseModalDocumentViewer}
                apiGetDocument={urlApiGetDocument}
                params={parametros}
                title={documentTitle}
            />
        </>
    )
}
