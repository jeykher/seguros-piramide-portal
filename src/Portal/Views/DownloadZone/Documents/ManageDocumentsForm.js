import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button";
import SelectSimpleController from "components/Core/Controller/SelectSimpleController"
import InputController from "components/Core/Controller/InputController"
import CardPanel from "components/Core/Card/CardPanel"
import IconButton from '@material-ui/core/IconButton';
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import BackupIcon from '@material-ui/icons/Backup';
import Slide from "@material-ui/core/Slide"
import { useDialog } from "context/DialogContext"
import SaveIcon from '@material-ui/icons/Save';
import Axios from "axios"


export default function ManageDocuments(props) {
  const [ enabledDirectories , setEnabledDirectories ] = useState([])
  const { handleSubmit,...objForm } = useForm();
  const [ viewForm, setViewForm ] = useState(true)
  const [ document, setDocument ] = useState()
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

  async function uploadDocument(e) {
    let docSize =  e.target.files[0].size/1024/1024
    try {
      if (e.target.files[0].type != "application/pdf" &&
          e.target.files[0].type != "application/vnd.ms-excel" && e.target.files[0].type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
          e.target.files[0].type != "application/msword" && e.target.files[0].type != "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
          e.target.files[0].type != "application/vnd.ms-powerpoint" && e.target.files[0].type != "application/vnd.openxmlformats-officedocument.presentationml.presentation"
          ){
        dialog({
            variant: "info",
            catchOnCancel: false,
            title: "Alerta",
            description: "El formato de documento no es permitido"
        })
        throw "El formato de documento no es permitido"
      }else if(docSize>15){
        
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Alerta",
          description: `El documento pesa más de 15MB (${docSize})`
      })
      throw `El documento pesa más de 15MB (${docSize})`
      console.log(`El documento pesa ${docSize}`)
      }
      setDocument(e.target.files[0])
    } catch (error) {
      console.error(error.statusText)
    }
  }

  async function onSubmit(dataform, e) {
    if(document){ 
      e.preventDefault();
      const name = document.name;
      const lastDot = name.lastIndexOf('.');
      const ext = name.substring(lastDot + 1);
      
      try {
        const params = 
        {
          document_name: dataform.p_document_name+"."+ext,
          document_description: dataform.p_document_description,
          document_directory_id: dataform.p_document_directory_id,
          document_content_type: document.type
        }

        const data = new FormData()
        data.append('file', document)
        data.append('parameters', JSON.stringify(params))
        
        const resp = await Axios.post("/uploadfile_docuware_blob/documents/add_document", data)

        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Información",
          description: "El documento fue cargado exitosamente",
        })

        setViewForm(false)
        objForm.reset({});
        setDocument(null)
        setViewForm(true)

      } catch (error) {
        console.error(error.statusText)
      }    
    }else{
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Información",
        description: "Debe ingresar el documento",
      })
    }
  }

  useEffect(() => {
    getEnabledDirectories()
  }, [])

  return (
    <GridContainer justify={'center'}>
      <GridItem xs={12} sm={12} md={6} lg={6}>
        <Slide in={true} direction='left' timeout={1000}>
          <div>
          <CardPanel titulo="Agregar Documento" icon="note_add" iconColor="primary">
            {viewForm &&  <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete={false}>
              <GridContainer justify="space-around" alignItems="center" style={{padding: '0 2em'}}>
                <GridItem xs={12}>
                  <SelectSimpleController
                    objForm={objForm}
                    label="Directorio Padre"
                    name="p_document_directory_id"
                    array={enabledDirectories}
                  />
                  <InputController
                    objForm={objForm}
                    label="Nombre"
                    name="p_document_name"
                    fullWidth
                  />
                  <InputController
                    objForm={objForm}
                    label="Descripción"
                    name="p_document_description"
                    fullWidth
                  />
                </GridItem>
                
                <GridItem xs={4}>
                  <GridContainer justify="center">
                    <Tooltip title="Agregar Documento" placement="right-start">
                      <p>
                        <br></br> 
                        <input 
                          className="input-file" id={'icon-button-file'}  
                          accept="application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation"
                          onChange={(e) => uploadDocument(e)} type="file" />
                        <label htmlFor={'icon-button-file'}>
                            <IconButton color="primary" aria-label="upload picture" component="span">
                                <BackupIcon fontSize="large"/>
                            </IconButton>
                        </label>
                      </p>
                    </Tooltip>
                  </GridContainer>
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