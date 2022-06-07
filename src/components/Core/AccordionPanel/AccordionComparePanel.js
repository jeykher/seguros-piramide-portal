import React from 'react'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import styles from 'components/Core/AccordionPanel/accordionComparePanelStyles';
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"

const useStyles = makeStyles(styles);


export default function AccordionComparePanel(props){
  const unmount = props.unmount ? true : false;
  const defaultExpanded=props.defaultExpanded;
  const classes = useStyles();
  function handleClickIcons(event){
    event.stopPropagation()
    props.handleClickIcon(props.params)
  }

  return(
    <Accordion className={props.className} defaultExpanded={defaultExpanded} TransitionProps={{ unmountOnExit: unmount }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}
        aria-controls={`panel${props.id}a-content`}
        id={`panel${props.id}a-header`}
      >
        <span className={classes.titleCategory}>{props.title}
          {props.icon &&  <Tooltip title="Eliminar beneficio" placement="right-start" arrow className={classes.buttonContainer}>
          <IconButton onClick={(event) =>handleClickIcons(event)}>
            <Icon style={{ fontSize: 22, color: "red" }}>remove_circle</Icon>
          </IconButton>
        </Tooltip>}
        </span>

      </AccordionSummary>
      <AccordionDetails>
        <GridItem xs={12}>
          {props.children}
        </GridItem>
      </AccordionDetails>
    </Accordion>
  )
}