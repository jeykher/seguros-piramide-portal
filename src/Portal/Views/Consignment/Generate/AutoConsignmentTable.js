import React from 'react'
import DateMaterialPicker from 'components/Core/Datetime/DateMaterialPicker'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import IconButton from '@material-ui/core/IconButton'
import BackupIcon from '@material-ui/icons/Backup'
import SearchIcon from '@material-ui/icons/Search'
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import Icon from "@material-ui/core/Icon"
import Tooltip from '@material-ui/core/Tooltip'
import NumberOnlyFormat from 'components/Core/NumberFormat/NumberOnlyFormat'

export default function AutoConsignmentTable(props) {
    

    return(

        <TableMaterial
                options={{
                    pageSize: 10,
                }}
                columns={[
                    {
                        title: 'Nro. Orden', field: 'ORDER_NUMBER', editable: 'never'
                    },
                    {
                        title: 'Nro. Declaración', field: 'DECLARATION_NUMBER', editable: 'never'
                    },
                    {
                        title: 'Subtotal Orden', field: 'INVOICE_BASE_AMOUNT', editable: 'never', type: 'currency', headerStyle: { textAlign: "center" },
                        render: rowData => (<AmountFormatDisplay name={"BaseAmount_" + rowData.ORDER_NUMBER} value={rowData.INVOICE_BASE_AMOUNT} prefix={rowData.INVOICE_CURRENCY_CODE} />),

                    },
                    {
                        title: 'Monto Iva', field: 'INVOICE_TAX_AMOUNT', editable: 'never', type: 'currency', headerStyle: { textAlign: "center" },
                        render: rowData => (<AmountFormatDisplay name={"TaxAmount_" + rowData.ORDER_NUMBER} value={rowData.INVOICE_TAX_AMOUNT} prefix={rowData.INVOICE_CURRENCY_CODE} />),

                    },
                    {
                        title: 'Monto Total Factura', field: 'INVOICE_AMOUNT', editable: 'never', type: 'currency', headerStyle: { textAlign: "center" },
                        render: rowData => (<AmountFormatDisplay name={"Amount_" + rowData.ORDER_NUMBER} value={rowData.INVOICE_AMOUNT} prefix={rowData.INVOICE_CURRENCY_CODE} />),

                    },
                    {
                        title: 'Facturar a', field: 'BILL_TO', editable: 'never'
                    },
                    {
                        title: 'Nro. Factura', field: 'INVOICE_NUMBER', editable: 'onUpdate',
                        editComponent: tableData => (<NumberOnlyFormat name={"InvoiceNumber_" + tableData.rowData.CASE_NUMBER}  {...tableData} />)
                    },
                    {
                        title: 'Nro. Control', field: 'INVOICE_CONTROL_NUMBER', editable: 'onUpdate',
                        editComponent: tableData => (<NumberOnlyFormat name={"InvoiceControlNumber_" + tableData.rowData.CASE_NUMBER}  {...tableData} />)
                    },
                    {
                        title: 'Fecha Factura', field: 'INVOICE_DATE', editComponent: tableData => (
                            <DateMaterialPicker name={"DateInvoicePicker_" + tableData.rowData.CASE_NUMBER} auxiliarValue={props.setAuxiliarValue(tableData.rowData.INVOICE_DATE)} {...tableData} />
                        )
                    },
                    {
                        title: 'Archivo Factura', field: 'archivo',
                        render: rowData => (
                            <div>{rowData.invoiceDocumentUploaded === 'S' ? (
                                <Tooltip title="Ver Factura" placement="right-start" arrow>
                                    <IconButton color="primary" component="span" onClick={(event) => props.handleOpenModalDocumentViewer(event, rowData)}>
                                        <SearchIcon />
                                    </IconButton>
                                </Tooltip>) : (<div></div>)}
                            </div>

                        ),
                        editComponent: tableData => (
                            <React.Fragment>
                                <input className="input-file" accept="application/pdf" id={`icon-button-file-${tableData.rowData.CASE_NUMBER}`}
                                    onChange={(e) => props.handleInvoiceFileChange(e, tableData)} type="file" />
                                <label htmlFor={`icon-button-file-${tableData.rowData.CASE_NUMBER}`}>
                                    <Tooltip title="Subir Factura" placement="right-start" arrow>
                                        <IconButton color="primary" aria-label="upload picture" component="span">
                                            <BackupIcon />
                                        </IconButton>
                                    </Tooltip>
                                </label>
                            </React.Fragment>
                        )
                    }
                ]}
                data={props.invoicesInConsignment}
                isLoading={props.isLoading}                
                editable={{
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            try {
                                props.save(newData, oldData)
                                resolve()
                            } catch (error) {
                                reject()
                            }
                        }),
                    iconProps: { color: "primary" },
                }
                }
                icons={{ Edit: e => (<Icon color="primary">edit</Icon>) }}

                actions={[
                    {
                        icon: 'backspace',
                        iconProps: { color: "primary" },
                        tooltip: 'Borrar Datos ',
                        onClick: (event, rowData) => props.handleCleanDetail(rowData),
                    }
                ]}
            />
    )
}