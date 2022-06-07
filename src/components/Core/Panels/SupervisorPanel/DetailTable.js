import React, {useState,useEffect} from "react"
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import CardPanel from "components/Core/Card/CardPanel"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import { makeStyles } from "@material-ui/core/styles";
import AssignationDialog from './AssignationDialog'
import {handleFilteredColumns,pauseUsersColumnsTable} from '../utils'
import {COLUMNS_TABLE} from '../constants'
import { MTableToolbar } from 'material-table';
import Icon from "@material-ui/core/Icon"
import Axios from 'axios'
import { navigate } from 'gatsby'
import trafficStyle from '../trafficStyle'
const useStyles = makeStyles(trafficStyle);

const DetailTable = (props) => {
  const {color,title,dataTable,icon,label,setUpdateDataPanel,handleDownload, process, isLoading} = props
  const classes = useStyles()
  const [openAssignationDialog, setOpenAssignationDialog] = useState(false);
  const [taskIdSelected, setTaskIdSelected] = useState(false);
  const [assignmentIdSelected, setAssignmentIdSelected] = useState(false);
  const [filteredColumns,setFilteredColumns] = useState(COLUMNS_TABLE)

  const handleAssign = (rowData) => {
    setOpenAssignationDialog(true)
    setTaskIdSelected(rowData.TASK_ID)
    setAssignmentIdSelected(rowData.ASSIGNMENT_ID)
  }


  const handleTypeColumn = (label) => {
    if(label === 'Operadores en pausa'){
      return pauseUsersColumnsTable
    }else{
      return filteredColumns
    }
  }

  const handleClick = async (event,rowData) => {
    event.preventDefault();
    if(title.includes('Operadores') === false){
      const params = {
        p_task_id: rowData.TASK_ID
      }
      const { data } = await Axios.post('/dbo/workflow/get_workflow_id_by_task',params);
      navigate(`/app/workflow/service/${data.result}`);
    }
  }

//El boton se escondera si se encuentra en unos de estos estatus.
  const validButton = () => {
    let validVal = title.includes('Anulados') 
    if(validVal){
      return true
    }
    validVal = title.includes('Rechazados')
    if(validVal){
      return true
    }
    validVal = title.includes('Liquidados')
    if(validVal){
      return true
    }
    validVal = title.includes('Operadores')
    if(validVal){
      return true
    }
    return false
  }

  useEffect(() => {
    if(dataTable.length > 0){
      const result = handleFilteredColumns(dataTable,process)
      setFilteredColumns(result)
    }
  },[dataTable, process])


  return (
  <CardPanel titulo={title} icon={icon ? icon : 'delete'} backgroundIconColor={color}>
    <TableMaterial
      options={{
        search: true,
        toolbar: true,
        sorting: false,
        pageSize: 5,
        cellStyle: {textAlign: 'center', fontSize: '12px'},
        actionsColumnIndex: -1,
        draggable: false,
        actionsCellStyle: {padding: '0 18px 0px 0px'},
        headerStyle: {
          backgroundColor: color,
          color: 'white',
          textAlign: 'center'
      },
      }}
      isLoading={isLoading}
      columns={handleTypeColumn(label)}
      data={dataTable}
      onRowClick={(event, rowData) => handleClick(event, rowData)}
      actions={[
        rowData => ({
          icon: () =>
          <Button color="warning" size="sm" round>
          {rowData.ASSIGNMENT_ID?'Reasignar':'Asignar' }
          </Button>,
          tooltip: rowData.ASSIGNMENT_ID?'Reasignar':'Asignar',
          onClick: (_,rowData) => handleAssign(rowData),   
          hidden: validButton(rowData)          
      })
    ]}
      components={{
        Toolbar: props => (
            <div className={classes.containerToolbar}>
              <Button onClick={() => handleDownload()} className={classes.buttons} color="success"><Icon>download</Icon> Excel</Button>
              <div className={classes.containerLight}>
                <div className={classes.circleRed}/>
                <div className={classes.circleOrange}/>
                <div className={classes.circleGreen}/>
              </div>
              <MTableToolbar {...props} />
            </div>
        )
     }}
    />
    <AssignationDialog
        openDialog={openAssignationDialog} 
        taskIdSelected={taskIdSelected}
        assignmentIdSelected={assignmentIdSelected}
        setOpenAssignationDialog={setOpenAssignationDialog}
        setUpdateDataPanel={setUpdateDataPanel}
    />
  </CardPanel>
  )
}

export default DetailTable
