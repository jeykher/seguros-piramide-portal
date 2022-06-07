import React, {useEffect, useState} from 'react';
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import Axios from "axios"
import { makeStyles } from "@material-ui/core/styles"
import Card from "../../../../components/material-kit-pro-react/components/Card/Card"
import CardBody from "../../../../components/material-kit-pro-react/components/Card/CardBody"
import CardHeader from "../../../../components/material-kit-pro-react/components/Card/CardHeader"
import { navigate } from "gatsby"



const EventDetail = (props) => {
  const {event} = props;
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
      p_event_title: event.name,
      p_event_date: event.date
    }
    const response = await Axios.post("/dbo/insurance_broker/get_event_details", params);
    setEventList(response.data.p_cur_data)
  }

  useEffect(() => {
    getEventList()

    return () => setEventList([{EVENT_DETAIL: '', CONTACT_INFO: ''}])
  }, [event])


  const handleClick = (event,rowData) => {
    return rowData.POST_URL !== null && navigate(`/app${rowData.POST_URL}`);
  }

  return(
    <Card>
      <CardHeader>
      <h4 className={classes.modalTitle}>{event.modalTitle}</h4>
      </CardHeader>
      <CardBody>
        <TableMaterial
          options={{
            pageSize: 5,
            sorting: false
          }}
          columns={[
            { title: 'Detalle', field: 'EVENT_DETAIL', width: '50%'},
            { title: 'Contacto', field: 'CONTACT_INFO', width: '50%'}
          ]}
          data={eventList}
          onRowClick={(event, rowData) => handleClick(event, rowData)}
        />
      </CardBody>
  </Card>
  )
}






export default EventDetail;