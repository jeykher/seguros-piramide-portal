import React from 'react'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import PasswordController from 'components/Core/Controller/PasswordController'
import PasswordConfirmController from 'components/Core/Controller/PasswordConfirmController'
import UserNameController from 'components/Core/Controller/UserNameController'
import Axios from 'axios'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon"
import { format } from 'date-fns'



const listStatus = [
  {value: 'ACT', label: 'Activo'}
]

export default function ConfigAlliesController(props){
  const { 
    objForm, 
    index, 
    isUpdate,
    handleOpenModal,
    handleOpenModalProducts
  } = props; 


  const handleValidateCode = async () => {
    const dataform = objForm.getValues();
    const params = {
      p_cod_username: dataform[`p_portal_username_${index}`]
    }
    await Axios.post('/dbo/insurance_broker/validate_user_ally',params);
  }

  return(
    <GridContainer>
        <GridItem xs={12}>
          <UserNameController
            objForm={objForm}
            label="Usuario"
            name={`p_portal_username_${index}`}
            disabled={isUpdate ? true : undefined}
            onBlur={handleValidateCode}
          />
        </GridItem>
      {
        !isUpdate &&
        <>
        <GridItem xs={12} md={6}>
          <PasswordController objForm={objForm} label="Clave"/>
        </GridItem>
        <GridItem xs={12} md={6}>
          <PasswordConfirmController objForm={objForm} label="Confirmar clave" />
        </GridItem>
        </>
      }
      <GridItem xs={12} md={6}>
        <SelectSimpleController
        objForm={objForm}
        label="Estatus"
        name={`p_status_${index}`}
        array={listStatus}
        defaultValue='ACT'
        disabled
      />

      <DateMaterialPickerController
        objForm={objForm}
        label="F. de configuración"
        name={`p_config_date_${index}`}
        disabled
        readonly={false}
        required={false}
        defaultValue={format(new Date(), 'dd/MM/yyyy')}
      />
      </GridItem>
      <GridItem xs={12} md={6}>
        <Button color="primary" onClick={handleOpenModal}> <Icon>info</Icon>Asignar Áreas</Button>
        {
          isUpdate &&
          <Button style={{marginLeft: '1.5em', padding: '12px 15px'}} color="primary" onClick={handleOpenModalProducts}> <Icon>info</Icon>Asignar Productos a Áreas existentes</Button>
        }
      </GridItem>
    </GridContainer>
  );
}