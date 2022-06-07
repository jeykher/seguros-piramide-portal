import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import CardPanel from 'components/Core/Card/CardPanel'
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'

import ModalDocumentViewer from '../Digitization/ModalDocumentViewer'
import Tooltip from '@material-ui/core/Tooltip'
import "./ConsignmentDetailsView.scss"


export default function ConsignmentDetailsView(props) {
    const { workflow_id } = props
    const [consignmentDetails, setConsignmentDetails] = useState()
    const urlApiGetDocument = '/dbo/consignment/get_invoice_document/get_blob/result/invoice_document'
    const documentTitle = 'Factura de Servicio'
    const [params, setParams] = useState()
    const [openModalDocumentViewer, setOpenModalDocumentViewer] = useState(false);

    async function getConsignmentDetails() {
        try {
            const data = { p_workflow_id: workflow_id }
            const jsonResponse = await Axios.post(`/dbo/consignment/get_batch_dets_by_workflow_id`, data);
            setConsignmentDetails(jsonResponse.data.result)
        } catch (error) {
            console.log(error)
        }
    }

    const handleOpenModalDocumentViewer = (e, row) => {
        let parameters = {}
        let identifier

        parameters.batch_invoicing_id = row.BATCH_INVOICING_ID
        parameters.insurance_area = row.INSURANCE_AREA
      
        if (parameters.insurance_area === '0004') {
            parameters.preadmission_id = row.IDEPREADMIN
            parameters.complement_id = row.NUMLIQUID
            identifier = row.BATCH_INVOICING_ID + '-' + row.IDEPREADMIN + '-' + row.NUMLIQUID
        } else if (parameters.insurance_area === '0002') {
            parameters.order_number = row.NUMORDEN
            identifier = row.BATCH_INVOICING_ID + '-'  + row.NUMORDEN
        }
        parameters = {
            p_json_params: JSON.stringify(parameters),
            identifier: identifier,
            responseContentType: 'application/pdf'
        }
        setParams(parameters);
        setOpenModalDocumentViewer(true);
    };

    const handleCloseModalDocumentViewer = () => {
        setOpenModalDocumentViewer(false);
    };

    useEffect(() => {
        getConsignmentDetails()
    }, [])


    return (
        <>
            <CardPanel titulo="Detalle de Remesa" className="container-detalle-remesa" icon="dynamic_feed" iconColor="primary">
                <TableMaterial
                    data={consignmentDetails}
                    columns={[
                        {
                            title: 'Nro.Orden', field: 'NRO_ORDEN', editable: 'never',
                        },

                        {
                            title: 'Nro. Factura', field: 'NROFACTURA', editable: 'never'
                        },
                        {
                            title: 'Nro. Control', field: 'NROCTRFACTURA', editable: 'never'
                        },
                        {
                            title: 'Fecha Factura', field: 'FECFACTURA', editable: 'never'
                        },
                        {
                            title: 'Monto Factura', field: 'MTOTOTFACT',
                            render: rowData => (<AmountFormatDisplay name={"Mtototfact_" + rowData.NRO_ORDEN} value={rowData.MTOTOTFACT} />)
                        },
                        {
                            title: 'Estatus', field: 'STS_FACTURA',
                            render: rowData => (<Badge color={rowData.STS_FACTURA === 'Rechazada' ? 'danger' : 'success'} >{rowData.STS_FACTURA}</Badge>)
                        },
                        {
                            title: 'Archivo Factura', field: 'archivo',
                            render: rowData => (
                                <div>{rowData.invoiceDocumentUploaded === 'S' ? (
                                    <Tooltip title="Ver Factura" placement="right-start" arrow>
                                        <IconButton color="primary" component="span" onClick={(event) => handleOpenModalDocumentViewer(event, rowData)}>
                                            <SearchIcon />
                                        </IconButton>
                                    </Tooltip>) : (<div></div>)}
                                </div>

                            )
                        }
                    ]}
                    options={{
                        search: true,
                        toolbar: true,
                        sorting: true,
                        pageSize: 10,
                    }}

                    detailPanel={rowData => {
                        return (
                            consignmentDetails.map((reg, index) => {
                                if (reg.NRO_ORDEN === rowData.NRO_ORDEN) {
                                    if (reg.STS_FACTURA === 'Rechazada') {
                                        return (
                                            <div className='text-container'>
                                                <h6 key={index}><strong>Motivo de Rechazo: </strong>{`${reg.MOTIVO_RECHAZO}`}</h6>
                                            </div>
                                        )
                                    } else {
                                        if (reg.INSURANCE_AREA === '0004') {
                                            return (
                                                <div className='text-container'>
                                                    <h6 key={index}><strong>Monto Amparado: </strong><AmountFormatDisplay name={"Mtoamparado_" + rowData.NRO_ORDEN} value={rowData.MTOAMPARADO} /></h6>
                                                </div>
                                            )
                                        }else if (reg.INSURANCE_AREA === '0002') {
                                            return (
                                                <div>
                                                    <h6 key={index}><strong>Nro. Declaración: </strong>{rowData.NUMDECLA}</h6>
                                                    <h6 key={index}><strong>Identificador Siniestro (IDESIN): </strong>{rowData.IDESIN}</h6>
                                                    <h6 key={index}><strong>Sub Total: </strong><AmountFormatDisplay name={"Subtotal_" + rowData.SUBTOTAL} value={rowData.SUBTOTAL} /></h6>
                                                    <h6 key={index}><strong>Monto IVA: </strong><AmountFormatDisplay name={"Mtoiva_" + rowData.MTOIVA} value={rowData.MTOIVA} /></h6>
                                                </div>
                                            )
                                        }
                                    }
                                } else {
                                    return null
                                }
                            })
                        )
                    }}

                />
            </CardPanel>
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
