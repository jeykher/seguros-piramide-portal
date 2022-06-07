import React, { useState, useEffect, useCallback } from "react"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import CardPanel from "components/Core/Card/CardPanel"
import { Calendar, momentLocalizer } from "react-big-calendar"
import Axios from "axios"
import moment from "moment"
import "moment/locale/es"
import { getISODate } from "utils/utils"
import Toolbar from "components/Core/Agenda/Toolbar"

import { makeStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
//Event
import EventDetail from './EventDetail';

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    width: "40%",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 3, 2, 3),
  },
}))

const localizer = momentLocalizer(moment)
const formatters = {
  timeGutterFormat: "hh:mm A",
  agendaTimeFormat: "hh:mm A",
  eventTimeFormat: "hh:mm A",
  eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
    localizer.format(start, "hh:mm A") +
    "--" +
    localizer.format(end, "hh:mm A"),
}

const setEventStyle = event => {
  const style = {
    backgroundColor: event.labelColor,
  }
  return {
    style: style,
  }
}

export default function Agenda() {
  const [events, setEvents] = useState([])
  const classes = useStyles()
  const [showModal, setShowModal] = useState(false)
  const [eventDetail,setEventDetail] = useState('')

  const handleShowModal = () => {
    setShowModal(!showModal)
  }

  const handleEventDetail = (event) =>{
    setEventDetail(event);
    handleShowModal();
  }


  async function getAppointments() {
    const response = await Axios.post(
      "/dbo/insurance_broker/get_schedule"
    )
    const result = response.data.p_cur_data.map(element => {
      const startDate = getISODate(element.BEGIN_DATE)
      const endDate = getISODate(element.END_DATE)
      return {
        id: element.ID,
        work_id: element.WORKFLOW_ID,
        title: element.EVENT_NAME,
        start: startDate,
        end: endDate,
        labelColor: element.COLOR_LABEL,
        date: element.BEGIN_DATE,
        name: element.EVENT_TITLE,
        modalTitle: element.EVENT_MODAL_TITLE
      }
    })
    setEvents(result)
  }

  useEffect(() => {
    getAppointments()
  }, [])

  return (
    <GridContainer>
      <Modal
        className={classes.modal}
        open={showModal}
        onClose={handleShowModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showModal}>
          <div className={classes.paper}>
            <EventDetail event={eventDetail}/>
          </div>
        </Fade>
      </Modal>
      <GridItem item xs={12} sm={12} md={12} lg={12}>
        <CardPanel titulo="Agenda" icon="event" iconColor="primary">
          <Calendar
            popup
            localizer={localizer}
            culture={"es"}
            events={events}
            defaultView="month"
            defaultDate={new Date()}
            style={{ height: "100vh" }}
            formats={formatters}
            eventPropGetter={setEventStyle}
            onSelectEvent={ event => handleEventDetail(event)}
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
              showMore: total => `mostrar ${total} más`,
            }}
            components={{
              toolbar: Toolbar,
            }}
          />
        </CardPanel>
      </GridItem>
    </GridContainer>
  )
}
