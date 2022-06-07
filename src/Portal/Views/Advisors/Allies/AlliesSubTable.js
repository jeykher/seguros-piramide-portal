import React, {useEffect, useState} from 'react';
import CustomTable from 'components/material-dashboard-pro-react/components/Table/Table'

import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import Switch from 'components/Core/Switch/Switch'
import { makeStyles } from "@material-ui/core/styles"
import Axios from 'axios'
import useAlly from './UseAlly';

import styles from "./AlliesStyles"

const useStyles = makeStyles(styles)

export default function AlliesSubTable(props){

  const {
    rowData, 
    handleStatusAlly, 
    getReportAlly,
    brokerSelected,
    setUpdateAlly,
    getRequiremntsAlly,
    getAreasAlly,
    setCreationSubAlly,
    getComissionsAlly,
    isBroker,
    getDetailAlly,
    levelsAlly
  } = props;

  const classes = useStyles();
  const [detail, setDetail] = useState(null)
  const { getLabelAlly,checkLevelAlly } = useAlly()


  const handleGetData = async (rowData) => {
    let params = {
      p_cod_supervisor: rowData.CODALIADO,
      p_level: rowData.PROXIMONIVEL
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const { data } = await Axios.post('/dbo/insurance_broker/get_all_allies',params);
    return data.p_cur_data;
  }
  useEffect( () =>{
    const getData = async () =>{
      const result = await handleGetData(rowData);
      setDetail(result);
    }
    getData();
  },[rowData])

  return(
    <div>
      {detail &&
        <>
          <CustomTable
            tableHead={['Cód. Usuario','Cédula','Nivel', "Áreas", "Nombre",'Estatus','Acciones']}
            tableData={detail.map(element => 
              [
                `${element.PORTAL_USERNAME}`,
                `${element.CEDULA}`,
                `${element.DESCRIPCIONNIVEL}`,
                `${element.AREAS !== null ? element.AREAS : ''}`,
                `${element.NOMBRE}`,
                <Tooltip title={`Activar o suspender ${rowData.DESCRIPCIONNIVEL.toLowerCase()}`} placement="right-start" arrow >
                  <IconButton onClick={() => handleStatusAlly(element)}>
                    <Switch 
                      size="small" 
                      checked={element.STATUS === 'ACT'}
                      name={'STATUS'}
                    />
                </IconButton>
              </Tooltip>,
              <>
                <Tooltip 
                  disabled={element.STATUS !== 'ACT'} 
                  title={`Editar ${element.DESCRIPCIONNIVEL.toLowerCase()}`} 
                  placement="right-start" arrow 
                >
                  <IconButton onClick={() => setUpdateAlly(element)}>
                    <Icon style={{ fontSize: 24, color: element.STATUS === 'ACT'  ? 'Chocolate' : 'disabled'}}>edit</Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Ver detalle" placement="right-start" arrow >
                  <IconButton onClick={() => getDetailAlly(element)}>
                    <Icon style={{ fontSize: 24, color: "Maroon" }}>contacts</Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Ver Requisitos" placement="right-start" arrow >
                  <IconButton onClick={() => getRequiremntsAlly(element)}>
                    <Icon style={{ fontSize: 24, color: "black" }}>assignment</Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Ver ficha" placement="right-start" arrow >
                  <IconButton onClick={() => getReportAlly(element)}>
                    <Icon style={{ fontSize: 24, color: "red" }}>find_in_page</Icon>
                  </IconButton>
                </Tooltip>
                {
                  isBroker !== false &&
                  <>
                    <Tooltip disabled={element.STATUS !== 'ACT'}  title="Editar áreas" placement="right-start" arrow >
                      <IconButton onClick={() => getAreasAlly(element)}>
                        <Icon style={{ fontSize: 24, color: element.STATUS === 'ACT'  ? 'green' : 'disabled' }}>ballot</Icon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip disabled={element.STATUS !== 'ACT'}  title="Editar comisiones" placement="right-start" arrow >
                      <IconButton onClick={() => getComissionsAlly(element)}>
                        <Icon style={{ fontSize: 24, color: element.STATUS === 'ACT'  ? 'black' : 'disabled' }}>list</Icon>
                      </IconButton>
                    </Tooltip>
                  </>
                }
                {
                  checkLevelAlly(element.PROXIMONIVEL,levelsAlly) === true &&
                  <Tooltip 
                    disabled={element.STATUS !== 'ACT'}
                    title={`Agregar ${getLabelAlly(element.PROXIMONIVEL,levelsAlly)}`} 
                    placement="right-start" 
                    arrow 
                  >
                    <IconButton onClick={() => setCreationSubAlly(element)}>
                      <Icon style={{ fontSize: 24, color: element.STATUS === 'ACT'  ? 'blue' : 'disabled' }}>person_add_alt_1</Icon>
                    </IconButton>
                  </Tooltip>
                }
               
              </>   
              ]
            )}
            customHeadCellClasses={[
            classes.headerCenter,
            classes.headerCenter,
            classes.headerCenter,
            classes.headerCenter,
            classes.headerCenter,
            classes.headerCenter,
            classes.headerCenter,
            classes.headerCenter,
            ]}
            customCellClasses={[
            classes.textCenter,
            classes.textCenter,
            classes.textCenter,
            classes.textAdjustCenter,
            classes.textAdjustCenter,
            classes.textCenter,
            classes.textCenter,
            classes.textCenter
            ]}
            customHeadClassesForCells={[0, 1, 2, 3, 4, 5, 6, 7]}
            customClassesForCells={[0, 1, 2, 3, 4, 5, 6, 7]}
          />
        </>
      }
    </div>
  )
}