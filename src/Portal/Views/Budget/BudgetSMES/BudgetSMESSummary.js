import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import BudgetLayout from 'Portal/Views/Budget/BudgetLayout'
import { makeStyles } from '@material-ui/core/styles'
import Icon from "@material-ui/core/Icon"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import MaterialTable from 'material-table';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Cardpanel from 'components/Core/Card/CardPanel'
import Card from "components/material-dashboard-pro-react/components/Card/Card";
import CardBody from 'components/material-dashboard-pro-react/components/Card/CardBody';

const useStyles = makeStyles({
    table: {
        minWidth: 600,
    },
    containerTable: {
        width: '98%'
    },
})

export default function BudgetSMESSummary(props) {
    const { objBudget, onBack, onFinish } = props;
    const planToBuy = objBudget.getPlanBuy()
    const planId = planToBuy.plan_id
    const assetsData = planToBuy.assetsAndRiskValues.filter(asset => asset.asset_value_amount > 0)
    const planParticularInfo = planToBuy.budgetPlanParticularInfo
    const budgetCurrencyCode = objBudget.budgetInfo.currency_code
    const classes = useStyles();
    const title = 'Resumen ' + objBudget.info[0].BUDGET_DESCRIPTION
    
    async function onEmit(data) {
        const params = {
            p_budget_id: objBudget.info[0].BUDGET_ID
        }
        await Axios.post('/dbo/budgets/emit_smes_budget', params)
        onFinish()
    }

    const smesAssetsRiskColumns =
        [
            {
                title: 'Bien', field: 'asset_description', readonly: true, editable: false,
                headerStyle: {
                    textAlign: 'left'
                }, width: '30%'
            },
            {
                title: 'Suma', field: 'asset_value_amount', type: 'currency', readonly: true, editable: false,
                render: rowData => (
                    <AmountFormatDisplay
                        name={"AssetAmountD_" + rowData.asset_class}
                        value={rowData.asset_value_amount}
                        prefix={`${budgetCurrencyCode} `}
                    />
                ),
                headerStyle: {
                    textAlign: 'right'
                }, width: '30%'
            },
            {
                title: '% Incendio', field: 'fire_risk_percentage', type: 'numeric', readonly: true, editable: false,
                render: rowData => (<AmountFormatDisplay name={"Fire_Risk_PercentageD_" + rowData.asset_class} value={rowData.fire_risk_percentage} />),
                headerStyle: {
                    textAlign: 'center'
                }, width: '10%'
            },
            {
                title: '% Terremoto', field: 'earthquake_risk_percentage', type: 'numeric', readonly: true, editable: false,
                render: rowData => (<AmountFormatDisplay name={"EarthQ_Risk_PercentageD_" + rowData.asset_class} value={rowData.earthquake_risk_percentage} />),
                headerStyle: {
                    textAlign: 'center'
                }, width: '10%'
            },
            {
                title: '% Motín', field: 'riot_risk_percentage', type: 'numeric', readonly: true, editable: false,
                render: rowData => (<AmountFormatDisplay name={"Riot_Risk_PercentageD_" + rowData.asset_class} value={rowData.riot_risk_percentage} />),
                headerStyle: {
                    textAlign: 'center'
                }, width: '10%'
            },
            {
                title: '¿Robo?', field: 'has_stole_risk_percentage', readonly: true, editable: false,
                lookup: { 'Y': 'Si', 'N': 'No' },
                cellStyle: {
                    textAlign: 'center'
                },
                headerStyle: {
                    textAlign: 'center'
                }, width: '10%'
            },
        ]



    const parentChildDataConnectionAssets = (row, rows) => rows.find(a => a.asset_class === row.asset_risk_group)


    return (
        <BudgetLayout objBudget={objBudget} title={title}>
            <div className={classes.containerTable}>
                <GridContainer justify="center" >
                    <GridItem xs={12} sm={12} md={12} lg={12} >
                        <Cardpanel titulo="Bienes y Valores a Riesgo" icon="home_work" iconColor="primary">
                            <MaterialTable

                                columns={smesAssetsRiskColumns}
                                data={assetsData}
                                parentChildData={(row, rows) => parentChildDataConnectionAssets(row, rows)}
                                options={{
                                    actionsColumnIndex: -1,
                                    //pageSize: 10,     
                                    paging: false,
                                    defaultExpanded: true,
                                    search: false,
                                    toolbar: false,
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
                                        /*editTooltip: 'Editar',*/
                                        emptyDataSourceMessage: 'No hay registros para mostrar',
                                        /*editRow: {
                                            saveTooltip: 'Guardar',
                                            cancelTooltip: 'Cancelar',
                                        }*/
                                    },
                                    /*toolbar: {
                                        searchTooltip: 'Buscar',
                                        searchPlaceholder: 'Buscar'
                                    },
        
                                    header: {
                                        actions: 'Acción'
                                    }*/
                                }}
                            />
                        </Cardpanel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={8} lg={8}>
                
                        <Card>
                            <CardBody>
                                <TableContainer component={Paper}>
                                    <Table className={classes.table} size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Porcentaje para Robo
                                </TableCell>
                                                <TableCell fullWidth align="right">
                                                    <AmountFormatDisplay name={"assetsStoleRiskPercentage" + planId} prefix={'%'} value={planParticularInfo.assets_stole_risk_percentage} />
                                                </TableCell>
                                                <TableCell component="th" scope="row"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow key={'sub-total'}>
                                                <TableCell component="th" scope="row"><h5>SUB TOTAL:</h5></TableCell>
                                                <TableCell scope="row" fullWidth align="right"><h5><AmountFormatDisplay name={"assetValueAmount" + planId} value={planParticularInfo.assets_subtotal_amount} prefix={budgetCurrencyCode + " "} /></h5></TableCell>
                                                <TableCell component="th" scope="row"></TableCell>
                                            </TableRow>
                                            <TableRow key={'1'}>
                                                <TableCell scope="row">Pérdidas indirectas</TableCell>
                                                <TableCell scope="row" fullWidth align="right"><AmountFormatDisplay name={"amountIndirectLoss" + planId} value={planParticularInfo.amount_indirect_loss} prefix={budgetCurrencyCode + " "} /></TableCell>
                                                <TableCell component="th" scope="row"></TableCell>
                                            </TableRow>
                                            <TableRow key={'2'}>
                                                <TableCell scope="row">Pérdidas de Renta</TableCell>
                                                <TableCell scope="row" fullWidth align="right"><AmountFormatDisplay name={"rentLossTotalAmount" + planId} value={planParticularInfo.rent_loss_total_amount} prefix={budgetCurrencyCode + " "} /></TableCell>
                                                <TableCell component="th" scope="row"></TableCell>
                                            </TableRow>
                                            <TableRow key={'total-risk-values'}>
                                                <TableCell component="th" scope="row">
                                                    <h5>TOTAL VALORES A RIESGO:</h5>
                                                </TableCell>
                                                <TableCell component="th" scope="row" fullWidth align="right"><h5><AmountFormatDisplay name={"budgetPlanInsuredAmount" + planId} value={planParticularInfo.budget_plan_insured_amount} prefix={budgetCurrencyCode + " "} /></h5></TableCell>
                                                <TableCell component="th" scope="row"></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>

                                </TableContainer>
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem item xs={12} sm={12} md={12} lg={12}>
                        <br></br><br></br>
                        <GridContainer justify="flex-end">
                            <Button onClick={onBack}><Icon>fast_rewind</Icon> Regresar</Button>
                            <Button color="primary" type="submit" onClick={onEmit}>
                                <Icon>send</Icon> Siguiente
                        </Button>
                        </GridContainer>
                    </GridItem>
                </GridContainer >
            </div>
        </BudgetLayout>
    )
}