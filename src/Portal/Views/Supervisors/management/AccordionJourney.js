import React, {useState} from 'react'
import Axios from 'axios'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import styles from 'components/Core/AccordionPanel/accordionComparePanelStyles'
import { makeStyles } from "@material-ui/core/styles"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import {hourFormat24to12} from 'utils/utils'
const useStyles = makeStyles(styles)


export default function AccordionJourney(props) {
  const { groupName, index, groupID, userID, journeyID} = props;
  const classes = useStyles();

  const [journeyHours,setJourneyHours] = useState('')

  const handleJourneyHours = async () => {
    if(!journeyHours){
      const params ={
        p_user_id: userID,
        p_group_id: groupID,
        p_journey_id: journeyID
      }
      const { data } = await Axios.post('/dbo/portal_admon/get_users_groups_journey_hours',params);
      setJourneyHours(data.p_cursor);
    }
  }

  return(
    <>
      <Accordion TransitionProps={{ unmountOnExit: true }} onClick={handleJourneyHours}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}
        aria-controls={`panel${index}b-content`}
        id={`panel${index}b-header`}
      >
        <span className={classes.titleCategory}>{groupName}</span>
      </AccordionSummary>
      <AccordionDetails>
        <GridItem xs={12}>
          {journeyHours &&
            journeyHours.map((element) => 
            <>
            <h5>{hourFormat24to12(element.start_journey_at)} - {hourFormat24to12(element.end_journey_at)}</h5>
            </>)
          }
        </GridItem>
      </AccordionDetails>
    </Accordion>
    </>
  )
}