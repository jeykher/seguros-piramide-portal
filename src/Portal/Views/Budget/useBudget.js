import { useState, useEffect } from 'react'
import Axios from 'axios'
import { distinctArray } from 'utils/utils'


export default function useBudget() {
    const [budgetHash, setbBudgetHash] = useState([])
    const [plans, setPlans] = useState([])
    const [plansAll, setPlansAll] = useState([])
    const [info, setInfo] = useState([])
    const [budgetInfo, setBudgetInfo] = useState()
    const [showBudget, setShowBudget] = useState(false)
    const [selectedPays,setSelectedPays] = useState([])
    const [selectAllCoberts,setSelectAllCoberts] = useState(true);
    const [budgetElementsUpdated, setBudgetElementsUpdated] = useState(false)

    async function getBudgetAreaName(id) {
        const params = { p_budget_id: id }
        const response = await Axios.post('/dbo/budgets/get_budget_area_name', params)
        return response.data.result
    }

    async function getBudgetbyHash(id) {
        setBudgetElementsUpdated(false)
        setbBudgetHash(id)
        const params = { p_budget_hash: id }
        const result = await Axios.post('/dbo/budgets/get_budget_by_hash', params)
        setValuesBudget(result, false)
    }

    async function getBudgetbyId(id) {
        setBudgetElementsUpdated(false)
        /* Codigo original del Portal */
        const params = { p_budget_id: id }
        const result = await Axios.post(`/dbo/budgets/get_budget_by_id`, params)
        /* Codigo original del Portal */
        /* Codigo para emplear la api de prueba de mock server*/
        // const result2 = await Axios.get(`http://localhost:3000/data`)
        /* Codigo para emplear la api de prueba de mock server*/
        setValuesBudget(result)
    }

    async function updateClinicPlan(data) {
        const result = await Axios.post(`/dbo/budgets/update_clinic_plan`, data)
        const notReOrder = true //flag que se utiliza para no reordenar el arreglo de planes
        if(result.status===200){
            getBudgetbyId(data.p_budget_id)
        }else {
            alert("error")
        }
    }

    async function getSMESBudgetbyId(id, planId) {
        setBudgetElementsUpdated(false)
        const params = { p_budget_id: id }
        const result = await Axios.post(`/dbo/budgets/get_budget_by_id_ii`, params)
        await setValuesSMESBudget(id, planId, result)
    }

    function setAssetRiskOnAPlan(assetsAndRiskValuesChanged, planIndexChanged) {

        const plansChanged = [...plans]
        plansChanged[planIndexChanged].assetsAndRiskValues = [...assetsAndRiskValuesChanged]
        setPlans([...plansChanged])
    }

    function setCoveragesOnAPlan(coveragesChanges, planIdChanged) {
        const plansChanged = [...plans]
        plansChanged[planIdChanged].coverages = [...coveragesChanges]
        setPlans([...plansChanged])
    }

    function setAdditionalChargesOnAPlan(additionalChargesChanges, planIdChanged) {
        const plansChanged = [...plans]
        plansChanged[planIdChanged].additionalCharges = [...additionalChargesChanges]
        setPlans([...plansChanged])
    }

    async function setValuesSMESBudget(id, planId, result) {

        let budgetPlans = result.data.p_budget_plans
        let i
        const assetRiskGroups = [...result.data.p_budget_particular_info.assets_risk_groups]
        const coveragesGroups = [...result.data.p_budget_particular_info.coverages_groups]

        async function getAssetsCoveragesAndInfoPlan(thePlan) {
            const plan = { ...thePlan }
            let params, assetsAvailableToSelect, coveragesAvailableToSelect, additionalCharges
            params = {
                p_budget_id: id,
                p_budget_plan_id: plan.plan_id,
                p_product_code: plan.product_code,
                p_plan_code: plan.plan_code,
                p_plan_revision: plan.plan_revision
            }
            const response = await Axios.post(`/dbo/budgets/get_assets_covers_and_plan_inf`, params)

            assetsAvailableToSelect = response.data.p_assets
            plan.assetsAndRiskValues = [...assetRiskGroups, ...assetsAvailableToSelect]

            coveragesAvailableToSelect = response.data.p_coverages
            plan.coverages = [...coveragesGroups, ...coveragesAvailableToSelect]

            plan.additionalCharges = [...response.data.p_additional_charges]

            plan.budgetPlanParticularInfo = { ...response.data.p_budget_plan_info }

            return { ...plan }
        }

        if (planId) {
            i = budgetPlans.findIndex(element => element.plan_id === planId)
            budgetPlans[i] = await getAssetsCoveragesAndInfoPlan(budgetPlans[i])
        } else {
            for (i = 0; i < budgetPlans.length; i++) {
                budgetPlans[i] = await getAssetsCoveragesAndInfoPlan(budgetPlans[i])
            }
        }
        setPlansAll(budgetPlans)
        setPlans(budgetPlans)
        //filterSelectedPays(budgetPlans)
        setInfo(result.data.p_budget_details)
        setBudgetInfo(result.data.p_budget_particular_info)
        setBudgetElementsUpdated(true)
    }

    function setValuesBudget(result) {
        setInfo(result.data.p_cur_budget)
        setBudgetInfo(result.data.p_budget_info)
        const plansOrdered = result.data.p_cur_budget[0].AREA_NAME==="PERSONAS"?
                                 result.data.p_budget_plans.plans.sort((a, b) => (a.mtosumaaseg < b.mtosumaaseg ? 1 : a.mtosumaaseg > b.mtosumaaseg ? -1 : 0))
                                 :
                                 result.data.p_budget_plans.plans.sort((a, b) => (a.prima < b.prima ? 1 : a.prima > b.prima ? -1 : 0))
        setPlansAll(plansOrdered)
        filterPlans(result.data.p_cur_budget, result.data.p_budget_plans.plans)
        setBudgetElementsUpdated(true)
    }

    function filterSelectedPays(plans) {
        const methodsPayment = filterMethodsPayments(plans)
        const resultPays = plans.map(element => {
            return {
                plan_id: element.plan_id,
                methods: methodsPayment
            }
        })
        setSelectedPays(resultPays);
    }

    function filterMethodsPayments(plans) {
        let pays = []
        plans.map((plan) => (pays = [...pays, ...plan.fraccionamiento]))
        const distinctPay = distinctArray(pays, "maxgiro", "nomplan")
                            .sort((a,b) => a.id - b.id).map(element => {
            return {
                checked: false,
                ...element
            }
        })
        const methodsPayments = [{
            checked: false,
            id: 0,
            name: 'Anual'
        }, ...distinctPay]
        return methodsPayments
    }

    function handleSelectedPay(event, plan_id, id) {
        let pays = [...selectedPays]
        const indexPlan = pays.findIndex(element => element.plan_id === plan_id)
        const indexMethod = pays[indexPlan].methods.findIndex(element => element.id === id)
        let oldValue = [...pays[indexPlan].methods]
        let oldMethod = pays[indexPlan].methods[indexMethod];
        let newMethod = { ...oldMethod, checked: event.target.checked }
        oldValue.splice(indexMethod, 1, newMethod);
        pays[indexPlan].methods = oldValue
        setSelectedPays(pays);
    }

    function filterPlans(jsonInfo, jsonPlans) {
        let category = 'GENERAL'
        if (jsonInfo[0].AREA_NAME === 'PERSONAS') {
            for (const plan of jsonPlans) {
                if (plan.categoria === 'ADFU') {
                    if (plan.coberturas.findIndex((c) => c.codramocert === 'ADFU' && c.codcobert === 'TESP' && c.indincluida === 'S') !== -1) {
                        category = 'ADFU'
                        break
                    }
                } else if (plan.categoria === 'IMSE') {
                    if (plan.coberturas.findIndex((c) => c.codramocert === 'IMSE' && c.codcobert === 'MARE' && c.indincluida === 'S') !== -1) {
                        category = 'IMSE'
                        break
                    }
                }
            }
            const plansFiltered = jsonPlans.filter((p) => p.tipo_plan !== 'HCMI' || (p.tipo_plan === 'HCMI' && p.categoria === category))
            // console.log(plansFiltered)
            setPlans(plansFiltered)
            filterSelectedPays(plansFiltered)
        } else {
            setPlans(jsonPlans)
            filterSelectedPays(jsonPlans)
        }
        setBudgetElementsUpdated(true)
    }

    function getPlanBuy() {
        return plans.find(element => element.plan_id === info[0].PLAN_ID_BUY)
    }

    function refresh() {
        if (info[0].AREA_NAME === 'PYME')
            getSMESBudgetbyId(info[0].BUDGET_ID, null)
        else
            getBudgetbyId(info[0].BUDGET_ID)
        //getBudgetbyHash(budgetHash)
    }

    function refreshMethodsPayment() {
        filterSelectedPays(plans);
    }

    function resetMethodsPlan(plan_id) {
        let pays = [...selectedPays]
        const indexPlan = pays.findIndex(element => element.plan_id === plan_id);
        const oldValue = pays[indexPlan].methods
        const newValue = oldValue.map(element => {
            return {
                ...element,
                checked: false
            }
        })
        pays[indexPlan].methods = newValue
        setSelectedPays(pays)
    }

    function handleSelectMethodsPlan(values) {
        let pays = [...selectedPays]
        for (const plan of pays) {
            if (values.some(element => element === plan.plan_id) === false) {
                const indexPlan = pays.findIndex(element => element.plan_id === plan.plan_id)
                const newValue = pays[indexPlan].methods.map(element => {
                    return {
                        ...element,
                        checked: false
                    }
                })
                pays[indexPlan].methods = newValue
            }
        }
        setSelectedPays(pays)
    }

    async function handleSelectAllCobertsOptional(value){
        setSelectAllCoberts(value);
        const params = {
            p_budget_id: info[0].BUDGET_ID,
            p_value: value ? 'S' : 'N'
        }
        await Axios.post('/dbo/budgets/set_all_coberts_optional', params)
        refresh()
    }

    useEffect(() => {
        budgetElementsUpdated && plans.length > 0 && info.length > 0 && budgetInfo && setShowBudget(true)
    }, [budgetElementsUpdated])

    return {
        plansAll,
        plans,
        setPlans,
        info,
        budgetInfo,
        getBudgetbyId,
        getBudgetbyHash,
        getPlanBuy,
        showBudget,
        setShowBudget,
        refresh,
        selectedPays,
        handleSelectedPay,
        refreshMethodsPayment,
        resetMethodsPlan,
        handleSelectMethodsPlan,
        handleSelectAllCobertsOptional,
        selectAllCoberts,
        setSelectAllCoberts,
        getBudgetAreaName,
        getSMESBudgetbyId,
        setAssetRiskOnAPlan,
        setCoveragesOnAPlan,
        setAdditionalChargesOnAPlan,
        updateClinicPlan
    }
}
