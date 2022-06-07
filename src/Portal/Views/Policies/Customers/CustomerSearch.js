import React, { Fragment } from 'react'
import CardTemplate from "components/Core/Card/CardTemplate"
import CustomerIdentification from 'Portal/Views/Customer/CustomerIdentification'
import InputController from 'components/Core/Controller/InputController'

export default function CustomerSearch({ index, dataForm, showForm, onSubmit }) {
  const { handleSubmit, ...objForm } = dataForm

  const onSearch = (data) => {
    onSubmit(data)
  }

  return (
    showForm && <form onSubmit={handleSubmit(onSearch)} noValidate>
      <CardTemplate
        titulo="Cliente"
        icon="person"
        color="primary"
        iconcolor="primary"
        accion="Buscar"
        iconaccion="search"
        body={
          <Fragment>
            <CustomerIdentification
              index={index}
              customerType={index}
              objForm={objForm}
              required={false}
            />
            <InputController
              objForm={objForm}
              label="Nombres y/o Apellidos"
              name={`p_names_${index}`}
              fullWidth
              required={false}
            />
            <InputController
                  objForm={objForm}
                  label="Nro. de Placa"
                  name={`p_license_plate_${index}`}
                  fullWidth
                  required={false}
                />
          </Fragment>
        }
      />
    </form>
  )
}
