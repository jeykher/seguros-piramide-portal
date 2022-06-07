import React, { useState, useEffect, Fragment } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import PrincingPlansPays from 'components/material-kit-pro-react/components/Pricing/PrincingPlansPays'
import { getSymbolCurrency } from 'utils/utils'
import CompareIcon from '@material-ui/icons/Compare'
import FindInPageIcon from '@material-ui/icons/FindInPage'
import Button from "components/material-kit-pro-react/components/CustomButtons/Button";
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CreateIcon from '@material-ui/icons/Create'
import PlansSumEdit from './PlansSumEdit'
import Check from "@material-ui/icons/Check"
import Close from "@material-ui/icons/Close"
import Success from 'components/material-kit-pro-react/components/Typography/Success'
import Danger from "components/material-kit-pro-react/components/Typography/Danger"
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import "./PlansCardPays.scss"
const useStyles = makeStyles((theme) => ({
    badgePay: {
        height: '40px',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    compareOption: {
        padding: '12px 30px'
    },
    compareButtonContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buyButton: {
        "@media (max-width: 1023px)": {
            padding: '0.8em 1.5em',
            fontSize: '0.8em'
        },
        "@media (max-width: 425px)": {
            padding: '0.6em 1.2em',
            fontSize: '0.8em'
        },
    },
    sumDiv: {
        display: "inline-block"
    },
    sumAction: {
        top: "0px !important",
        cursor: "pointer"
    },
    divSum: {
        "@media (max-width: 2023px)": {
            minHeight: '50px'
        },
        "@media (max-width: 599px)": {
            minHeight: '40px'
        },
    }
}));

export default function PlansCardPays(props) {
    const { index, plan, onAddCompare, onSelectPay, onSelectBuy, onRemove,
        showValue, showCompare, showPay, showFooter, onShowPlanInfo, showPlanInfo,
        onReturn, showReturn, showMount, objBudget, showEdit, showAgesPlan,
        selectedPays, handleSelectedPay, showCheckbox, onShowCompare, disableSelects, disableDetails } = props
    const {indregprima,tipoclinica, tipoclibase, mtodeducible} = plan
    const { resetMethodsPlan,updateClinicPlan } = objBudget

    const classes = useStyles();
    const [showEditSumDialog, setShowEditSumDialog] = useState(false)
    const [agesPlan, setAgesPlan] = useState(null)
    const [showClinicaSelectorDeducible, setShowClinicaSelectorDeducible] = useState(false);
    const [deduciblesByPlan, setDeduciblesByPlan] = useState([])
    const [clinicaSelect, setClinicaSelect] = useState(tipoclibase);
    const [deducibleSelect, setDeducibleSelect] = useState(mtodeducible);

    let arrayPlans = []
    function getPrima() {
        const indexActiveFrac = plan.fraccionamiento.findIndex((element) => element.stsplan === 'S')
        return indexActiveFrac === -1 ? plan.prima : plan.fraccionamiento[indexActiveFrac].prima
    }

    function handleCloseSumEdit() {
        setShowEditSumDialog(false)
    }

    const handleChangeSelect1Clinica = (e) => {
        setDeducibleSelect()
        setClinicaSelect(e.target.value)
        setShowClinicaSelectorDeducible(true)
        let deduciblesTemporales = tipoclinica.filter(deducibleTemp => deducibleTemp.Tipo === e.target.value)
        setDeduciblesByPlan(deduciblesTemporales);
    }

    
    const initSelectClinica = () => {
        setClinicaSelect(tipoclibase)
        setShowClinicaSelectorDeducible(true)
        let deduciblesTemporales = tipoclinica?.filter(deducibleTemp => deducibleTemp.Tipo === tipoclibase)
        setDeduciblesByPlan(deduciblesTemporales);
    }

    const  handleChangeSelectDeducible = async (e) => {
        setDeducibleSelect(e.target.value)
        const data = {
            p_budget_id: objBudget.info[0].BUDGET_ID,
            p_plan_id: plan.plan_id,
            p_codclasecli: clinicaSelect,
            p_sumaaseg: plan.sumaaseg,
            p_mtodeducible: e.target.value
        }
        await updateClinicPlan(data)
    }

    useEffect(() => {
        if (objBudget.info[0].AREA_NAME === 'PERSONAS') {
            const apliAge = objBudget.budgetInfo.insured.map((a) =>
                plan.coberturas.findIndex((p) => p.age === a.age) === -1 ? { age: a.age, inc: 'N' } : { age: a.age, inc: 'S' })
            setAgesPlan(apliAge)
            initSelectClinica()
        }
    }, [])

    if(tipoclinica != undefined || tipoclinica != null) {
        tipoclinica.map((clinica,index)=>{
           let valid = arrayPlans.find(element => element === clinica.Tipo);
           if (valid===undefined){
               arrayPlans.push(clinica.Tipo)
           }
        })
    }
    console.log(deducibleSelect);
    return (
        <PrincingPlansPays
            key={index}
            index={index}
            description={plan.descplanprod}
            currency={getSymbolCurrency(plan.codmoneda)}
            mount={getPrima()}
            onRemove={onRemove}
            showPay={showPay}
            showMount={showMount}
            plan={plan}
            tipoBudget={objBudget?.info[0].AREA_NAME}
            selectedPays={selectedPays}
            handleSelectedPay={handleSelectedPay}
            showCheckbox={showCheckbox}
            removeCheckbox={resetMethodsPlan}
            disableSelects={disableSelects}
        >
            {showMount && <div className={classes.divSum}>
                {showValue && <ul>
                    <li>
                        <div className={classes.sumDiv}>
                            <h6>Asegurado por: </h6><small>{getSymbolCurrency(plan.codmoneda)} </small>
                            <b><AmountFormatDisplay name={`sum_${index}`} value={plan.sumaaseg} /></b>
                        </div>
                        {showEdit && plan.indmodsum === 'S' &&
                            <Tooltip title={`Aumento de Suma Asegurada y % Descuento`} placement="right-start" arrow >
                                <div className={classes.sumDiv}>
                                    <CreateIcon color="primary" className={classes.sumAction} onClick={() => setShowEditSumDialog(true)} />
                                </div>
                            </Tooltip>}
                    </li>
                </ul>}
            </div>}
                {(indregprima == 'C' && tipoclinica?.length !=0 && !onShowCompare) ? (
                    <>
                        <div className="container-selects-clinica"
                         style={{
                            width: "100%",
                            margin: '-5px 0 10px'
                        }}>
                            <FormControl style={{
                                width: '80%'
                            }}>
                                <InputLabel 
                                    id="demo-simple-select-label"
                                >
                                    <span
                                        className={
                                            clinicaSelect != undefined
                                                ? 'typeofclinicsselect'
                                                : ''
                                        }
                                    >
                                        Clase de Clínica
                                    </span>
                                </InputLabel>
                                <Tooltip 
                                    title="Seleccione la clase de clínica" 
                                    placement="right-start" 
                                    arrow className={classes.buttonContainer}
                                >
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        onChange={handleChangeSelect1Clinica}
                                        value={clinicaSelect}
                                        disabled={disableSelects || disableDetails}
                                        required
                                    >
                                        {arrayPlans.map((TipoClinica,index)=>{
                                            return(
                                                <MenuItem value={TipoClinica}>Tipo {TipoClinica}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </Tooltip>
                            </FormControl>
                            <FormControl style={{ 
                                width: '80%' 
                            }}>
                                    <InputLabel 
                                        id="demo-simple-select-label"
                                    >
                                        <span
                                            className={
                                                deducibleSelect != undefined
                                                ? 'typeofclinicsselect'
                                                : ''
                                                }
                                        >
                                            Deducible
                                        </span>
                                    </InputLabel>
                                    <Tooltip 
                                        title="Seleccione el deducible a aplicar" 
                                        placement="right-start" 
                                        arrow className={classes.buttonContainer}
                                    >
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            className={classes.selectInput}
                                            onChange={handleChangeSelectDeducible}
                                            value={deducibleSelect}
                                            disabled={disableSelects || disableDetails}
                                            required
                                        >
                                            {
                                                deduciblesByPlan.map(deducibleIterado => (
                                                <MenuItem value={deducibleIterado.Deducible}>{deducibleIterado.Deducible}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </Tooltip>
                            </FormControl>
                        </div>
                        {
                            (clinicaSelect != undefined && deducibleSelect != undefined) 
                            ? <Button color="primary" className={classes.buyButton} round onClick={() => onSelectBuy(plan)}>Comprar</Button> 
                            : <Button color="primary" className={classes.buyButton} round onClick={() => onSelectBuy(plan)} disabled>Comprar</Button>
                        }
                    </>
                )
                : (
                    <>
                        <Button color="primary" className={classes.buyButton} round onClick={() => onSelectBuy(plan)}>Comprar</Button>
                    </>
                )}
            <GridContainer>
                {showCompare && <GridItem xs={12} sm={12} md={5}>
                    <div className={classes.compareButtonContainer}>
                    {
                        (indregprima == 'C' && tipoclinica?.length !=0 && !onShowCompare)
                        ? (
                            
                            (clinicaSelect != undefined && deducibleSelect != undefined)
                                ? <Button color="warning" simple onClick={() => onAddCompare(plan.plan_id)}><CompareIcon /> Comparar</Button>
                                : <Button color="warning" simple onClick={() => onAddCompare(plan.plan_id)} disabled><CompareIcon /> Comparar</Button>
                        )
                        : (
                            <Button color="warning" simple onClick={() => onAddCompare(plan.plan_id)}><CompareIcon /> Comparar</Button>
                        )
                    }
                    </div>
                </GridItem>}
                {showPlanInfo && <GridItem xs={12} sm={12} md={5}>
                    {
                        (indregprima == 'C' && tipoclinica?.length !=0 && !onShowCompare)
                        ? (
                            
                            (clinicaSelect != undefined && deducibleSelect != undefined)
                                ? <Button color="primary" simple onClick={() => onShowPlanInfo(plan)}><FindInPageIcon /> Ver más</Button>
                                : <Button color="primary" simple onClick={() => onShowPlanInfo(plan)} disabled><FindInPageIcon /> Ver más</Button>
                        )
                        : (
                            <Button color="primary" simple onClick={() => onShowPlanInfo(plan)}><FindInPageIcon /> Ver más</Button>
                        )
                    }
                </GridItem>}
            </GridContainer>
            {showAgesPlan && <GridContainer justify="center">
                {agesPlan && agesPlan.map((a, index) => (
                    a.inc === 'S' ? <Fragment key={`row_${index}xa`}>{a.age}<Success><Check style={{ fontSize: '1rem' }} /></Success></Fragment> :
                        <Fragment key={`row_${index}xa`}>{a.age}<Danger><Close style={{ fontSize: '1rem' }} /></Danger></Fragment>
                ))}
            </GridContainer>}
            {showReturn && <Button color="primary" simple onClick={() => onReturn()}>Regresar</Button>}
            <PlansSumEdit objBudget={objBudget} plan={plan} openDialog={showEditSumDialog} handleCloseSumEdit={handleCloseSumEdit} />
        </PrincingPlansPays >
    )
}
