import React,{useState,useEffect} from 'react'
import {navigate} from 'gatsby'
import objSocket from 'socket.io-client';
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "components/material-dashboard-pro-react/components/Snackbar/Snackbar";
import {statusColors} from 'utils/utils'
import { getToken } from './auth';

export default function NotificationsActiveServices() {
    const [notifications, setNotifications] = useState([])
    const [show, setShow] = useState(false)

    function openSocket(){
        const token = getToken();
        const socket = objSocket(`${process.env.GATSBY_API_URL}`, {query: `Authorization=bearer ${token}`});
        socket.on('active_services', (data) => {
          console.log('active_services')
          console.log(data) 
          setNotifications(data.result)
          if(data.result.length > 0){
            setShow(true)
          }
        })
        socket.emit('active_services', 'arranca');
    }

    function handleClick(workflowId){
        navigate(`/app/workflow/service/${workflowId}`);
        setShow(false)
    }

    useEffect(() => {
        openSocket()
    }, [])

    return (
        notifications.slice(0, 1).map((reg)=>(
            <Snackbar
                place="br"
                color={statusColors[reg.STATUS_FOR_COLORS].color}
                icon={AddAlert}
                message={<div onClick={()=>handleClick(reg.WORKFLOW_ID)}>{`${reg.STAGE_STATUS} - ${reg.STAGE_NAME}: ${reg.NOMBRE_ASEGURADO}`}</div>}
                open={show}
                closeNotification={() => setShow(false)}
                close                
            />                 
        ))
    )
}
