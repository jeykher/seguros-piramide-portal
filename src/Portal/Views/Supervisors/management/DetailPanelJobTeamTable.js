import React, {useEffect, useState} from 'react'
import Axios from 'axios'
import AccordionGroup from './AccordionGroup';

export default function DetailPanelJobTeamTable(props) {
  const { userID } = props;
  const [dataGroup,setDataGroup] = useState('');
  async function getDataJobTeam(){
    const params ={
      p_user_id: userID
    }
    const { data } = await Axios.post('/dbo/portal_admon/get_users_groups',params);
    setDataGroup(data.p_cursor);
}
  useEffect(() => {
      getDataJobTeam();
  }, [userID])

  return(
    <>
    { dataGroup && dataGroup.map((element,index) => 
      <AccordionGroup groupName={element.GROUP_NAME} index={index} groupID={element.GROUP_ID} userID={userID}/>
    )
    }
    </>
  )
}