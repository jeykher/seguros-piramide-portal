import React, { Fragment } from 'react'
import EmailController from 'components/Core/Controller/EmailController'
import PhoneController from 'components/Core/Controller/PhoneController'

export default function CustomerContact(props) {
    const { objForm, index, readOnly } = props;
    return (
        <Fragment>
            <PhoneController 
                readonly={readOnly ? true : false} 
                objForm={objForm} 
                label="Teléfono de Habitación" 
                name={`p_local_phone_${index}`} 
            />
            <PhoneController
                readonly={readOnly ? true : false}
                objForm={objForm} 
                label="Teléfono Celular" 
                name={`p_mobile_phone_${index}`} 
            />
            <EmailController
                readonly={readOnly ? true : false}
                objForm={objForm} 
                label="Correo Electrónico" 
                name={`p_email_${index}`} 
            />
        </Fragment>
    )
}
