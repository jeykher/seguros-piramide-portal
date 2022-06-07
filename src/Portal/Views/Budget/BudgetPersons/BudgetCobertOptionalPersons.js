import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import { distinctArray } from 'utils/utils'
import CheckBox from 'components/Core/CheckBox/CheckBox'
import AccordionPanelCard from 'components/Core/AccordionPanel/AccordionPanelCard'
import CardPanel from 'components/Core/Card/CardPanel';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    containerCheckbox: {
        margin: '0 10px'
    },
}));

export default function BudgetCobertOptionalPersons(props) {
    const classes = useStyles();
    const { objBudget, typePlan, dialog } = props
    const { plansAll, budgetInfo, info, refresh } = objBudget
    const [cobertsOpt, setCobertsOpt] = useState([])
    const [cobOpt, setCobOpt] = useState([])
    const [cobAdfu, setCobAdfu] = useState(false)
    const [cobImse, setCobImse] = useState(false)



    let cobertNotInclude = []
    let insuredEnableAdfu = 0
    let insuredEnableImse = 0
    let planAdfu
    let planImse
    verifyEnableInsuredCobert()
    function verifyEnableInsuredCobert() {
        planAdfu = plansAll.find((p) => p.categoria === 'ADFU')
        if (planAdfu !== undefined) {
            const insuredAdfu = distinctArray(planAdfu.coberturas, "insured_id", "insured_id").length
            const cobertAdfu = planAdfu.coberturas.find((e) => e.codcobert === 'TESP')
            if(cobertAdfu === undefined){
                insuredEnableAdfu = 0
            } else{
                insuredEnableAdfu = Math.trunc(insuredAdfu / cobertAdfu.permite_aseg)
            }           
            if (insuredEnableAdfu === 0) cobertNotInclude.push('TESP')
        }

        planImse = plansAll.find((p) => p.categoria === 'IMSE')
        if (planImse !== undefined) {
            const insuredImse = distinctArray(planImse.coberturas, "insured_id", "insured_id").length
            const cobertImse = planImse.coberturas.find((e) => e.codcobert === 'MARE')
            if(cobertImse === undefined){
                insuredEnableImse = 0
            } else{
                insuredEnableImse = Math.trunc(insuredImse / cobertImse.permite_aseg)
            }            
            if (insuredEnableImse === 0) cobertNotInclude.push('MARE')
        }
    }

    function verifyCobertsExcluyents(copt) {
        setCobAdfu(copt.findIndex((e) => e.codcobert === 'TESP' && e.indincluida === 'S') !== -1 ? true : false)
        setCobImse(copt.findIndex((e) => e.codcobert === 'MARE' && e.indincluida === 'S') !== -1 ? true : false)
    }

    useEffect(() => {
        function getCobertOpt() {
            let copt = []
            for (const plan of plansAll) {
                copt = [...copt, ...plan.coberturas.filter((cobert) => cobert.indcobertoblig === 'N'
                    && cobert.codprod === typePlan && !cobertNotInclude.includes(cobert.codcobert))]
            }
            setCobOpt(copt)
            verifyCobertsExcluyents(copt)
            setCobertsOpt(distinctArray(copt, "codcobert", "desccobert"))
        }
        getCobertOpt()
    }, [plansAll])


    function validateCountAseg(params) {
        try {
            if ((params.p_value === 'S') && (params.p_codcobert === 'TESP')) {
                if (planAdfu.coberturas.filter((e) => e.codcobert === 'TESP' && e.indincluida === 'S').length >= insuredEnableAdfu) {
                    throw new Error('No es posible incluir esta cobertura a mas personas')
                }
            }
            if ((params.p_value === 'S') && (params.p_codcobert === 'MARE')) {
                if (planImse.coberturas.filter((e) => e.codcobert === 'MARE' && e.indincluida === 'S').length >= insuredEnableImse) {
                    throw new Error('No es posible incluir esta cobertura a mas personas')
                }
            }
            return true
        } catch (error) {
            dialog({
                variant: "info",
                catchOnCancel: false,
                title: "Alerta",
                description: error.message
            })
            return false
        }
    }

    async function handleSelectCobertOpt(e, insured, cobert) {
        const params = {
            p_budget_id: info[0].BUDGET_ID,
            p_type_plan: typePlan,
            p_codcobert: cobert.id,
            p_insured_id: insured.insured_id,
            p_value: e.target.checked ? 'S' : 'N'
        }
        if (!validateCountAseg(params)) return
        await Axios.post('/dbo/budgets/set_cobert_persons_optional', params)
        refresh()
    }

    const checkAllCobertsOptional = () => {
        for(const cobert of cobertsOpt){
            for(const insured of budgetInfo.insured){
                const result = cobOpt.find(element => insured.insured_id === element.insured_id && cobert.id === element.codcobert);
                if(result !== undefined){
                    if(result.indincluida !== 'S'){
                        objBudget.setSelectAllCoberts(false);
                        return
                    }
                }
            }
        }
    }

    useEffect(() => {
        cobertsOpt.length > 0 && checkAllCobertsOptional();
    },[cobertsOpt])


    return (
        cobertsOpt.length > 0 &&
            <CardPanel
            titulo="Coberturas Opcionales"
            icon="list_alt"
            iconColor="primary"
            collapse
            >
                <GridContainer>
                    <GridItem item xs={12} sm={12} md={8} lg={8} >
                        <CheckBox
                            checked={objBudget.selectAllCoberts}
                            className={classes.containerCheckbox}
                            label='Seleccionar todo'
                            name={`check_all`}
                            onChange={(e) => objBudget.handleSelectAllCobertsOptional(e.target.checked)}
                        />
                    </GridItem>
                </GridContainer>
                {cobertsOpt.map((cobert, ind) => (
                    ((cobAdfu && cobert.id !== 'MARE') || (!cobAdfu)) &&
                    ((cobImse && cobert.id !== 'TESP') || (!cobImse)) &&
                        <Fragment key={ind}>
                            <AccordionPanelCard id={12} title={cobert.name} color="primary">
                                <GridContainer>
                                    {budgetInfo.insured.map((insured, index) => {
                                        const regCobert = cobOpt.find((e) => insured.insured_id === e.insured_id && cobert.id === e.codcobert)
                                        if (regCobert !== undefined) {
                                        return (<GridItem item key={index} xs={12} sm={6} md={4} lg={4} >
                                            <CheckBox
                                                checked={regCobert.indincluida === 'S' ? true : false}
                                                classLabel="labelSmall"
                                                label={insured.age}
                                                name={`check_${insured.insured_id}_${cobert.id}`}
                                                onChange={(e) => handleSelectCobertOpt(e, insured, cobert)}
                                            />
                                        </GridItem>)
                                        }
                                    })}
                                </GridContainer>
                            </AccordionPanelCard>
                        </Fragment>
                ))}

        </CardPanel>
    )
}
