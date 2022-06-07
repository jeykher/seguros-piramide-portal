import React, {useEffect, useState} from 'react'
import { format } from 'date-fns'
import { useForm } from "react-hook-form"
import { makeStyles } from "@material-ui/core/styles"
import { useDialog } from "context/DialogContext"
import { getIdentification} from 'utils/utils'
import Icon from "@material-ui/core/Icon"
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Card from "components/material-dashboard-pro-react/components/Card/Card"
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import CardPanel from 'components/Core/Card/CardPanel'
import AlliesPersonalController from './AlliesPersonalController'
import IdentityAlliesController from './IdentityAlliesController'
import AddressController from 'components/Core/Controller/AddressController'
import CustomerContact from 'Portal/Views/Customer/CustomerContact'
import ConfigAlliesController from './ConfigAlliesController'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import useAlly from './UseAlly';
import ModalAddAreasAlly from './Modal/ModalAddAreasAlly'
import ModalShowProducts from './Modal/ModalShowProducts'
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import ModalAddProducts from './Modal/ModalAddProducts'

import styles from "./AlliesStyles"


const useStyles = makeStyles(styles)

const layoutProducts = [
  {
    CODAREA: '0004',
    PRODUCTS: [
      {
        CODPRODUCT: 'HCMI',
        DESCPROD: 'Descripcion',
      }
    ]
  },
  {
    CODAREA: '0002',
    PRODUCTS: [
      {
        CODPRODUCT: 'AUTI',
        DESCPROD: 'Descripcion AUTO'
      }
    ]
  }
]

export default function AlliesForm(props){

  const {
    handleStep, 
    handleSelectedAlly, 
    isReadonly, 
    selectedAlly, 
    isCreation, 
    levelAlly, 
    codSupervisor,
    handleIsNewAlly,
    isNewAlly,
    brokerSelected,
    codAlly,
    isUpdate,
    toUpdateAlly,
    handleIsCodPortal,
    handleCodAlly,
    handleLevelAlly,
    levelsAlly
  } = props
  const classes = useStyles()
  const { handleSubmit, ...objForm } = useForm();
  const { setValuesForm, getLabelAlly, resetFormAlly} = useAlly()
  const [showForm,setShowForm] = useState(true);
  const [listAreas,setListAreas] = useState([]);
  const [openModal,setOpenModal] = useState(false);
  const [listSelectedAreas,setListSelectedAreas] = useState(null)
  const [cleanForm,setCleanForm] = useState(true);
  const [identificationAlly,setIdentificationAlly] = useState(null)
  const [selectedArea,setSelectedArea] = useState(null)
  const dialog = useDialog()
  const index = 1;
  const [listProducts,setListProducts] = useState([]);
  const [listSelectedProducts,setListSelectedProducts] = useState({})
  const [openModalProducts,setOpenModalProducts] = useState(false)
  const [listPlanType,setListPlanType] = useState([])
  const [selectedListPlanType,setSelectedListPlanType] = useState({})
  const [listAsignedProducts,setListAsignedProducts] = useState([])
  const [listExistentAreas,setListExistentAreas] = useState(false)
  const [openModalAddProdToAreas,setOpenModalAddProdToAreas] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }

  const handleOpenModalProducts = () => {
    setOpenModalProducts(!openModalProducts)
  }

  const handleOpenModalAddProdToAreas = () => {
    setOpenModalAddProdToAreas(!openModalAddProdToAreas)
  }

  const handleListAsignedProducts = (value) => {
    setListAsignedProducts(value)
  }

  const handleIdentificationAlly = (typeId,numid,dvid) =>{
    setIdentificationAlly({
      typeId,
      numid,
      dvid
    })
  }

  const handleGetListSelectedAreas = () => {
    const dataList= objForm.getValues().p_areas_1;

    const listSelected = dataList.map(element => {
      return{
        CODAREA: element,
        COMISSION: 0,
        EFFECTIVE_DATE: format(new Date(), 'dd/MM/yyyy'),
        STATUS: 'ACT',
      }
    })
    setListSelectedAreas(listSelected);
  }


  const getAreaOfList = (valToFind) => {
    const data = listAreas.find(element => element.CODAREA === valToFind)
    return data.DESCRIPCION
  }



  const handleCleanForm = (value) => {
    setCleanForm(value);
  }


  const handleShowForm = (value) => {
    setShowForm(value);
  }

  const getValueDirection = (property) => {
    if(selectedAlly){
      return selectedAlly[`${property}`]
    }else if(toUpdateAlly){
      return toUpdateAlly[`${property}`]
    }else{
      return ''
    }
  }

  const addProductsToSelectedAreas = (listSelectedAreas) => {
    const result = listSelectedAreas.map(element => {
      return {
        ...element,
        LISTPROD: listSelectedProducts[element.CODAREA]
      }
    })
    return result
  }


  const checkSubmit = async (dataform) => {
    if(!isUpdate && listSelectedAreas === null){
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: 'Alerta',
          description: 'Debe registrar al menos un área' ,
        })
    }else{
      await onSubmit(dataform);
    }
  }

  const onSubmit = async (dataform) => {
    const formData = objForm.getValues();
    let numid = null
    let dvid = null
    if ((formData[`p_identification_type_${index}`]!==undefined && 
         formData[`p_identification_type_${index}`] !== "") && 
        (formData[`p_identification_number_${index}`]!==undefined && formData[`p_identification_number_${index}`] !== "")){
      [numid, dvid] = getIdentification(formData[`p_identification_type_${index}`], formData[`p_identification_number_${index}`])
    }
    const jsonRegister = {
      p_name_two_1: null,
      p_surname_one_1: null,
      p_surname_two_1: null,
      ...dataform,
      p_cod_local_phone_1: dataform.p_local_phone_1.substr(0,4),
      p_local_phone_1: dataform.p_local_phone_1.substr(4),
      p_cod_mobile_phone_1: dataform.p_mobile_phone_1.substr(0,4),
      p_mobile_phone_1: dataform.p_mobile_phone_1.substr(4),
      p_identification_d_1: `${dvid}`,
      p_identification_number_1: parseInt(numid),
      p_mobile_phone_complete: dataform.p_mobile_phone_1,
      p_payer_1: 'A'
    }
    let params = {
      p_level: levelAlly,
      p_cod_supervisor: codSupervisor,
      p_json_areas: null
    };
    if(!isUpdate){
      params = {
        ...params, 
        p_creation : isCreation,
        p_json_register: JSON.stringify(jsonRegister),
        p_json_areas: JSON.stringify(addProductsToSelectedAreas(listSelectedAreas))
      }
      
    }else{
      params = {
        ...params, 
        p_cod_ally: codAlly,
        p_json_update: JSON.stringify(jsonRegister)
      }
      if(listSelectedAreas !== null){
        params = {
          ...params,
          p_json_areas: JSON.stringify(addProductsToSelectedAreas(listSelectedAreas))
        }
      }
      if(listAsignedProducts !== null){
        params = {
          ...params,
          p_json_products: JSON.stringify(addProductsToSelectedAreas(listAsignedProducts))
        }
      }
    }
    if(brokerSelected !=null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    try{
      const {data} = await Axios.post(`/dbo/insurance_broker/${isUpdate ? 'update_ally' : 'register_ally'}`,params);
      if(!isUpdate){
        let reportParams = {
          p_level: levelAlly,
          p_cod_supervisor: codSupervisor,
          p_cod_ally: data.p_result.cod_ally
        }
        if(brokerSelected !=null){
          reportParams = { ...reportParams, p_insurance_broker_code: `${brokerSelected}`}
        }
        await Axios.post(`/dbo/insurance_broker/send_detail_report`,reportParams);
      }
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: `${isUpdate ? 'Notificación de Actualización' : 'Notificación de Registro'}`,
        description: data.p_result.result,
      })
      handleStep(0)
    }catch(error){
      console.log(error)
    }
  }


  const getAllAreas = async (params = null) => {
    if(params === null){
      let parameters = {
        p_cod_supervisor: codSupervisor,
        p_level: levelAlly
      }
      if(brokerSelected !== null){
        parameters = { ...parameters, p_insurance_broker_code: `${brokerSelected}`}
      }
      const { data } = await Axios.post('/dbo/insurance_broker/get_available_areas', parameters);
      setListAreas(data.p_cur_data);
    }else{
      const { data } = await Axios.post('/dbo/insurance_broker/get_available_areas_by_ally',params);
      setListAreas(data.p_cur_data);
    }
  }

  const handleGetListAllProducts = async (codArea) => {
    let params = {
      p_cod_supervisor: codSupervisor,
      p_level: levelAlly,
      p_cod_area: codArea
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const {data} = await Axios.post(`/dbo/insurance_broker/get_available_products`,params);
    setListProducts(data.p_cur_data)
    //Esta function setea el estado que maneja los productos en la lista
  }

  const getListProducts = async (codArea) => {
    let params = {
      p_cod_supervisor: codSupervisor,
      p_level: levelAlly,
      p_cod_area: codArea
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const {data} = await Axios.post(`/dbo/insurance_broker/get_available_products`,params);
    return data.p_cur_data
    //Esta function devuelve los productos en caso de no existir.
  }

  const handleGetPlanType = async (codArea) => {
    let params = {
      p_cod_supervisor: codSupervisor,
      p_level: levelAlly,
      p_cod_area: codArea
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const {data} = await Axios.post(`/dbo/insurance_broker/get_available_plan_types`,params);
    setListPlanType(data.p_cur_data)
  }

  const handleBack = () => {
    handleLevelAlly(1)
    handleStep(0)
  }

  const handleSaveProducts = (arrayProducts,codArea) => {
    const newListProduct = {
      ...listSelectedProducts,
      [codArea]: arrayProducts
    }
    setListSelectedProducts(newListProduct)
  }

  const handleSaveTypesPlan = (arrayTypePlan,codProd) => {
    const newListPlanType = {
      ...selectedListPlanType,
      [codProd]: arrayTypePlan
    }
    setSelectedListPlanType(newListPlanType)
  }

  const handleShowProducts = (codArea) => {
    setSelectedArea(codArea)
    handleOpenModalProducts();
  }

  //Logica para agregar productos a areas existentes
  //Funcion que trae las areas ya existentes.
  const getExistentAreasAlly = async () => {
    let params = {
      p_cod_ally: codAlly,
      p_cod_supervisor: codSupervisor,
      p_level: levelAlly,
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const { data } = await Axios.post('/dbo/insurance_broker/get_excluded_areas_by_ally',params);
    setListExistentAreas(data.p_cur_data);
  }



  useEffect(() => {
    if(selectedAlly){
      setValuesForm(selectedAlly, index, objForm)
      let params ={
        p_cod_ally: codAlly,
        p_cod_supervisor: codSupervisor,
        p_level: levelAlly,
      }
      if(brokerSelected !== null){
        params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
      }
      getAllAreas(params);
    }else{
      if(cleanForm === false){
        resetFormAlly(index,objForm,identificationAlly)
        handleCleanForm(true)
      }else{
        handleShowForm(true)
      }
      
    }
  },[selectedAlly,codAlly,cleanForm])

//Vuelve a mostrar el form
  useEffect(() => {
    
    if(selectedAlly && showForm === false){
      handleShowForm(true);
    }
  },[selectedAlly])

  useEffect(() => {
    
    if(toUpdateAlly && showForm === false){
      const formData = objForm.getValues();
      if(formData.p_sex_1){
        handleShowForm(true)
      }
    }
  },[toUpdateAlly,objForm])



  useEffect(() => {
    getAllAreas();
  },[])

  useEffect(() => {
    if(toUpdateAlly){
      handleShowForm(false)
      let params ={
        p_cod_ally: codAlly,
        p_cod_supervisor: codSupervisor,
        p_level: levelAlly,
      }
      if(brokerSelected !== null){
        params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
      }
      getAllAreas(params);
      setValuesForm(toUpdateAlly, index, objForm)
    }
  },[toUpdateAlly])

  return(
    <>
    <GridContainer>
      <GridItem item xs={12} sm={12} md={12} lg={12}>
        <Card>
          <CardHeader color="primary"  className="text-center">
            <h5>{`${isUpdate ? 'Editar' : 'Agregar' } ${getLabelAlly(levelAlly,levelsAlly)}`}</h5>
          </CardHeader>
          <CardBody>
          { showForm &&
            <form onSubmit={handleSubmit(checkSubmit)} noValidate autoComplete="off" className={classes.root}>
              <GridItem item xs={12} sm={12} md={12} lg={12}>
              <CardPanel titulo="Identificación" icon="list" iconColor="info">
                <IdentityAlliesController 
                  handleStep={handleStep} 
                  objForm={objForm} 
                  index={index} 
                  handleSelectedAlly={handleSelectedAlly}
                  handleShowForm={handleShowForm}
                  handleIsNewAlly={handleIsNewAlly}
                  brokerSelected={brokerSelected}
                  codAlly={codAlly}
                  handleIsCodPortal={handleIsCodPortal}
                  handleCodAlly={handleCodAlly}
                  levelAlly={levelAlly}
                  codSupervisor={codSupervisor}
                  isUpdate={isUpdate}
                  handleCleanForm={handleCleanForm}
                  handleIdentificationAlly={handleIdentificationAlly}
                  handleLevelAlly={handleLevelAlly}
                  />
              </CardPanel>
              </GridItem>
                  <GridItem item xs={12} sm={12} md={12} lg={12}>
                    <CardPanel titulo="Datos personales" icon="perm_identity" iconColor="primary">
                      <AlliesPersonalController 
                        index={index} 
                        objForm={objForm} 
                        readonly={isReadonly}
                        isUpdate={isUpdate}
                        isNewAlly={isNewAlly}
                      />
                    </CardPanel>
                  </GridItem>
                  <GridItem item xs={12} sm={12} md={12} lg={12}>
                    <CardPanel titulo="Dirección" icon="location_on" iconColor="success" >
                      <AddressController
                        index={index}
                        objForm={objForm}
                        showCountry={true}
                        showUrbanization={true}
                        showDetails={true}
                        readOnly={isReadonly}
                        countryId={getValueDirection('CODPAIS')}
                        estateId={getValueDirection('CODESTADO')}
                        cityId={getValueDirection('CODCIUDAD')}
                        municipalityId={getValueDirection('CODMUNICIPIO')}
                        urbanizationId={getValueDirection('CODURBANIZACION')}
                      />
                    </CardPanel>
                  </GridItem>
                  <GridItem item xs={12} sm={12} md={12} lg={12}>
                    <CardPanel titulo="Datos de Contacto" icon="phone" iconColor="warning" >
                      <CustomerContact objForm={objForm} index={index} readOnly={isReadonly} />
                    </CardPanel>
                  </GridItem>
                  <GridItem item xs={12} sm={12} md={12} lg={12}>
                    <CardPanel titulo="Configuración" icon="build_circle" iconColor="rose" >
                      <ConfigAlliesController
                        objForm={objForm} 
                        index={index} 
                        handleOpenModal={handleOpenModal}
                        isUpdate={isUpdate}
                        handleOpenModalProducts={handleOpenModalAddProdToAreas}
                      />
                      {
                        listSelectedAreas &&
                        <GridContainer justify="center" alignItems="center">
                          <GridItem xs={12} md={8}>
                            <h4 style={{textAlign: 'center'}}>Areas a asignar:</h4>
                          </GridItem>
                          <GridItem xs={12} md={8}>
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
                                  render: rowData => (<span>{getAreaOfList(rowData.CODAREA)}</span>)
                                },
                                { 
                                  title: "Comisión",
                                  field: "COMISSION", 
                                  headerStyle: {textAlign: 'center'},
                                  render: rowData => (<span>{`${rowData.COMISSION}%`}</span>)
                                },
                                { 
                                  title: "Fecha Efectiva", 
                                  field: "EFFECTIVE_DATE", 
                                  headerStyle: {textAlign: 'center'}
                                },
                                { 
                                  title: "Estatus", 
                                  field: "STATUS", 
                                  headerStyle: {textAlign: 'center'},
                                  render: rowData => (<span>{`${rowData.STATUS === 'ACT' ? 'Activo' : 'Suspendido'}`}</span>)
                                },
                              ]}
                              actions={[
                                (rowData) => ({
                                  icon: 'list',
                                  tooltip: `Ver productos`,
                                  iconProps:{
                                    style:{
                                      fontSize: 24,
                                      color: 'Maroon',
                                      textAlign: 'center',
                                      margin: '0 0.5em'
                                    }
                                  },
                                  onClick: (event, rowData) => handleShowProducts(rowData.CODAREA)
                                })
                              ]}
                            />
                          </GridItem>
                        </GridContainer>
                      }
                      {
                        listAsignedProducts.length > 0 &&
                        <GridContainer justify="center" alignItems="center">
                          <GridItem xs={12} md={8}>
                            <h4 style={{textAlign: 'center'}}>Productos a asignar:</h4>
                          </GridItem>
                          <GridItem xs={12} md={8}>
                            <TableMaterial
                              data={listAsignedProducts}
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
                                  headerStyle: {textAlign: 'center'},
                                  render: rowData => (<span>{rowData.DESCAREA}</span>)
                                },
                                { 
                                  title: "Productos", 
                                  headerStyle: {textAlign: 'center'},
                                  render: rowData => {
                                    const filteredNames = rowData.PRODUCTS.map(element => element.DESCPROD);

                                    return(
                                      <span>{filteredNames.toString()}</span>
                                    )
                                  }
                                },
                              ]}
                              editable={{
                                onRowDelete: oldData =>
                                new Promise((resolve, reject) => {
                                  setTimeout(() => {
                                    const dataDelete = [...listAsignedProducts];
                                    const index = oldData.tableData.id;
                                    dataDelete.splice(index, 1);
                                    setListAsignedProducts([...dataDelete])
                                    resolve()
                                  }, 300)
                                })
                            }}
                            icons={{
                              Delete: () => (<Icon color="primary">delete_outline</Icon>)
                            }}
                            />
                          </GridItem>
                        </GridContainer>
                      }
                    </CardPanel>
                  </GridItem>
              <GridContainer justify="center" alignItems="center">
                <Button onClick={handleBack}> <Icon>fast_rewind</Icon>Volver</Button>
                <Button color="primary" type="submit"> <Icon>save</Icon>{isUpdate ? 'Actualizar': 'Guardar'}</Button>
                
              </GridContainer>
            </form>
            }
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
    <ModalAddAreasAlly
      open={openModal}
      handleClose={handleOpenModal}
      listAreas={listAreas}
      objForm={objForm}
      index={index}
      listSelectedAreas={listSelectedAreas}
      handleGetListSelectedAreas={handleGetListSelectedAreas}
      handleGetListAllProducts={handleGetListAllProducts}
      setListSelectedAreas={setListSelectedAreas}
      getAreaOfList={getAreaOfList}
      listProducts={listProducts}
      handleSaveProducts={handleSaveProducts}
      handleSaveTypesPlan={handleSaveTypesPlan}
      listPlanType={listPlanType}
      handleGetPlanType={handleGetPlanType}
      listSelectedProducts={listSelectedProducts}
      setSelectedListPlanType={setSelectedListPlanType}
      setListSelectedProducts={setListSelectedProducts}
      getListProducts={getListProducts}
      selectedListPlanType={selectedListPlanType}
      codSupervisor={codSupervisor}
      levelAlly={levelAlly}
      brokerSelected={brokerSelected}
    />
    <ModalShowProducts
      open={openModalProducts}
      handleClose={handleOpenModalProducts}
      listSelectedProducts={listSelectedProducts}
      selectedListPlanType={selectedListPlanType}
      selectedArea={selectedArea}
      codSupervisor={codSupervisor}
      levelAlly={levelAlly}
      brokerSelected={brokerSelected}
    />
    {
      openModalAddProdToAreas &&
      <ModalAddProducts
        open={openModalAddProdToAreas}
        handleClose={handleOpenModalAddProdToAreas}
        getExistentAreasAlly={getExistentAreasAlly}
        listAreas={listExistentAreas}
        codAlly={codAlly}
        brokerSelected={brokerSelected}
        handleListAsignedProducts={handleListAsignedProducts}
        listAsignedProducts={listAsignedProducts}
        codSupervisor={codSupervisor}
        levelAlly={levelAlly}
      />
    }
    </>
  )
}