import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios'
import CardTemplate from "components/Core/Card/CardTemplate"
import UserIdentification from './UserIdentification'
import InputController from 'components/Core/Controller/InputController'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import Tooltip from '@material-ui/core/Tooltip';


export default function UsersSearch({ index, dataForm, onSubmit, profiles }) {
  const { handleSubmit, ...objForm } = dataForm
  const onSearch = (data) => {
    onSubmit(data)
  }

  return (
     <form onSubmit={handleSubmit(onSearch)} noValidate>
      <CardTemplate
        titulo="Usuarios"
        icon="person"
        color="primary"
        iconcolor="primary"
        accion="Buscar"
        iconaccion="search"
        body={
          <Fragment>
            <UserIdentification
              index={index}
              customerType={index}
              objForm={objForm}
              required={false}
            />
            <Tooltip title="Ingrese uno o varios usuarios separados por coma(,)" placement="left-start" arrow>
            <InputController
              objForm={objForm}
              label="Código de Usuarios"
              name={`p_portal_usernames_${index}`}
              fullWidth
              required={false}
            />
            </Tooltip>

            <InputController
              objForm={objForm}
              label="Nombres"
              name={`p_name_${index}`}
              fullWidth
              required={false}
            />

            <InputController
              objForm={objForm}
              label="Apellidos"
              name={`p_last_name_${index}`}
              fullWidth
              required={false}
            />
             <SelectSimpleController  objForm={objForm} label="Perfil"  name={`p_profile_${index}`} array={profiles} rules={{ required: false}}/>
          </Fragment>
        }
      />
    </form>
  )
}
