import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import InsuredInfo from './InsuredInfo'
import RequestLetterGuaranteeAsInsuredForm from './LetterGuarantee/RequestLetterGuaranteeAsInsuredForm'
import RequestMedicalAttentionAsInsuredForm from './MedicalAttention/RequestMedicalAttentionAsInsuredForm'
import RequestRefundAsInsuredForm from './Refund/RequestRefundAsInsuredForm'

export default function RequestServiceAsInsured(props) {
    const [verification,setVerification] = useState(null);
    const serviceType = props.serviceType
    const  {location: {state}} = props

    async function getVerification(){
        try{
            const params = {p_verification_id : props.verificationId}
            const response = await Axios.post('/dbo/health_claims/get_insuran_verification_by_id',params)
            const jsonResult = response.data.result
            setVerification(jsonResult)
        }catch(error){
            console.error(error)
        }
    }

    useEffect(() => {
        getVerification()
    }, [])

    return (
        <GridContainer>
            <GridItem item xs={12} sm={12} md={12} lg={4}>
                {verification !== null &&
                    <InsuredInfo data={verification.clientData} />
                }
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={8}>
                {verification && serviceType === '01' &&
                    <RequestLetterGuaranteeAsInsuredForm serviceType={serviceType} verificationId={verification.verificationId} />
                }
                {verification && serviceType === '04' &&
                    <RequestMedicalAttentionAsInsuredForm serviceType={serviceType} verificationId={verification.verificationId} />
                }
                {verification && serviceType === '03' &&
                    <RequestRefundAsInsuredForm serviceType={serviceType} verificationId={verification.verificationId} clientCodeRequest={verification.clientData.clientCode} contractCode={verification.policies[0].clientCode_contra} identNumber={parseInt(state.p_identification_number)} identType={state.p_identification_type} isMinor={verification.policies[0].holder_age < 18} titularCodClient={verification.policies[0].insured_holder} ideaseg={verification.policies[0].id_holder} />
                }
            </GridItem>
        </GridContainer>
    )
}

