import React, {useState,useEffect} from "react"
import Axios from 'axios'
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import { makeStyles } from "@material-ui/core/styles"
import Switch from 'components/Core/Switch/Switch'
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import ModalAddAdjustment from './Modal/ModalAddAdjustment'
import ModalEditAdjustment from './Modal/ModalEditAdjustment'
import ModalHistAdjustmentView from './Modal/ModalHistAdjustmentView'
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"


import { useDialog } from 'context/DialogContext'
import { getSymbolCurrency} from "utils/utils"

const useStyles = makeStyles(() => ({
  container: {
    padding: "1em",
  },
  buttonWatch:{
    background: 'rgba(47, 134, 255, 0.95)'
  },
  containerButtons:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }
}))

const BudgetsAdjustmentsTable = (props) => {
  const {dataGroup} = props
  
  const classes = useStyles()
  const [budgetAreaList,setBudgetAreaList] = useState([])
  const [currencyList,setCurrencyList] = useState([])
  const [adjustmentsList,setAdjustmentsList] = useState([]);
  const [showModalAddAdjustment,setShowModalAddAdjustment] = useState(false)
  const [showModalEditAdjustment,setShowModalEditAdjustment] = useState(false)
  const [showModalHistAdjustment, setShowModalHistAdjustment] = useState(false)
  const [selectedAdjustment, setSelectedAdjustment] = useState(null);
  const dialog = useDialog()


  //funciones

  const handleSelectedAdjustment = (value) => {
    setSelectedAdjustment(value)
  }

  const handleEditAdjustment = (value) => {
    handleSelectedAdjustment(value)
    handleShowModalEditAdjustment()
  }

  const handleHistAdjustment = (value) => {
    handleSelectedAdjustment(value)
    handleShowModalHistAdjustment()
  }
  
  const handleShowModalAddAdjustment = () => {
    setShowModalAddAdjustment(!showModalAddAdjustment)
  }

  const handleShowModalEditAdjustment = () => {
    setShowModalEditAdjustment(!showModalEditAdjustment)
  }

  const handleShowModalHistAdjustment = () => {
    setShowModalHistAdjustment(!showModalHistAdjustment)
  }

  const getBudgetAreaList = async () => {
    try {
      
      const { data } = await Axios.post('/dbo/budgets/get_budget_areas_simple_list');
      setBudgetAreaList(data.cur_budget_areas);
    } catch (error) {
      console.log(error)
    }
  }

  const getCurrencyList = async () => {
    try {
      const params = {
        p_list_code: 'TPMOPCLI'
      }
      const { data } = await Axios.post('/dbo/toolkit/get_values_list',params);
      setCurrencyList(data.p_cursor);
    } catch (error) {
      console.log(error)
    }
  }

  const changeAdjustmentStatus = async (dataAdj,newStatus) => {
    const params = {
      p_status: newStatus,
      p_adjustment_id: dataAdj.ADJUSTMENT_ID
    }
    try{

      await Axios.post('/dbo/portal_admon/update_status_adjustments',params)
      await getAdjustValues(dataAdj.WORKING_GROUP_ID)
    }catch(error){
      console.error(error)
    }
  }

  const getAdjustValues = async (groupId) => {
    try {
      const params = {
        p_working_group_id: groupId
      }
      const { data } = await Axios.post('/dbo/portal_admon/get_budget_adjust_values',params);
      setAdjustmentsList(data.cur_adjust_list);
    } catch (error) {
      console.log(error)
    }
  }

  

  const handleStatusAdjust = async (rowElement) => {
    handleSelectedAdjustment(rowElement)
    if(rowElement.STATUS && rowElement.STATUS === 'ENABLED'){
      validateDisableAdjustment(rowElement)
    }else{
      await changeAdjustmentStatus(rowElement,'ENABLED')
    }
  }

  const validateDisableAdjustment = (dataAdj) => {
    dialog({
      variant: "danger",
      catchOnCancel: false,
      resolve: () => changeAdjustmentStatus(dataAdj,'DISABLED'),
      title: "Confirmación",
      description: "¿Está seguro que desea deshabilitar estos valores?"
    })
  }

  useEffect(() => {
    getBudgetAreaList()
    getCurrencyList()
    getAdjustValues(dataGroup.WORKING_GROUP_ID)
  },[])

  return (
    <GridContainer className={classes.container}>
      <GridItem xs={12}>
        <h4>Ajustes por grupo</h4>
      </GridItem>
      <GridItem xs={12}>
        <Button color="primary" round size="sm" onClick={handleShowModalAddAdjustment}>
          Agregar Ajustes
        </Button>
      </GridItem>
      <GridItem xs={12}>
        <TableMaterial
          options={{
            pageSize: 5,
            search: false,
            toolbar: false,
            draggable: false,
            actionsColumnIndex: -1,
            headerStyle: {
              backgroundColor: 'beige',
              textAlign: 'center'
          },
          }}
          columns={[
            { 
              title: "Área", 
              field: "AREA_NAME",
              cellStyle: { textAlign: "center" },
            },
            { 
              title: "Moneda", 
              field: "CURRENCY_CODE",
              cellStyle: { textAlign: "center" },
              render: rowData => (getSymbolCurrency(rowData.CURRENCY_CODE))
            },
            { 
              title: "% - Tasa", 
              field: "MIN_PERC_RATE"
            },
            { 
              title: "% + Tasa", 
              field: "MAX_PERC_RATE"
            },
            { 
              title: "% - Suma", 
              field: "MIN_PERC_ASSURED_SUM"
            },
            { 
              title: "% + Suma", 
              field: "MAX_PERC_ASSURED_SUM"
            },
            {
              title: "Estatus", 
              field: "STATUS", 
              cellStyle: { textAlign: "center" },
              headerStyle: { textAlign: 'center'}, 
              render: (rowData) => {
                return (
                  (dataGroup.STATUS === 'ENABLED')?<Tooltip title={`Activar o suspender Ajustes `} placement="right-start" arrow >
                     <IconButton onChange={() => handleStatusAdjust(rowData)}>
                      <Switch 
                        size="small" 
                        checked={rowData.STATUS === 'ENABLED'}
                        name={'STATUS'}
                        disabled= {dataGroup.STATUS === 'DISABLED'}
                      />
                     </IconButton>
                  </Tooltip>:<Badge  color='danger'>INACTIVO</Badge>
                )
              }
            }
          ]}
          actions={[
            
            (rowData) => ({
              icon: 'edit',
              tooltip: (rowData.STATUS !== 'ENABLED')?'Debe activar el grupo para editar estos valores':'Editar Valores de Ajuste',
              disabled: rowData.STATUS !== 'ENABLED',
              iconProps:{
                style:{ 
                  fontSize: 24,
                  color: 'green',
                  textAlign: 'center',
                  margin: '0 0.5em'
                }
              },
              onClick: (event, rowData) => handleEditAdjustment(rowData)
            }),
            (rowData) => ({
              icon: 'list',
              tooltip: 'Ver cambios',
              iconProps:{
                style:{
                  fontSize: 24,
                  textAlign: 'center',
                  margin: '0 0.5em'
                }
              },
              onClick: (event, rowData) => handleHistAdjustment(rowData)
            })
          ]}
          data={adjustmentsList}
        />
      </GridItem>
      { showModalAddAdjustment &&
        <ModalAddAdjustment
          open={showModalAddAdjustment}
          budgetAreaList={budgetAreaList}
          currencyList={currencyList}
          handleClose={handleShowModalAddAdjustment}
          dataGroup={dataGroup}
          getAdjustValues={getAdjustValues}
        />
      }

      { showModalEditAdjustment &&
        <ModalEditAdjustment
          open={showModalEditAdjustment}
          handleClose={handleShowModalEditAdjustment}
          selectedAdjustment={selectedAdjustment}
          getAdjustValues={getAdjustValues}
        />
      }

      { showModalHistAdjustment &&
        <ModalHistAdjustmentView
          open={showModalHistAdjustment}
          handleClose={handleShowModalHistAdjustment}
          selectedAdjustment={selectedAdjustment}
        />
      }


    </GridContainer>
  )
}



export default BudgetsAdjustmentsTable
