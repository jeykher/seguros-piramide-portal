import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import CardPanel from "components/Core/Card/CardPanel"
import { Calendar, momentLocalizer } from "react-big-calendar"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import SearchIcon from "@material-ui/icons/Search"
import Axios from "axios"
import moment from "moment"
import "moment/locale/es"
import { getISODate } from "utils/utils"
import Toolbar from "components/Core/Agenda/Toolbar"

import { makeStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem"
import Icon from "@material-ui/core/Icon"
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
  leyendContainer:{
    padding: '1em 1.5em'
  }
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


export default function CalendarManager({parameters}) {
  const { handleSubmit, ...objForm } = useForm()
  const [events, setEvents] = useState([])
  const classes = useStyles()
  const [showModal, setShowModal] = useState(false)
  const [eventDetail,setEventDetail] = useState('')
  const [showCalendar,setShowCalendar] = useState(false)
  const [listStatus,setListStatus] = useState([])
  const [statusFilter,setStatusFilter] = useState(false)
  // const [dateStart,setDateStart] = useState(null)
  // const [dateEnd,setDateEnd] = useState(null)
  const [initDate,setInitDate] = useState(null)


  const handleShowModal = () => {
    setShowModal(!showModal)
  }

  const handleEventDetail = (event) =>{
    setEventDetail(event);
    handleShowModal();
  }


  async function getAppointments(data) {

    const dataform = parameters.getValues()
    const params = {
      p_date_start: dataform.start_date,
      p_date_end: dataform.end_date,
      p_status_query: statusFilter
    }
    const response = await Axios.post(
      "/dbo/team_manager/get_schedule", params 
    )
    const result = response.data.p_cur_data.map(element => {
      const startDate = getISODate(element.BEGIN_DATE)
      const endDate = getISODate(element.END_DATE)
      return {
        id: element.ID,
       // work_id: element.WORKFLOW_ID,
        title: element.EVENT_NAME,
        start: startDate,
        end: endDate,
        labelColor: element.COLOR_LABEL,
        date: element.BEGIN_DATE,
        name: element.EVENT_TITLE,
        calendar: element.CALENDAR_ID,
        calendarDetail: element.CALENDAR_DETAIL_ID,
        status: element.STATUS

      }
    })
    setEvents(result)
    setShowCalendar(true) 
  }

  async function getStatus() {
    const result = await Axios.post('/dbo/team_manager/get_list_sts_calendar')
    setListStatus(result.data.p_cursor)
  } 

  const handleChange = (event) => {
    setStatusFilter(event.target.value);
  };


  function onSubmit(_,e) {
    e.preventDefault();
    getAppointments()
  }
  useEffect(() => {
  //  getAppointments()
    getStatus()
    
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
            <EventDetail event={eventDetail} dateStartQuery={parameters.getValues().start_date} dateEndQuery={parameters.getValues().end_date}/>
          </div>
        </Fade> 
      </Modal>

      <GridItem item xs={12} sm={12} md={12} lg={12}>
        <CardPanel titulo="Agenda" icon="event" iconColor="primary">
           <form onSubmit={handleSubmit(onSubmit)} >
            <GridContainer>
              <GridItem item xs={12} sm={12} md={2} lg={2}>
                    <InputLabel htmlFor="p_status_id">Estatus</InputLabel>
                    
                      <Select
                        labelId="status"
                        id="p_status_id"
                        fullWidth
                        onChange={handleChange}
                        label="Estaus"
                        name="status"
                      >
                        <MenuItem value="">
                          <em>Estatus de Consulta</em>
                        </MenuItem>
                        {listStatus && listStatus.map( item => <MenuItem key={`value_${item.CODE}`} value={item.CODE} >{item.DESCRIPTION}</MenuItem>) }
                      </Select>
                </GridItem> 
                {/* <GridItem item xs={12} sm={12} md={2} lg={2}>      
                            <DateMaterialPickerController
                              fullWidth
                              objForm={objForm}
                              label="Fecha desde"
                              name="p_from_date"
                              disableFuture
                              required={true}
                              defaultValue={()=>{
                                    
                                var fecha = new Date();
                                var dias = 30; // Número de días a restar
                                fecha.setDate(fecha.getDate() - dias);
                                  return format(fecha, 'dd/MM/yyyy')
                                }
                              }
                            />
                </GridItem>            
                <GridItem item xs={12} sm={12} md={2} lg={2}> 
                            <DateMaterialPickerController
                              fullWidth
                              objForm={objForm}
                              label="Fecha hasta"
                              name="p_until_date"setI
                              disableFuture
                              required={true}
                              defaultValue={format(new Date(), 'dd/MM/yyyy')}
                            />
                </GridItem>             */}
                <GridItem item xs={12} sm={12} md={2} lg={2}> 
                <Button type="submit" color="primary" fullWidth><SearchIcon /> Buscar</Button>
                </GridItem>
                          
                      
                
            </GridContainer>            
            </form>  
          {showCalendar &&
            <>
            <br/>
            <br/>
            <GridContainer className={classes.leyendContainer}>
                <GridItem xs={12} md={3}>
                    <GridContainer justify="center" alignItems="center">
                    <Icon style={{ color: '#DB2B10' }} >mail</Icon><span style={{ fontSize:15, color: '#DB2B10' }}> Carta Aval</span>                    
                    </GridContainer>
                 </GridItem>
                 <GridItem xs={12} md={3}>
                    <GridContainer justify="center" alignItems="center">
                    <Icon style={{ color: '#0A6205' }} >favorite</Icon><span style={{ fontSize:15, color: '#0A6205' }}> Atención Médica Primaria</span>                       
                    </GridContainer>
                 </GridItem>
                 <GridItem xs={12} md={3}>
                    <GridContainer justify="center" alignItems="center">                    
                    <Icon style={{ color: '#FFC300' }} >local_hospital</Icon><span style={{ fontSize:15, color: '#FFC300' }}> Emergencia</span>                       
                    </GridContainer>
                 </GridItem>
                 <GridItem xs={12} md={3}>
                    <GridContainer justify="center" alignItems="center">
                    
                      <Icon style={{ color: '#290EBB' }} >price_check</Icon><span style={{ fontSize:15, color: '#290EBB' }}> Reembolso</span>                       
                    </GridContainer>
                 </GridItem>
            </GridContainer> 
            <br/>
            <br/>
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
            </>
          }
          
        </CardPanel>
      </GridItem>
    </GridContainer>
  )
}
