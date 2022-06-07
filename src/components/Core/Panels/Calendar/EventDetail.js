import React, {useEffect, useState} from 'react';
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import Axios from "axios"
import { makeStyles } from "@material-ui/core/styles"
import Card from "../../../material-kit-pro-react/components/Card/Card"
import CardBody from "../../../material-kit-pro-react/components/Card/CardBody"
import CardHeader from "../../../material-kit-pro-react/components/Card/CardHeader"
import { navigate } from "gatsby"
import DetailUsersAssignment from './DetailUsersAssignment';

const EventDetail = (props) => {
  const {event, dateStartQuery, dateEndQuery} = props;
  const [showModal, setShowModal] = useState(false)
  const [taskId, setTaskId] = useState(null)
  const useStyles = makeStyles( () => ({
    modalTitle:{
      backgroundColor: event.labelColor,
      margin: '0',
      color: 'white',
      textAlign: 'center',
      boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
      padding: '0.5em'
    }
  }))
  const classes = useStyles()

  const [eventList,setEventList] = useState([{EVENT_DETAIL: '', CONTACT_INFO: ''}]);

  async function getEventList() {
    const params = {
      p_date_start: dateStartQuery,
      p_date_end: dateEndQuery,
      p_calendar_id : event.calendarDetail,
      p_selected_date : event.date,
      p_status_workflow : event.status
    }
    const response = await Axios.post("/dbo/team_manager/get_schedule_detail", params);
    setEventList(response.data.p_cur_data)
  }

  useEffect(() => {
    getEventList()

    return () => setEventList([{EVENT_DETAIL: '', CONTACT_INFO: ''}])
  }, [event])


  /*const handleClick = (event,rowData) => {
    return rowData.POST_URL !== null && navigate(`/app${rowData.POST_URL}`);
  }*/
  function handleClick(event, rowData){
    navigate(`/app/workflow/service/${rowData.WORKFLOW_ID}`);
  }


  function handleClickUsers(event, rowData){
    setTaskId(rowData.TASK_ID)
    setShowModal(true)
  }

  function handleCloseModalUsers(){
    setShowModal(false)
  }
  return(
    <Card>
      <CardHeader>
       <h4 className={classes.modalTitle}>{`${event.title} - ${event.date}`}</h4> 
      </CardHeader>
      <CardBody>
        <TableMaterial
          options={{
            pageSize: 5,
            sorting: false
          }}
          columns={[
            { title: 'Póliza', field: 'POLIZA', width: '25%', cellStyle: { textAlign: "center" },headerStyle: { textAlign: "center" }},
            { title: 'Nro. Caso', field: 'CASO', width: '25%', cellStyle: { textAlign: "center" },headerStyle: { textAlign: "center" }},
            { title: 'Oficina', field: 'SUCURSAL', width: '25%', cellStyle: { textAlign: "center" },headerStyle: { textAlign: "center" }},
            { title: 'workflow', field: 'WORKFLOW_ID', width: '25%', hidden:true}
          ]}
          data={eventList}
         // onRowClick={(event, rowData) => handleClick(event, rowData)}
          actions={[() => ({
            icon: 'visibility',
            tooltip: 'Ver detalle',
            iconProps:{
              style:{
                fontSize: 24,
                color: 'Maroon',
                textAlign: 'center',
                margin: '0 0.5em'
              }
            },
            onClick: (event, rowData) => handleClick(event, rowData)
          }),
          () => ({
            icon: 'person',
            tooltip: 'Ver Usuarios',
            iconProps:{
              style:{
                fontSize: 24,
                color: 'Maroon',
                textAlign: 'center',
                margin: '0 0.5em'
              }
            },
            onClick: (event, rowData) => handleClickUsers(event, rowData)
          })]}
        />
      </CardBody>

      {showModal && <DetailUsersAssignment taskId={taskId} handleCloseModalUsers={handleCloseModalUsers}/>}
      
  </Card>
  )
}






export default EventDetail;