import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem"
import SelectSimpleController from "components/Core/Controller/SelectSimpleController"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import Axios from "axios"

export default function DownloadDocumentsTable(props) {
  const [ directories , setDirectories ] = useState([])
  const { handleSubmit,...objForm } = useForm();
  const [ documents, setDocuments ] = useState()
  const [ directoryId, setDirectoryId ] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const urlApiGetDocument ='/dbo/documents/get_document_file/get_blob/result/document_file'

  async function getDirectories() {
        
    const jsonDirectories = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/documents/get_enabled_docs_directories`)
    
    if(jsonDirectories&&jsonDirectories.data&&jsonDirectories.data.result&&jsonDirectories.data.result.length>0){        
      setDirectories(jsonDirectories.data.result)
    }  
  }

  async function getDocuments(directory_id) {
        
    try {
      let params = null;
      if(directory_id){
        params = {
            p_document_directory_id: parseInt(directory_id),
        }
      }

      const jsonDocuments = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/documents/get_enabled_docs_by_dir_id`,params)

      if(jsonDocuments&&jsonDocuments.data&&jsonDocuments.data.result){        
        setDocuments(jsonDocuments.data.result)
        setIsLoading(false);
      }
    } catch {
      console.log("Error get documents")
    }  
  }

  async function downloadDocument(rowData){

    let paramsDownload = {
      p_document_id: parseInt(rowData.DOCUMENT_ID),
      p_portal_user_id: null,
      responseContentType: rowData.DOCUMENT_CONTENT_TYPE 
    } 

    const response = await Axios.post(urlApiGetDocument, paramsDownload, {
      responseType: 'arraybuffer',
      responseEncoding: 'binary'
    });

    let buffer = response.data
    const file = new Blob([buffer], { type: paramsDownload.responseContentType });
    
    const fileURL = URL.createObjectURL(file);

    let tempLink = document.createElement('a');    
    tempLink.href = fileURL;
    tempLink.setAttribute('download', rowData.DOCUMENT_NAME);
    tempLink.click();
    tempLink.remove();    

    URL.revokeObjectURL(fileURL);
  }

  function handleClickDownload(e, rowData){
    e.preventDefault();
    downloadDocument(rowData)
  }

  function handleDirectory(value){
    setDirectoryId(value)
  }

  useEffect(()=>{
    getDirectories()
  },[])

  useEffect(() => {
    getDocuments(directoryId)
  }, [directoryId])

  return (
    <>        
        <GridContainer justify={'center'}>
            <GridItem xs={12} sm={12} md={4} lg={4}>                    
                <SelectSimpleController
                    objForm={objForm}
                    label="Filtrar por Directorio"
                    name="p_filter_directory"
                    array={directories}
                    required={false}
                    onChange={value=>handleDirectory(value)}
                />                    
            </GridItem> 
        </GridContainer>
        <br></br>     
        <TableMaterial
        options={{
            search: true,
            toolbar: true,
            sorting: true,
            pageSize: 10,
        }}
        columns={[
            { title: "Documento", width: "20%", field: "DOCUMENT_NAME" },
            { title: "Descripción", width: "60%", field: "DOCUMENT_DESCRIPTION" },
            { title: "Descargar", width: "20%" ,render: (rowData) => {
              return (                  
                <Tooltip title="Descargar Documento" placement="right-start">
                    <IconButton onClick={(event) =>handleClickDownload(event, rowData)} color="primary">
                        <Icon fontSize="large">cloud_download</Icon>
                    </IconButton>
                </Tooltip>                 
              )
            },
          }                
        ]}
        data={documents}
        isLoading = {isLoading}
        />
    </>
  )
}
