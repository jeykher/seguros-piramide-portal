import React, { useState, useEffect} from "react"
import Axios from 'axios'
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import { makeStyles } from "@material-ui/core/styles"
import { useDialog } from "context/DialogContext"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import Switch from 'components/Core/Switch/Switch'
import AlliesSubTable from './AlliesSubTable'
import ConfirmDialog from './Dialogs/ConfirmDialog'
import ReasonDialog from './Dialogs/ReasonDialog'
import ModalEditAreasAlly from './Modal/ModalEditAreasAlly'
import ModalEditComisionAlly from './Modal/ModalEditComisionAlly'
import useAlly from './UseAlly';
import styles from "./AlliesStyles"

const useStyles = makeStyles(styles)


export default function VendorsTable(props) {

  const {
    alliesData,
    setCreationSubAlly, 
    getAllAllies,
    brokerSelected,
    setUpdateAlly,
    getRequiremntsAlly,
    isBroker,
    getDetailAlly,
    levelsAlly
  } = props;
  
  const classes = useStyles();
  const dialog = useDialog()
  const [showModalEditAreas,setShowModalEditAreas] = useState(false);
  const [showModalEditComission,setShowModalEditComission] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog ] = useState(false)
  const [openReasonDialog, setOpenReasonDialog ] = useState(false)
  const [arrayReason, setArrayReason] = useState('')
  const [selectedRow,setSelectedRow] = useState();
  const [typeStatus,setTypeStatus] = useState(null);
  const [dataAreas,setDataAreas] = useState();
  const [isActivate,setIsActivate] = useState(false);
  const { getLabelAlly,checkLevelAlly} = useAlly()


  const handleDataAreas = (value) => {
    setDataAreas(value);
  }


  const handleTypeStatus = (value) => {
    setTypeStatus(value)
  }

  const handleSelectedRow = (value) => {
    setSelectedRow(value)
  }

  const getAreasAlly = (value) => {
    handleshowModalEditAreas()
    handleSelectedRow(value)
  }

  const handleshowModalEditAreas = () => {
    setShowModalEditAreas(!showModalEditAreas)
  }

  const handleshowModalEditComission = () => {
    setShowModalEditComission(!showModalEditComission)
  }

  const getComissionsAlly = (value) =>{
    handleshowModalEditComission();
    handleSelectedRow(value)
  }

  const handleOpenConfirmDialog = (value) => {
    setOpenConfirmDialog(value)
  }

  const handleOpenReasonDialog = (value) => {
    setOpenReasonDialog(value)
    value !== true && handleOpenConfirmDialog(true)
  }

  const handleIsActivate = (value) => {
    setIsActivate(value)
  }

  const onCloseConfirm = () =>{
    setOpenConfirmDialog(false);
  }
  
  const onCloseReason = () => {
    setOpenReasonDialog(false);
  }

  const getReasonList = async (codLval) => {
    const params = { p_list_code: codLval }
    const result = await Axios.post('/dbo/toolkit/get_values_list', params)
    setArrayReason(result.data.p_cursor)
  }

  const handleAddReasonAlly = (value) => {
    handleSelectedRow({
      ...selectedRow,
      p_cod_lval: value.p_cod_lval,
      p_observation: value.p_observation
    })
  }

  const handleStatusAlly = async (rowElement) => {
    const statusRow = rowElement.STATUS === 'ACT' ? true : false;
    handleTypeStatus(1)
    handleSelectedRow(rowElement)
    if(statusRow === true){
      handleIsActivate(false)
      isBroker ? getReasonList('MTVOSAL') : getReasonList('MTVOSAL2')
      handleOpenReasonDialog(true) 
    }else{
      handleIsActivate(true)
      handleOpenConfirmDialog(true)
    }
  }

  const handleActivateAlly = async () => {
    let params = {
      p_cod_ally: selectedRow.CODALIADO,
      p_cod_supervisor: selectedRow.CODSUPERVISOR, 
      p_level: selectedRow.NIVEL,
      p_is_employee: 'N',
      p_portal_ally_id:selectedRow.PORTAL_USER_ID
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    try{
      selectedRow.CODSUPERVISOR !== null && await Axios.post(`/dbo/insurance_broker/validate_status_supervisor`,params);
      const { data } = await Axios.post(`/dbo/insurance_broker/activate_ally`,params);
       dialog({
         variant: "info",
         title: "Notificación",
         description: data.p_result.result,
       })
     await getAllAllies();
   }catch(error){
     console.log(error)
   }
  }

  const handleSuspendAlly = async () => {
    const toParams = {
      p_cod_ally: selectedRow.CODALIADO,
      p_cod_supervisor: selectedRow.CODSUPERVISOR, 
      p_level: selectedRow.NIVEL,
      p_cod_lval: selectedRow.p_cod_lval,
      p_observation: selectedRow.p_observation,
      p_is_employee: 'N',
      p_portal_ally_id:selectedRow.PORTAL_USER_ID
    }
    let params = {
      p_json_params: JSON.stringify(toParams)
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    try{
      const { data } = await Axios.post(`/dbo/insurance_broker/suspend_ally`,params);
      dialog({
        variant: "info",
        title: "Notificación",
        description: data.p_result.result,
      })
    }catch(error){
      console.log(error)
    }

    await getAllAllies();
  }


  const handleStatusAreaAlly = async (rowElement) => {
    const statusRow = rowElement.STATUSAREA === 'ACT' ? true : false;
    handleSelectedRow({...selectedRow, ...rowElement});
    handleTypeStatus(2)
    if(statusRow === true){
        handleIsActivate(false)
        getReasonList('MTVOSAR');
        handleOpenReasonDialog(true)
    }else{
        handleIsActivate(true)
        handleOpenConfirmDialog(true)
      
    }
  }

  const handleSuspendAreaAlly = async () => {
    const toParams = {
      p_cod_ally: selectedRow.CODALIADO,
      p_cod_supervisor: selectedRow.CODSUPERVISOR, 
      p_level: selectedRow.NIVEL,
      p_cod_area: selectedRow.CODAREA,
      p_cod_lval: selectedRow.p_cod_lval,
      p_observation: selectedRow.p_observation,
    }
    let params = {
      p_json_params: JSON.stringify(toParams)
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const { data } = await Axios.post(`/dbo/insurance_broker/suspend_area_ally`,params);
    dialog({
      variant: "info",
      title: "Notificación",
      description: data.p_result.result,
    })
    await getAllAreasAlly();
    await getAllAllies();
  }


  const handleActivateAreaAlly = async () => {
    let params = {
      p_cod_ally: selectedRow.CODALIADO,
      p_cod_supervisor: selectedRow.CODSUPERVISOR, 
      p_level: selectedRow.NIVEL,
      p_cod_area: selectedRow.CODAREA
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    try{
      const { data } = await Axios.post(`/dbo/insurance_broker/activate_area_ally`,params);
       dialog({
         variant: "info",
         title: "Notificación",
         description: data.p_result.result,
       })
     await getAllAreasAlly();
     await getAllAllies();
   }catch(error){
     console.log(error)
   }
  }

  const getAllAreasAlly = async () => {
    let params = {
      p_cod_ally: selectedRow.CODALIADO,
      p_cod_supervisor: selectedRow.CODSUPERVISOR,
      p_level: selectedRow.NIVEL
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const result2 = await Axios.post('/dbo/insurance_broker/get_areas_by_ally_i',params);
    const filtered = JSON.parse(result2.data.p_json_result);
    console.log(filtered)
    handleDataAreas(filtered)
  }

  const getReportAlly = async (rowElement) =>{
    let params = {
      p_cod_ally: rowElement.CODALIADO,
      p_cod_supervisor: rowElement.CODSUPERVISOR,
      p_level: rowElement.NIVEL
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const { data } = await Axios.post(`/dbo/insurance_broker/get_detail_report_ally`,params);
    window.open(data.p_url,"_blank");
  }

  const handleSuspendProduct = async (codProd,codArea) => {
    const toParams = {
      p_cod_ally: selectedRow.CODALIADO,
      p_cod_area: codArea,
      p_cod_prod: codProd,
      p_level: selectedRow.NIVEL

    }
    let params = {
      p_json_params: JSON.stringify(toParams)
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    try{
      const { data } = await Axios.post(`/dbo/insurance_broker/suspend_product_by_area_ally`,params);
    dialog({
      variant: "info",
      title: "Notificación",
      description: data.p_result.result,
    })
    await getAllAreasAlly()
    }catch(error){
      console.log(error)
    }
    
  }


  const handleActivateProduct = async (codProd,codArea) => {
    let params = {
      p_cod_ally: selectedRow.CODALIADO,
      p_cod_area: codArea,
      p_cod_prod: codProd,
      p_level: selectedRow.NIVEL
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    try{
      const { data } = await Axios.post(`/dbo/insurance_broker/activate_product_ally`,params);
       dialog({
         variant: "info",
         title: "Notificación",
         description: data.p_result.result,
       })
       await getAllAreasAlly();
   }catch(error){
     console.log(error)
   }
  }

  const handleStatusProduct = (rowElement,codArea) => {
    const statusRow = rowElement.STSPRODUCTO === 'ACT' ? true : false;
    if(statusRow){
      handleSuspendProduct(rowElement.CODPROD,codArea)
    }else{
      handleActivateProduct(rowElement.CODPROD,codArea)
    }
  }

  const handleSuspendTypePlan = async (codPlanType,codArea) => {
    const toParams = {
      p_cod_ally: selectedRow.CODALIADO,
      p_cod_area: codArea,
      p_cod_plan_type: codPlanType,
      p_level: selectedRow.NIVEL

    }
    let params = {
      p_json_params: JSON.stringify(toParams)
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    try{
      const { data } = await Axios.post(`/dbo/insurance_broker/suspend_plantype_by_area_ally`,params);
    dialog({
      variant: "info",
      title: "Notificación",
      description: data.p_result.result,
    })
    await getAllAreasAlly();
    }catch(error){
      console.log(error)
    }
    
  }


  const handleActivateTypePlan = async (codPlanType,codArea) => {
    let params = {
      p_cod_ally: selectedRow.CODALIADO,
      p_cod_area: codArea,
      p_cod_plan_type: codPlanType,
      p_level: selectedRow.NIVEL
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    try{
      const { data } = await Axios.post(`/dbo/insurance_broker/activate_plantype_ally`,params);
       dialog({
         variant: "info",
         title: "Notificación",
         description: data.p_result.result,
       })
       await getAllAreasAlly();
   }catch(error){
     console.log(error)
   }
  }

  const handleStatusTypePlan = (rowElement,codArea) => {
    const statusRow = rowElement.STSTIPOPLAN === 'ACT' ? true : false;
    if(statusRow){
      handleSuspendTypePlan(rowElement.INDTIPOPLAN,codArea)
    }else{
      handleActivateTypePlan(rowElement.INDTIPOPLAN,codArea)
    }
  }

  return (
    <>
    <TableMaterial
      options={{
        search: true,
        toolbar: true,
        sorting: false,
        pageSize: 5,
        actionsColumnIndex: -1,
        cellStyle: {textAlign: 'center'},
        draggable: false
      }}
      data={alliesData}
      localization={{
        header: {
            actions: 'Acciones'
        },
        body: {
          emptyDataSourceMessage: 'Sin resultados para mostrar',
        },
        pagination: {
          labelRowsSelect: 'Filas',
          firstTooltip: 'Primera página',
          previousTooltip: 'Página anterior',
          nextTooltip: 'Página siguiente',
          lastTooltip: 'Última página',
          labelDisplayedRows: '{from}-{to} de {count}',
      },
      toolbar: {
          searchPlaceholder: 'Buscar',
          searchTooltip: 'Buscar'
      },
      }}
      columns={[
        { 
          title: "Cód. Usuario",
          field: "PORTAL_USERNAME",
          headerStyle: {textAlign: 'center'} 
        },
        { 
          title: "Cédula",
          field: "CEDULA", 
          headerStyle: {textAlign: 'center'} 
        },
        { 
          title: "Nivel", 
          field: "DESCRIPCIONNIVEL", 
          headerStyle: {textAlign: 'center'} 
        },
        { 
          title: "Áreas", 
          field: "AREAS", 
          headerStyle: {textAlign: 'center'},
          render: (rowData) => <span>{rowData.AREAS}</span>
        },
        { 
          title: "Nombre", 
          field: "NOMBRE", 
          headerStyle: {textAlign: 'center'} 
        },
        {
          title: "Estatus", 
          field: "STATUS", 
          cellStyle: { textAlign: "center" },
          headerStyle: { textAlign: 'center'}, 
          render: (rowData) => {
            return (
              <Tooltip title={`Activar o suspender ${rowData.DESCRIPCIONNIVEL.toLowerCase()}`} placement="right-start" arrow >
                 <IconButton onClick={() => handleStatusAlly(rowData)}>
                  <Switch 
                    size="small" 
                    checked={rowData.STATUS === 'ACT'}
                    name={'STATUS'}
                  />
                 </IconButton>
              </Tooltip>
            )
          },
        },
      ]}
      actions={[
        (rowData) => ({
        icon: 'edit',
        disabled: rowData.STATUS !== 'ACT',
        tooltip: `Editar ${rowData.DESCRIPCIONNIVEL.toLowerCase()}`,
        iconProps:{
          style:{
            fontSize: 24,
            color: rowData.STATUS === 'ACT'  ? 'Chocolate' : 'disabled',
            textAlign: 'center',
            margin: '0 0.5em'
          }
        },
        onClick: (event, rowData) => setUpdateAlly(rowData)
        }),
        () => ({
          icon: 'contacts',
          tooltip: 'Ver detalle',
          iconProps:{
            style:{
              fontSize: 24,
              color: 'Maroon',
              textAlign: 'center',
              margin: '0 0.5em'
            }
          },
          onClick: (event, rowData) => getDetailAlly(rowData)
        }),
        () => ({
          icon: 'assignment',
          tooltip: 'Ver Requisitos',
          iconProps:{
            style:{
              fontSize: 24,
              color: 'black',
              textAlign: 'center',
              margin: '0 0.5em'
            }
          },
          onClick: (event, rowData) => getRequiremntsAlly(rowData)
        }),
        () => ({
          icon: 'find_in_page',
          tooltip: 'Ver Ficha',
          iconProps:{
            style:{
              fontSize: 24,
              color: 'red',
              textAlign: 'center',
              margin: '0 0.5em'
            }
          },
          onClick: (event, rowData) => getReportAlly(rowData)
        }),
        (rowData) => ({
          icon: 'ballot',
          tooltip: 'Editar áreas',
          hidden: isBroker === false,
          disabled: rowData.STATUS !== 'ACT',
          iconProps:{
            style:{
              fontSize: 24,
              color: rowData.STATUS === 'ACT' ? 'green' : 'disabled',
              textAlign: 'center',
              margin: '0 0.5em'
            }
          },
          onClick: (event, rowData) => getAreasAlly(rowData)
        }),
        (rowData) => ({
          icon: 'list',
          tooltip: 'Editar comisiones',
          hidden: isBroker === false,
          disabled: rowData.STATUS !== 'ACT',
          iconProps:{
            style:{
              fontSize: 24,
              color: rowData.STATUS === 'ACT' ? 'black' : 'disabled',
              textAlign: 'center',
              margin: '0 0.5em'
            }
          },
          onClick: (event, rowData) => getComissionsAlly(rowData)
        }),
        (rowData) => ({
          icon: 'person_add_alt_1',
          disabled: rowData.STATUS !== 'ACT',
          hidden: checkLevelAlly(rowData.PROXIMONIVEL, levelsAlly) === false,
          tooltip: `Agregar ${getLabelAlly(rowData.PROXIMONIVEL,levelsAlly)}`,
          iconProps:{
            style:{
              fontSize: 24,
              color: rowData.STATUS === 'ACT' ? 'blue' : 'disabled',
              textAlign: 'center',
              margin: '0 0.5em'
            }
          },
          onClick: (event, rowData) => setCreationSubAlly(rowData)
        })
      ]}
      detailPanel={[
        rowData => ({
          tooltip: `Ver ${getLabelAlly(rowData.PROXIMONIVEL,levelsAlly)}`,
          icon: () => 
              <Icon className={`${rowData.DEPENDIENTE === 0 && classes.buttonNone}`}>
                keyboard_arrow_right
              </Icon>,
          render: (rowData) => {
            return(
              <AlliesSubTable 
                rowData={rowData} 
                handleStatusAlly={handleStatusAlly}
                getReportAlly={getReportAlly}
                brokerSelected={brokerSelected}
                setUpdateAlly={setUpdateAlly}
                getRequiremntsAlly={getRequiremntsAlly}
                getAreasAlly={getAreasAlly}
                setCreationSubAlly={setCreationSubAlly}
                getComissionsAlly={getComissionsAlly}
                isBroker={isBroker}
                getDetailAlly={getDetailAlly}
                levelsAlly={levelsAlly}
              />
            )
          }
        })
      ]}
    />
    { showModalEditAreas &&
      <ModalEditAreasAlly
      open={showModalEditAreas}
      handleClose={handleshowModalEditAreas}
      selectedRow={selectedRow}
      brokerSelected={brokerSelected}
      getReasonList={getReasonList}
      handleStatusAreaAlly={handleStatusAreaAlly}
      dataAreas={dataAreas}
      getAllAreasAlly={getAllAreasAlly}
      handleStatusProduct={handleStatusProduct}
      handleStatusTypePlan={handleStatusTypePlan}
    />
    }
    { showModalEditComission &&
      <ModalEditComisionAlly
      open={showModalEditComission}
      handleClose={handleshowModalEditComission}
      selectedRow={selectedRow}
      brokerSelected={brokerSelected}
    />
    }
    {
      openReasonDialog &&
      <ReasonDialog
        selectedRow={selectedRow}
        openDialog={openReasonDialog} 
        onSubmit={handleAddReasonAlly}
        handleOpenDialog={handleOpenReasonDialog}
        onClose={onCloseReason}
        arrayList={arrayReason}
      />
    }
    {
      openConfirmDialog &&
      <ConfirmDialog
        selectedRow={selectedRow}
        openDialog={openConfirmDialog} 
        onSuspend={typeStatus === 1 ? handleSuspendAlly : handleSuspendAreaAlly}
        handleOpenDialog={handleOpenConfirmDialog}
        onClose={onCloseConfirm}
        isActivate={isActivate}
        onActivate={typeStatus === 1 ? handleActivateAlly: handleActivateAreaAlly}

      />
    }
    </>
  )
}