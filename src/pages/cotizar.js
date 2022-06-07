import React, { useEffect } from 'react'
import queryString from 'query-string';
import { initAxiosInterceptors } from 'utils/axiosConfig'
import { useDialog } from 'context/DialogContext'
import { useLoading } from 'context/LoadingContext'
import { navigate } from "gatsby"
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
import TemplateBlank from 'LandingPageMaterial/Layout/TemplateBlank'

export default function Cotizar(props) {
    let params_url = queryString.parse(props.location.search)
    const { getBudgetbyHash, showBudget, setShowBudget, ...objBudget } = useBudget()
    const dialog = useDialog();
    const loading = useLoading();

    async function searchBudget() {
        await getBudgetbyHash(params_url.id)
    }

    async function handleBack() {
        setShowBudget(false)
        const params = { p_budget_id: objBudget.info[0].BUDGET_ID }
        await Axios.post('/dbo/budgets/set_prev_status_budget', params)
        await searchBudget()
        navigate(`/cotizar?id=${params_url.id}`, { replace: true })
    }

    async function handleFinish() {
        setShowBudget(false)
        await searchBudget()
        navigate(`/cotizar?id=${params_url.id}`, { replace: true })
    }

    useEffect(() => {
        initAxiosInterceptors(dialog,loading)
        searchBudget()
    }, [])


    function budgetController() {
        const status = objBudget.info[0].STATUS
        switch (status) {
            case 'CREATED':
                return <BudgetCode objBudget={objBudget} onFinish={handleFinish} />
            case 'VALID':
                return <Budget objBudget={objBudget} onFinish={handleFinish} title={objBudget.info[0].BUDGET_DESCRIPTION} />
            case 'HOLDER':
                return <BudgetCustomerForm objBudget={objBudget} index="HOLDER" onFinish={handleFinish} onBack={handleBack} title="Datos del Titular" />
            case 'INVOICEER':
                return <BudgetCustomerForm objBudget={objBudget} index="INVOICEER" onFinish={handleFinish} onBack={handleBack} title="Datos de la persona que pagará la póliza" />
            case 'DRIVER':
                return <BudgetDriverForm objBudget={objBudget} index="DRIVER" onFinish={handleFinish} onBack={handleBack}/>
            case 'VEHDATA':
                return <VehicleData objBudget={objBudget} onFinish={handleFinish} onBack={handleBack}/>
            case 'RISKDATA':
                return <RiskData objBudget={objBudget} onFinish={handleFinish} onBack={handleBack}/>
            case 'TRAVELER':
                return <BudgetCustomerTravel objBudget={objBudget} onFinish={handleFinish} onBack={handleBack}/>
            case 'INSPECTION':
                return <BudgetInspection objBudget={objBudget} onFinish={handleFinish} />
            case 'INSURED':
                return <BudgetInsured objBudget={objBudget} index="INSURED" onFinish={handleFinish} onBack={handleBack}/>
            case 'SUMMARY':
                return <BudgetInsuredSummary objBudget={objBudget} onFinish={handleFinish} />
            case 'INCLUDED':
                return <BudgetRequirements objBudget={objBudget} onFinish={handleFinish} isPortal={false} />
            case 'ACTIVATED':
                return <BudgetPay objBudget={objBudget} onFinish={handleFinish} />
            case 'PAYED':
                return <BudgetResult objBudget={objBudget} onFinish={handleFinish} />
            default:
                return null;
        }
    }

    return (
        showBudget &&
        <TemplateBlank>
            {budgetController()}
        </TemplateBlank>
    )
}
