import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem"
import SelectSimpleController from "components/Core/Controller/SelectSimpleController"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import { useDialog } from "context/DialogContext"

import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import { withStyles } from "@material-ui/core/styles"
import Switch from "@material-ui/core/Switch"

import Axios from "axios"

const CustomSwitch =  withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '& + $track': {
      backgroundColor: '#ef1635',
      opacity: 1,
      border: 'none',
    },

    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});


export default function ManageDocuments(props) {
  const { handleClickAdd } = props
  const [ directories , setDirectories ] = useState([])
  const { handleSubmit,...objForm } = useForm();
  const [ documents, setDocuments ] = useState()
  const [ directoryId, setDirectoryId ] = useState();
  const [ isLoading, setIsLoading ] = useState(false);
  const [openModalDocumentViewer, setOpenModalDocumentViewer] = useState(false);
  const urlApiGetDocument ='/dbo/documents/get_document_file/get_blob/result/document_file'
  const dialog = useDialog()


  async function getDirectories() {
        
    const jsonDirectories = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/documents/get_all_document_directories`)
    
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
      setIsLoading(true);
      const jsonDocuments = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/documents/get_all_documents_by_dir_id`,params)

      if(jsonDocuments&&jsonDocuments.data&&jsonDocuments.data.result){        
        setDocuments(jsonDocuments.data.result)
      }
      setIsLoading(false);
    } catch {
      console.log("Error get documents")
    }  
  }

  async function changeDocumentStatus(rowData){
    
    let params = {
      p_document_id: parseInt(rowData.DOCUMENT_ID),
      p_document_status: (rowData.DOCUMENT_STATUS=='DISABLED'?'ENABLED':'DISABLED'), 
    } 

    await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/documents/modify_document_status`,params)
    
  }

  const handleCloseModalDocumentViewer = () => {
    setOpenModalDocumentViewer(false);
  };

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

  function handleChangeDocumentStatus(e, rowData){
    changeDocumentStatus(rowData).then(() => { getDocuments(directoryId) })  
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
          <GridItem xs={12} sm={12} md={4} lg={4}></GridItem>
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
          <GridItem xs={12} sm={12} md={4} lg={4}>
              <GridContainer justify="flex-end">
                <Tooltip title="Agregar Documento" placement="right-start" arrow>
                    <IconButton onClick={(event) =>handleClickAdd(event)} color="primary">
                      <Icon fontSize="large">note_add</Icon>
                    </IconButton>
                  </Tooltip>
              </GridContainer>
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
            { title: "Documento", width: "15%", field: "DOCUMENT_NAME" },
            { title: "Descripción", width: "55%", field: "DOCUMENT_DESCRIPTION" },
            { title: "Descargar", width: "15%" ,render: (rowData) => {
              return (                  
                <Tooltip title="Descargar Documento" placement="right-start">
                    <IconButton onClick={(event) =>handleClickDownload(event, rowData)} color="primary">
                        <Icon fontSize="large">cloud_download</Icon>
                    </IconButton>
                </Tooltip>                  
              )
            },
          },
          {
            title: "Activo", width: "15%",sorting:false, field: "DOCUMENT_DIRECTORY_STATUS", cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: 'center'}, render: (rowData) => {
              return (
                  <CustomSwitch size="small" checked={rowData.DOCUMENT_STATUS === "ENABLED"}
                    name={rowData.DOCUMENT_STATUS}
                    onChange={event => handleChangeDocumentStatus(event.target, rowData)}/>
                )
            },
          }                   
        ]}
        data={documents}
        isLoading={isLoading}
        />
    </>
  )
}
