import React,{useState} from 'react'
import {navigate} from 'gatsby'
import { useDialog } from 'context/DialogContext'
import Axios from 'axios'
import BillingSearch from './BillingSearch'
import BillingTable from './BillingTable'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import {getSymbolCurrency} from 'utils/utils'

export default function Billing() {
    const [billings,setBillings] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [jsonResponse,setJsonResponse] = useState()
    const [currency,setcurrency] = useState('')
    const dialog = useDialog();

    function handleBack (e){
        e.preventDefault();
        window.history.back()
    }

    async function getBilling(dataform){
        setIsLoading(true);
        const params = {
            p_start_date : dataform.p_start_date,
            p_end_date : dataform.p_end_date
        }
        const response = await Axios.post('/dbo/auto_claims/request_invoice_batch',params)
        setJsonResponse(response.data.p_result)
        setcurrency(getSymbolCurrency(response.data.p_result.moneda))
        const jsonselectAll = response.data.p_cur_data.map((row)=>{return { ...row, tableData: { checked: true }}})
        setBillings(jsonselectAll)
        setIsLoading(false)
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
            await Axios.post('/dbo/auto_claims/request_approval_invoice_batch',jsonParam)
            navigate('/app/home_proveedor_satelital')
        }catch(error){
            console.error(error)
        }
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={3} lg={3}>
                <BillingSearch handleSearch={getBilling}/>
            </GridItem>
            <GridItem xs={12} sm={12} md={9} lg={9}>
                <BillingTable billings={billings} isLoading={isLoading} currency={currency} handleBack={handleBack} handleEnviar={sendBilling}/>
            </GridItem>
        </GridContainer>
    )
}
