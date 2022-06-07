import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import PolicyCobert from './PolicyCobert'
import Cardpanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"

export default function PolicyDetailsVehicle({ policy_id, certified_id }) {
    const [vehicle, setVehicle] = useState(null)
    const [coverages, setCoverages] = useState([])

    async function getpolicyDetails() {
        const params = { p_policy_id: policy_id, p_certified_id: certified_id }
        const result = await Axios.post('dbo/general_policies/get_policy_vehicle', params)
        setVehicle(result.data.c_vehicle[0])
        setCoverages(result.data.c_coverages)
    }

    useEffect(() => {
        getpolicyDetails()
    }, [])

    return (
        vehicle && <Cardpanel titulo="Detalle del Seguro" icon="drive_eta" iconColor="primary">
            <GridContainer>
                <GridItem xs={12} sm={6} md={6}>
                    <h6><strong>Marca: </strong>{vehicle.DESCMARCA} </h6>
                    <h6><strong>Modelo: </strong>{vehicle.DESCMODELO} </h6>
                    <h6><strong>Versión: </strong> {vehicle.DESVERSION}</h6>
                    <h6><strong>Año: </strong>{vehicle.ANOVEH} </h6>
                    <h6><strong>Color: </strong>{vehicle.COLOR} </h6>
                </GridItem>
                <GridItem xs={12} sm={6} md={6}>
                    <h6><strong>Placa: </strong>{vehicle.NUMPLACA} </h6>
                    <h6><strong>Serial de Carroceria: </strong>{vehicle.SERIALCARROCERIA} </h6>
                    <h6><strong>Serial de Motor: </strong>{vehicle.SERIALMOTOR} </h6>
                    <h6><strong>Número de puestos: </strong>{vehicle.NUMPUESTOS} </h6>
                </GridItem>
            </GridContainer>
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <PolicyCobert coverages={coverages}/>
                </GridItem>
            </GridContainer>
        </Cardpanel>
    )
}
