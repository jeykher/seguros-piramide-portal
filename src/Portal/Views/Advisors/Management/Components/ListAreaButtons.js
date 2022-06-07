import React from 'react'
import Icon from "@material-ui/core/Icon"
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import ManagementStyle from '../ManagementAdvisorsStyle'
import { getInsuranceAreaData } from 'utils/utils'

const useStyles = makeStyles(ManagementStyle);


export default function ListAreaButtons(props){
  const classes = useStyles();

  const {listAreas,handleArea} = props;
  
  return(
    <>
    {
      listAreas.map((element,index) => (
        <Button 
          key={index} 
          variant="text"
          onClick={() => handleArea(element.description)}
          className={classes.fontBold}
          size="small"
          >
         <Icon className={`${classes.colorIcon} ${classes.marginIcon}`}>{getInsuranceAreaData(element.description,'icon')}</Icon>
          {getInsuranceAreaData(element.description,'title')}
        </Button>
      ))
    }
  </>
  )

}