import React from 'react'
import Cardpanel from 'components/Core/Card/CardPanel'

export default function InsuredInfo(props) { 
    const data = props.data;
    return (
        <Cardpanel titulo={data.nameAndLastName} icon="perm_identity" iconColor="primary">
            <h6><strong>Identificación: </strong> {data.clientCode}</h6> 
            <h6><strong>Fecha de nacimiento: </strong>{data.birthDate} </h6>    
            {data.contactPhoneNumber  && <h6><strong>Teléfono de contacto: </strong>{data.contactPhoneNumber} </h6>}
            <h6><strong>Teléfono del cliente: </strong>{data.phoneNumber} </h6>
        </Cardpanel>
    )
}
