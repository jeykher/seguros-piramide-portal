import React, { useState, useEffect } from 'react'
import AccordionComparePanel from 'components/Core/AccordionPanel/AccordionComparePanel'
import Axios from 'axios'
import { distinctArray } from 'utils/utils'
import PolicyCobert from './PolicyCobert'
import Cardpanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"

export default function PolicyDetailsHome({ policy_id, certified_id }) {
    const [risk, setRisk] = useState(null)
    const [property, setProperty] = useState([])
    const [coverages, setCoverages] = useState([])
    const [coveragesProp, setCoveragesProp] = useState([])

    async function getpolicyDetails() {
        const params = { p_policy_id: policy_id, p_certified_id: certified_id }
        const result = await Axios.post('dbo/general_policies/get_policy_home', params)
        setRisk(result.data.c_risk[0])
        setProperty(distinctArray(result.data.c_properties, "DESCBIEN", "DESCBIEN"))
        setCoverages(result.data.c_coverages)
        setCoveragesProp(result.data.c_coverages_property)
    }

    function getCobertsProperty(descbien) {
        return coveragesProp.filter((c) => c.DESCBIEN === descbien)
    }

    useEffect(() => {
        getpolicyDetails()
    }, [])

    return (
        <Cardpanel titulo="Detalle del Seguro" icon="home" iconColor="primary">
            {risk && <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <h6>{`${risk.DESCZONAPOSTAL} - ${risk.ZONAPOSTAL}`}</h6>
                    <h6>{risk.DIREC} </h6>
                    <h6>{`${risk.DESCMUNICIPIO} - ${risk.DESCCIUDAD}`}</h6>
                    <h6>{`${risk.DESCESTADO} - ${risk.DESCPAIS}`}</h6>
                </GridItem>
            </GridContainer>}
            {property.map((p, index) => (
                <AccordionComparePanel key={index} title={p.name} unmount>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                            <PolicyCobert coverages={getCobertsProperty(p.id)} />
                        </GridItem>
                    </GridContainer>
                </AccordionComparePanel>
            ))}
            {coverages.length > 0 && <AccordionComparePanel key={231} title="Complementarias" unmount>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <PolicyCobert coverages={coverages} />
                    </GridItem>
                </GridContainer>
            </AccordionComparePanel>}
        </Cardpanel>
    )
}
