import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Icon from "@material-ui/core/Icon"
import Axios from 'axios'
import { useDialog } from "context/DialogContext"
import { useForm } from "react-hook-form"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import SelectSimple from 'components/Core/SelectSimple/SelectSimple'
import SelectMultipleChipController from 'components/Core/Controller/SelectMultipleChipController'


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerSwitch:{
    margin: '1em 0',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column'
  },
  containerTable:{
    margin: '2em 0',
    width: '70%'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    width: "50%",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
  },
  title: {
    margin: '0.10em 0'
  },
  containerSelect:{
    width: '80%'
  }
}));

export default function ModalAddProducts(props) {
  const { 
    open, 
    handleClose,
    getExistentAreasAlly,
    listAreas,
    codAlly,
    brokerSelected,
    handleListAsignedProducts,
    listAsignedProducts,
    codSupervisor,
    levelAlly
    } = props;


  const classes = useStyles()
  const [step, setStep] = useState(0);
  const { handleSubmit, ...objForm } = useForm();
  const [selectedArea,setSelectedArea ] = useState(null);
  const [isAdditionalLevel,setIsAdditionalLevel] = useState(false)
  const [listPlanType,setListPlanType] = useState([])
  const [listProducts,setListProducts] = useState([])
  const dialog = useDialog()
  const index = 1



  const handleStep = (value) => {
    setStep(value);
  }

  const handleListProducts = (value) => {
    setListProducts(value)
  }

  const handleInitialStep = () => {
    handleStep(0);
    setIsAdditionalLevel(false);
    handleListProducts([]);
  }

  const handleGetProducts = async () => {
    let params ={
      p_cod_ally: codAlly,
      p_cod_area: selectedArea,
      p_level: levelAlly,
      p_cod_supervisor: codSupervisor
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const { data } = await Axios.post('/dbo/insurance_broker/get_available_products_by_ally', params);
    handleListProducts(data.p_cur_data)
  }

  const handleProductsAndPlanTypes = async () => {
    if(selectedArea === '0002'){
      await handleGetPlanType()
    }else{
      await handleGetProducts()
    }
    handleStep(1)
  }

  const handleGetPlanType = async () => {
    setIsAdditionalLevel(true)
    let params = {
      p_cod_ally: codAlly,
      p_cod_area: selectedArea,
      p_level: levelAlly,
      p_cod_supervisor: codSupervisor
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const {data} = await Axios.post(`/dbo/insurance_broker/get_avlbl_plan_types_by_ally`, params);
    setListPlanType(data.p_cur_data)
  }


  const checkTitles = () => {
    let title;
    switch(step){
      case 0:
        title = 'Área a seleccionar:'
        break;
      case 1: 
      title = isAdditionalLevel ? 'Tipos de plan a seleccionar:' : 'Productos a seleccionar'
      break;
      default:
      title = 'Área a seleccionar:'
    }
    return title
  }

  const handleResult = () => {
    const formData = objForm.getValues();
    const validNewProductArea = listAsignedProducts.some( element => element.CODAREA === selectedArea);
    if(validNewProductArea){
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: 'Alerta',
        description: 'Esta área fue seleccionada anteriormente, elimine el registro existente en la tabla y proceda a ingresarlo nuevamente.' ,
      })
      handleClose()
    }else{
      const findSelectedArea = listAreas.find(element => element.CODAREA === selectedArea);
      const products = formData[`p_products_${index}`]
      let newListProducts;
      if(isAdditionalLevel){ //Si son tipos de planes
        const filteredProducts = products.map(element => {
          const findPlanType = listPlanType.find(plan => plan.CODLVAL === element);
          return {
            CODTPLAN: findPlanType.CODLVAL,
            DESCPROD: findPlanType.DESCRIP
          }
        })
        const result = {
          ...findSelectedArea,
          PRODUCTS: filteredProducts
        }
        newListProducts = [
          ...listAsignedProducts,
          result
        ]
      }else{ //Si son productos
        const filteredProducts = products.map(element => {
          const findProductData = listProducts.find(product => product.CODPROD === element)
          return {
            CODPROD: findProductData.CODPROD,
            DESCPROD: findProductData.DESCPROD
          }
        })
        const result = {
          ...findSelectedArea,
          PRODUCTS: filteredProducts
        }
        newListProducts = [
          ...listAsignedProducts,
          result
        ]
      }
      handleListAsignedProducts(newListProducts)
      handleClose()
    }
  }

  useEffect(() => {
    getExistentAreasAlly()
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
            <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} lg={12} className={classes.modal}>
              <h3 className={classes.title}>
                {
                  checkTitles()
                }
              </h3>
            </GridItem>
              {
                step === 0 &&
                <GridItem xs={12} md={6} className={classes.containerSwitch}>
                {
                  listAreas &&
                  <SelectSimple
                  id="1"
                  onChange={(e) => setSelectedArea(e)}
                  array={listAreas}
                  label="Área"
                  value={selectedArea}
                  classNameForm={classes.containerSelect}
                  />
                }
                </GridItem>
              }
              {
                  step === 1 && 
                  <GridItem xs={12} md={6} className={classes.containerSwitch}>
                {
                  listProducts &&
                  <>
                    {isAdditionalLevel === true ? 
                        <SelectMultipleChipController
                          objForm={objForm}
                          arrayValues={listPlanType}
                          label="Tipos de planes a seleccionar:"
                          name={`p_products_${index}`}
                          required={false}
                          descrip="DESCRIP"
                          idvalue="CODLVAL"
                        />
                        :
                        <SelectMultipleChipController
                        objForm={objForm}
                        arrayValues={listProducts}
                        label="Productos a seleccionar:"
                        name={`p_products_${index}`}
                        required={false}
                        descrip="DESCPROD"
                        idvalue="CODPROD"
                      />
                    }
                  </>
                }
                </GridItem>
                } 
            <GridItem xs={12} sm={12} md={12} lg={12} className={classes.modal}>
                {
                  step === 0 && <>
                  <Button  onClick={handleClose}> <Icon>fast_rewind</Icon>Cerrar</Button>
                  <Button color="primary" onClick={handleProductsAndPlanTypes}> <Icon>fast_forward</Icon>Siguiente</Button>
                  </>
                }
                {
                  step === 1 && <>
                  <Button  onClick={handleInitialStep}> <Icon>fast_rewind</Icon>Atras</Button>
                  <Button color="primary" onClick={handleResult}> <Icon>save</Icon>Guardar</Button>
                  </>
                }
              </GridItem>
            </GridContainer>
          </div>
        </Fade>
      </Modal>
    </>
  );
}