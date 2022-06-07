import React, {useState} from 'react'
import Axios from 'axios'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styles from 'components/Core/AccordionPanel/accordionComparePanelStyles';
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import AccordionJourney from './AccordionJourney';
const useStyles = makeStyles(styles);


export default function AccordionGroup(props) {
  const { groupName, index, groupID, userID} = props;
  const classes = useStyles();
  const [dataJourney,setDataJourney] = useState('')
  const handleDataJourney = async () => {
    if(!dataJourney){
      const params ={
      p_user_id: userID,
      p_group_id: groupID
    }
    const { data } = await Axios.post('/dbo/portal_admon/get_users_groups_journey',params);
    setDataJourney(data.p_cursor);
    }
  }

  return(
    <>
      <Accordion TransitionProps={{ unmountOnExit: true }} onClick={handleDataJourney}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}
        aria-controls={`panel${index}a-content`}
        id={`panel${index}a-header`}
      >
        <span className={classes.titleCategory}>{groupName}</span>
      </AccordionSummary>
      <AccordionDetails>
        <GridItem xs={12}>
          {dataJourney &&
            dataJourney.map((element,index) => 
            <>
            <AccordionJourney 
              index={index} 
              groupID={groupID} 
              userID={userID} 
              groupName={element.DAY_OF_WEEK}
              journeyID={element.JOURNEY_ID}
            />
            </>)
          }
        </GridItem>
      </AccordionDetails>
    </Accordion>
    </>
  )
}