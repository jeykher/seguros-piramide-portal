import React, {useState,useEffect} from 'react'
import DateMaterialPicker from 'components/Core/Datetime/DateMaterialPicker'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import IconButton from '@material-ui/core/IconButton'
import BackupIcon from '@material-ui/icons/Backup'
import SearchIcon from '@material-ui/icons/Search'
import AmountFormatInput from 'components/Core/NumberFormat/AmountFormatInput'
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import Icon from "@material-ui/core/Icon"
import Tooltip from '@material-ui/core/Tooltip'
import NumberOnlyFormat from 'components/Core/NumberFormat/NumberOnlyFormat'
import "./HealthConsignmentTable.scss"

export default function HealthConsignmentTable(props) {
    

    return(

        <TableMaterial
                options={{
                    pageSize: 10,
                    rowStyle: (rowData) => {
                        if(rowData.INDERRNOCTRL==="S") {
                            return { 
                                backgroundColor: '#ffaaaa4f',
                                opacity: 0.8
                                
                            };
                        }
                    },
                }}
                columns={[
                    {
                        title: 'Nro.Orden', field: 'CASE_NUMBER', editable: 'never'
                    },

                    {
                        title: 'Titular/Paciente', field: 'INSURED_IDENTIFICATION_DETAILS', editable: 'never'
                    },
                    {
                        title: 'Monto Amparado', field: 'APPROVED_AMOUNT_LOCAL_CURRENCY', editable: 'never', type: 'currency', headerStyle: { textAlign: "center" },
                        render: rowData => (<AmountFormatDisplay name={"ApprovedAmount_" + rowData.CASE_NUMBER} value={rowData.APPROVED_AMOUNT_LOCAL_CURRENCY} prefix="Bs. " />),

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
                        title: 'Monto Factura', field: 'INVOICE_AMOUNT', type: 'currency',
                        render: rowData => (<AmountFormatDisplay name={"InvoiceAmountD_" + rowData.CASE_NUMBER} value={rowData.INVOICE_AMOUNT} prefix={rowData.INVOICE_CURRENCY_CODE} />),
                        editComponent: tableData => (<AmountFormatInput name={"InvoiceAmountI_" + tableData.rowData.CASE_NUMBER} prefix={tableData.rowData.INVOICE_CURRENCY_CODE} {...tableData} />)

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
                /*detailPanel={[{
                    tooltip: 'Ver Detalle',
                    render: rowData => {
                        return (
                            props.invoicesInConsignment.map((reg, index) => {
                                if (reg.CASE_NUMBER === rowData.CASE_NUMBER) {
                                    return (
                                        <div>
                                            <h6 key={index}><strong>Titular/Paciente:</strong>{`${reg.INSURED_IDENTIFICATION_DETAILS}`}</h6>
                                            <h6 key={index}><strong>Monto Amparado:</strong> <AmountFormatDisplay name={"ApprovedAmount_" + reg.CASE_NUMBER} value={reg.APPROVED_AMOUNT_LOCAL_CURRENCY} prefix={reg.INVOICE_CURRENCY_CODE} /></h6>
                                        </div>
                                    )
                                } else {
                                    return null
                                }
                            })
                        )
                    }
                }]}*/

                editable= {{
                    isEditable: rowData => rowData.INDERRNOCTRL === 'N', // only name(a) rows would be editable
                    isEditHidden: rowData => rowData.INDERRNOCTRL === 'N',
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            try {
                                props.save(newData, oldData)
                                resolve()
                            } catch (error) {
                                reject()
                            }
                        }),
                }
                }   
                
                icons={{ Edit: e => (<Icon color="primary">edit</Icon>) }}

                actions={[
                    rowData => ({
                        icon:  rowData.INDERRNOCTRL==="S"?'info':'backspace',
                        tooltip: rowData.INDERRNOCTRL==="S"?'Esta orden de servicio esta siendo revisada, no puede ser editada por los momentos':'Borrar Datos',
                        onClick: (event, rowData) => props.handleCleanDetail(rowData),
                        disabled:rowData.INDERRNOCTRL==="S"?true:false,
                        iconProps: {
                            className: rowData.INDERRNOCTRL==="S"?"iconInfo":"iconDelete",
                            color: "primary"
                        },
                    })
                ]}



            />
    )
}