import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import { distinctArray } from 'utils/utils'
import CheckBox from 'components/Core/CheckBox/CheckBox'
import AccordionPanelCard from 'components/Core/AccordionPanel/AccordionPanelCard'
import CreateIcon from '@material-ui/icons/Create'
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import Divider from '@material-ui/core/Divider';
import BudgetCobertEditSum from './BudgetCobertEditSum'

export default function BudgetCobertOptionalVehicle(props) {
    const { objBudget, typePlan } = props
    const { plans, info, refresh } = objBudget
    const [cobertsOpt, setCobertsOpt] = useState([])
    const [cobOpt, setCobOpt] = useState([])
    const [showEditSumDialog, setShowEditSumDialog] = useState(false)
    const [dataEdit, setDataEdit] = useState(null)

    useEffect(() => {
        function getCobertOpt() {
            let copt = []
            const plansType = plans.filter((p) => p.tipo_plan === typePlan)
            for (const plan of plansType) {
                copt = [...copt, ...plan.coberturas.filter((cobert) => cobert.indcobertoblig === 'N')]
            }
            setCobOpt(copt)
            const titleCobert = distinctArray(copt, "codcobert", "desccobert")
            const cobertsAllOpt = setCobertsDetails(titleCobert, copt)
            cobertsAllOpt.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
            setCobertsOpt(cobertsAllOpt)
        }
        getCobertOpt()
    }, [plans])

    async function handleSelectCobertOpt(e, cobert) {
        const params = {
            p_budget_id: info[0].BUDGET_ID,
            p_type_plan: typePlan,
            p_codcobert: cobert.id,
            p_value: e.target.checked ? 'S' : 'N'
        }
        await Axios.post('/dbo/budgets/set_cobert_vehicle_optional', params)
        refresh()
    }

    function setCobertsDetails(codTitles, cobOptionals) {
        let cobDet = []
        for (const cob of codTitles) {
            const coberts = cobOptionals.filter((cobert) => cobert.codcobert === cob.id)
            const sums = coberts.sort((a, b) => (a.sumaasegmax > b.sumaasegmax ? 1 : a.sumaasegmax < b.sumaasegmax ? -1 : 0))[0]
            cobDet = [...cobDet, { ...cob, ...sums }]
        }
        return cobDet
    }

    function handleCloseSumEdit() {
        setShowEditSumDialog(false)
    }

    function handleEditSum(cobert) {
        setDataEdit(null)
        setDataEdit({
            title: cobert.cobcomplementaria === 'S' ? cobert.cc_tipotarifa === 'SA' ? '% de Suma' : '% de Tasa' : 'Suma Asegurada',
            id: cobert.id,
            sumaaseg: cobert.cobcomplementaria === 'S' ? cobert.cc_valor : cobert.suma_aseg,
            sumaasegmin: cobert.cobcomplementaria === 'S' ? cobert.cc_valor_min : cobert.sumaasegmin,
            sumaasegmax: cobert.cobcomplementaria === 'S' ? cobert.cc_valor_max : cobert.sumaasegmax
        })
        setShowEditSumDialog(true)
    }

    return (
        cobertsOpt.length > 0 &&
        <AccordionPanelCard id={12} title="Coberturas opcionales" color="primary">
            <GridContainer>
                {cobertsOpt.map((cobert, ind) => (
                    <Fragment key={ind}>
                        <GridItem item xs={12} sm={12} md={12} lg={12}>
                            <CheckBox
                                checked={cobert.indincluida === 'S' ? true : false}
                                classLabel="labelSmall"
                                label={cobert.name}
                                name={`check_${cobert.id}`}
                                onChange={(e) => handleSelectCobertOpt(e, cobert)}
                            />
                        </GridItem>
                        {cobert.indincluida === 'S' && <GridItem item xs={12} sm={12} md={12} lg={12}>
                            {cobert.cobcomplementaria === 'S' ? cobert.cc_tipotarifa === 'SA' ? '% Suma: ' : '% Tasa: ' : 'Suma: '}
                            <AmountFormatDisplay name={`sumopt_${cobert.id}`} value={cobert.cobcomplementaria === 'S' ? cobert.cc_valor : cobert.suma_aseg} />
                            <CreateIcon color="primary" onClick={() => handleEditSum(cobert)} />
                            <Divider />
                        </GridItem>}
                    </Fragment>
                ))}
            </GridContainer>
            {dataEdit && <BudgetCobertEditSum
                objBudget={objBudget}
                typePlan={typePlan}
                data={dataEdit}
                step={1}
                openDialog={showEditSumDialog}
                handleCloseSumEdit={handleCloseSumEdit}
            />}
        </AccordionPanelCard>
    )
}
