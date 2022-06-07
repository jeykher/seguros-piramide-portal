import React, { Fragment } from 'react'
import AddressController from 'components/Core/Controller/AddressController'

export default function InspectionFormAddress(props) {
    const { objForm } = props
    return (
        <Fragment>
            <h5>Introduzca la dirección donde se hará la inspección</h5>
            <AddressController
                index={0}
                objForm={objForm}
                showUrbanization={true}
                showDetails={true}
            />
        </Fragment>
    )
}
