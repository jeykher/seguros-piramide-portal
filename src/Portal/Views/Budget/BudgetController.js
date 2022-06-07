import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import useBudget from 'Portal/Views/Budget/useBudget'
import BudgetCode from 'Portal/Views/Budget/BudgetCode'
import BudgetCustomerForm from 'Portal/Views/Budget/BudgetCustomerForm'
import Budget from 'Portal/Views/Budget/Budget'
import BudgetInsured from 'Portal/Views/Budget/BudgetPersons/BudgetInsured'
import BudgetInsuredSummary from 'Portal/Views/Budget/BudgetPersons/BudgetInsuredSummary'
import BudgetDriverForm from 'Portal/Views/Budget/BudgetVehicle/BudgetDriverForm'
import BudgetRequirements from 'Portal/Views/Budget/BudgetRequirements'
import BudgetPay from 'Portal/Views/Budget/BudgetPay'
import VehicleData from 'Portal/Views/Budget/BudgetVehicle/VehicleData'
import BudgetInspection from 'Portal/Views/Budget/BudgetVehicle/BudgetInspection'
import BudgetResult from 'Portal/Views/Budget/BudgetResult'
import RiskData from 'Portal/Views/Budget/BudgetHome/RiskData'
import BudgetCustomerTravel from 'Portal/Views/Budget/BudgetTravel/BudgetCustomerTravel'
import BudgetSMES from 'Portal/Views/Budget/BudgetSMES/BudgetSMES'
import BudgetSMESLocations from 'Portal/Views/Budget/BudgetSMES/BudgetSMESLocations'
import BudgetSMESSummary from 'Portal/Views/Budget/BudgetSMES/BudgetSMESSummary'

export default function BudgetController({ id, restartScroll, workflowId }) {
    const { getBudgetbyId, showBudget, setShowBudget, getBudgetAreaName, getSMESBudgetbyId, ...objBudget } = useBudget()
    const [budgetAreaName, setBudgetAreaName] = useState()
    const [tabSelectedBudgetSMES, setTabSelectedBudgetSMES] = useState()
    const [showBackButtonOnBudgetSMES, setShowBackButtonOnBudgetSMES] = useState(false)

    async function searchBudget(planId) {
        let budgetId
        if (!id && workflowId) {
            const params = { p_workflow_id: workflowId }
            const response = await Axios.post('/dbo/budgets/get_budget_id_from_workflow_id', params)
            budgetId = response.data.result
            setShowBackButtonOnBudgetSMES(true)
        } else {
            budgetId = id
        }
        const localBudgetAreaName = await getBudgetAreaName(budgetId)
        setBudgetAreaName(localBudgetAreaName)
        if (localBudgetAreaName === "PYME") {
            await getSMESBudgetbyId(budgetId, planId)
        } else {
            await getBudgetbyId(budgetId)
        }
    }

    async function handleBack() {
        setShowBudget(false)
        const apiServicePath = (budgetAreaName === "PYME") ? '/dbo/budgets/set_prev_status_budget_v2' : '/dbo/budgets/set_prev_status_budget'
        const params = { p_budget_id: objBudget.info[0].BUDGET_ID }
        await Axios.post(apiServicePath, params)
        await searchBudget()
    }

    async function handleFinish() {
        setShowBudget(false)
        await searchBudget()
    }

    async function handleFinishBudgetSMES(planId, tabSelected) {
        setTabSelectedBudgetSMES(tabSelected)
        setShowBudget(false)
        await searchBudget(planId)
    }

    useEffect(() => {
        restartScroll()
    }, [showBudget])

    useEffect(() => {
        searchBudget()
    }, [])

    function budgetController() {
        const status = objBudget.info[0].STATUS
        switch (status) {
            case 'CREATED':
                return <BudgetCode objBudget={objBudget} onFinish={handleFinish} />
            case 'VALID':
                return (budgetAreaName === "PYME") ? <BudgetSMES objBudget={objBudget} onFinish={handleFinishBudgetSMES} tabSelected={tabSelectedBudgetSMES} /> : <Budget objBudget={objBudget} onFinish={handleFinish} title={objBudget.info[0].BUDGET_DESCRIPTION} />
            case 'APPROVAL_REQUESTED':
                return <BudgetSMES objBudget={objBudget} onFinish={handleFinishBudgetSMES} tabSelected={tabSelectedBudgetSMES} showBackButton={showBackButtonOnBudgetSMES}/>
            case 'APPROVED':
                return <BudgetSMES objBudget={objBudget} onFinish={handleFinishBudgetSMES} tabSelected={tabSelectedBudgetSMES} showBackButton={showBackButtonOnBudgetSMES}/>
            case 'LOCATIONS':
                return <BudgetSMESLocations objBudget={objBudget} onFinish={handleFinishBudgetSMES} onBack={handleBack} />
            case 'HOLDER':
                return <BudgetCustomerForm objBudget={objBudget} index="HOLDER" onFinish={handleFinish} title="Datos del Titular" onBack={handleBack} />
            case 'LEGALREP':
                return <BudgetCustomerForm objBudget={objBudget} index="LEGALREP" onFinish={handleFinish} title="Datos del Representante Legal" onBack={handleBack} />
            case 'INVOICEER':
                return <BudgetCustomerForm objBudget={objBudget} index="INVOICEER" onFinish={handleFinish} title="Datos de la persona que pagará la póliza" onBack={handleBack} />
            case 'DRIVER':
                return <BudgetDriverForm objBudget={objBudget} index="DRIVER" onFinish={handleFinish} onBack={handleBack} />
            case 'VEHDATA':
                return <VehicleData objBudget={objBudget} onFinish={handleFinish} onBack={handleBack} />
            case 'RISKDATA':
                return <RiskData objBudget={objBudget} onFinish={handleFinish} onBack={handleBack} />
            case 'TRAVELER':
                return <BudgetCustomerTravel objBudget={objBudget} onFinish={handleFinish} onBack={handleBack} />
            case 'INSPECTION':
                return <BudgetInspection objBudget={objBudget} onFinish={handleFinish} />
            case 'INSURED':
                return <BudgetInsured objBudget={objBudget} index="INSURED" onFinish={handleFinish} onBack={handleBack} />
            case 'SUMMARY':
                return <BudgetInsuredSummary objBudget={objBudget} onFinish={handleFinish} />
            case 'SME_SUMMARY':
                return <BudgetSMESSummary objBudget={objBudget} onFinish={handleFinishBudgetSMES} onBack={handleBack} />
            case 'INCLUDED':
                return <BudgetRequirements objBudget={objBudget} onFinish={handleFinish} isPortal={true} />
            case 'ACTIVATED':
                return <BudgetPay objBudget={objBudget} onFinish={handleFinish} />
            case 'PAYED':
                return <BudgetResult objBudget={objBudget} onFinish={handleFinish} />
            default:
                return null;
        }
    }
    return (
        showBudget && budgetController()
    )
}
