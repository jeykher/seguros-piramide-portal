import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { setColors, getColors } from 'utils/colorsArray'
import Cardpanel from 'components/Core/Card/CardPanel'
import { useForm, Controller } from "react-hook-form";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import Icon from "@material-ui/core/Icon";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import TextField from '@material-ui/core/TextField';
import ChatMessage from 'components/Core/Chat/ChatMessage'
//import io from 'socket.io-client';

export default function ChatMessages(props) {
    const { handleSubmit, errors, control, reset } = useForm();
    const [messages, setMessages] = useState([])
    const [arrayColors, setarrayColors] = useState([])
    const { list } = props
    const chatRoom = `room_${list.MESSAGE_ID}`
    //let socketChatWf
    //const [socket, setsocket] = useState([])

   /* async function openSocket() {
        socketChatWf = io.connect(`${process.env.GATSBY_API_URL}/chats_wf`)
        socketChatWf.emit("joinRoom", chatRoom)
        socketChatWf.on("refresh", (res) => getMessages())
        setsocket(socketChatWf)
    }*/

    async function getMessages() {
        const params = { p_message_id: list.MESSAGE_ID }
        const response = await Axios.post('/dbo/workflow/get_wf_chat', params)
        console.log('messagess')
        console.log(response.data.p_cursor_chat)
        const data = response.data.p_cursor_chat
        setarrayColors(setColors(data, "AUTHOR"))
        setMessages(data)
    }

    useEffect(() => {
        //if (!socketChatWf) openSocket()
        getMessages()
    }, [list])

    async function onSubmit(dataform, e) {
        e.preventDefault();
        const p_json = {
            subject: list.SUBJECT,
            answer_of_message_id: list.MESSAGE_ID,
            destinataries: []
        }
        const params = {
            p_workflow_id: list.WORKFLOW_ID,
            p_message_text: dataform.p_message_text,
            p_json_message: JSON.stringify(p_json)
        }
        await Axios.post('/dbo/workflow/send_a_message', params)
        getMessages()//socket.emit("newMessage", chatRoom) 
        reset({ p_message_text: '' })
    }


    return (
        <Cardpanel titulo={list.SUBJECT} icon="group" iconColor="primary">
            <h6>Participantes: {list.DESTINATARIES_LIST}</h6>
            {messages.map((reg, index) => (
                <ChatMessage
                    key={index}
                    title={reg.AUTHOR}
                    body={reg.TEXT}
                    time={reg.MESSAGE_DATE}
                    type={reg.SIDE === 'RIGTH' ? 'sent' : 'received'}
                    readed={reg.READED_DATE === null ? false : true}
                    colorAuthor={getColors(arrayColors, reg.AUTHOR)}
                />
            ))}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Controller
                    label="Mensaje"
                    as={TextField}
                    fullWidth
                    multiline
                    rows="1"
                    name="p_message_text"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    helperText={errors.p_message_text && "Debe escribir un mensaje"}
                />
                <GridContainer justify="center">
                    <Button color="primary" type="submit">
                        <Icon>send</Icon> Enviar
                    </Button>
                </GridContainer>
            </form>
        </Cardpanel>
    )
}
