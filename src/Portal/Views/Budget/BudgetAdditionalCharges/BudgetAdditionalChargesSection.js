import React, { useState, useEffect } from 'react'
import Axios from 'axios'

import Icon from "@material-ui/core/Icon"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import AmountFormatInput from 'components/Core/NumberFormat/AmountFormatInput'
import SelectSimple from 'components/Core/SelectSimple/SelectSimple'
import MaterialTable from 'material-table'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

export default function BudgetAdditionalChargesSection(props) {
    const { classes, additionalChargesData, setAdditionalChargesData, availableAdditionalCharges, planId, optionName, budgetPlanPremiumAmount, budgetCurrencyCode, handleChangesOnChargesSection, msgDialog } = props;

    const chargesColumns =
        [
            {
                title: 'Recargos / Descuentos', field: 'charge_acsel_key',
                render: rowData => (<div className={classes.textLeft}>{rowData.budget_addi_charge_description}</div>),
                //editable: rowData => (typeof rowData.value === 'undefined') ? "onAdd" : "never",
                editComponent: props => {
                    console.log('Las props')
                    console.log(props)
                    return (
                        <>{

                            (!props.rowData.charge_acsel_key && availableAdditionalCharges.length > 0) ? (
                                <SelectSimple
                                    id={"Sel_Budget_AddiCharge_" + props.rowData.charge_acsel_key}
                                    onChange={(value) => {
                                        const i = availableAdditionalCharges.findIndex(element => element.value === value)
                                        props.rowData.budget_addi_charge_description = availableAdditionalCharges[i].descrip
                                        props.onChange(value)

                                    }
                                    }
                                    array={availableAdditionalCharges}
                                    label='Seleccione'
                                    classNameForm={classes.containerSelect}
                                />) :
                                (
                                    <div className={classes.textLeft}>{props.rowData.budget_addi_charge_description}</div>
                                )
                        }
                        </>
                    )
                }, width: '70%',
                headerStyle: {
                    textAlign: 'left'
                }
            },
            {
                title: 'Porcentaje', field: 'charge_percentage', type: 'numeric',
                render: rowData => (<AmountFormatDisplay name={"Charge_Percentage_D" + rowData.charge_percentage} value={rowData.charge_percentage} />),
                editComponent: props => (
                    <div className={classes.textRight} >
                        <AmountFormatInput
                            name={"Charge_Percentage_I_" + props.rowData.charge_acsel_key}
                            placeholder="Porcentaje"
                            inputProps={{ style: { textAlign: 'right' } }}
                            {...props}
                        />
                    </div>
                ),
                headerStyle: {
                    textAlign: 'right'
                }, width: '30%'
            },
        ]


    async function handleChargesChanges(e) {
        e.preventDefault();
        await handleChangesOnChargesSection()
    }
    return (
        <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={8} lg={8}>
                <MaterialTable
                    title={optionName}
                    columns={chargesColumns}
                    data={additionalChargesData}
                    editable={{
                        onRowAdd: newData =>
                            new Promise((resolve, reject) => {
                                // if (validateAddCharge(newData)) {
                                const chargeAcselTypeAndCode = newData.charge_acsel_key.split('-')
                                newData.acsel_charge_type = chargeAcselTypeAndCode[0]
                                newData.acsel_charge_code = chargeAcselTypeAndCode[1]
                                const newArrayData = [...additionalChargesData, newData]
                                setAdditionalChargesData([...newArrayData], newData, 'CREATE')
                                //filterAvailableAdditionalCharges()
                                resolve()
                                /* } else {
                                     reject()
                                 }*/
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                                //if (validateUpdateCharge(newData, oldData)) {
                                const arrayDataUpdate = [...additionalChargesData]
                                const index = oldData.tableData.id
                                arrayDataUpdate[index] = newData
                                setAdditionalChargesData([...arrayDataUpdate], newData, 'UPDATE')
                                resolve()
                                /*} else {
                                    reject()
                                }*/
                            }),
                        onRowDelete: oldData =>
                            new Promise((resolve, reject) => {
                                //if (validateDeleteCharge(newData)) {
                                const arrayDataDelete = [...additionalChargesData]
                                const index = oldData.tableData.id
                                arrayDataDelete.splice(index, 1)
                                setAdditionalChargesData([...arrayDataDelete], oldData, 'DELETE')
                                resolve()
                                /* } else {
                                     reject()
                                 }*/
                            })
                    }}
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
                            emptyDataSourceMessage: 'No hay registros para mostrar',
                            deleteTooltip: 'Eliminar',
                            editTooltip: 'Editar',
                            addTooltip: 'Agregar Nuevo',
                            filterRow: {
                                filterTooltip: 'Filtro'
                            },
                            editTooltip: 'Editar',
                            editRow: {
                                cancelTooltip: 'Cancelar',
                                saveTooltip: 'Guardar',
                                deleteText: '¿Desea eliminar este registro?'
                            }
                        },
                        toolbar: {
                            searchTooltip: 'Buscar',
                            searchPlaceholder: 'Buscar'
                        },
                        /*pagination: {
                        labelDisplayedRows: '{from}-{to} de {count}',
                        labelRowsSelect: 'filas',
                        labelRowsPerPage: 'Filas por página',
                        firstAriaLabel: 'Primera página',
                        firstTooltip: 'Primera página',
                        previousAriaLabel: 'Página anterior',
                        previousTooltip: 'Página anterior',
                        nextAriaLabel: 'Página siguiente',
                        nextTooltip: 'Página siguiente',
                        lastAriaLabel: 'Última página',
                        lastTooltip: 'Última página'
                        },*/
                        header: {
                            actions: 'Acciones'
                        }
                    }}
                />
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>
                <br></br><br></br>
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow key={'total'}>
                                <TableCell component="th" scope="row" colSpan={3} align="center">
                                    <h5>PRIMA TOTAL : <AmountFormatDisplay name={"budgetPlanPremiumAmount" + planId} value={budgetPlanPremiumAmount} prefix={budgetCurrencyCode + " "} /></h5>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>

                </TableContainer>
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>
                <br></br><br></br>
                <p className={classes.textCenter}>
                    <Button color="primary" onClick={handleChargesChanges}>
                        <Icon>refresh</Icon> Actualizar Cambios en Cotización
                        </Button>
                </p>
            </GridItem>
        </GridContainer>
    )

}