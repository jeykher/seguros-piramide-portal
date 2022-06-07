import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import IconButton from '@material-ui/core/IconButton';
import BackupIcon from '@material-ui/icons/Backup';
import SearchIcon from '@material-ui/icons/Search';
import { getProfile } from "utils/auth"
import ModalDocumentViewer from 'Portal/Views/Digitization/ModalDocumentViewer'

export default function DigitizationList(props) {
    const { dataReqAlly,selectedAlly,getRequiremntsAlly, brokerSelected, handleDataReqAlly} = props
    const [openModalDocumentViewer, setOpenModalDocumentViewer] = useState(false);
    const urlApiGetDocument = '/dbo/insurance_broker/get_doc_req_ally/get_blob/result/document_image'
    const documentTitle = 'Requisito'
    const [params, setParams] = useState()
    const dialog = useDialog();

    async function saveDocument(e, row) {
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
            let params = {
                p_cod_supervisor: selectedAlly.CODSUPERVISOR,
                p_level: selectedAlly.NIVEL,
                p_cod_ally: selectedAlly.CODALIADO,
                p_cod_req: row.CODREQ,
                p_file_name: 'PRUEBA',
                p_insurance_broker_code : getProfile().p_insurance_broker_code,
                p_portal_user_id : getProfile().p_portal_user_id
            }
            if(brokerSelected !== null){
                params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
              }
            data.append('parameters', JSON.stringify(params))
            const resp = await Axios.post("/uploadfile_docuware_blob/insurance_broker/update_req_ally", data)
            const newData = dataReqAlly.map(element => {
                if(element.CODREQ === row.CODREQ){
                    element.STSREQ = 'ENT'
                }
                return element
            })
            handleDataReqAlly(newData)
        } catch (error) {
            console.error(error.statusText)
        }
    }

    async function showDocument(e, row) {
        try {
            let params = {
                p_cod_ally: selectedAlly.CODALIADO.trim(),
                p_cod_req: row.CODREQ,
                responseContentType: 'application/pdf'
            }
            if(brokerSelected !== null){
                params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
              }
            setParams(params);
            setOpenModalDocumentViewer(true);
        } catch (error) {
            console.error(error)
        }
    }

    const handleCloseModalDocumentViewer = () => {
        setOpenModalDocumentViewer(false);
    };


    return (
        <>
        <TableMaterial
            data={dataReqAlly}
            columns={[
                { title: 'Documento', field: 'DESCREQ' },
                {
                    title: 'Estatus', field: 'STSREQ', render: rowData =>
                        <Badge color={(rowData.STSREQ === 'PEN' && "primary") || (rowData.STSREQ === 'ENT' && "success")}>{(rowData.STSREQ === 'PEN' && "pendiente") || (rowData.STSREQ === 'ENT' && "entregado")}</Badge>
                }
            ]}

            actions={[
                rowData => ({
                    icon: () =>
                        <React.Fragment>
                            <input className="input-file" accept="application/pdf" id={`icon-button-file-${rowData.CODREQ}`} onChange={(e) => saveDocument(e, rowData)} type="file" />
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
                        <IconButton color="primary" component="span">
                            <SearchIcon />
                        </IconButton>,
                    tooltip: 'Ver documento',
                    onClick: (event, rowData) => showDocument(event, rowData),
                    hidden: rowData.STSREQ === 'PEN'
                })
            ]}
            options={{ actionsColumnIndex: -1, paging: false, search: false, toolbar: false, sorting: false }}
        />
        <ModalDocumentViewer
                open={openModalDocumentViewer}
                handleClose={handleCloseModalDocumentViewer}
                apiGetDocument={urlApiGetDocument}
                params={params}
                title={documentTitle}
            />
        </>
    )
}
