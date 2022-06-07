import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import InsuredInfo from './InsuredInfo'
import RequestLetterGuaranteeAsInsuredForm from './LetterGuarantee/RequestLetterGuaranteeAsInsuredForm'
import RequestMedicalAttentionAsInsuredForm from './MedicalAttention/RequestMedicalAttentionAsInsuredForm'
import RequestRefundAsInsuredForm from './Refund/RequestRefundAsInsuredForm'

export default function RequestServiceAsInsured(props) {
    const [clientInfo, setClientInfo] = useState(null);
    const [verification,setVerification] = useState(props.verificationId);
    const serviceType = props.serviceType
    const  {location: {state}} = props

    console.log(state)

    async function getClientInfo() {
        try {
            const params = { p_client_code_request: props.clientCode }
            const response = await Axios.post('/dbo/health_claims/get_client_info', params)
            const jsonResult = response.data.result
            jsonResult.verificationId = props.verificationId
          //  console.log(jsonResult)
            setClientInfo(jsonResult)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
            getClientInfo()
    }, [])

    return (
        <GridContainer>
            <GridItem item xs={12} sm={12} md={12} lg={4}>
                {clientInfo !== null &&
                    <InsuredInfo data={clientInfo} />
                }
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={8}>
                {clientInfo && serviceType === '01' &&
                    <RequestLetterGuaranteeAsInsuredForm serviceType={props.serviceType} clientCodeRequest={props.clientCode} verificationId={parseInt(props.verificationId)} />
                }
                {clientInfo && serviceType === '04' &&
                    <RequestMedicalAttentionAsInsuredForm serviceType={props.serviceType} clientCodeRequest={props.clientCode} verificationId={parseInt(props.verificationId)} />
                }
                {clientInfo && serviceType === '03' &&
                    <RequestRefundAsInsuredForm serviceType={props.serviceType} clientCodeRequest={props.clientCode} contractCode={state.clientCode_contra} identNumber={clientInfo.numid} identType={clientInfo.tipoid} verificationId={parseInt(props.verificationId)} isMinor={state.holder_age < 18} titularCodClient={state.insured_holder}  ideaseg={state.id_holder} />
                }
            </GridItem>
        </GridContainer>
    )
}


// {"p_service_type":"03","p_title_disease_code":"11","p_subtitle_disease_code":"06","p_disease_code":"K61","p_det_disease_code":"K610","p_service_amount":"324.00","p_currency_code":"BS","p_claim_date_as_string":"29/04/2022","p_json_param_account":"{\"p_is_beneficiary\":\"N\",\"p_currency_type\":\"NAC\",\"p_account_type\":\"AHO\",\"p_account_number\":\"01740153001536001090\",\"p_identification_type\":null,\"p_identification_number\":null,\"p_identification_id\":null,\"p_claim_invoice_number\":234,\"p_claim_control_number\":\"456\",\"p_claim_invoice_date\":\"29/04/2022\",\"p_string_json_data\":\"[]\"}","p_client_code_request":null}