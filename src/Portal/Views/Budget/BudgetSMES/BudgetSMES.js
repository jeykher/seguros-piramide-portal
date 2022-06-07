import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { useForm } from "react-hook-form"

import CardPanel from 'components/Core/Card/CardPanel'
import CustomTabs from "components/material-dashboard-pro-react/components/CustomTabs/CustomTabs"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";

import { makeStyles } from "@material-ui/core/styles"
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import PrintIcon from '@material-ui/icons/Print'
import SendIcon from '@material-ui/icons/Send'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import Tooltip from '@material-ui/core/Tooltip'
import ApartmentIcon from '@material-ui/icons/Apartment'
import SelectAllIcon from '@material-ui/icons/SelectAll'
import PostAddIcon from '@material-ui/icons/PostAdd'

import BudgetTitle from 'Portal/Views/Budget/BudgetTitle'
import BudgetSMESAssetsPlanInfoSection from 'Portal/Views/Budget/BudgetSMES/BudgetSMESAssetsPlanInfoSection'
import BudgetSMESCoveragesSection from 'Portal/Views/Budget/BudgetSMES/BudgetSMESCoveragesSection'
import BudgetAdditionalChargesSection from 'Portal/Views/Budget/BudgetAdditionalCharges/BudgetAdditionalChargesSection'
import StickyFooterCompareOptions from 'Portal/Views/Budget/Compare/StickyFooterCompareOptions'
import BudgetSMESOptionsCompare from 'Portal/Views/Budget/BudgetSMES/BudgetSMESOptionsCompare'
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"

import Icon from "@material-ui/core/Icon"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"

import { useDialog } from 'context/DialogContext'

const useStyles = makeStyles((theme) => ({
    textCenter: {
        textAlign: "center"
    },
    textRight: {
        textAlign: "right"
    },
    textLeft: {
        textAlign: "left"
    },
    containerSelect: {
        width: '100%',
        textAlign: "left"
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    rigthIcon: {
        float: "right",
    },
    buttons: {
        textAlign: "left",
        '& > *': {
            margin: theme.spacing(2),
        },
    }
}));

export default function BudgetSMES(props) {
    const dialog = useDialog()
    const { onFinish, objBudget, tabSelected, showBackButton } = props
    //const [objBudget, setObjBudget] = useState()
    const classes = useStyles();
    const [options, setOptions] = useState()
    const [optionSelected, setOptionSelected] = useState(0)
    const [showCompare, setShowCompare] = useState()
    const [showOptions, setShowOptions] = useState()
    const [assetsAndRiskValuesToManage, setAssetsAndRiskValuesToManage] = useState([])
    const [coveragesToManage, setCoveragesToManage] = useState([])
    const [additionalChargesToManage, setAdditionalChargesToManage] = useState([])
    const { handleSubmit, ...objForm } = useForm({ defaultValues: getValuesToPreload() })
    const [availableAdditionalCharges, setAvailableAdditionalCharges] = useState([])
    const [availableIndirectLossesPercent, setAvailableIndirectLossesPercent] = useState([])


    async function getAvailableIndirectLossesPercent() {
        const result = await Axios.post('/dbo/budgets/get_available_indirlosses_percentages', null)
        setAvailableIndirectLossesPercent(result.data.result)
    }

    async function getAvailableAdditionalCharges() {
        const params = {
            p_budget_plan_id: objBudget.plans[optionSelected].plan_id,
            p_product_code: objBudget.plans[optionSelected].product_code
        }
        const result = await Axios.post('/dbo/budgets/get_avail_additional_charges', params)

        const additionalChargesWithOutFilter = [...result.data.result]
        const additionalChargesFilter = additionalChargesWithOutFilter.filter(charge => objBudget.plans[optionSelected].additionalCharges.findIndex(element => (element.acsel_charge_type === charge.tiporecadcto && element.acsel_charge_code === charge.codrecadcto)) === -1)
        setAvailableAdditionalCharges([...additionalChargesFilter])
    }



    useEffect(() => {
        getAvailableIndirectLossesPercent()
        getAvailableAdditionalCharges()
    }, [])

    useEffect(() => {
        getAvailableAdditionalCharges()
    }, [additionalChargesToManage])


    useEffect(() => {
        if (objBudget) {
            addOptionBase([])
        }
    }, [])



    function getValuesToPreload() {
        const valuesToPreload = {
            assetsStoleRiskPercentage: objBudget.plans[optionSelected].budgetPlanParticularInfo.assets_stole_risk_percentage,
            indirectLossPercentage: objBudget.plans[optionSelected].budgetPlanParticularInfo.indirect_loss_percentage,
            rentLossMonths: objBudget.plans[optionSelected].budgetPlanParticularInfo.rent_loss_months,
            rentLossAmount: objBudget.plans[optionSelected].budgetPlanParticularInfo.rent_loss_amount
        }
        return valuesToPreload
    }

    async function handleChangesOnAssetsAndPlanInfoSection(jsonParams) {
        const params = { p_budget_id: objBudget.info[0].BUDGET_ID, ...jsonParams, p_json_char_assets: JSON.stringify([...assetsAndRiskValuesToManage]) }
        await Axios.post('/dbo/budgets/manage_assets_planinfo_section', params)
        setAssetsAndRiskValuesToManage([])
    }

    async function handleChangesOnCoverages() {
        const params = { p_budget_id: objBudget.info[0].BUDGET_ID, p_budget_plan_id: objBudget.plans[optionSelected].plan_id, p_json_char_coverages: JSON.stringify([...coveragesToManage]) }

        await Axios.post('/dbo/budgets/manage_coverages_selection', params)
        setCoveragesToManage([])

    }

    async function handleChangesOnCharges() {
        const params = { p_budget_id: objBudget.info[0].BUDGET_ID, p_budget_plan_id: objBudget.plans[optionSelected].plan_id, p_json_char_addi_charges: JSON.stringify([...additionalChargesToManage]) }
        await Axios.post('/dbo/budgets/manage_additional_charges', params)
        setAdditionalChargesToManage([])

    }


    async function handleAllChanges(dataform, tabToShowSelected) {
        const budgetPreviousStatus = objBudget.info[0].STATUS
        const valuesPreloadedOnForm = getValuesToPreload()

        const jsonParams = {
            p_budget_plan_id: objBudget.plans[optionSelected].plan_id,
            p_indirect_loss_percentage: dataform['indirectLossPercentage'],
            p_rent_loss_months: dataform['rentLossMonths'],
            p_rent_loss_amount: dataform['rentLossAmount'],
            p_assets_stole_risk_percentage: dataform['assetsStoleRiskPercentage']
        }

        let hasChangesOnForm = false
        let changesHandledOnAssetsAndPlanInfoSection = false
        let changesHandledOnCoveragesSection = false
        let changesHandledOnChargesSection = false

        if (valuesPreloadedOnForm.assetsStoleRiskPercentage != jsonParams.p_assets_stole_risk_percentage
            || valuesPreloadedOnForm.indirectLossPercentage != jsonParams.p_indirect_loss_percentage
            || valuesPreloadedOnForm.rentLossMonths != jsonParams.p_rent_loss_months
            || valuesPreloadedOnForm.rentLossAmount != jsonParams.p_rent_loss_amount) {
            hasChangesOnForm = true
        }
        if (hasChangesOnForm || assetsAndRiskValuesToManage.length > 0) {
            await handleChangesOnAssetsAndPlanInfoSection(jsonParams)
            changesHandledOnAssetsAndPlanInfoSection = true
        }
        if (coveragesToManage.length > 0) {
            await handleChangesOnCoverages()
            changesHandledOnCoveragesSection = true
        }
        if (additionalChargesToManage.length > 0) {
            await handleChangesOnCharges()
            changesHandledOnChargesSection = true
        }
        if (changesHandledOnAssetsAndPlanInfoSection || changesHandledOnCoveragesSection || changesHandledOnChargesSection) {
            await onFinish(objBudget.plans[optionSelected].plan_id, tabToShowSelected)
        } else {
            dialog({
                variant: "info",
                catchOnCancel: false,
                title: "Información",
                description: "No hay cambios pendientes por actualizar en la cotización"
            })
        }
    }




    async function onSubmit(dataform, e) {
        e.preventDefault()
        await handleAllChanges(dataform, 0)

    }

    async function handleChangesOnCoveragesSection() {
        const dataform = objForm.getValues()
        await handleAllChanges(dataform, 1)

    }

    async function handleChangesOnChargesSection() {
        const dataform = objForm.getValues()
        await handleAllChanges(dataform, 2)

    }


    function setAssetsRiskData(data, index) {
        let copy = JSON.parse(JSON.stringify(data))
        if (copy[index].asset_value_amount > 0 && copy[index].fire_risk_percentage > 0) {
            copy[index].selected_indicator = "Y"
        } else {
            copy[index].selected_indicator = "N"
        }
        objBudget.setAssetRiskOnAPlan([...copy], optionSelected)
        let copyAssetsAndRiskValuesToManage = JSON.parse(JSON.stringify([...assetsAndRiskValuesToManage]));
        let i = 0

        if (copyAssetsAndRiskValuesToManage.length > 0) {
            i = copyAssetsAndRiskValuesToManage.findIndex(element => element.asset_class === copy[index].asset_class)
        }
        (i > -1) ? copyAssetsAndRiskValuesToManage[i] = { ...copy[index] } : copyAssetsAndRiskValuesToManage = [...copyAssetsAndRiskValuesToManage, { ...copy[index] }]
        setAssetsAndRiskValuesToManage([...copyAssetsAndRiskValuesToManage])
    }

    function setCoverageData(data, index) {
        let copy = JSON.parse(JSON.stringify(data));
        objBudget.setCoveragesOnAPlan([...copy], optionSelected)
        let copyCoveragesToManage = JSON.parse(JSON.stringify([...coveragesToManage]));
        let i = 0
        if (copyCoveragesToManage.length > 0) {
            i = copyCoveragesToManage.findIndex(element => element.coverage_code === copy[index].coverage_code)
        }
        (i > -1) ? copyCoveragesToManage[i] = { ...copy[index] } : copyCoveragesToManage = [...copyCoveragesToManage, { ...copy[index] }]
        setCoveragesToManage([...copyCoveragesToManage])
    }

    function setAdditionalChargesData(arrayData, elementData, operationType) {
        let copy = JSON.parse(JSON.stringify(arrayData));
        const newAdditionalChargeToManage = JSON.parse(JSON.stringify(elementData));
        objBudget.setAdditionalChargesOnAPlan([...copy], optionSelected)
        let copyAdditionalChargesToManage = JSON.parse(JSON.stringify([...additionalChargesToManage]));
        let i = 0
        if (copyAdditionalChargesToManage.length > 0) {
            i = copyAdditionalChargesToManage.findIndex(element => (element.acsel_charge_type === newAdditionalChargeToManage.acsel_charge_type && element.acsel_charge_code === newAdditionalChargeToManage.acsel_charge_code))
        }
        if (i > -1) {
            copyAdditionalChargesToManage.splice(i, 1)
        }
        newAdditionalChargeToManage.operationType = operationType
        copyAdditionalChargesToManage = [...copyAdditionalChargesToManage, { ...newAdditionalChargeToManage }]
        setAdditionalChargesToManage([...copyAdditionalChargesToManage])
    }

    function addOptionBase() {
        setOptionSelected(0)

    }

    function addOption(e) {
        e.preventDefault()
        addOptionBase()
    }

    function copyOption(e) {
        e.preventDefault()
        let copy = JSON.parse(JSON.stringify(options));
        let copySelected = JSON.parse(JSON.stringify(options[optionSelected]));
        copySelected['name'] = 'Opción ' + (options.length + 1)
        copy.push(copySelected)
        setOptionSelected(copy.length - 1)
        setOptions(copy)
    }

    function removeOption(e, index) {
        e.preventDefault()
        let copy = JSON.parse(JSON.stringify(options));
        copy.splice(index, 1)
        setOptionSelected(0)
        console.log(copy)
        setOptions(copy)
    }

    function editOption(e, index) {
        e.preventDefault()
        setOptionSelected(index)
        setShowCompare(false)
    }

    function checkOption(e, index) {
        e.preventDefault()
        let copy = JSON.parse(JSON.stringify(options)); //---> TODO PROBAR SI SE CAMBIA ESTE MANEJO
        copy[index].checked = !copy[index].checked
        setOptions(copy)
        console.log(copy)
        console.log('checkOption', index)
    }

    function showOptionsBar(e) {
        e.preventDefault()
        setShowOptions(!showOptions)
    }

    function showCompareOptions(e) {
        e.preventDefault()
        setShowCompare(!showCompare)
    }

    function cleanOptionsBar(e) {
        e.preventDefault()
        setOptions([options[0]])
        setOptionSelected(0)
        setShowCompare(false)
    }

    const msgDialog = (dataErrors) => {
        dialog({
            variant: "info",
            catchOnCancel: false,
            title: "Alerta",
            description: dataErrors
        })
    }

    async function requestBudgetPlanApproval() {
        const params = {
            p_budget_id: objBudget.info[0].BUDGET_ID,
            p_budget_plan_id: objBudget.plans[optionSelected].plan_id
        }
        const result = await Axios.post('/dbo/budgets/request_budget_plan_approval', params)
        msgDialog('Fue enviada una solicitud de aprobación para que pueda continuar con su cotización')
        await onFinish(objBudget.plans[optionSelected].plan_id, 0)
    }

    async function printOption(e) {
        e.preventDefault()
        if (objBudget.info[0].STATUS === 'APPROVED') {
            msgDialog('En proceso de construccion')
        } else if (objBudget.info[0].STATUS === 'APPROVAL_REQUESTED') {
            msgDialog('Existe una solicitud de aprobación pendiente para poder continuar con su cotización')
        } else {
            await requestBudgetPlanApproval()
        }
    }

    async function emitOption(e) {
        e.preventDefault()
        if (objBudget.info[0].STATUS === 'APPROVED') {
            //const i = objBudget.selectedPays.findIndex(element => element.plan_id === objBudget.plans[optionSelected].plan_id)
            const params = {
                p_budget_id: objBudget.info[0].BUDGET_ID,
                p_budget_plan_id: objBudget.plans[optionSelected].plan_id,
                p_plan_id_pay: null
            }
            const result = await Axios.post('/dbo/budgets/buy_smes_budget', params)
            await onFinish(objBudget.plans[optionSelected].plan_id, 0)
        } else if (objBudget.info[0].STATUS === 'APPROVAL_REQUESTED') {
            msgDialog('Existe una solicitud de aprobación pendiente para poder continuar con su cotización')
        } else {
            await requestBudgetPlanApproval()
        }
    }

    function handleBackToWorkflowTimeLine(e) {
        e.preventDefault();
        window.history.back()
    }

    return (
        <>
            {objBudget &&
                <>
                    {objBudget.plans.length > 1 &&
                        <StickyFooterCompareOptions
                            optionSelected={optionSelected}
                            options={objBudget.plans}
                            removeOption={removeOption}
                            editOption={editOption}
                            checkOption={checkOption}
                            showOptionsBar={showOptionsBar}
                            cleanOptionsBar={cleanOptionsBar}
                            showCompareOptions={showCompareOptions}
                            classes={classes}
                        />
                    }
                    <GridContainer justify="center">
                        <GridItem xs={12} sm={12} md={12} lg={12}>
                            <BudgetTitle title={objBudget.info[0].BUDGET_DESCRIPTION} />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={9} lg={9}>
                            <CardPanel collapse titulo={<GridContainer>
                                <GridItem xs={12} sm={12} md={4} lg={4}>{'Datos Generales  '}
                                </GridItem>
                                <GridItem xs={12} sm={12} md={5} lg={5}>
                                    <Badge color={objBudget.info[0].STATUS_COLOR}>{objBudget.info[0].STATUS_DESCRIPTION}</Badge>
                                </GridItem>
                            </GridContainer>
                            }
                                icon={'fingerprint'}
                                iconColor={'primary'}
                            >
                                <GridContainer justify="center">
                                    <GridItem xs={12} sm={12} md={3} lg={3}>
                                        <h6><strong>Cotización N°: {objBudget.info[0].BUDGET_ID} </strong></h6>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3} lg={3}>
                                        <h6><strong>CI/RIF: </strong> {objBudget.budgetInfo.p_identification_type_1 + '-' + objBudget.budgetInfo.p_identification_number_1} </h6>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3} lg={3}>
                                        <h6><strong>Nombre/Razon Social: </strong> {objBudget.budgetInfo.p_name_one_1 + ' ' + objBudget.budgetInfo.p_surmane_one_1} </h6>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3} lg={3}>
                                        <h6><strong>Correo Electrónico: </strong> {objBudget.budgetInfo.p_email_1} </h6>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6} lg={6}>
                                        <h6><strong>Dirección: </strong> {objBudget.budgetInfo.p_address_1} </h6>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6} lg={6}>
                                        <h6><strong>Localidades: </strong> {objBudget.budgetInfo.locations_number} </h6>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6} lg={6}>
                                        <h6><strong>Índole de Riesgo: </strong> {objBudget.budgetInfo.risk_nature_description} </h6>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6} lg={6}>
                                        <h6><strong>Índole Específica: </strong> {objBudget.budgetInfo.specific_risk_nature_description} </h6>
                                    </GridItem>
                                </GridContainer>
                            </CardPanel>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3} lg={3}>
                            <div className={classes.buttons}>
                                <br></br>
                                {/*<Tooltip title="Agregar Opción" placement="top">
                                    <Fab color="primary" aria-label="add" onClick={(event) => addOption(event)}>
                                        <AddIcon />
                                    </Fab>
                                </Tooltip>
                                <Tooltip title="Copiar Opción" placement="top">
                                    <Fab color="primary" aria-label="add" onClick={(event) => copyOption(event)}>
                                        <FileCopyIcon />
                                    </Fab>
                                </Tooltip>
                                <Tooltip title="Solicitar Aprobación Cotización" placement="top">
                                    <Fab color="secondary" aria-label="edit">
                                        <SendIcon />
                                    </Fab>
                                </Tooltip>

                                <Tooltip title="Imprimir" placement="top" >
                                    <Fab color="default" aria-label="print" onClick={(event) => printOption(event)}>
                                        <PrintIcon />
                                    </Fab>
                                </Tooltip>*/}
                                <Tooltip title="Emitir" placement="top" >
                                    <Fab color="primary" aria-label="print" onClick={(event) => emitOption(event)}>
                                        <ThumbUpIcon />
                                    </Fab>
                                </Tooltip>


                            </div>
                            {/*<br></br>
                        <GridItem xs={6} sm={6} md={12} container direction="row" justify="center" alignItems="center">
                            <Button color="warning" round onClick={(event) =>showOptionsBar(event)}>{`Opciones`}</Button>
                        </GridItem>*/}
                        </GridItem>
                        {(!showCompare || objBudget.plans.length == 1) &&
                            <GridItem xs={12} sm={12} md={12} lg={12}>
                                <CustomTabs
                                    tabSelected={tabSelected}
                                    headerColor="primary"
                                    tabs={[
                                        {
                                            tabName: "Bienes y Valores a Riesgo",
                                            tabIcon: ApartmentIcon,
                                            tabContent: (
                                                <>
                                                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                                        <BudgetSMESAssetsPlanInfoSection
                                                            classes={classes}
                                                            assetsData={objBudget.plans[optionSelected].assetsAndRiskValues}
                                                            setAssetsData={setAssetsRiskData}
                                                            optionName={objBudget.plans[optionSelected].plan_description}
                                                            removeOption={removeOption}
                                                            editOption={editOption}
                                                            planParticularInfo={objBudget.plans[optionSelected].budgetPlanParticularInfo}
                                                            planId={objBudget.plans[optionSelected].plan_id}
                                                            budgetCurrencyCode={objBudget.budgetInfo.currency_code}
                                                            availableIndirectLossesPercent={availableIndirectLossesPercent}
                                                            objForm={objForm}
                                                            msgDialog={msgDialog}
                                                        />
                                                    </form >
                                                </>
                                            )
                                        },
                                        {
                                            tabName: "Coberturas",
                                            tabIcon: SelectAllIcon,
                                            tabContent: (
                                                <BudgetSMESCoveragesSection
                                                    classes={classes}
                                                    coveragesData={objBudget.plans[optionSelected].coverages}
                                                    setCoverageData={setCoverageData}
                                                    planParticularInfo={objBudget.plans[optionSelected].budgetPlanParticularInfo}
                                                    planId={objBudget.plans[optionSelected].plan_id}
                                                    optionName={objBudget.plans[optionSelected].plan_description}
                                                    removeOption={removeOption}
                                                    editOption={editOption}
                                                    budgetCurrencyCode={objBudget.budgetInfo.currency_code}
                                                    handleChangesOnCoveragesSection={handleChangesOnCoveragesSection}
                                                    msgDialog={msgDialog}
                                                />
                                            )
                                        },
                                        {
                                            tabName: "Recargos y Descuentos",
                                            tabIcon: PostAddIcon,
                                            tabContent: (
                                                <BudgetAdditionalChargesSection
                                                    classes={classes}
                                                    additionalChargesData={objBudget.plans[optionSelected].additionalCharges}
                                                    availableAdditionalCharges={availableAdditionalCharges}
                                                    setAdditionalChargesData={setAdditionalChargesData}
                                                    planId={objBudget.plans[optionSelected].plan_id}
                                                    productCode={objBudget.plans[optionSelected].product_code}
                                                    optionName={objBudget.plans[optionSelected].plan_description}
                                                    budgetCurrencyCode={objBudget.budgetInfo.currency_code}
                                                    budgetPlanPremiumAmount={objBudget.plans[optionSelected].budgetPlanParticularInfo.budget_plan_premium_amount}
                                                    removeOption={removeOption}
                                                    editOption={editOption}
                                                    handleChangesOnChargesSection={handleChangesOnChargesSection}
                                                    msgDialog={msgDialog}
                                                />
                                            )
                                        }
                                    ]}
                                />

                            </GridItem>

                        }
                        {showBackButton &&
                            <GridItem xs={12} sm={12} md={12} lg={12}>
                                <GridContainer justify="center">
                                    <GridItem>
                                        <Button color="secondary" onClick={handleBackToWorkflowTimeLine}>
                                            <Icon>fast_rewind</Icon> Regresar
                                        </Button>
                                    </GridItem>
                                </GridContainer>
                            </GridItem>}
                        {showCompare &&
                            <GridItem xs={12} sm={12} md={12} lg={12}>
                                <BudgetSMESOptionsCompare
                                    options={options.filter(option => option.checked === true)}
                                    smesAssetsRiskTypes={objBudget.budgetInfo.assets_risk_groups}
                                    smesCoverageTypes={objBudget.budgetInfo.coverages_groups}
                                />
                            </GridItem>
                        }
                    </GridContainer>
                </>
            }
        </>
    );
}