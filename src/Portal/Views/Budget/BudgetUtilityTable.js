import React, { useState } from 'react'

import MaterialTable from 'material-table';


export default function BudgetUtilityTable(props) {
    const { columns, data, setData, optionName, hasRowValidatorFunction, rowValidatorFunction, parentChildDataConnection, isEditableFunction } = props;
    //const [validated, setValidated] = useState(false)

    const validateRow = (dataValidate, oldData) => {
        let validatedResult = true 
        if (hasRowValidatorFunction) {
            validatedResult = rowValidatorFunction(dataValidate, oldData)
        }
        return validatedResult
    }

    return (
        <MaterialTable
            title={optionName}
            columns={columns}
            data={data}
            editable={{
                isEditable: rowData => isEditableFunction(rowData),
                /*onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                    return new Promise((resolve, reject) => {
                      console.log('newValue: ' + newValue);
                      resolve()
                    });
                },*/
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                        if (validateRow(newData, oldData)) {
                            const dataUpdate = [...data];
                            const index = oldData.tableData.id;
                            dataUpdate[index] = newData;
                            setData([...dataUpdate], index);
                            resolve()
                        } else {
                            reject()
                        }
                    }),
            }}
            parentChildData={(row, rows) => parentChildDataConnection(row, rows)}
            options={{
                actionsColumnIndex: -1,
                //pageSize: 10,     
                paging: false,
                defaultExpanded: true,
                headerStyle: {
                    backgroundColor: '#ccc',
                    color: '#000',
                    textAlign: 'center'
                },
                rowStyle: rowData => ({
                    backgroundColor: (rowData.is_parent === 'Y') ? "#EEE" : null
                  })                
            }}
            localization={{
                body: {
                    editTooltip: 'Editar',
                    emptyDataSourceMessage: 'No hay registros para mostrar',
                    editRow: {
                        saveTooltip: 'Guardar',
                        cancelTooltip: 'Cancelar',
                    }
                },
                toolbar: {
                    searchTooltip: 'Buscar',
                    searchPlaceholder: 'Buscar'
                },
                /*pagination: {
                labelDisplayedRows: '{from}-{to} de {count}',
                labelRowsSelect: 'filas',
                labelRowsPerPage: 'Filas por p??gina',
                firstAriaLabel: 'Primera p??gina',
                firstTooltip: 'Primera p??gina',
                previousAriaLabel: 'P??gina anterior',
                previousTooltip: 'P??gina anterior',
                nextAriaLabel: 'P??gina siguiente',
                nextTooltip: 'P??gina siguiente',
                lastAriaLabel: '??ltima p??gina',
                lastTooltip: '??ltima p??gina'
                },*/
                header: {
                    actions: 'Acci??n'
                }
            }}
        />

    )
}