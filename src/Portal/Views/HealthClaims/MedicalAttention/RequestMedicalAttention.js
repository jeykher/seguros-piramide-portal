import React, { useEffect,useState } from 'react'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import InsuredInfo from '../InsuredInfo'
import RequestMedicalAttentionForm from './RequestMedicalAttentionForm'

export default function RequestMedicalAttention(props) {
    const [verification,setVerification] = useState(null);

    async function getVerification(){
        try{
            const params = {p_verification_id : props.id}
            const response = await Axios.post('/dbo/health_claims/get_insuran_verification_by_id',params)
            setVerification(response.data.result)
        }catch(error){
            console.error(error)
        }
    }
    
    useEffect(() => {
        getVerification()
    }, [])

    return (
        <GridContainer>
            <GridItem item xs={12} sm={4} md={4} lg={4}>
                {verification !== null &&
                    <InsuredInfo data={verification.clientData}/>
                }  
            </GridItem>
            <GridItem xs={12} sm={8} md={8} lg={8}>
                {verification !== null &&
                    <RequestMedicalAttentionForm data={verification} id={props.id}/>
                }                
            </GridItem>
        </GridContainer>
    )
}