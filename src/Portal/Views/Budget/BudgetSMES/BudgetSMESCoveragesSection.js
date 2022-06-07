import React from 'react'
import Icon from "@material-ui/core/Icon"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import BudgetUtilityTable from 'Portal/Views/Budget/BudgetUtilityTable'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Tooltip from '@material-ui/core/Tooltip'
import CheckIcon from '@material-ui/icons/Check'
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import AmountFormatInput from 'components/Core/NumberFormat/AmountFormatInput'
import SelectSimple from 'components/Core/SelectSimple/SelectSimple'
import CheckBoxSimple from 'components/Core/CheckBox/CheckBoxSimple'

import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

export default function BudgetSMESCoveragesSection(props) {
    const { classes, coveragesData, setCoverageData, planId, planParticularInfo, optionName, budgetCurrencyCode, handleChangesOnCoveragesSection, msgDialog } = props;

    const smesCoverageColumns =
        [
            {
                title: '', field: 'included_indicator',
                render: rowData => (
                    <>{rowData.included_indicator === 'Y' ? (
                        <Tooltip title="Cobertura Incluida" placement="right-start" arrow>
                            <CheckIcon />
                        </Tooltip>) : (<div></div>)}
                    </>

                ),
                editComponent: props => (
                    <>{(props.rowData.coverage_selection_editable === "Y") ? (
                        <CheckBoxSimple
                            checkedValue="Y"
                            uncheckedValue="N"
                            {...props}
                        />) : (<div>{props.rowData.included_indicator === 'Y' ? (
                            <Tooltip title="Cobertura Incluida" placement="right-start" arrow>
                                <CheckIcon />
                            </Tooltip>) : (<div></div>)}
                        </div>)}
                    </>

                ), width: '2%'

            },
            {
                title: 'Partidas / Coberturas', field: 'coverage_description', readonly: true, editable: false, width: '30%',
                headerStyle: {
                    textAlign: 'left'
                }
            },
            {
                title: 'Suma', field: 'insured_amount', type: 'currency',
                render: rowData => (
                    <AmountFormatDisplay
                        name={"InsuredAmountD_" + rowData.coverage_code}
                        value={rowData.insured_amount}
                        prefix={`${budgetCurrencyCode} `}
                    />
                ),
                editable: rowData => (rowData.insured_amount_editable === "Y") ? "onUpdate" : "never",
                editComponent: props => (
                    <>{(props.rowData.insured_amount_editable === "Y") ? (
                        <div className={classes.textRight}>
                            <AmountFormatInput
                                name={"InsuredAmountI_" + props.rowData.coverage_code}
                                placeholder="Suma"
                                prefix={`${budgetCurrencyCode} `}
                                inputProps={{ style: { textAlign: 'right' } }}
                                {...props}
                            />
                        </div>) : (
                        <div className={classes.textRight}>
                            <AmountFormatDisplay
                                name={"InsuredAmountD2_" + props.rowData.coverage_code}
                                value={props.rowData.insured_amount}
                                prefix={`${budgetCurrencyCode} `}

                            />
                        </div>)}
                    </>

                ), width: '25%',
                headerStyle: {
                    textAlign: 'right'
                }

            },
            {
                title: '% Deducible', field: 'deductible_percentage', type: 'numeric',
                render: rowData => (<AmountFormatDisplay name={"DedPercentage_" + rowData.coverage_code} value={rowData.deductible_percentage} />),
                editable: rowData => (rowData.deductible_percentage_editable === "Y") ? "onUpdate" : "never",
                editComponent: ({ value, onChange, rowData }) => {
                    const array = JSON.parse(rowData.deductible_percentage_list)
                    const defaultValueIndex = array.findIndex(element => element.default_value_indicator === "S")
                    const defaultValue = (defaultValueIndex > -1) ? array[defaultValueIndex].value : (array.length > 0) ? array[0].value : null
                    const theValue = (value) ? value : defaultValue
                    const updateWithDefaultValue = (value) ? false : true
                    return (
                        <div className={classes.textRight}>{(rowData.deductible_percentage_editable === "Y" && array.length > 0) ? (
                            <SelectSimple
                                id={"Sel_DedPercentage_ii_" + rowData.coverage_code}
                                value={theValue}
                                onChange={onChange}
                                array={array}
                                defaultValue={defaultValue}
                                withoutLabel
                                updateWithDefaultValue={updateWithDefaultValue}
                            />) :
                            (
                                <AmountFormatDisplay
                                    name={"DedPercentage2_" + rowData.coverage_code}
                                    value={value}
                                />
                            )
                        }
                        </div>
                    )
                }, width: '10%',
                headerStyle: {
                    textAlign: 'center'
                }
            },
            {
                title: 'Monto Deducible', field: 'deductible_amount', type: 'currency',
                editable: "never",
                render: rowData => (
                    <AmountFormatDisplay
                        name={"DedAmountD_" + rowData.coverage_code}
                        value={rowData.deductible_amount}
                        prefix={`${budgetCurrencyCode} `}
                    />
                ), width: '15%',
                headerStyle: {
                    textAlign: 'right'
                }
            },
            {
                title: 'Prima', field: 'premium_amount', type: 'currency',
                editable: "never",
                render: rowData => (
                    <AmountFormatDisplay
                        name={"PremiumAmountD_" + rowData.coverage_code}
                        value={rowData.premium_amount}
                        prefix={`${budgetCurrencyCode} `}
                    />
                ), width: '18%',
                headerStyle: {
                    textAlign: 'right'
                }
            },
        ]

    async function handleCoveragesChanges(e) {
        e.preventDefault();
        await handleChangesOnCoveragesSection()
    }

    const parentChildDataConnectionCoverages = (row, rows) => rows.find(a => a.coverage_code === row.clasification_coverage_sme)
    const isEditableFunctionCoverages = (rowData) => (rowData.product_code && (rowData.insured_amount_editable === 'Y' || rowData.deductible_percentage_editable === 'Y' || rowData.coverage_selection_editable === 'Y'))

    function validateCompleteCoverageInsuredAmount(dataValidate, oldData) {
        
        if ((dataValidate.included_indicator === 'Y') && (typeof dataValidate.insured_amount === 'undefined' || dataValidate.insured_amount === ''
            || parseFloat(dataValidate.insured_amount) <= 0)) {
            msgDialog('Debe indicar un valor para la Suma Asegurada de la cobertura')
            return false
        }
        if (oldData.included_indicator === 'N' && dataValidate.included_indicator === 'N' && !oldData.deductible_percentage && dataValidate.deductible_percentage) {
            return false
        }
        if (!(oldData.included_indicator !== dataValidate.included_indicator
            || parseFloat(oldData.insured_amount) !== parseFloat(dataValidate.insured_amount)
            || parseFloat(oldData.deductible_percentage) !== parseFloat(dataValidate.deductible_percentage))) {
            return false
        }
        return true

    }

    return (
        <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} lg={12}>
                <BudgetUtilityTable
                    classes={classes}
                    columns={smesCoverageColumns}
                    data={coveragesData}
                    isEditableFunction={isEditableFunctionCoverages}
                    parentChildDataConnection={parentChildDataConnectionCoverages}
                    setData={setCoverageData}
                    optionName={optionName}
                    hasRowValidatorFunction
                    rowValidatorFunction={validateCompleteCoverageInsuredAmount}
                //removeOption={removeOption}
                //editOption={editOption}
                />
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>
                <br></br><br></br>
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow key={'total'}>
                                <TableCell component="th" scope="row" colSpan={3} align="center">
                                    <h5>PRIMA TOTAL : <AmountFormatDisplay name={"budgetPlanPremiumAmount" + planId} value={planParticularInfo.budget_plan_premium_amount} prefix={budgetCurrencyCode + " "} /></h5>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>

                </TableContainer>
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>
                <br></br><br></br>
                <p className={classes.textCenter}>
                    <Button color="primary" onClick={handleCoveragesChanges}>
                        <Icon>refresh</Icon> Actualizar Cambios en Cotización
                        </Button>
                </p>
            </GridItem>
        </GridContainer>
    )
}