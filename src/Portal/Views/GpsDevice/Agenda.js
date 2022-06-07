import React, { useState, useEffect } from "react"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
import {Calendar, momentLocalizer } from 'react-big-calendar';
import Axios from 'axios';
import moment from 'moment';
import 'moment/locale/es';
import { navigate } from "gatsby";
import { getISODate } from 'utils/utils'
import Toolbar from 'components/Core/Agenda/Toolbar';




const localizer = momentLocalizer(moment);



const formatters = {
  timeGutterFormat: 'hh:mm A',
  agendaTimeFormat: 'hh:mm A',
  eventTimeFormat: 'hh:mm A',
  eventTimeRangeFormat: ({start,end},culture,localizer) => localizer.format(start, 'hh:mm A') + '--' + localizer.format(end,'hh:mm A')
}

const setEventStyle = (event,start,end, iSelected) => {
  const style = {
    backgroundColor: event.labelColor
  };
  return {
    style: style
  }
}

export default function Agenda() {
  const [events, setEvents] = useState([]);
  
  async function getAppointments(){
    const response = await Axios.post('/dbo/auto_claims/get_appointment_schedule');

    const result = response.data.p_cur_data.map(element => {
      const startDate =  getISODate(element.FECINI);
      const endDate = getISODate(element.FECFIN);
      return {
        id: element.ID,
        work_id: element.WORKFLOW_ID,
        title: element.TITULO,
        start: startDate,
        end: endDate,
        labelColor: element.COLOR_LABEL
      }
    });
    setEvents(result);
  }

  useEffect(() => {
        getAppointments();
  }, [])


    return (
        <GridContainer>
            <GridItem item xs={12} sm={12} md={12} lg={12}>
                <CardPanel
                    titulo="Agenda"
                    icon="event"
                    iconColor="primary"
                >
                <Calendar
                  popup
                  localizer={localizer}
                  culture={'es'}
                  events={events}
                  defaultView="month"
                  defaultDate={new Date()}
                  style={{ height: '100vh'}}
                  formats={formatters}
                  eventPropGetter={setEventStyle}
                  onSelectEvent={ event => navigate(`/app/workflow/service/${event.work_id}`)}
                  messages={{
                    next: "Sig.",
                    previous: "Ant.",
                    today: "Hoy",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                    date: "Fecha",
                    time: "Hora",
                    event: "Evento",
                    showMore: total => `mostrar ${total} más`
                  }}
                  components={{
                    toolbar: Toolbar
                  }}
                />
                </CardPanel>
            </GridItem>
        </GridContainer>
    )
}
