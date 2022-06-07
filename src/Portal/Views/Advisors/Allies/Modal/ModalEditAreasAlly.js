import React, { useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Switch from 'components/Core/Switch/Switch'
import Icon from "@material-ui/core/Icon"
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import IconButton from "@material-ui/core/IconButton"

import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerSwitch:{
    margin: '0.10em 0',
    justifyContent: 'center',
    display: 'flex',
  },
  containerSwitchTitle:{
    margin: '0.10em 0',
    display: 'flex',
    marginTop: '1.75em'
  },
  containerDiv:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%'
  },
  containerDivProducts:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
  },
  containerTitleProducts:{
    marginLeft: '4em'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    width: "35%",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
    maxHeight: '800px',
    overflowY: 'auto'
  },
  title: {
    margin: '0.10em 0'
  },
  button:{
    padding: 0
  },
  titleProducts:{
    margin: 0,
  },
  titleAreas:{
    margin: '0.45em 0',
    fontSize: '1.15em'
  },
  titleProductsItem:{
    fontSize: '1.25em'
  },
  buttonSpace:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2.5em'
  }
}));
export default function ModalEditAreasAlly(props) {
  const { open, handleClose,handleStatusAreaAlly, dataAreas, getAllAreasAlly,handleStatusProduct,handleStatusTypePlan} = props;
  const classes = useStyles();
  useEffect(() => {
    getAllAreasAlly();
  },[])

  return (
    <>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <div className={classes.paper}>
            <GridContainer>
            <GridItem xs={12} sm={12} md={12} lg={12} className={classes.modal}>
              <h3 className={classes.title}>Áreas a editar:</h3>
            </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={12} className={classes.modal}>
              <GridContainer>
                {
                  dataAreas &&
                  dataAreas.map(element => {
                    return(
                      <>
                      <GridItem xs={12} sm={12} md={12} lg={12} className={classes.containerSwitchTitle}>
                        <div className={classes.containerDiv}>
                          <h4 className={classes.titleAreas}>
                            {element.DESCAREA}
                          </h4>
                          <Tooltip className={classes.button} title="Activar o suspender área" placement="left-start" arrow >
                            <IconButton onClick={() => handleStatusAreaAlly(element)}>
                              <Switch 
                                size="small" 
                                checked={element.STATUSAREA === 'ACT'}
                                name={'STATUS'}
                              />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </GridItem>
                      {element.PRODUCTOS || element.TIPOPLAN ?
                        <>
                         <GridItem xs={12} sm={12} md={12} lg={12} className={classes.containerTitleProducts}>
                          <h5 className={classes.titleProducts}>
                            {element.CODAREA === '0002' ? 'Tipo de planes:' : 'Productos:'}
                          </h5>
                        </GridItem>
                        {
                        element.CODAREA !== '0002' ? element.PRODUCTOS.map(product => {
                          return(
                            <GridItem xs={12} sm={12} md={12} lg={12} className={classes.containerSwitch}>
                              <div className={classes.containerDivProducts}>
                                <h5 classname={classes.titleProductsItem}>
                                  {product.DESCPROD}
                                </h5>
                                <Tooltip className={classes.button} title="Activar o suspender Producto" placement="left-start" arrow >
                                  <IconButton onClick={() => handleStatusProduct(product, element.CODAREA)}>
                                    <Switch 
                                      size="small" 
                                      checked={product.STSPRODUCTO === 'ACT'}
                                      name={'STATUS'}
                                    />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </GridItem>
                          )
                          })
                          :
                          element.TIPOPLAN.map(product => {
                            return(
                              <GridItem xs={12} sm={12} md={12} lg={12} className={classes.containerSwitch}>
                              <div className={classes.containerDivProducts}>
                                <h5 classname={classes.titleProductsItem}>
                                  {product.DESCRIP}
                                </h5>
                                <Tooltip className={classes.button} title="Activar o suspender tipo de plan" placement="left-start" arrow >
                                  <IconButton onClick={() => handleStatusTypePlan(product, element.CODAREA)}>
                                    <Switch 
                                      size="small" 
                                      checked={product.STSTIPOPLAN === 'ACT'}
                                      name={'STATUS'}
                                    />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </GridItem>
                            )
                          })
                        }
                        </>
                       : null
                      }
                      </>
                    )
                  })
                }
                </GridContainer>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={12} className={classes.buttonSpace}>
                <Button color="primary" onClick={handleClose}> <Icon>fast_rewind</Icon>Volver</Button>
              </GridItem>
            </GridContainer>
          </div>
        </Fade>
      </Modal>
    </>
  );
}


