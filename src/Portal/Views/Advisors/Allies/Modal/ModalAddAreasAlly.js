import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Icon from "@material-ui/core/Icon"
import SelectMultipleChipController from 'components/Core/Controller/SelectMultipleChipController'
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import AmountFormatInput from 'components/Core/NumberFormat/AmountFormatInput'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import SelectSimple from 'components/Core/SelectSimple/SelectSimple'
import DateMaterialPicker from 'components/Core/Datetime/DateMaterialPicker'
import { format } from 'date-fns'
import { useDialog } from "context/DialogContext"
import Axios from 'axios'

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
    width: "52%",
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

const listStatus = [
  {value: 'ACT', label: 'Activo'}
]

export default function ModalAddAreasAlly(props) {
  const { 
    open, 
    handleClose,
    listAreas, 
    objForm, 
    index, 
    listSelectedAreas, 
    handleGetListSelectedAreas,
    setListSelectedAreas,
    getAreaOfList,
    handleGetListAllProducts,
    listProducts,
    handleSaveProducts,
    handleSaveTypesPlan,
    listPlanType,
    handleGetPlanType,
    listSelectedProducts,
    setSelectedListPlanType,
    setListSelectedProducts,
    getListProducts,
    selectedListPlanType,
    codSupervisor,
    levelAlly,
    brokerSelected
    } = props;


  const classes = useStyles();
  const dialog = useDialog()
  const [step, setStep] = useState(0);
  const [isSaving,setIsSaving] = useState(false);
  const [selectedArea,setSelectedArea] = useState(null);
  const [isAdditionalLevel,setIsAdditionalLevel] = useState(false)
  const [selectedProduct,setSelectedProduct] = useState(null)


  const handleList = () => {
    handleGetListSelectedAreas();
    handleStep(1)
  }

  const resetAreas = () => {
    setListSelectedAreas([])
    setSelectedListPlanType({})
    setListSelectedProducts({})
    handleStep(0)
  }

  const resetProducts = () => {
    handleStep(1)
  }

  const handleGetProducts = (codArea) => {
    handleGetListAllProducts(codArea)
    handleStep(2)
    handleSelectedArea(codArea)
  }

  const handleSelectedArea = (value) => {
    setSelectedArea(value)
  }
  const handleStep = (value) => {
    setStep(value);
  }

  const checkTitles = () => {
    let title;
    switch(step){
      case 0:
        title = 'Áreas a seleccionar:'
        break;
      case 1: 
        title = 'Áreas a editar % de comisión:'
        break;
      case 2: 
      title = 'Productos a Seleccionar'
      break;
      default:
      title = 'Áreas a seleccionar:'
    }
    return title
  }




  const validateSaveRegister = async () => {
    if(isSaving !== false){
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: 'Alerta',
        description: 'Debe guardar el registro insertado antes de confirmar',
      })
      setIsSaving(false);
    }else{
      const validAreas = validatePercentAreas();
      await validateProducts();
      if(validAreas === true){
        handleClose();
      }
    }
  }

  const validatePercentAreas = () => {
    let valueResult = false;
    if(listSelectedAreas !== null){
      const isChanged = listSelectedAreas.some(element => element.COMISSION === 0);
      if(isChanged === true){
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: 'Alerta',
          description: 'Debe registrar los % de comisión antes de confirmar',
        })
        valueResult = false
      }else{
        valueResult = true;
      }
    }
    return valueResult
  }

  const validateProducts = async () => {
    let resultProducts = {};
    let filteredProducts = [];
    let filteredTypePlans = {};
    for(let i = 0; i < listSelectedAreas.length; i++){
      filteredProducts = []
      const codArea = listSelectedAreas[i].CODAREA
      const value = listSelectedProducts[codArea]
      let params = {
        p_cod_supervisor: codSupervisor,
        p_level: levelAlly,
        p_cod_area: codArea
      }
      if(brokerSelected !== null){
        params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
      }
      if(value === undefined){
        const products = await getListProducts(codArea)
        for(let j = 0; j < products.length; j++){
            if(products[j].NIVELADICIONAL !== 'N'){
              const dataPlan = await Axios.post(`/dbo/insurance_broker/get_available_plan_types`,params);
              const typePlans = dataPlan.data.p_cur_data.map(element => { return {CODTPLAN: element.CODLVAL }})
              filteredProducts.push({
                CODPROD: products[j].CODPROD,
                HASTYPEPLAN: 'Y',
                LISTPLANS: typePlans
              })
              filteredTypePlans = {
                ...filteredTypePlans,
                [products[j].CODPROD]: typePlans
              }
            }else{
              filteredProducts.push({
                CODPROD: products[j].CODPROD,
                HASTYPEPLAN: 'N'
              })
            }
        }
        resultProducts = {
          ...resultProducts,
          [codArea]: filteredProducts
        }
      }
  }
  const resultAllProducts = {
      ...listSelectedProducts,
      ...resultProducts
  }
  const resultAllTypePlans = {
    ...selectedListPlanType,
    ...filteredTypePlans
  }
  setListSelectedProducts(resultAllProducts)
  setSelectedListPlanType(resultAllTypePlans)
}

  const saveProducts = () => {
    const formData = objForm.getValues();
    const products = formData[`p_products_${index}`]
    const formatedProducts  = products.map(element => {
      return{
        CODPROD: element,
        HASTYPEPLAN: 'N'
      }
    })
    handleStep(1);
    handleSaveProducts(formatedProducts,selectedArea)
  }

  const saveProductsAndTypePlans = () => {
    const formData = objForm.getValues();
    const planTypes = formData[`p_plan_types_${index}`]
    const formatedPlanTypes  = planTypes.map(element => {
      return{
        CODTPLAN: element
      }
    })
    const formatedProducts = [
      {
        CODPROD:selectedProduct,
        HASTYPEPLAN: 'Y',
        LISTPLANS: formatedPlanTypes
      }
    ]
    handleSaveTypesPlan(formatedPlanTypes,selectedProduct)
    handleSaveProducts(formatedProducts,selectedArea)
    handleStep(1);
    
  }

  useEffect(() => {
    if(listProducts){
      const result = listProducts.some(element => element.NIVELADICIONAL !== 'N')
      setIsAdditionalLevel(result)
    }
  },[listProducts])

  useEffect(() => {
    if(selectedProduct){
      handleGetPlanType(selectedArea)
    }
  },[selectedProduct])


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
              <h3 className={classes.title}>
                {
                  checkTitles()
                }
              </h3>
            </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={12} className={classes.modal}>
              <GridContainer className={classes.modal}>
                <>
                {
                  step === 0 && 
                  <GridItem xs={12} md={6} className={classes.containerSwitch}>
                {
                  listAreas &&
                  <SelectMultipleChipController
                    objForm={objForm}
                    arrayValues={listAreas}
                    label="Areas a seleccionar: "
                    name={`p_areas_${index}`}
                    required={false}
                    descrip="DESCRIPCION"
                    idvalue="CODAREA"
                  />
                }
                </GridItem>
                }                
                {
                  step === 1 && listSelectedAreas &&
                  <GridItem xs={12} className={classes.containerTable}>
                  <TableMaterial
                    data={listSelectedAreas}
                    options={{
                      search: false,
                      toolbar: false,
                      sorting: false,
                      pageSize: 5,
                      cellStyle: {textAlign: 'center'},
                      draggable: false,
                      paging: false
                    }}
                    columns={[
                      { 
                        title: "Área",
                        field: "CODAREA",
                        headerStyle: {textAlign: 'center'},
                        render: rowData => (<span>{getAreaOfList(rowData.CODAREA)}</span>),
                        editComponent: ({value,onChange}) => (
                          <SelectSimple
                          id="1"
                          value={value}
                          onChange={onChange}
                          array={listAreas}
                          disabled
                          classNameForm={classes.containerSelect}
                        />
                        )
                      },
                      { 
                        title: "Comisión",
                        field: "COMISSION", 
                        headerStyle: {textAlign: 'center'},
                        render: rowData => (<span>{`${rowData.COMISSION}%`}</span>),
                        editComponent:  ({value,onChange}) => (
                          <AmountFormatInput 
                            name={"COMISSION"}
                            isAllowed={(values) => {
                              const {floatValue} = values;
                              return floatValue >= 0 &&  floatValue <= 100;
                            }} 
                            value={value}
                            onChange={onChange}
                          />
                        )
                      },
                      { 
                        title: "Fecha Efectiva", 
                        field: "EFFECTIVE_DATE", 
                        headerStyle: {textAlign: 'center'},
                        editComponent: ({value,onChange}) => (
                          <DateMaterialPicker 
                            name={"EFFECTIVE_DATE"} 
                            auxiliarValue={value}
                            onChange={onChange}
                            disablePast
                            invalidDateMessage='Fecha no reconocida, por favor utilizar dd/mm/yyyy'
                            minDateMessage='La fecha no puede menor al día de hoy'
                          />
                      )
                      },
                      { 
                        title: "Estatus", 
                        field: "STATUS", 
                        headerStyle: {textAlign: 'center'},
                        render: rowData => (<span>{`${rowData.STATUS === 'ACT' ? 'Activo' : 'Suspendido'}`}</span>),
                        editComponent: ({value,onChange}) => (
                          <SelectSimple
                          id="2"
                          value={value}
                          onChange={onChange}
                          array={listStatus}
                          disabled
                        />
                        )
                      },
                    ]}
                    editable={{
                      onRowUpdate: (newData, oldData) =>
                          new Promise((resolve, reject) => {
                              try {
                                let data = [...listSelectedAreas];
                                const newRow = {
                                  ...newData,
                                  EFFECTIVE_DATE:format(new Date(newData.EFFECTIVE_DATE), 'dd/MM/yyyy'),
                                  COMISSION: parseFloat(newData.COMISSION)
                                }
                                const index = data.indexOf(oldData);
                                data[index] = newRow;
                                setListSelectedAreas(data)
                                  resolve()
                              } catch (error) {
                                  reject()
                              }
                          }),
                      onRowDelete: oldData =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          const dataDelete = [...listSelectedAreas];
                          const index = oldData.tableData.id;
                          dataDelete.splice(index, 1);
                          setListSelectedAreas([...dataDelete])
                          resolve()
                        }, 300)
                      })
                  }}
                  icons={{
                    Clear: () => (<Icon color="primary">clear</Icon>),
                    Check: () => (<Icon onClick={() => setIsSaving(false)} color="primary">check</Icon>),
                    Edit: () => (<Icon onClick={() => setIsSaving(true)} color="primary">edit</Icon>),
                    Delete: () => (<Icon color="primary">delete_outline</Icon>)
                  }}
                  actions={[
                    () => ({
                      icon: 'list',
                      tooltip: 'Detallar Productos',
                      iconProps:{
                        style:{
                          fontSize: 24,
                          color: 'Maroon',
                          textAlign: 'center',
                          margin: '0 0.5em'
                        }
                      },
                      onClick: (event, rowData) => handleGetProducts(rowData.CODAREA)
                    })
                  ]}
                  />
                </GridItem>
                }
                {
                  step === 2 && 
                  <GridItem xs={12} md={6} className={classes.containerSwitch}>
                {
                  listProducts &&
                  <>
                  {isAdditionalLevel === true ? 
                    <>
                      <SelectSimple
                      id="1"
                      onChange={(e) => setSelectedProduct(e)}
                      array={listProducts}
                      label="Productos"
                      value={selectedProduct}
                      classNameForm={classes.containerSelect}
                      />
                      {
                        selectedProduct && 
                        <SelectMultipleChipController
                        objForm={objForm}
                        arrayValues={listPlanType}
                        label="Tipos de planes a seleccionar:"
                        name={`p_plan_types_${index}`}
                        required={false}
                        descrip="DESCRIP"
                        idvalue="CODLVAL"
                      />
                      }
                    </>
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
                </>
              </GridContainer>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={12} className={classes.modal}>
              
                
                {
                  step === 0 && <>
                  <Button  onClick={handleClose}> <Icon>fast_rewind</Icon>Cerrar</Button>
                  <Button color="primary" onClick={handleList}> <Icon>fast_forward</Icon>Siguiente</Button>
                  </>
                }
                {
                  step === 1 && <>
                  <Button  onClick={resetAreas}> <Icon>fast_rewind</Icon>Volver</Button>
                  <Button color="primary" onClick={validateSaveRegister}> <Icon>save</Icon>Confirmar</Button>
                  </>
                }
                {
                  step === 2 && <>
                  <Button  onClick={resetProducts}> <Icon>fast_rewind</Icon>Volver</Button>
                  <Button color="primary" onClick={isAdditionalLevel ? saveProductsAndTypePlans : saveProducts}> <Icon>save</Icon>Guardar</Button>
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
