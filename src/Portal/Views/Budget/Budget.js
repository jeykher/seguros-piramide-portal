import React, { useState, useEffect, Fragment } from 'react'
import Axios from 'axios'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import BudgetInfoVeh from 'Portal/Views/Budget/BudgetVehicle/BudgetInfoVeh'
import BudgetInfoContainerPersons from 'Portal/Views/Budget/BudgetPersons/BudgetInfoContainer'
import BudgetInfoContainerTravel from 'Portal/Views/Budget/BudgetTravel/BudgetInfoContainer'
import BudgetInfo from './BudgetInfo'
import BudgetPlansCompare from 'Portal/Views/Budget/Compare/BudgetPlansCompare'
import ModalCompareTypePDF from 'components/Core/PDF/ModalCompareTypePDF'
import { distinctArray } from 'utils/utils'
import StickyFooterCompare from 'Portal/Views/Budget/Compare/StickyFooterCompare'
import PlansTab from 'Portal/Views/Budget/Plans/PlansTab'
import useBudgetCompare from './Compare/useBudgetCompare'
import BudgetPlanInfo from './PlanInfo/BudgetPlanInfo'
import BudgetTitle from 'Portal/Views/Budget/BudgetTitle'
import BudgetSelectPay from './BudgetSelectPay'
import { getProfileCode } from "utils/auth"

const goToTop = () => {
    if (typeof window !== `undefined`) {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
    }
}

export default function Budget(props) {
    const { onFinish, objBudget, title } = props
    const { plans, setPlans, info, budgetInfo } = objBudget
    const [showCompare, setShowcompare] = useState(false)
    const { setAllPlans, ...objCompare } = useBudgetCompare()
    const [distinctPlans, setDistinctPlans] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [typeModal, setTypeModal] = useState('')
    const [showPlanInfo, setShowPlanInfo] = useState(false);
    const [planInfo, setPlanInfo] = useState('');
    const [planBuy, setPlanBuy] = useState(null)

    function getDistinctPlans() {
        const result = distinctArray(plans, "tipo_plan", "descrip_tipo_plan")
        setDistinctPlans(result);
    }

    function handleShowModal(value) {
        value && setTypeModal(value.currentTarget.name);
        setShowModal(!showModal)
    }

    function handleShowCompare() {
        goToTop();
        setShowcompare(true)
    }

    function handleShowPlanInfo(plan) {
        goToTop();
        setPlanInfo(plan);
        setShowPlanInfo(!showPlanInfo);
    }

    function handleCloseCompare() {
        setShowcompare(false)
    }

    useEffect(() => {
        plans && setAllPlans(plans)
        getDistinctPlans();
        objCompare.handleCleanCompare()
    }, [plans])

    function handleSelectPay(plan_id, numfracc) {
        const newPlans = [...plans]
        const indexPlan = newPlans.findIndex(element => element.plan_id === plan_id)
        for (const regFracc of newPlans[indexPlan].fraccionamiento) {
            regFracc.numfracc === numfracc ? regFracc.stsplan = 'S' : regFracc.stsplan = 'N'
        }
        setPlans(newPlans)
    }

    async function handleSelectBuy(plan) {
        if (plan.fraccionamiento.length > 0) {
            const plansPays = {
                plan_id: plan.plan_id,
                plans_pay: [{ nomplan: 'Anual', prima: plan.prima }, ...plan.fraccionamiento]
            }
            setPlanBuy(plansPays)
        } else {
            onSelectPay(plan.plan_id)
        }
    }

    async function onSelectPay(plan_id_buy, plan_id_pay) {
        const params = {
            p_budget_id: info[0].BUDGET_ID,
            p_plan_id_buy: plan_id_buy,
            p_plan_id_pay: plan_id_pay === undefined ? null : plan_id_pay,
        }
        if ((getProfileCode() === 'insurance_broker' || getProfileCode() === 'corporate') && (info[0].AREA_NAME === 'AUTOMOVIL'||info[0].AREA_NAME === 'HOGAR'||info[0].AREA_NAME === 'PYME')) {
            const parameters = {
                p_insurance_broker_code: info[0].BUDGET_PARTNER_CODE
            }
            await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/budgets/get_valid_req`,parameters)
        } 
        await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/budgets/budget_buy`, params)
        onFinish()
    }

    function onCloseSelectPay() {
        setPlanBuy(null)
    }

    return (
        <Fragment>
            <BudgetTitle title={title} />
            <GridContainer>
                {info && info[0].AREA_NAME === 'AUTOMOVIL' &&
                    <BudgetInfoVeh info={info} budgetInfo={budgetInfo} />}
                {info && info[0].AREA_NAME === 'PERSONAS' && budgetInfo &&
                    <BudgetInfoContainerPersons info={info} budgetInfo={budgetInfo} />}
                {info && info[0].AREA_NAME === 'HOGAR' && budgetInfo &&
                    <BudgetInfo info={info} />}
                {info && info[0].AREA_NAME === 'VIAJE' && budgetInfo &&
                    <BudgetInfoContainerTravel info={info} budgetInfo={budgetInfo} />}
            </GridContainer>
            {!showCompare && !showPlanInfo && plans &&
                <PlansTab
                    plans={plans}
                    objBudget={objBudget}
                    onAddCompare={objCompare.handleAddCompare}
                    onSelectPay={handleSelectPay}
                    onSelectBuy={handleSelectBuy}
                    onShowPlanInfo={handleShowPlanInfo}
                    handleClose={handleShowModal}
                />
            }
            {!showCompare && showPlanInfo && <GridContainer>
                <BudgetPlanInfo
                    objBudget={objBudget}
                    AreaName={info[0].AREA_NAME}
                    plan={planInfo}
                    onReturn={handleShowPlanInfo}
                    onSelectPay={handleSelectPay}
                    onSelectBuy={handleSelectBuy} />
            </GridContainer>}
            {showCompare && <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    {plans &&
                        <BudgetPlansCompare
                            objBudget={objBudget}
                            BudgetType={info[0].AREA_NAME}
                            objCompare={objCompare}
                            onClose={handleCloseCompare}
                            onSelectPay={handleSelectPay}
                            onSelectBuy={handleSelectBuy}
                        />
                    }
                </GridItem>
            </GridContainer>}
            {objCompare.countCompare > 0 && !showCompare &&
                <StickyFooterCompare objBudget={objBudget} objCompare={objCompare} onShowCompare={handleShowCompare} />
            }
            {planBuy && <BudgetSelectPay planBuy={planBuy} closeSelect={onCloseSelectPay} onSelect={onSelectPay} />}
            <ModalCompareTypePDF
                open={showModal}
                handleClose={handleShowModal}
                idPlans={distinctPlans}
                plans={plans}
                type={info[0].AREA_NAME}
                budgetInfo={budgetInfo}
                infoVehicle={budgetInfo}
                infoClient={info}
                typeModal={typeModal}
            />
        </Fragment>
    )
}
