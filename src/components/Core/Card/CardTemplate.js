import React from 'react'
import { makeStyles } from '@material-ui/styles';
import Icon from "@material-ui/core/Icon";

import Card from "components/material-dashboard-pro-react/components/Card/Card";
import CardHeader from 'components/material-dashboard-pro-react/components/Card/CardHeader';
import CardBody from 'components/material-dashboard-pro-react/components/Card/CardBody';
import CardIcon from 'components/material-dashboard-pro-react/components/Card/CardIcon';
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";


import styles from './cardTemplateStyle'
const useStyles = makeStyles(styles);

export default function CardTemplate(props) {
  const classes = useStyles();
  const { collapse, back,handleBack } = props
  const [expanded,setExpanded] = React.useState(true);
  const handleCollapseCard = () =>{
    collapse && setExpanded(!expanded);
  }
  return (
    <Card 
      collapse={collapse} 
      handleCollapseCard={handleCollapseCard}
      expanded={expanded}
      >
      <CardHeader color={props.color} icon>
        <CardIcon color={props.iconcolor}>
          <Icon>{props.icon}</Icon> 
        </CardIcon>
        <h5 className={classes.cardIconTitle}>{props.titulo}</h5>
      </CardHeader>
      <CardBody 
        expanded={expanded}
        >
        {props.body}
        <div className={classes.buttonAccion}>
          <Button fullWidth color={props.iconcolor} type="submit" onClick={props.actionButton ? props.actionButton : undefined}>
          {props.iconaccion && <Icon>{props.iconaccion}</Icon>}  {props.accion}
          </Button>
        </div>
        {
          back &&
          <div className={classes.buttonAccion}>
          <Button fullWidth onClick={handleBack}>
            <Icon>fast_rewind</Icon> Regresar
          </Button>
          </div>
        }
      </CardBody>
    </Card>
  )
}