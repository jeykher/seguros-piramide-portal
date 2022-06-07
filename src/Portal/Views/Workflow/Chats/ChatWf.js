import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import ChatNewForm from './ChatNewForm'
import ChatList from './ChatList'
import ChatMessages from './ChatMessages'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    list: {
        maxWidth: 500,        
    }
});

export default function ChatWf(props) {
    const { workflow_id,id_message } = props
    const [showNew, setShowNew] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [currentList, setcurrentList] = useState(false);
    const [chats, setChats] = useState([]);
    const classes = useStyles();
    const [selectedChat, setSelectedChat] = useState(0);

    function handleNewChat() {
        setShowMessages(false)
        setShowNew(true)
    }

    function handleSelectList(reg,indexSelected) {
        setcurrentList(reg)
        setShowNew(false)
        setShowMessages(true)
        setSelectedChat(indexSelected) 
    }

    async function getChats() {
        const params = {
            p_workflow_id: workflow_id
        }
        const response = await Axios.post('/dbo/workflow/get_list_of_chats', params)
        setChats(response.data.p_cursor_messages)
    }

    async function handleCreateChat(p_message_text, p_json) {
        console.log(p_json)
        const params = {
            p_workflow_id: workflow_id,
            p_message_text: p_message_text,
            p_json_message: JSON.stringify(p_json)
        }
        await Axios.post('/dbo/workflow/send_a_message', params)
        setShowNew(false)
        getChats()
    }

    useEffect(() => {
       getChats()

    }, [])
    useEffect(() => {
        if(id_message){
            chats.map((element,index) => {
                if (element.MESSAGE_ID == id_message) {
                    handleSelectList(element,index)                  
                }
            })
        }else{              
            if(chats && chats[0])  {
                handleSelectList(chats[0],0)
            }
        }

    }, [chats])

    return (

        <GridContainer className={classes.list} role="presentation">
            <GridItem md={12}>
                <ChatList
                    chats={chats}
                    eventNewList={handleNewChat}
                    eventSelectList={handleSelectList}
                    setSelected={selectedChat}
                />
            </GridItem>
            <GridItem md={12}>
                {showNew && <ChatNewForm workflowId={workflow_id} onCreate={handleCreateChat} />}
                {showMessages && <ChatMessages list={currentList} />}
            </GridItem>
        </GridContainer>
    )
}
