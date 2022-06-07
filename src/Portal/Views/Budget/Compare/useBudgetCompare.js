import { useState, useEffect } from 'react'

export default function useBudgetCompare() {
    const [plans, setPlans] = useState([])
    const [plansCompare, setPlansCompare] = useState([])
    const [countCompare, setCountCompare] = useState(0)

    function setAllPlans(plans){
        setPlans(plans)
    }

    const handleAddCompare = (plan_id) => {
        const planExists = plansCompare.findIndex(element => element.plan_id === plan_id)
        if (planExists === -1) {
            const planToCompare = plans.find(element => element.plan_id === plan_id)
            setPlansCompare([...plansCompare, planToCompare])
            setCountCompare(plansCompare.length)
        }
    }

    function handleSelectCompare(values) {
        let newPlansCompare = []
        for (let value of values) {
            const findcompare = plans.find(element => element.plan_id === value)
            newPlansCompare = [...newPlansCompare, findcompare]
        }
        setPlansCompare([...newPlansCompare])
        setCountCompare(newPlansCompare.length)
    }

    function handleCleanCompare() {
        setPlansCompare([])
    }

    function handleRemoveCompare(reg) {
        const indexToRemove = plansCompare.findIndex(element => element.plan_id === reg.plan_id)
        const plansNew = [...plansCompare]
        plansNew.splice(indexToRemove, 1)
        setPlansCompare(plansNew)
    }

    useEffect(() => {
        setCountCompare(plansCompare.length)
    }, [plansCompare])

    return {
        plansCompare,
        countCompare,
        setAllPlans,
        handleAddCompare,
        handleSelectCompare,
        handleRemoveCompare,
        handleCleanCompare
    }
}
