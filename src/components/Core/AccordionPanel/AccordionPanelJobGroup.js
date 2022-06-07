import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  expansionCard: {
    marginTop: '0',
    boxShadow: '5px 2px 6px 3px rgba(0, 0, 0, 0.14)',
    borderRadius: '4px',
    //
  },
  expansionSummary: {
    padding: '0px 1em',
    background: 'beige'
  },
  expansionDetails: {
    padding: '3px 3px 3px'
  },
  expansionTitle: {
      fontSize: '0.7rem'
  }
}));


export default function AccordionPanelJobGroup(props) {
  const classes = useStyles();
  return (
    <Accordion className={classes.expansionCard}>
      <AccordionSummary
        className={classes.expansionSummary}
        expandIcon={<ExpandMoreIcon color="primary" />}
        aria-controls={`panel${props.id}a-content`}
        id={`panel${props.id}a-header`}
      >
        <Typography variant="subtitle2" className={classes.expansionTitle}>{props.title} </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.expansionDetails}>
        <GridItem xs={12}>
          {props.children}
        </GridItem>
      </AccordionDetails>
    </Accordion>
  )
}