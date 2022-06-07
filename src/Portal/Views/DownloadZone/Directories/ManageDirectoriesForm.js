import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button";
import SelectSimpleController from "components/Core/Controller/SelectSimpleController"
import InputController from "components/Core/Controller/InputController"
import CardPanel from "components/Core/Card/CardPanel"
import Slide from "@material-ui/core/Slide"
import { useDialog } from "context/DialogContext"
import SaveIcon from '@material-ui/icons/Save';
import Axios from "axios"


export default function ManageDirectoriesForm(props) {
  const [ enabledDirectories , setEnabledDirectories ] = useState([])
  const { handleSubmit,...objForm } = useForm();
  const [ viewForm, setViewForm ] = useState(true)
  const dialog = useDialog()

  async function getEnabledDirectories() { 
    let params = 
    {
      p_portal_user_id: null
    }  

    const jsonDirectories = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/documents/get_enabled_docs_directories`,params)
    if(jsonDirectories&&jsonDirectories.data&&jsonDirectories.data.result){        
      setEnabledDirectories(jsonDirectories.data.result)
    }  
  }

  useEffect(() => {
    getEnabledDirectories()
  }, [])

  async function onSubmit(dataform, e) {    
    e.preventDefault();
    
    try {
      const params = 
      {
        p_document_directory_name: dataform.p_doc_directory_name,
        p_doc_directory_description: dataform.p_doc_directory_description,
        p_parent_directory_id: dataform.p_parent_directory_id
      }      

      await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/documents/add_document_directory`,params)

      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Información",
        description: "El directorio fue agregado exitosamente",
      })

      setViewForm(false)
      objForm.reset({});
      setViewForm(true)

    } catch (error) {
      console.error(error.statusText)
    }
  }

  return (
    <GridContainer justify={'center'}>
      <GridItem xs={12} sm={12} md={6} lg={6}>
        <Slide in={true} direction='left' timeout={1000}>
          <div>
          <CardPanel titulo="Agregar Directorio" icon="create_new_folder" iconColor="primary">
            {viewForm &&  <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete={false}>
              <GridContainer justify="center" style={{padding: '0 2em'}}>
                <GridItem xs={12}>
                  <SelectSimpleController
                    objForm={objForm}
                    label="Directorio Padre"
                    name="p_parent_directory_id"
                    array={enabledDirectories}
                    required={false}
                  />
                  <InputController
                    objForm={objForm}
                    label="Nombre"
                    name="p_doc_directory_name"
                    fullWidth
                  />
                  <InputController
                    objForm={objForm}
                    label="Descripción"
                    name="p_doc_directory_description"
                    fullWidth
                  />
                </GridItem>                
                <GridItem xs={12} sm={12} md={12} lg={12}> 
                  <br></br>                 
                  <Button type="submit" color="primary" fullWidth><SaveIcon/> Guardar</Button>
                </GridItem>
              </GridContainer>
            </form>}
          </CardPanel>
          </div>
        </Slide>
      </GridItem>
    </GridContainer>
  )
}