import React, { useEffect, useState } from 'react';
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import Icon from "@material-ui/core/Icon"

import DateMaterialPicker from 'components/Core/Datetime/DateMaterialPicker'
import { format } from 'date-fns'
import { useDialog } from '../../../../context/DialogContext';
export default function RequestInvoicesForm(props) {
    const dialog = useDialog()
    const { handleSetInvoices, invoices, numberInvoice,incidenceDate } = props
    const [columns, setColumns] = useState([
        
        { title: 'Número de Factura',  field: 'invoiceNumber', type: 'numeric', cellStyle: { textAlign: 'center'} },
        { title: 'Número de control',  field: 'controlNumber', cellStyle: { textAlign: 'center'} },
        {
            title: 'Fecha Factura',
            field: 'invoice_date',
            type: 'date',
            editComponent: props => (
              <DateMaterialPicker
                placeholder="Fecha Factura"
                disableFuture
                {...props}
              />
            ),
            cellStyle: {
              textAlign: 'center'
            }
         }
    ]);
    
    const [data, setData] = useState([
        // { amount: 2000, invoiceNumber: 23456 , controlNumber: 345678 },
        // { amount: 5000, invoiceNumber: 6543 , controlNumber: 876543},
    ]);

    return (
        <TableMaterial
            options={{
                pageSize: 5,
                search: false,
                toolbar: true,
                sorting: false,
                draggable: false,
                headerStyle: { textAlign: 'center' },
            }}

            columns={columns}
            data={invoices}
            icons={{
                Add: () => (<Icon color="primary" style={{ fontSize: 30 }}>add_circle</Icon>),
                // Clear: () => (<Icon color="primary">clear</Icon>),
                // Check: () => (<Icon color="primary">check</Icon>),
                 Edit: () => (<Icon color="primary">edit</Icon>),
                 Delete: () => (<Icon color="primary">delete_outline</Icon>),
              }}
            editable={{
                onRowAdd: newData =>
                new Promise((resolve, reject) => {

                    let incidencesDate = new Date(incidenceDate)
                    let invoiceDate = new Date(newData.invoice_date)

                    if (+invoiceDate < +incidencesDate ) {
                        dialog({
                            variant: "info",
                            catchOnCancel: false,
                            title: "Alerta",
                            description: "La fecha de la factura debe ser mayor o igual a la fecha de ocurrencia",
                        })
                        reject()
                        return
                    }

                    const found = invoices.find(element => newData.invoiceNumber.toString().replace(/^0+/, '') === element.invoiceNumber.toString().replace(/^0+/, ''))

                    if(newData.invoiceNumber===undefined || newData.controlNumber===undefined || newData.invoice_date===undefined){
                        dialog({
                            variant: "info",
                            catchOnCancel: false,
                            title: "Alerta",
                            description: "Todos los campos son requeridos",
                        })
                        reject()
                        return
      
                    }else{
                        if(numberInvoice.toString().replace(/^0+/, '')===newData.invoiceNumber.toString().replace(/^0+/, '')){
                            dialog({
                                variant: "info",
                                catchOnCancel: false,
                                title: "Alerta",
                                description: "El número de factura no puede ser igual al número de la factura principal",
                            })
                            reject()
                            return
                         }else{
                            if(newData.invoiceNumber.toString().replace(/^0+/, '') === newData.controlNumber.toString().replace(/^0+/, '')){

                                dialog({
                                    variant: "info",
                                    catchOnCancel: false,
                                    title: "Alerta",
                                    description: "El número de control de la factura no puede ser igual al número de la factura",
                                })
                                reject()
                                return
                                }else{
                                if(found){
                                    dialog({
                                        variant: "info",
                                        catchOnCancel: false,
                                        title: "Alerta",
                                        description: "El número de factura ya está registrado",
                                    })
                                    reject()
                                    return
                                }else{
                                    setTimeout(() => {
            
                                        const newRow = {
                                            invoiceNumber: newData.invoiceNumber.toString().replace(/^0+/, ''),
                                            controlNumber: newData.controlNumber,
                                            invoice_date: format(new Date(newData.invoice_date), 'dd/MM/yyyy')
                                        }
                                    handleSetInvoices([...invoices, newRow]);
                                    
                                    resolve();
                                    }, 1000)
                                }
                            
                            }
                        }
                    }
                }),
                onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                    const dataDelete = [...invoices];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    handleSetInvoices([...dataDelete]);
                    
                    resolve()
                    }, 1000)
                }),
                onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                    const dataUpdate = [...invoices];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    handleSetInvoices([...dataUpdate]);

                    resolve();
                    }, 1000)
                }),
                
            }}
            />
    );
}

