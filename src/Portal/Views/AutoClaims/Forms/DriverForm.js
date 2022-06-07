import React from "react"
import InputController from "../../../../components/Core/Controller/InputController"
import SelectSimpleController from "../../../../components/Core/Controller/SelectSimpleController"
import PhoneController from "../../../../components/Core/Controller/PhoneController"
import EmailController from "../../../../components/Core/Controller/EmailController"
import {listSex } from "../../../../utils/utils"
import DateMaterialPickerController from "../../../../components/Core/Controller/DateMaterialPickerController"


export default function DriverForm(props) {
  const {objForm,index} = props;

  return (<>
          <InputController objForm={objForm}  label="Nombre" name={`p_nombre_${index}`}/>
          <InputController objForm={objForm} label="Apellido" name={`p_apellido_${index}`}/>
          <DateMaterialPickerController objForm={objForm} label="Fecha de Nacimiento" name={`p_fecnac_${index}`}/>
          <SelectSimpleController objForm={objForm} label="Sexo" name={`p_sexo_${index}`} array={listSex} />
          <EmailController objForm={objForm} label="Correo Electrónico" name={`p_email_${index}`}/>
          <PhoneController objForm={objForm} label="Teléfono" name={`p_telefono_${index}`}/>
    </>
  )
}
