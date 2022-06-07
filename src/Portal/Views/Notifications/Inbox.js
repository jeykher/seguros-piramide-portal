import React, { useEffect, useState } from "react"
import { Dialog,DialogContent,DialogTitle } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import Chat from "@material-ui/icons/Chat"
import ListAlt from "@material-ui/icons/ListAlt"
import CustomTabs from "../../../components/material-dashboard-pro-react/components/CustomTabs/CustomTabs"
import Axios from "axios"
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import ButtonIconText from 'components/Core/ButtonIcon/ButtonIconText'
import { navigate } from "gatsby-link"
import useMediaQuery from '@material-ui/core/useMediaQuery';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from "@material-ui/icons/Close"
import Hidden from "@material-ui/core/Hidden"
import { useStaticQuery, graphql } from "gatsby"

import { getProfileCode } from 'utils/auth'

const styles = {
  textCenter: {
    textAlign: "center"
  },
  floatRigth: {
    float: 'right'
  },
  root: {
    flexGrow: 1,
    maxWidth: 600,
  },
  hideContent: {
    display: "none"
  },
  showContent: {
    display: "block"
  },
  tab:{
    padding: '10px !important',
    alignSelf: 'center',
    "@media (min-width: 60px)": {
      width: 330,
      height:510,
      align: 'center'
    },
    "@media (min-width: 760px)": {
      width: 550,
      height:570,
    }
  }
};
const useStyles = makeStyles(styles);

export default function Inbox(props) {
  const {modal,numReg,onClosePop} = props
  const [openInbox, setOpenInbox] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const smallView = !useMediaQuery('(min-width:600px)');
  const mediumView = !useMediaQuery('(min-width:960px)');
  const classes = useStyles();



   function onClose() {
    setOpenInbox(false)
    onClosePop && onClosePop();
  }

  function onOpen() {
    setShowModal(true)
  }


  if(!modal&&!mediumView)
    return(<TabsNotification modal={modal} onClose={onClose} onOpen={onOpen} numReg={numReg}/>)

  return (
    <Dialog
            open={openInbox}
            onClose={() => setOpenInbox(false)} 
            fullScreen={smallView}
            className={showModal?classes.showContent:classes.hideContent}
            >
      <DialogTitle id="alert-dialog-title">Notificaciones
      { <Hidden mdUp>
            <IconButton onClick={onClose} className={classes.floatRigth}>
            <CloseIcon />
            </IconButton>
        </Hidden>
      }   
      </DialogTitle>
      <DialogContent className={classes.tab}>
         <TabsNotification modal={true} onClose={onClose} onOpen={onOpen} numReg={numReg}/>
      </DialogContent>
    </Dialog>
  )
}

function TabsNotification(props){
  const [messages, setMessages] = useState([]);
  const {onClose,onOpen,numReg,modal} = props
  const [tasks, setTasks] = useState([]);
  const [news,setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dataNews = useStaticQuery(
    graphql`
    query{
      allStrapiNoticias(sort: {order: DESC, fields: fecha_publicacion} filter: {categoria_publicacion:{ identificador_categoria: {eq: "2"}}} ){
        edges{
          node{
            id
            titulo_noticia
            fecha_publicacion
          }
        }
      }
    }
  `
  )


  async function handleClick(event, rowData) {
    onClose && onClose();
    navigate(`/app/workflow/service/${rowData.WORKFLOW_ID}`);
  }

  function handleChat(event, rowData){
    onClose && onClose();
    navigate(`/app/workflow/service/${rowData.WORKFLOW_ID}/${rowData.MESSAGE_ID}`);
  }

  async function get_unread_messages(){

    const [messages,tasks]=await Promise.all([
      Axios.post('/dbo/workflow/get_unread_messages').then(({data})=>data.p_cursor),
      Axios.post('/dbo/workflow/get_pending_tasks').then(({data})=>data.p_cursor),
    ]);
    setMessages(messages)
    setTasks(tasks)
    setIsLoading(false);
    if((messages.length>0||tasks.length)&&modal){
      onOpen&&onOpen();
    }
  }

  const getNews = () =>{
    const noticias = dataNews.allStrapiNoticias.edges.map((element) => {
      return{
        title: element.node.titulo_noticia,
        date: element.node.fecha_publicacion,
        id: element.node.id
      }
    })
    setNews(noticias);
    setIsLoading(false);
  }

  useEffect(() =>{
    getNews();
  },[])

  useEffect(() => {
    get_unread_messages()
  }, [])


 return( <CustomTabs
    headerColor="primary"
    tabs={[
      {
        tabName: "Tareas pendientes",
        tabIcon: ListAlt,
        tabContent: (  <TableMaterial
          options={{
            pageSize: numReg,
            sorting: false
          }}
          columns={[
            { title: 'Servicio', field: 'TITLE',  width: '10%', render: rowData =>
                <ButtonIconText tooltip={rowData.TOOLTIP} color={rowData.COLOR === undefined  ? "primary" : rowData.COLOR} icon={rowData.ICON === undefined ? "event" : rowData.ICON} />
            },
            { title: 'Título', field: 'TITLE', width: '65%'},
            { title: 'Detalle', field: 'TIMESTAMP', width: '25%'}
          ]}
          data={tasks}
          isLoading = {isLoading}
          onRowClick={(event, rowData) => handleClick(event, rowData)}
        />),
      },
      {
        tabName: "Chats",
        tabIcon: Chat,
        tabContent: (
          <TableMaterial
            options={{
              pageSize: numReg,
              sorting: false
            }}
            columns={[
              { title: 'Servicio', field: 'SUBJECT', width: '10%', render: rowData =>
                  <ButtonIconText tooltip={rowData.TOOLTIP} color={rowData.COLOR === undefined  ? "primary" : rowData.COLOR} icon={rowData.ICON === undefined ? "event" : rowData.ICON} />
              },
              { title: 'Asunto', field: 'SUBJECT', width: '65%'},
              { title: 'Fecha', field: 'MESSAGE_DATE', width: '25%'}
            ]}
            data={messages}
            isLoading = {isLoading}
            onRowClick={(event, rowData) => handleChat(event, rowData)}
          />
        ),
      },
      getProfileCode() === 'insurance_broker' ? {
        tabName: "Noticias",
        tabIcon: Chat,
        tabContent: (
          <TableMaterial
            options={{
              pageSize: numReg,
              sorting: false
            }}
            columns={[
              { title: 'Titulo', 
                field: 'title', 
                width: '50%',
                cellStyle: { textAlign: "center" },
                headerStyle: { textAlign: 'center'},
              },
              { title: 'Fecha', 
                field: 'date', 
                width: '50%',
                cellStyle: { textAlign: "center" },
                headerStyle: { textAlign: 'center'},
              },
            ]}
            data={news}
            isLoading = {isLoading}
            onRowClick={(event, rowData) => window.open(`${window.location.origin}/noticias_asesor/${rowData.id}`,'_blank')}
          />
        ),
      } :
      {
        tabName: 'undefined'
      }
    ].filter(element => element.tabName !== 'undefined')}
  />)
}
