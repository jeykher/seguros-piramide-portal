import React from 'react';
import { indentificationTypeAll } from 'utils/utils'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import { makeStyles } from "@material-ui/core/styles";
import Identification from 'components/Core/Controller/Identification'

const useStyles = makeStyles((theme) => ({
  containerButton:{
    marginTop: '2em'
  },
  containerGrid: {
    padding: '1.5em'
  }
}));


export default function IdentificationCustomer({handleGetIdentification, objForm}) {
  const classes = useStyles();
  
  return (
    <form noValidate>
    <GridContainer justify="center" className={classes.containerGrid}>
      <GridContainer justify="center" xs={12}>
      <h3>Identificación del cliente</h3>
      </GridContainer>
      <GridContainer justify="center" xs={12} sm={6} md={5}> 
          <Identification objForm={objForm} index={1} arrayType={indentificationTypeAll} />
          <GridContainer className={classes.containerButton} justify="center" xs={12}>
          <Button color="primary" onClick={handleGetIdentification}>Siguiente</Button>
          </GridContainer>
      </GridContainer>
    </GridContainer>
    </form>
  )
}