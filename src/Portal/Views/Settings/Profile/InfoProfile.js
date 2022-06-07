import React from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Icon from "@material-ui/core/Icon"

export default function InfoProfile(){


  return(
    <GridContainer>
      <GridItem xs={12} md={12}>
        <Accordion>
          <AccordionSummary
            expandIcon={<Icon>create</Icon>}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <h6>Testing</h6>
          </AccordionSummary>
          <AccordionDetails>
            <span>Testing</span>
          </AccordionDetails>
        </Accordion>
      </GridItem>
    </GridContainer>
  )
}