import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Cardpanel from 'components/Core/Card/CardPanel'
import VerificationLetterGuaranteeForm from './VerificationLetterGuaranteeForm'
import VerificationLetterGuaranteeFormNot from './VerificationLetterGuaranteeFormNot'

export default function VerificationLetterGuarantee(props) {
    const [verification, setVerification] = useState(null);

    async function getVerification() {
        try {
            const params = {
                p_preadmission_id: props.p_preadmission_id,
                p_complement_id: props.p_complement_id
            }
            const response = await Axios.post('/dbo/health_claims/get_service_details', params)
            setVerification(response.data.result[0])            
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getVerification()
    }, [])

    let formShow
    if(verification && verification.INDAPROBCARTA === "S"){
        formShow = <VerificationLetterGuaranteeForm verificar={true} data={verification}/>
    }else{
        formShow = <VerificationLetterGuaranteeFormNot verificar={true} data={verification}/>
    }

    return (
        <GridContainer>
            <GridItem item xs={12} sm={4} md={4} lg={4}>
                {verification !== null &&
                    <Cardpanel titulo={verification.NOM_ASEGURADO} icon="perm_identity" iconColor="primary">
                        <h6><strong>A favor de: </strong> {verification.NOM_PROVEEDOR}</h6>
                        <h6><strong>Por: </strong>{verification.MTOAMPARADO} </h6>
                        <h6><strong>Procedimiento: </strong>{verification.DESCTRATA} </h6>
                    </Cardpanel>
                }
            </GridItem>
            <GridItem xs={12} sm={8} md={8} lg={8}>
                {verification && formShow}
            </GridItem>
        </GridContainer>
    )
}
