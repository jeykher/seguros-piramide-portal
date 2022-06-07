import React, {useState, useEffect, Fragment} from 'react'
import Axios from 'axios'
import Timeline from 'components/material-dashboard-pro-react/components/Timeline/Timeline'
import {statusColors} from 'utils/utils'
import TimelineActions from './TimelineActions'
import ChatFloating from './Chats/ChatFloating'

export default function TimelineWf(props) {
    const { id,id_message } = props
    const [stories, setStories] = useState(null)

    async function getTimeline(){
        const params = {
            p_workflow_id: id
        }
        const response = await Axios.post('/dbo/workflow/full_timeline_to_clob',params)
        const jsonResult =  response.data.result        
        setTimeline(jsonResult.timeline)
    }

    function setTimeline(tracking){
        setStories(
            tracking.map((reg) => {
                return({
                    inverted: true,
                    badgeColor: statusColors[reg.statuscolors].color,
                    badgeIcon:  reg.decisionPoint === 'S' ? statusColors["Pregunta"].icon : statusColors[reg.statuscolors].icon,
                    title: reg.stage,
                    titleColor: statusColors[reg.statuscolors].color,
                    body: (
                    <div>
                        {`${reg.status} - ${reg.contextual_date}`}
                    </div>
                    ),             
                    footer: (
                        <TimelineActions reg={reg} color={statusColors[reg.statuscolors].color}/>
                    )                
                })                         
        }))
    }

    useEffect(()=>{
        getTimeline()
        document.getElementById('main_panel').scrollTo(0,0);
    }, [id])

    return (
        <Fragment>
            {stories && <Timeline simple stories={stories} />}
            {<ChatFloating workflowId={id} id_message={id_message}/>}
        </Fragment>
        
    )
}
