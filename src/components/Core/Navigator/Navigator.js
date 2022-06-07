import React, {useState} from 'react'
import NavPills from 'components/material-kit-pro-react/components/NavPills/NavPills';
import Card from "components/material-dashboard-pro-react/components/Card/Card.js";
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js";
import Icon from "@material-ui/core/Icon";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton'
import Button from "components/material-kit-pro-react/components/CustomButtons/Button";
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js";
import CardIcon from "components/material-dashboard-pro-react/components/Card/CardIcon.js";
import styles from "components/Core/Card/cardPanelStyle";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(styles);



export default function Navigator(props){
  const classes = useStyles();
  const {handleShowMore} = props;
  return(
    <Card>
      <CardHeader color={'red'} icon>
        <CardIcon color="primary">
            <Icon>perm_identity</Icon>
        </CardIcon>
        <h4 className={classes.cardIconTitle}>Asegurados</h4>
      </CardHeader>
      <CardBody>
        <NavPills
            horizontal={{
                tabsGrid: { xs: 12, sm: 2, md: 4 },
                contentGrid: { xs: 12, sm: 10, md: 8 }
            }}
            color='primary'
            tabs={[
              {
                tabButton: 'Illich',
                tabContent: (
                  <>
                    <h6><strong>Nombre y apellido: Illich Alexander Rada Canelon </strong></h6>
                    <h6><strong>Cedula: 27.833.782</strong></h6>
                    <h6><strong>Edad: 20</strong></h6>
                    <Tooltip title="Detalles" placement="left-start" arrow>
                      <IconButton color="primary" onClick={() => handleShowMore()}>
                          <Icon color="primary" style={{ fontSize: 32 }} >assignment</Icon>
                      </IconButton>
                    </Tooltip>
                    <Button color="primary" simple onClick={() => handleShowMore()}>Ver más</Button>
                  </>
                )
              },
              {
                tabButton: 'Alexander',
                tabContent: (
                  <>
                    <h6><strong>Nombre y apellido: JONATHAN ALFONZO CAMACARO </strong></h6>
                    <h6><strong>Cedula: 15.342.636</strong></h6>
                    <h6><strong>Edad: 40</strong></h6>
                    <Tooltip title="Detalles" placement="left-start" arrow>
                      <IconButton color="primary" onClick={() => handleShowMore()}>
                          <Icon color="primary" style={{ fontSize: 32 }} >assignment</Icon>
                      </IconButton>
                    </Tooltip>
                  </>
                )
              },
              {
                tabButton: 'Carlos',
                tabContent: (
                  <>
                    <h6><strong>Nombre y apellido: JONATHAN ALFONZO CAMACARO </strong></h6>
                    <h6><strong>Cedula: 15.342.636</strong></h6>
                    <h6><strong>Edad: 40</strong></h6>
                    <Tooltip title="Detalles" placement="left-start" arrow>
                      <IconButton color="primary" onClick={() => handleShowMore()}>
                          <Icon color="primary" style={{ fontSize: 32 }} >assignment</Icon>
                      </IconButton>
                    </Tooltip>
                  </>
                )
              },
              {
                tabButton: 'Jonathan',
                tabContent: (
                  <>
                    <h6><strong>Nombre y apellido: JONATHAN ALFONZO CAMACARO </strong></h6>
                    <h6><strong>Cedula: 15.342.636</strong></h6>
                    <h6><strong>Edad: 40</strong></h6>
                    <Tooltip title="Detalles" placement="left-start" arrow>
                            <IconButton color="primary" onClick={() => handleShowMore()}>
                                <Icon color="primary" style={{ fontSize: 32 }} >assignment</Icon>
                            </IconButton>
                    </Tooltip>
                  </>
                )
              },
              {
                tabButton: 'Gusmen',
                tabContent: (
                  <>
                    <h6><strong>Nombre y apellido: PACHECO AVILAN GUSMEN JAVIER </strong></h6>
                    <h6><strong>Cedula: 17.244.322</strong></h6>
                    <h6><strong>Edad: 41</strong></h6>
                    <Tooltip title="Detalles" placement="left-start" arrow>
                      <IconButton color="primary" onClick={() => handleShowMore()}>
                          <Icon color="primary" style={{ fontSize: 32 }} >assignment</Icon>
                      </IconButton>
                    </Tooltip>
                    <Button color="primary" onClick={() => handleShowMore()}>Ver mas</Button>
                  </>
                )
              }
            ]} />
      </CardBody>
    </Card>
  )
}