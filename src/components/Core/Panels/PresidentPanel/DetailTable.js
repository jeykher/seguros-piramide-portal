import React,{useEffect, useState} from "react"
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import CardPanel from "components/Core/Card/CardPanel"
import { makeStyles } from "@material-ui/core/styles";
import {handleFilteredColumns,pauseUsersColumnsTable} from '../utils'
import {COLUMNS_TABLE} from '../constants'
import { MTableToolbar } from 'material-table';
import Icon from "@material-ui/core/Icon"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Axios from 'axios'
import { navigate } from 'gatsby'
import trafficStyle from '../trafficStyle'
const useStyles = makeStyles(trafficStyle)


const DetailTable = (props) => {
  const {color,title,dataTable,icon,label,handleDownload, isLoading,process} = props
  const [filteredColumns,setFilteredColumns] = useState(COLUMNS_TABLE)
  const classes = useStyles()


  const handleTypeColumn = (label) => {
    if(label === 'Operadores en pausa'){
      return pauseUsersColumnsTable
    }else{
      return filteredColumns
    }
  }

  const handleClick = async (event,rowData) => {
    event.preventDefault();
    const params = {
      p_task_id: rowData.TASK_ID
    }
    const { data } = await Axios.post('/dbo/workflow/get_workflow_id_by_task',params);
    navigate(`/app/workflow/service/${data.result}`);
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
        draggable: false,
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
  </CardPanel>
  )
}

export default DetailTable
