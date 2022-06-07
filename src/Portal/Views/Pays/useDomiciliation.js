import React from 'react'
import Axios from 'axios'
import { AccordionSummary } from '@material-ui/core'
import { useDialog } from '../../../context/DialogContext'

const useDomiciliation = () => {
    const dialog = useDialog()
    const getPlanToBuy = async (plans, plan_id_to_buy) => {
        return plans.find(element => element.plan_id === plan_id_to_buy)
    }
    const getBudgetbyId = async (id) => {
        const params = { p_budget_id: id }
        let response = await Axios.post(`/dbo/budgets/get_budget_by_id`, params)
        return response.data
    }
    const getBanks = async () => {
        let insuranceCompany = undefined
        let company = process.env.GATSBY_INSURANCE_COMPANY
        let response = await Axios.post('/dbo/budgets/get_entfinan')
        if(company === 'PIRAMIDE') {
            insuranceCompany = '01'
        }
        else {
            insuranceCompany = '02'
        }
        response.data.company = insuranceCompany
        return response.data
    }
    const getTypeAccount = async () => {
        let response = await Axios.post('/dbo/budgets/get_tipocta')
        return response.data
    }
    const getCustomerInfo = async (budget_id) => {
        try {
            let userBudgetInformation = null
            let params = {
                p_budget_id: budget_id
            }
            let response =  await Axios.post('/dbo/budgets/get_insured_summary', params)
            return response.data
        }
        catch(error) {
            console.log(error)
        }
    }
    const getNumberAccounts = async (userData) => {
        let params = {
            cpTipoId: userData.cpTipoId,
            npNumId: userData.npNumId,
            cpDvid: userData.cpDvid,
            cpCodEntFinan: userData.cpCodEntFinan,
            cpTipoCuenta: userData.cpTipoCuenta,
            cpCtaMoneda: userData.cpCtaMoneda
        }
        let response = await Axios.post('/dbo/budgets/get_numcuenta', params)
        return response.data
    } 
    const getPoliciesClient = async (clientCode) => {
        let params = {
            p_client_code: clientCode
        }
        const response = await Axios.post('/dbo/general_policies/get_policies_client', params)
        return response.data
    }
    const updateNumberAccount = async (accountData) => {
        const params = {
            cpCodFracc: accountData.cpCodFracc,
            npNumFracc: accountData.npNumFracc,    
            cpTipoid: accountData.cpTipoid,
            npNumid: accountData.npNumid,
            cpDvid: accountData.cpDvid,
            cpNumcuenta: accountData.cpNumcuenta,
            cpTipocuenta: accountData.cpTipocuenta,
            cpCodentfinan: accountData.cpCodentfinan,
            cpCodseguridad: accountData.cpCodseguridad,
            dpFecsts: accountData.dpFecsts,
            cpMesvenc: accountData.cpMesvenc,
            cpAnovenc: accountData.cpAnovenc,
            cpTipotarj: accountData.cpTipotarj,
            cpIndpri: accountData.cpIndpri,
            cpCodusr: accountData.cpCodusr,
            cpCodciaseg: accountData.cpCodciaseg,
            cpCtamoneda: accountData.cpCtamoneda,
            cpIndctanom: accountData.cpIndctanom,
            cpStscuenta: accountData.cpStscuenta
       }
       try {
           const response = await Axios.post('/dbo/budgets/actualiza_cf', params)
           return response.data
       }
       catch(error) {
            console.log(error)
            dialog({
                variant: "info",
                catchOnCancel: false,
                title: "Alerta",
                description: "Cuenta bancaria invalida o existente.",
            })
       }
    }
    return {
        getPlanToBuy,
        getBudgetbyId,
        getBanks,
        getTypeAccount,
        getCustomerInfo,
        getNumberAccounts,
        getPoliciesClient,
        updateNumberAccount
    }
}

export default useDomiciliation