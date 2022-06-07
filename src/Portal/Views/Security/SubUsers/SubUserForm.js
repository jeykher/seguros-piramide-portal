import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import GridContainer from "../../../../components/material-dashboard-pro-react/components/Grid/GridContainer"
import GridItem from "../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import Slide from "@material-ui/core/Slide"
import CardPanel from "../../../../components/Core/Card/CardPanel"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import EmailController from 'components/Core/Controller/EmailController'
import PasswordController from 'components/Core/Controller/PasswordController'
import PasswordConfirmController from 'components/Core/Controller/PasswordConfirmController'
import UserNameController from 'components/Core/Controller/UserNameController'
import InputController from "components/Core/Controller/InputController"
import PhoneController from "../../../../components/Core/Controller/PhoneController"
import EditIcon   from "@material-ui/icons/Edit"
import { useDialog } from "context/DialogContext"
import Axios from "axios"
import AutoCompleteWithData from "../../../../components/Core/Autocomplete/AutoCompleteWithData"
export default function SubUserForm(props) {
  const { handleSubmit,...objForm } = useForm();
  const [rols,setRols]=useState([])
  const [viewForm,setViewForm]=useState(true)
  const dialog = useDialog()

  async function addSubUser(dataform){
    const arrayroles =(dataform.p_roles === undefined ||dataform.p_roles.length === 0 )?[]: dataform.p_roles.map((fila) => {return {portal_role_id:fila.VALUE}})
    const params = {
      p_json_register: JSON.stringify(
        {
          first_name:dataform.p_name,
          last_name: dataform.p_last_name,
          email: dataform.p_email,
          portal_user: dataform.p_portal_username,
          pwd: dataform.p_password,
          phone_number:parseInt(dataform.p_phone),
          p_rols:arrayroles
        }
      ),

    }
    const { data } = await Axios.post("/dbo/security/sub_users_register", params)
    dialog({
      variant: "info",
      catchOnCancel: false,
      title: "Información",
      description: "Usuario creado exitosamente",
    })
    setViewForm(false)
    objForm.reset({});
    setViewForm(true)
  }

  async function getRoles(){
    const { data } = await Axios.post("/dbo/security/get_availables_roles")
    setRols(data.result)


  }

  async function onSubmit(dataform, e) {
    e.preventDefault();
    addSubUser(dataform)
  }

  useEffect(()=>{
    getRoles()
  },[])

  return (
    <GridContainer justify={'center'}>
      <GridItem xs={12} sm={12} md={6} lg={6}>
        <Slide in={true} direction='left' timeout={1000}>
          <div>
          <CardPanel titulo="Agregar usuario" icon="person" iconColor="primary">
            {viewForm &&  <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete={false}>
              <GridContainer justify="center" style={{padding: '0 2em'}}>
                <InputController
                  objForm={objForm}
                  label="Nombre"
                  name="p_name"
                  fullWidth
                />
                <InputController
                  objForm={objForm}
                  label="Apellido"
                  name="p_last_name"
                  fullWidth
                />
                <EmailController objForm={objForm} label="Correo Electrónico" name={'p_email'}/>
                <PhoneController objForm={objForm} label="Número de Teléfono" name={'p_phone'} />
                <UserNameController
                  objForm={objForm}
                  label="Usuario"
                  name="p_portal_username"
                />
                <PasswordController objForm={objForm} label="Clave"/>
                <PasswordConfirmController objForm={objForm} label="Confirmar clave" />
                <Controller
                  fullWidth
                  multiple
                  label="Permisos"
                  options={rols}
                  as={AutoCompleteWithData}
                  noOptionsText="Escriba para seleccionar el permiso"
                  name="p_roles"
                  control={objForm.control}
                  onChange={([e, value]) => {
                    return value ? value : null
                  }
                  }
                />
                <Button type="submit" color="primary" fullWidth><EditIcon /> Registrar</Button>
              </GridContainer>
            </form>}
          </CardPanel>
          </div>
        </Slide>
      </GridItem>
    </GridContainer>
  )
}