import React, { useState, useEffect } from 'react'
import AccordionComparePanel from 'components/Core/AccordionPanel/AccordionComparePanel'
import Axios from 'axios'
import PolicyCobert from './PolicyCobert'
import Cardpanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"

export default function PolicyDetailsPersons({ policy_id, certified_id }) {
    const [insured, setInsured] = useState([])
    const [coverages, setCoverages] = useState([])

    async function getpolicyDetails() {
        const params = { p_policy_id: policy_id, p_certified_id: certified_id }
        const result = await Axios.post('dbo/general_policies/get_policy_health', params)
        setInsured(result.data.c_insured)
        setCoverages(result.data.c_coverages)
    }

    function getCobertsInsured(codcli){
        return coverages && coverages.filter((c)=> c.CODCLI === codcli)
    }

    useEffect(() => {
        getpolicyDetails()
    }, [])

    return (
        <Cardpanel titulo="Detalle del Seguro" icon="persons" iconColor="primary">
            {insured.map((ins, index) => (
                <AccordionComparePanel key={index} title={`${ins.NOMBRE} - ${ins.PARENTESCO}`} unmount>
                    <GridContainer>
                        <GridItem xs={12} sm={6} md={6}>
                            <h6><strong>Identificación: </strong>{ins.IDENTIFICACION} </h6>
                            <h6><strong>Nombres y apellidos: </strong>{ins.NOMBRE} </h6>
                            <h6><strong>Parentesco: </strong> {ins.PARENTESCO}</h6>
                            <h6><strong>Fecha de nacimiento: </strong>{`${ins.FECNAC} (${ins.EDAD})`} </h6>
                            <h6><strong>Estatura: </strong>{ins.ESTATURA} </h6>
                            <h6><strong>Peso: </strong>{ins.PESO} </h6>
                        </GridItem>
                        <GridItem xs={12} sm={6} md={6}>
                            <h6><strong>E-Mail: </strong>{ins.EMAIL} </h6>
                            <h6><strong>Télefono local: </strong>{`${ins.CODAREA1}-${ins.TELEF1}`} </h6>
                            <h6><strong>Télefono móvil: </strong>{`${ins.CODAREA3}-${ins.TELEF3}`} </h6>
                        </GridItem>
                    </GridContainer>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                            <PolicyCobert coverages={getCobertsInsured(ins.CODCLI)} />
                        </GridItem>
                    </GridContainer>
                </AccordionComparePanel>
            ))}
        </Cardpanel>
    )
}
