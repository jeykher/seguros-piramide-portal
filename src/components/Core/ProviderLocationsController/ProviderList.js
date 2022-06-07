import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from "@material-ui/core/styles";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Icon from "@material-ui/core/Icon";
import providerLocationsControllerStyle from "./providerLocationsControllerStyle"
const useStyles = makeStyles(providerLocationsControllerStyle); 
const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion)

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export default function ProviderList(props) {

  const classes = useStyles()
  const [expanded, setExpanded] = useState('panel1')
  let eIndex = 1
  let panelArray = []
  let flagInitial = true
  let InitialPanel = null
  let InitialItem = null
  let panel = ''
  let panelD = ''
  let panelH = ''
  let dynamicTitle = ''
  let municipality = ''

  const handleChange = (panel, itemService, toggleIsTrue) => (event, newExpanded) => {
    if (toggleIsTrue) {
      setExpanded(newExpanded ? panel : false)
      props.providerSelected([itemService, props.providerList[1]])
    }
  }

  if (props.providerList[0]) {
    if (props.providerList[0].length > 0) {
        props.providerList[0].map(itemService => {
          panel = 'panel' + eIndex;
          panelD = 'panel' + eIndex + 'd-content';
          panelH = 'panel' + eIndex + 'd-header';
          dynamicTitle = '';
          if ( itemService ) {
            municipality = itemService.MUNICIPIO_PROVEEDOR;
            dynamicTitle = itemService.NOMBRE_PROVEEDOR + (municipality?" - " + municipality:'') + (itemService.TELEFONOS?" - " + itemService.TELEFONOS:'') + (itemService.SERVICIOS?" - " + itemService.SERVICIOS:'');
            panelArray.push (<Accordion key={panelH} square expanded={expanded === panel} onChange={handleChange(panel, itemService, true)}>
                            <AccordionSummary key={panelH} aria-controls={panelD} id={panelH}>
                              <GridContainer>
                                <GridItem xs={10} sm={10} md={10}>
                                  <Typography><b>{dynamicTitle}</b></Typography>
                                </GridItem>
                                <GridItem xs={2} sm={2} md={2}>
                                  <Typography><Icon fontSize="small" color="secondary"></Icon></Typography>
                                </GridItem>
                              </GridContainer>
                            </AccordionSummary>
                            <AccordionDetails key={panelH} >
                              <Typography>{itemService.DIRECCION_PROVEEDOR}</Typography>
                            </AccordionDetails>
                          </Accordion>);
            eIndex += 1
          }
          if (flagInitial) {
            flagInitial = false
            InitialPanel = panel
            InitialItem = itemService
          }
          return null
      })
    }
  }

  useEffect( () => {
    props.providerSelected([InitialItem, props.providerList[1]])
  }, [InitialItem, InitialPanel])

  return (
      <GridContainer>
        <GridItem className={classes.providerList}>
          {panelArray}
        </GridItem>
      </GridContainer>
  )
}
