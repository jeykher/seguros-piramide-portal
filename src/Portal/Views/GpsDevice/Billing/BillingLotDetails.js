import React,{useEffect, useState} from 'react'
import CardPanel from 'components/Core/Card/CardPanel'

export default function BillingLotDetails(props) {
    const [data,setdata] = useState(null)

    useEffect(() => {
        setdata(props.data)
    }, [props.data])

    return (
        data && <CardPanel titulo="Facturación" icon="date_range" iconColor="primary" >
            <h6><strong>Lote:</strong> {data.idlotfact}</h6>
            <h6><strong>Fecha inicio:</strong> {data.fecinilot}</h6>
            <h6><strong>Fecha fin:</strong> {data.fecfinlot}</h6>  
        </CardPanel>
    )
}
