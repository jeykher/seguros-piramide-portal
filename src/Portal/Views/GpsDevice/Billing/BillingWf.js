import React,{useState,useEffect} from 'react'
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import {getSymbolCurrency} from 'utils/utils'
import BillingLotDetails from  './BillingLotDetails'
import BillingTable from  './BillingTable'
import pendingAction from '../../Workflow/pendingAction'

export default function BillingWf(props) {
    const {workflow_id,program_id} = props
    const [billings,setBillings] = useState([])
    const [jsonResponse,setJsonResponse] = useState(null)
    const [currency,setcurrency] = useState('')
    const dialog = useDialog();

    function handleBack (e){
        e.preventDefault();
        window.history.back()
    }

    async function getParams(){
        const params = {p_workflow_id: workflow_id, p_program_id : program_id}
        const response = await Axios.post('/dbo/workflow/program_to_clob',params)
        const jsonResult = response.data.result
        console.log(jsonResult)
        getBilling(jsonResult.program_actions[0].parameters[0])
    }

    async function getBilling(parameters){
        const params = {p_idlotfact : parameters.p_idlotfact}
        const response = await Axios.post('/dbo/auto_claims/get_invoice_batch',params)
        console.log(response)        
        setJsonResponse(response.data.p_result)
        setcurrency(getSymbolCurrency(response.data.p_result.moneda))
        const jsonselectAll = response.data.p_cur_data.map((row)=>{return { ...row, tableData: { checked: true }}})
        setBillings(jsonselectAll)
    }

    async function sendBilling (data){
        try{
            if(data.length === 0){
                dialog({
                    variant: "info",
                    catchOnCancel: false,
                    title: "Alerta",
                    description: "Debe seleccionar al menos un servicio"
                })
                throw "Debe seleccionar al menos un servicio"
            }
            const params = {
                p_idlotfact: jsonResponse.idlotfact,
                p_included : data
            }
            const jsonParam = {p_json_register : JSON.stringify(params)}
            console.log(jsonParam)
            await Axios.post('/dbo/auto_claims/request_approval_invoice_batch',jsonParam)
            await pendingAction(workflow_id)
        }catch(error){
            console.error(error)
        }
    }

    useEffect(()=>{
        getParams()
    }, [])

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={3} lg={3}>
                {jsonResponse && <BillingLotDetails data={jsonResponse}/> }        
            </GridItem>
            <GridItem xs={12} sm={12} md={9} lg={9}>
                {billings && <BillingTable billings={billings} currency={currency} handleBack={handleBack} handleEnviar={sendBilling}/>}
            </GridItem>            
        </GridContainer>
    )
}
