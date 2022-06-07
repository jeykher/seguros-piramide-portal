import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Timeline from 'components/material-dashboard-pro-react/components/Timeline/Timeline'
import CardTravel from "@material-ui/icons/CardTravel";
import Extension from "@material-ui/icons/Extension";
import Card from 'components/material-dashboard-pro-react/components/Card/Card'
import CardBody from 'components/material-dashboard-pro-react/components/Card/CardBody'

const servicio_tracking = [
        {
          // First story
          inverted: true,
          badgeColor: "danger",
          title: "Some Title",
          titleColor: "danger",
          body: (
            <p>
              Wifey made the best Father{"'"}s Day meal ever. So thankful so happy so
            </p>
          ),
          footerTitle: "11 hours ago via Twitter"
        },
        {
          // Second story         
          title: "Another One",
          titleColor: "success",
          body: (
            <p>
              Thank God for the support of my wife and real friends. I also wanted to
              point out 
            </p>
          )
        }
]

export default function TimeLineChat() {
  const [stories, setStories] = useState(null)
    async function getMessages() {
        const params = {
            p_user_id: 28,
            p_rows: 100,
            p_page: 0
            //p_cursor_messages
        }
        const response = await Axios.post('/dbo/workflow/get_table_messages',params)
        console.log('messagess')
        console.log(response.data.p_cursor_messages)
        setChat(response.data.p_cursor_messages)
    }
    
    useEffect(()=>{
        getMessages()
    }, [])

    function setChat(chat){
      setStories(
          chat.map((reg) => {
          return(
              {   
                title: reg.AUTHOR,
                titleColor: "success",
                body: (
                  <p>
                    Thank God for the support of my wife and real friends. I also wanted to
                    point out 
                  </p>
                )
              }            
          )
      }))
      console.log('stories')
      console.log(stories)
  }

    return (        
      <Card plain>
          <CardBody plain>
              {stories &&  <Timeline simple stories={stories} />}
          </CardBody>
      </Card>
    )
        
}
