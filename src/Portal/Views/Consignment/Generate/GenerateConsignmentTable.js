import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { navigate } from 'gatsby'
import { useDialog } from 'context/DialogContext'
import ModalDocumentViewer from '../../Digitization/ModalDocumentViewer'
import { format } from 'date-fns'
import GenerateConsignmentTotals from './GenerateConsignmentTotals'
import Icon from "@material-ui/core/Icon"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import { getProfileHome } from 'utils/auth';
import HealthConsignmentTable from './HealthConsignmentTable'
import AutoConsignmentTable from './AutoConsignmentTable'


export default function GenerateConsignmentTable({ providerCode, insuranceArea }) {
    const [invoicesInConsignment, setInvoicesInConsignment] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const dialog = useDialog()
    const [params, setParams] = useState()
    const [openModalDocumentViewer, setOpenModalDocumentViewer] = useState(false);
    const [approvedAmountTotal, setApprovedAmountTotal] = useState()
    const [invoicesAmountTotal, setInvoicesAmountTotal] = useState()
    const [invoicesCount, setInvoicesCount] = useState()
    const urlApiGetDocument = '/dbo/consignment/get_invoice_document/get_blob/result/invoice_document'
    const documentTitle = 'Factura de Servicio Salud'
    const [invoicesWithFileUploaded, setInvoicesWithFileUploaded] = useState([])

    async function getInvoicesInConsignment() {
        try {
            setIsLoading(true);
            const params = providerCode ? { p_provider_code: providerCode, p_insurance_area: insuranceArea/*'0004'*/ } : { p_insurance_area: insuranceArea/*'0004'*/ }
            const consignment = await Axios.post('/dbo/consignment/get_candidates_no_p', params)
            setInvoicesInConsignment(consignment.data.result)
            setInvoicesWithFileUploaded(consignment.data.result)
            setIsLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    async function setTotals(data) {
        const approvedTotal = data.reduce(function (total, currentValue) {
            if (currentValue.INCLUDED === 'S') {
                return total + ((insuranceArea === '0004') ? currentValue.APPROVED_AMOUNT_LOCAL_CURRENCY : (insuranceArea === '0002') ? currentValue.INVOICE_BASE_AMOUNT : 0)
            } else {
                return total
            }
        }, 0)
        setApprovedAmountTotal(approvedTotal)

        setInvoicesAmountTotal(data.reduce(function (total, currentValue) {
            if (currentValue.INCLUDED === 'S') {
                return total + Number(currentValue.INVOICE_AMOUNT)
            } else {
                return total
            }
        }, 0))

        setInvoicesCount(data.reduce(function (total, currentValue) {
            if (currentValue.INCLUDED === 'S') {
                return total + 1
            } else {
                return total
            }
        }, 0))
    }

    useEffect(() => {
        getInvoicesInConsignment()
    }, [])

    useEffect(() => {
        invoicesInConsignment && setTotals(invoicesInConsignment)
    }, [invoicesInConsignment])

    async function handleInvoiceFileChange(e, params) {
        try {
            if (e.target.files[0].type !== "application/pdf") {
                dialog({
                    variant: "info",
                    catchOnCancel: false,
                    title: "Alerta",
                    description: "El documento debe estar en formato PDF"
                })
                throw "El documento debe estar en formato PDF"
            }
            const row = params.rowData
            const parameters = {}
            
            let invoicesWithFilesEditionVariable = [...invoicesWithFileUploaded];
            const data = new FormData()
            //invoices[row.tableData.id].INVOICE_DATE = setAuxiliarValue(row.INVOICE_DATE)
            data.append('file', e.target.files[0])
            parameters.batch_invoicing_id = row.BATCH_INVOICING_ID
            parameters.insurance_area = insuranceArea
            if (insuranceArea === '0004') {
                parameters.preadmission_id = row.PREADMISSION_ID
                parameters.complement_id = row.COMPLEMENT_ID
            } else if (insuranceArea === '0002') {
                parameters.order_number = row.ORDER_NUMBER
            }
            data.append('parameters', JSON.stringify(parameters))
            await Axios.post('/uploadfile_docuware_blob/consignment/add_invoice_document', data)
            //invoices[row.tableData.id].invoiceDocumentUploaded = 'S'
            invoicesWithFilesEditionVariable[row.tableData.id].invoiceDocumentUploaded = 'S'
            setInvoicesWithFileUploaded([...invoicesWithFilesEditionVariable])
            dialog({
                variant: "info",
                catchOnCancel: false,
                title: "",
                description: "¡Archivo de la factura actualizado exitosamente!"
            })
        } catch (error) {
            console.error(error)
            dialog({
                variant: "info",
                catchOnCancel: false,
                title: "Alerta",
                description: "El archivo no pudo ser cargado, verifique la velocidad de carga de su internet e intente nuevamente"
            })
        }
    }

    async function save(newData, oldData) {
        
        if (newData.INVOICE_DATE != oldData.INVOICE_DATE
            || newData.INVOICE_NUMBER != oldData.INVOICE_NUMBER
            || newData.INVOICE_CONTROL_NUMBER != oldData.INVOICE_CONTROL_NUMBER
            || newData.INVOICE_AMOUNT != oldData.INVOICE_AMOUNT
            || ((!newData.invoiceDocumentUploaded || newData.invoiceDocumentUploaded === 'N') && oldData.invoiceDocumentUploaded === 'S')
        ) {
            if (!newData.INVOICE_AMOUNT) {
                dialog({
                    variant: "info",
                    catchOnCancel: false,
                    title: "Alerta",
                    description: "Monto de la Factura no puede estar vacío"
                })
                throw "Monto de la Factura no puede estar vacío"
            }

            let data = [...invoicesInConsignment];
            let dataControlFileUploaded = [...invoicesWithFileUploaded]

            const index = data.indexOf(oldData);
            data[index] = newData;
            
            if (newData.INVOICE_DATE != oldData.INVOICE_DATE
                || newData.INVOICE_NUMBER != oldData.INVOICE_NUMBER
                || newData.INVOICE_CONTROL_NUMBER != oldData.INVOICE_CONTROL_NUMBER
                || newData.INVOICE_AMOUNT != oldData.INVOICE_AMOUNT) {
                if (newData.INVOICE_DATE != oldData.INVOICE_DATE) {
                    data[index].INVOICE_DATE = format(new Date(data[index].INVOICE_DATE), 'dd/MM/yyyy')
                }
                const detailJsonData = {... data[index], insurance_area : insuranceArea}
                const params = { p_detail_json_data: JSON.stringify(detailJsonData) }
                await Axios.post('/dbo/consignment/modify_detail', params)
            }
            
            data[index].invoiceDocumentUploaded = dataControlFileUploaded[index].invoiceDocumentUploaded

            if (data[index].INVOICE_DATE
                && data[index].INVOICE_NUMBER
                && data[index].INVOICE_CONTROL_NUMBER) {
                if (data[index].uploadDocumentRequired === 'N' || data[index].invoiceDocumentUploaded === 'S') {
                    const identifierNumberRowIncluded = (insuranceArea === '0004') ? data[index].CASE_NUMBER : (insuranceArea === '0002') ? data[index].ORDER_NUMBER : null
                    data[index].INCLUDED = 'S'
                    dialog({
                        variant: "info",
                        catchOnCancel: false,
                        title: "",
                        description: "La orden número " + identifierNumberRowIncluded + " fue incluida en la remesa"
                    })
                } else {
                    dialog({
                        variant: "info",
                        catchOnCancel: false,
                        title: "Alerta",
                        description: "Recuerda que debes subir el documento físico de la factura para poder incluir la orden en la remesa"
                    })
                }
            } else {
                data[index].INCLUDED = 'N'
                dialog({
                    variant: "info",
                    catchOnCancel: false,
                    title: "Alerta",
                    description: "Recuerda completar todos los datos de la factura para poder incluir la orden en la remesa"
                })
            }

            data.forEach(function (e, index) {
                e.invoiceDocumentUploaded = dataControlFileUploaded[index].invoiceDocumentUploaded
            })

            data.sort(function (a, b) {
                if ((a.INCLUDED === 'S') && (b.INCLUDED === 'N')) {
                    return - 1
                }
                else if ((a.INCLUDED === 'N') && (b.INCLUDED === 'S')) {
                    return 1
                } else {
                    return 0
                }
            });

            setInvoicesInConsignment([...data]);
            setInvoicesWithFileUploaded([...data]);
        }
    }

    async function cleanDetail(row) {
        let data = [...invoicesInConsignment]
        let dataControlFileUploaded = [...invoicesWithFileUploaded]
        const index = data.indexOf(row);
        const params = { p_detail_json_data: JSON.stringify(data[index]) }
        const urlApiService = (insuranceArea === '0004') ? '/dbo/consignment/clean_health_detail' : (insuranceArea === '0002') ? '/dbo/consignment/clean_auto_detail' : null
    
        await Axios.post(urlApiService, params) 
        
        data.forEach(function (e, index) {
            e.invoiceDocumentUploaded = dataControlFileUploaded[index].invoiceDocumentUploaded
        })

        data[index].INVOICE_DATE = null
        data[index].INVOICE_NUMBER = null
        data[index].INVOICE_CONTROL_NUMBER = null
        data[index].invoiceDocumentUploaded = 'N'
        data[index].INCLUDED = 'N'

        data.sort(function (a, b) {
            if ((a.INCLUDED === 'S') && (b.INCLUDED === 'N')) {
                return - 1
            }
            else if ((a.INCLUDED === 'N') && (b.INCLUDED === 'S')) {
                return 1
            } else {
                return 0
            }
        });

        setInvoicesInConsignment([...data])
        setInvoicesWithFileUploaded([...data])
    }

    async function cleanAllDetails() {

        const params = {}
        let data = [...invoicesInConsignment]
        const urlApiService = (insuranceArea === '0004') ? '/dbo/consignment/clean_all_health_details' : (insuranceArea === '0002') ? '/dbo/consignment/clean_all_auto_details' : null
        await Axios.post(urlApiService, params)
        data.forEach(function (e) {
            e.INVOICE_DATE = null
            e.INVOICE_NUMBER = null
            e.INVOICE_CONTROL_NUMBER = null
            e.INCLUDED = 'N'
            e.invoiceDocumentUploaded = 'N'
        })
        
        setInvoicesInConsignment([...data])
        setInvoicesWithFileUploaded([...data])

    }

    const handleCleanDetail = (rowData) => {
        dialog({
            variant: "danger",
            catchOnCancel: false,
            resolve: () => cleanDetail(rowData),
            title: "Confirmación",
            description: "¿Está seguro de borrar los datos de la orden?"
        })
    }

    const handleCleanAllDetails = () => {
        dialog({
            variant: "danger",
            catchOnCancel: false,
            resolve: () => cleanAllDetails(),
            title: "Confirmación",
            description: "¿Está seguro de borrar los datos de todas las órdenes?"
        })
    }



    const handleOpenModalDocumentViewer = (e, row) => {
        let parameters = {}
        let identifier
        parameters.batch_invoicing_id = row.BATCH_INVOICING_ID
        parameters.insurance_area = insuranceArea
      
        if (insuranceArea === '0004') {
            parameters.preadmission_id = row.PREADMISSION_ID
            parameters.complement_id = row.COMPLEMENT_ID
            identifier = row.BATCH_INVOICING_ID + '-' + row.PREADMISSION_ID + '-' + row.COMPLEMENT_ID
        } else if (insuranceArea === '0002') {
            parameters.order_number = row.ORDER_NUMBER
            identifier = row.BATCH_INVOICING_ID + '-'  + row.ORDER_NUMBER
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

    async function sendConsignment() {
        try {
            if (invoicesCount === 0) {
                dialog({
                    variant: "info",
                    catchOnCancel: false,
                    title: "Alerta",
                    description: "Debe completar y guardar todos los datos de al menos una factura"
                })
                throw "Debe completar y guardar todos los datos de al menos una factura"
            }
            const params = providerCode ? { p_provider_code: providerCode} : {}
            const response = await Axios.post('/dbo/consignment/process_batch_invoicing', params)
            const coreConsingmentNumber = response.data.p_core_batch_invoicing_number
            dialog({
                variant: "info",
                catchOnCancel: false,
                title: "",
                description: "La remesa fue enviada exitosamente y registrada con el Nro. " + coreConsingmentNumber
            })
            navigate(getProfileHome());
        } catch (error) {
            console.error(error)
        }
    }

    function handleBack(e) {
        e.preventDefault();
        window.history.back()
    }


    function setAuxiliarValue(dateVal) {
        if (dateVal && dateVal != 'Invalid Date') {
            return (dateVal.length === 10) ? dateVal : format(new Date(dateVal), 'dd/MM/yyyy')
        }

    }

    return (
        <div>
            {insuranceArea === '0004' && <HealthConsignmentTable
                invoicesInConsignment={invoicesInConsignment}
                isLoading={isLoading}
                setAuxiliarValue={setAuxiliarValue}
                handleOpenModalDocumentViewer={handleOpenModalDocumentViewer}
                handleInvoiceFileChange={handleInvoiceFileChange}
                save={save}
                handleCleanDetail={handleCleanDetail}
            />}

            {insuranceArea === '0002' && <AutoConsignmentTable
                invoicesInConsignment={invoicesInConsignment}
                isLoading={isLoading}
                setAuxiliarValue={setAuxiliarValue}
                handleOpenModalDocumentViewer={handleOpenModalDocumentViewer}
                handleInvoiceFileChange={handleInvoiceFileChange}
                save={save}
                handleCleanDetail={handleCleanDetail}
            />}
            <GenerateConsignmentTotals
                totalApproved={approvedAmountTotal}
                totalInvoices={invoicesAmountTotal}
                countInvoices={invoicesCount}
                insuranceArea={insuranceArea}
            />
            <GridContainer justify="center">
                <Button color="secondary" onClick={handleBack}>
                    <Icon>fast_rewind</Icon> Regresar
                        </Button>
                <Button color="secondary" onClick={handleCleanAllDetails}>
                    <Icon>backspace</Icon> Limpiar
                        </Button>
                <Button color="primary" onClick={sendConsignment}>
                    <Icon>send</Icon> Enviar
                        </Button>
            </GridContainer>
            <ModalDocumentViewer
                open={openModalDocumentViewer}
                handleClose={handleCloseModalDocumentViewer}
                apiGetDocument={urlApiGetDocument}
                params={params}
                title={documentTitle}
            />
        </div>
    )
}
