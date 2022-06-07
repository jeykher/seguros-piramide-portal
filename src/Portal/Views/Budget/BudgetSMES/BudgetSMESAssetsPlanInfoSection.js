import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import Icon from "@material-ui/core/Icon"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import BudgetUtilityTable from 'Portal/Views/Budget/BudgetUtilityTable'
import BudgetSMESAssetsRiskTotals from 'Portal/Views/Budget/BudgetSMES/BudgetSMESAssetsRiskTotals'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import AmountFormatInput from 'components/Core/NumberFormat/AmountFormatInput'
import CheckBoxSimple from 'components/Core/CheckBox/CheckBoxSimple'





export default function BudgetSMESAssetsPlanInfoSection(props) {
    const { classes, assetsData, setAssetsData, optionName, planParticularInfo, planId, budgetCurrencyCode, availableIndirectLossesPercent, msgDialog, objForm } = props;
    

    const smesAssetsRiskColumns =
        [
            {
                title: 'Bien', field: 'asset_description', readonly: true, editable: 'never',
                headerStyle: {
                    textAlign: 'left'
                }, width: '30%'
            },
            {
                title: 'Suma', field: 'asset_value_amount', type: 'currency',
                render: rowData => (
                    <AmountFormatDisplay
                        name={"AssetAmountD_" + rowData.asset_class}
                        value={rowData.asset_value_amount}
                        prefix={`${budgetCurrencyCode} `}
                    />
                ),
                editComponent: props => (
                    <div className={classes.textRight}>
                        <AmountFormatInput
                            name={"AssetAmountI_" + props.rowData.asset_class}
                            inputProps={{ style: { textAlign: 'right' } }}
                            placeholder="Suma"
                            prefix={`${budgetCurrencyCode} `}
                            {...props}
                        />
                    </div>
                ),
                headerStyle: {
                    textAlign: 'right'
                }, width: '30%'
            },
            {
                title: '% Incendio', field: 'fire_risk_percentage', type: 'numeric',
                render: rowData => (<AmountFormatDisplay name={"Fire_Risk_PercentageD_" + rowData.asset_class} value={rowData.fire_risk_percentage} />),
                editComponent: props => (
                    <div className={classes.textRight}>
                        <AmountFormatInput
                            name={"Fire_Risk_PercentageI_" + props.rowData.asset_class}
                            placeholder="% Incendio"
                            inputProps={{ style: { textAlign: 'right' } }}
                            {...props}
                        />
                    </div>
                ),
                headerStyle: {
                    textAlign: 'center'
                }, width: '10%'
            },
            {
                title: '% Terremoto', field: 'earthquake_risk_percentage', type: 'numeric',
                render: rowData => (<AmountFormatDisplay name={"EarthQ_Risk_PercentageD_" + rowData.asset_class} value={rowData.earthquake_risk_percentage} />),
                editComponent: props => (
                    <div className={classes.textRight}>
                        <AmountFormatInput
                            name={"EarthQ_Risk_PercentageI_" + props.rowData.asset_class}
                            placeholder="% Terremoto"
                            inputProps={{ style: { textAlign: 'right' } }}
                            {...props}
                        />
                    </div>
                ),
                headerStyle: {
                    textAlign: 'center'
                }, width: '10%'
            },
            {
                title: '% Motín', field: 'riot_risk_percentage', type: 'numeric',
                render: rowData => (<AmountFormatDisplay name={"Riot_Risk_PercentageD_" + rowData.asset_class} value={rowData.riot_risk_percentage} />),
                editComponent: props => (
                    <div className={classes.textRight}>
                        <AmountFormatInput
                            name={"Riot_Risk_PercentageI_" + props.rowData.asset_class}
                            placeholder="% Motín"
                            inputProps={{ style: { textAlign: 'right' } }}
                            {...props}
                        />
                    </div>
                ),
                headerStyle: {
                    textAlign: 'center'
                }, width: '10%'
            },
            {
                title: '¿Robo?', field: 'has_stole_risk_percentage',
                editable: rowData => (rowData.asset_class === '001') ? "always" : "never",
                editComponent: (props) => {
                    return (
                        <>{(props.rowData.asset_class === '001') ? (
                            <div></div>) : (
                            <CheckBoxSimple
                                id={"Check_Stole_Risk_Percentage" + props.rowData.asset_class}
                                checkedValue="Y"
                                uncheckedValue="N"
                                {...props}
                            />)
                        }
                        </>

                    )
                },
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
    const isEditableFunctionAssets = (rowData) => rowData.asset_code

    function validateCompleteRiskPercentages(dataValidate, oldData) {
        
        if (typeof dataValidate.asset_value_amount === 'undefined' || dataValidate.asset_value_amount === ''
            || parseFloat(dataValidate.asset_value_amount) < 0) {
            msgDialog('Debe indicar un valor para la Suma Asegurada del Bien')
            return false
        }
        if (typeof dataValidate.fire_risk_percentage === 'undefined' || dataValidate.fire_risk_percentage === ''
            || parseFloat(dataValidate.fire_risk_percentage) <= 0 || parseFloat(dataValidate.fire_risk_percentage) > 100) {
            msgDialog('Por favor ingrese un valor mayor a 0 y menor o igual a 100 para el Porcentaje de Incendio')
            return false
        }

        if (typeof dataValidate.earthquake_risk_percentage === 'undefined' || dataValidate.earthquake_risk_percentage === ''
            || parseFloat(dataValidate.earthquake_risk_percentage) < 0 || parseFloat(dataValidate.earthquake_risk_percentage) > 100) {
            msgDialog('Porcentaje Terremoto: Por favor ingrese un valor entre 0 y 100')
            return false
        }
        if (typeof dataValidate.riot_risk_percentage === 'undefined' || dataValidate.riot_risk_percentage === ''
            || parseFloat(dataValidate.riot_risk_percentage) < 0 || parseFloat(dataValidate.riot_risk_percentage) > 100) {
            msgDialog('Porcentaje Motín: Por favor ingrese un valor entre 0 y 100')
            return false
        }

        if (parseFloat(dataValidate.riot_risk_percentage) > parseFloat(dataValidate.fire_risk_percentage)) {
            msgDialog('El porcetaje de Motín debe ser menor o igual al porcentaje de Incendio')
            return false
        }

        if (!(parseFloat(oldData.asset_value_amount) !== parseFloat(dataValidate.asset_value_amount)
            || parseFloat(oldData.fire_risk_percentage) !== parseFloat(dataValidate.fire_risk_percentage)
            || parseFloat(oldData.earthquake_risk_percentage) !== parseFloat(dataValidate.earthquake_risk_percentage)
            || parseFloat(oldData.riot_risk_percentage) !== parseFloat(dataValidate.riot_risk_percentage)
            || oldData.has_stole_risk_percentage !== dataValidate.has_stole_risk_percentage)) {
            return false
        }
        return true

    }

    return (
        <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} lg={12}>
                <BudgetUtilityTable
                    classes={classes}
                    columns={smesAssetsRiskColumns}
                    data={assetsData}
                    isEditableFunction={isEditableFunctionAssets}
                    parentChildDataConnection={parentChildDataConnectionAssets}
                    setData={setAssetsData}
                    optionName={optionName}
                    //removeOption={removeOption}
                    //editOption={editOption}
                    hasRowValidatorFunction
                    rowValidatorFunction={validateCompleteRiskPercentages}
                />
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>
                <br></br><br></br>
                <BudgetSMESAssetsRiskTotals
                    objForm={objForm}
                    planParticularInfo={planParticularInfo}
                    planId={planId}
                    budgetCurrencyCode={budgetCurrencyCode}
                    availableIndirectLossesPercentArray={availableIndirectLossesPercent}
                />
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>
                <br></br><br></br>
                <p className={classes.textCenter}>
                    <Button color="primary" type="submit">
                        <Icon>refresh</Icon> Actualizar Cambios en Cotización
                        </Button>
                </p>
            </GridItem>
        </GridContainer >
    )
}