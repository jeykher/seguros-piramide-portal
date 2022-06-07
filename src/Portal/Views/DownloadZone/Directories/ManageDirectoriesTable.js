import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem"
import SelectSimpleController from "components/Core/Controller/SelectSimpleController"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import { useDialog } from "context/DialogContext"

import Switch from "@material-ui/core/Switch"
import { withStyles } from "@material-ui/core/styles"
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"

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

export default function ManageDirectoriesTable(props) {
  const { handleClickAdd } = props
  const [ allDirectories , setAllDirectories ] = useState([])
  const [ directoriesFiltered , setDirectoriesFiltered ] = useState([])
  const { handleSubmit,...objForm } = useForm();
  const [ directoryId, setDirectoryId ] = useState()
  const [ isLoading, setIsLoading ] = useState(false)
  const dialog = useDialog()
  
  const handleChangeDirectoryStatus = (event, rowData) => {
    changeDirectoryStatus(rowData).then(() => { getDirectories(directoryId) })  
  }

  function handleDirectory(value){
    setDirectoryId(value)
  }

  async function changeDirectoryStatus(rowData){
    
    let params = {
        p_document_directory_id: parseInt(rowData.DOCUMENT_DIRECTORY_ID),
        p_document_directory_status: (rowData.DOCUMENT_DIRECTORY_STATUS=='DISABLED'?'ENABLED':'DISABLED'), 
    } 

    await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/documents/modify_doc_directory_status`,params)
  }

  async function getDirectories(parentDirectoryId) { 
    let params = null;

    if(parentDirectoryId){
        params = {
            p_parent_directory_id: parseInt(parentDirectoryId),
        }    
    }
    setIsLoading(true); 
    const jsonDirectories = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/documents/get_all_document_directories`,params)

    if(jsonDirectories&&jsonDirectories.data&&jsonDirectories.data.result){        
        if(!params){
            setAllDirectories(jsonDirectories.data.result)
        }
        setDirectoriesFiltered(jsonDirectories.data.result)
    } 
    setIsLoading(false);

}

  useEffect(() => {
    getDirectories(directoryId)
  }, [directoryId])

  return (
    <>        
        <GridContainer>
          <GridItem xs={12} sm={12} md={4} lg={4}></GridItem>
          <GridItem xs={12} sm={12} md={4} lg={4}>                    
              <SelectSimpleController
                  objForm={objForm}
                  label="Filtrar por Directorio"
                  name="p_filter_directory"
                  array={allDirectories}
                  required={false}
                  onChange={value=>handleDirectory(value)}
              />                    
          </GridItem>
          <GridItem xs={12} sm={12} md={4} lg={4}>
            <GridContainer justify="flex-end">
              <Tooltip title="Agregar Directorio" placement="right-start" arrow>
              <IconButton onClick={(event) =>handleClickAdd(event)} color="primary">
                <Icon fontSize="large">add_to_photos</Icon>
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
            { title: "Directorio", width: "70%", field: "DOCUMENT_DIRECTORY_PATH" },
            {
                title: "Activo", width: "30%",sorting:false, field: "DOCUMENT_DIRECTORY_STATUS", cellStyle: { textAlign: "center" },
                headerStyle: { textAlign: 'center'}, render: (rowData) => {
                  return (
                      <CustomSwitch size="small" checked={rowData.DOCUMENT_DIRECTORY_STATUS === "ENABLED"}
                        name={rowData.DOCUMENT_DIRECTORY_STATUS}
                        onChange={event => handleChangeDirectoryStatus(event.target, rowData)}/>
                    )
                },
            }                  
        ]}
        data={directoriesFiltered}
        isLoading={isLoading}
        />
    </>
  )
}
