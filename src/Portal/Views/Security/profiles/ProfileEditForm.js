import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import GridContainer from "../../../../components/material-dashboard-pro-react/components/Grid/GridContainer"
import GridItem from "../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import Slide from "@material-ui/core/Slide"
import CardPanel from "../../../../components/Core/Card/CardPanel"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import InputController from "components/Core/Controller/InputController"
import EditIcon   from "@material-ui/icons/Edit"
import { useDialog } from "context/DialogContext"
import Axios from "axios"
import SelectSimpleController from "../../../../components/Core/Controller/SelectSimpleController"



export default function ProfileEditForm(props) {
  const {handleSubmit, ...objForm } = useForm();
  const [profileTypes,setProfileTypes]=useState(null)
  const [schemas,setSchemas]=useState(null)
  const [tables,setTables]=useState(null)
  const [columns,setColumns]=useState(null)
  const [schema,setSchema]=useState(null)
  const [table,setTable]=useState(null)
  const {profile}=props
  const [viewForm, setViewForm] = useState(true)
  const dialog = useDialog()

  async function addSubUser(dataform) {
    const arrayroles = (dataform.p_roles === undefined || dataform.p_roles.length === 0) ? [] : dataform.p_roles.map((fila) => {
      return { portal_role_id: fila.VALUE }
    })
    const params = {
      p_json_register: JSON.stringify(
        {
          first_name: dataform.p_name,
          last_name: dataform.p_last_name,
          email: dataform.p_email,
          portal_user: dataform.p_portal_username,
          pwd: dataform.p_password,
          phone_number: parseInt(dataform.p_phone),
          p_rols: arrayroles
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

  async function onSubmit(dataform, e) {
    e.preventDefault();
    console.log(dataform)
    //addSubUser(dataform)
  }


  async function getSchemas(pColumnName) {
    const params = {
      p_table_owner:'PORTAL' ,
      p_table_name:'PROFILES',
      p_column_name:pColumnName
    }
    const { data } = await Axios.post("/dbo/toolkit/range_for_column", params)
    const arrayTypes = data.result.map((fila) => {
      return {
        value: fila.CODE,
        label: fila.DESCRIPTION,

      }

    })
    setSchemas(arrayTypes)
  }
  async function getProfilesType(pColumnName) {
    const params = {
      p_table_owner:'PORTAL' ,
      p_table_name:'PROFILES',
      p_column_name:pColumnName
    }
    const { data } = await Axios.post("/dbo/toolkit/range_for_column", params)
    const arrayTypes = data.result.map((fila) => {
      return {
        value: fila.CODE,
        label: fila.DESCRIPTION,

      }

    })
    setProfileTypes(arrayTypes)
  }
  async function getTables(pSchema) {
    const params = {
      p_schema_name:pSchema
    }
    const { data } = await Axios.post("/dbo/security/get_table_name", params)
    const arrayTypes = data.result.map((fila) => {
      return {
        value: fila.CODE,
        label: fila.DESCRIPTION,

      }

    })
    setTables(arrayTypes)
  }
  async function getColumn(pSchema,pTable) {
    const params = {
      p_schema_name:pSchema,
      p_table_name:pTable
    }
    const { data } = await Axios.post("/dbo/security/get_column_name", params)
    const arrayTypes = data.result.map((fila) => {
      return {
        value: fila.CODE,
        label: fila.DESCRIPTION,

      }

    })
    setColumns(arrayTypes)
  }

  function handleSchema(val){
    setSchema(val)
    getTables(val);
  }
  function handleTable(val){
    setTable(val)
    getColumn(schema,val);
  }

  useEffect(()=>{
    getProfilesType('PROFILE_TYPE');
    getSchemas('SCHEMA_NAME');
    setSchema(profile.SCHEMA_NAME)
    setTable(profile.TABLE_NAME)
    getTables(profile.SCHEMA_NAME);
    getColumn(profile.SCHEMA_NAME,profile.TABLE_NAME)
  },[])



  return (
    <GridContainer justify={'center'}>
      <GridItem xs={12} sm={12} md={6} lg={6}>
        <Slide in={true} direction='left' timeout={1000}>
          <div>
            <CardPanel titulo="Modificar perfil" icon="assignment_ind" iconColor="primary">
              {viewForm &&
              <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete={false}>
                <GridContainer justify="center" style={{ padding: '0 2em' }}>
                  <InputController
                    objForm={objForm}
                    label="Nombre"
                    name="p_profile_name"
                    defaultValue={profile.PROFILE_NAME}
                    fullWidth
                  />
                  <InputController
                    objForm={objForm}
                    label="Descripción"
                    name="p_description"
                    defaultValue={profile.DESCRIPTION}
                    fullWidth
                  />
                 <SelectSimpleController  defaultValue={profile.PROFILE_TYPE} objForm={objForm} required={true} label="Tipo perfil"
                                          name={`p_profile_type`} array={profileTypes}/>

                  <SelectSimpleController onChange={(e)=>handleSchema(e)}  defaultValue={profile.SCHEMA_NAME} objForm={objForm} required={true} label="Esquema"
                                           name={`p_schema`} array={schemas}/>


                  <SelectSimpleController onChange={(e)=>handleTable(e)}  defaultValue={profile.TABLE_NAME} objForm={objForm} required={true} label="Tabla"
                                           name={`p_table`} array={tables}/>

                  <SelectSimpleController  defaultValue={profile.IDENTITY_COLUMN} objForm={objForm} required={true} label="Columna"
                                           name={`p_colum`} array={columns}/>






                  {/*<h6><strong>AUTO_REGISTER:</strong> {profile.AUTO_REGISTER}</h6><br/>
                  <h6><strong>BUSINESS_AREA_ID:</strong> {profile.BUSINESS_AREA_ID}</h6><br/>
                  <h6><strong>DEPARTMENT_ID:</strong> {profile.DEPARTMENT_ID}</h6><br/>
                  <h6><strong>DESCRIPTION:</strong> {profile.DESCRIPTION}</h6><br/>
                  <h6><strong>HOME:</strong> {profile.HOME}</h6><br/>
                  <h6><strong>IDENTITY_COLUMN:</strong> {profile.IDENTITY_COLUMN}</h6><br/>
                  <h6><strong>PROFILE_CODE:</strong> {profile.PROFILE_CODE}</h6><br/>
                  <h6><strong>PROFILE_ID:</strong> {profile.PROFILE_ID}</h6><br/>
                  <h6><strong>PROFILE_NAME:</strong> {profile.PROFILE_NAME}</h6><br/>
                  <h6><strong>PROFILE_TYPE:</strong> {profile.PROFILE_TYPE}</h6><br/>
                  <h6><strong>REF_CURSOR_PACKAGE:</strong> {profile.REF_CURSOR_PACKAGE}</h6><br/>
                  <h6><strong>REF_CURSOR_PACKAGE_HIST:</strong> {profile.REF_CURSOR_PACKAGE_HIST}</h6><br/>
                  <h6><strong>REF_CURSOR_PROCEDURE:</strong> {profile.REF_CURSOR_PROCEDURE}</h6><br/>
                  <h6><strong>REF_CURSOR_PROCEDURE_HIST:</strong> {profile.REF_CURSOR_PROCEDURE_HIST}</h6><br/>
                  <h6><strong>REF_CURSOR_SCHEMA:</strong> {profile.REF_CURSOR_SCHEMA}</h6><br/>
                  <h6><strong>REF_CURSOR_SCHEMA_HIST:</strong> {profile.REF_CURSOR_SCHEMA_HIST}</h6><br/>
                  <h6><strong>SCHEMA_NAME:</strong> {profile.SCHEMA_NAME}</h6><br/>
                  <h6><strong>STATUS:</strong> {profile.STATUS}</h6><br/>
                  <h6><strong>SUB_DEPARTMENT_ID:</strong> {profile.SUB_DEPARTMENT_ID}</h6><br/>
                  <h6><strong>TABLE_NAME:</strong> {profile.TABLE_NAME}</h6><br/>
                  <h6><strong>VALID_PACKAGE:</strong> {profile.VALID_PACKAGE}</h6><br/>
                  <h6><strong>VALID_PROCEDURE:</strong> {profile.VALID_PROCEDURE}</h6><br/>
                  <h6><strong>VALID_SCHEMA:</strong> {profile.VALID_SCHEMA}</h6><br/>
                  <h6><strong>WEB_IDENTITY_PARAM_NAME:</strong> {profile.WEB_IDENTITY_PARAM_NAME}</h6><br/>
*/}

                  <Button type="submit" color="primary" fullWidth><EditIcon/>Modificar</Button>
                </GridContainer>
              </form>}
            </CardPanel>
          </div>
        </Slide>
      </GridItem>
    </GridContainer>
  )
}
