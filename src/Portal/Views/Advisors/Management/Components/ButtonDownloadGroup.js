import React from 'react'
import Icon from "@material-ui/core/Icon"
import { ButtonGroup, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import ManagementStyle from '../ManagementAdvisorsStyle'
const useStyles = makeStyles(ManagementStyle);


export default function ButtonDownloadGroup(props){
  const classes = useStyles();

  const {handleGetPolicies, handleGetCustomers, hideClient, hidePolicy,titlePolicies,titleClients} = props;


  
  
  return(
      <ButtonGroup variant="text" size="small" color="primary">
        { !hidePolicy &&
          <Button
            variant="text" 
            size="small" 
            onClick={handleGetPolicies}
            className={`${classes.buttonBase} ${classes.fontBold}`}
          >
            <Icon className={classes.colorIcon}>get_app</Icon>
            {titlePolicies ? titlePolicies : 'DESCARGAR DETALLE PÓLIZAS'}
          </Button>
        }
        { !hideClient &&
          <Button
            variant="text" 
            size="small"
            onClick={handleGetCustomers}
            className={`${classes.buttonBase} ${classes.fontBold}`}
          >
            <Icon className={classes.colorIcon}>get_app</Icon>
            {titleClients ? titleClients : 'DESCARGAR DETALLE CLIENTES'}
          </Button>
        }
      </ButtonGroup>
  )
}