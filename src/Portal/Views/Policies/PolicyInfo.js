import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import Cardpanel from 'components/Core/Card/CardPanel'
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem"

export default function PolicyInfo({ policy_id, certified_id }) {
    const [policy, setPolicy] = useState(null)

    async function getpolicyDetails() {
        const params = { p_policy_id: policy_id, p_certified_id: certified_id }
        const result = await Axios.post('dbo/general_policies/get_policy_client', params)
        setPolicy(result.data.c_policy[0])
    }

    useEffect(() => {
        getpolicyDetails()
    }, [])

    return (
        policy &&
        <Cardpanel titulo={policy.NUMEROPOL} icon="article" iconColor="primary">
            <GridItem xs={12} sm={12} md={12}>
                <h6><strong>Producto: </strong>{policy.DESCPROD} </h6>
                <h6><strong>Plan: </strong>{policy.DESCPLAN} </h6>
                <h6><strong>Numero: </strong> {policy.NUMEROPOL}</h6>
                <h6><strong>Certificado: </strong>{policy.NUMCERT} </h6>
                <h6><strong>Vigencia: </strong>{policy.VIGENCIA} </h6>
                <h6><strong>Contratante: </strong>{policy.CONTRATANTE} </h6>
                <h6><strong>Titular: </strong>{policy.TITULAR} </h6>
                <h6><strong>Tlf. Hab: </strong>{policy.TELEFHAB} </h6>
                <h6><strong>Tlf. Movil: </strong>{policy.TELEFCEL} </h6>
                <h6><strong>Email: </strong>{policy.EMAIL} </h6>
                <h6><strong>Asesor: </strong>{policy.ASESOR} </h6>
            </GridItem>
        </Cardpanel>
    )
}
