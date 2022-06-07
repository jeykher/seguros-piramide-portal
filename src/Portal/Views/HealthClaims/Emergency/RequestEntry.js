import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import InsuredInfo from '../InsuredInfo'
import RequestEntryForm from './RequestEntryForm'

export default function RequestEntry(props) {
    const [verification,setVerification] = useState(null);

    async function getVerification(){
        try{
            const params = {p_verification_id : props.id}
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
            <GridItem xs={12} sm={12} md={4} lg={4}>
                {verification !== null &&
                    <InsuredInfo data={verification.clientData}/>
                }                
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>
               <RequestEntryForm id={props.id}/>                        
            </GridItem>
        </GridContainer>
    )
}
