import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Icon from "@material-ui/core/Icon"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Axios from 'axios'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerSwitch:{
    margin: '0.50em 0',
    justifyContent: 'center',
    display: 'flex'
  },
  containerTable:{
    margin: '2em 0',
    width: '70%'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    width: "50%",
    minHeight: '20vh',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
  },
  title: {
    margin: '0.10em 0'
  },
  containerSelect:{
    width: '80%'
  },
  buttonNone:{
    display: 'none !important',
    padding: 0
  },
}));




export default function ModalShowProducts(props) {
  const { 
    open, 
    handleClose,
    listSelectedProducts,
    selectedListPlanType,
    selectedArea,
    codSupervisor,
    levelAlly,
    brokerSelected
    } = props;
  const classes = useStyles();

  const [filteredProducts,setFilteredProducts] = useState([]);
  const [filteredTypePlans,setFilteredTypePlans] = useState([])


  const handleFilterProducts = async () => {
    const data = await getAreaOfList();
    setFilteredProducts(data)
  }
  const getAreaOfList = async () => {
    let params = {
      p_cod_supervisor: codSupervisor,
      p_level: levelAlly,
      p_cod_area: selectedArea
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const {data} = await Axios.post(`/dbo/insurance_broker/get_available_products`,params);
    const dataProducts = listSelectedProducts[selectedArea]
    const hasTypePlan = dataProducts.some(element => element.HASTYPEPLAN !== 'N')
    const filtered = dataProducts.map(elementSelected => {
      return data.p_cur_data.find(element => element.CODPROD === elementSelected.CODPROD)
    })
    hasTypePlan === true && getTypeOfProducts(filtered)
    return filtered

  }

  const getTypeOfProducts = async (dataFilteredProducts) => {
    let params = {
      p_cod_supervisor: codSupervisor,
      p_level: levelAlly,
      p_cod_area: selectedArea
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const {data} = await Axios.post(`/dbo/insurance_broker/get_available_plan_types`,params);
    const filtered = dataFilteredProducts.map(elementSelected => {
      const result = selectedListPlanType[elementSelected.CODPROD]
      return result.map(elementType => {
        return data.p_cur_data.find(element => element.CODLVAL === elementType.CODTPLAN)
      })
    })
    setFilteredTypePlans(...filtered)
  }

  useEffect(() => {
     open === true && handleFilterProducts()
     setFilteredTypePlans([])
  },[selectedArea,listSelectedProducts])

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
              <h3 className={classes.title}>Productos por área:</h3>
            </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={12} className={classes.modal}>
              <GridContainer className={classes.modal}>
                <>
                {filteredProducts.length > 0 && 
                filteredProducts.map(element => (
                  <GridItem xs={12} className={classes.containerSwitch}>
                    <h5 className={classes.title}>{element.DESCPROD}</h5>
                  </GridItem>
                  
                ))}
                {filteredTypePlans.length > 0 && 
                <>
                <h4 className={classes.title}>Tipos de plan por producto:</h4>
                {
                  filteredTypePlans.map(element => (
                    <GridItem xs={12} className={classes.containerSwitch}>
                      <h5 className={classes.title}>{element.DESCRIP}</h5>
                    </GridItem>
                    
                  ))  
                }
                </>
                }
                </>
              </GridContainer>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={12} className={classes.modal}>
                  <Button  onClick={handleClose}> <Icon>fast_rewind</Icon>Cerrar</Button>
              </GridItem>
            </GridContainer>
          </div>
        </Fade>
      </Modal>
    </>
  );
}

