import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Axios from 'axios'
import Icon from "@material-ui/core/Icon"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import AmountFormatInput from 'components/Core/NumberFormat/AmountFormatInput'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import SelectSimple from 'components/Core/SelectSimple/SelectSimple'
import DateMaterialPicker from 'components/Core/Datetime/DateMaterialPicker'
import { format } from 'date-fns'

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
    flexDirection: 'column',
    alignItems: 'center'
  },
  containerTable:{
    margin: '2em 0',
    width: '70%'
  },
  containerDiv:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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

const listStatus = [
  {value: 'ACT', label: 'Activo'},
  {value: 'SUS', label: 'Suspendido'}
]



export default function ModalEditComisionAlly(props) {
  const { 
    open, 
    handleClose,
    selectedRow,
    brokerSelected
    } = props;
  const classes = useStyles();

  const [step, setStep] = useState(0);
  const [selectedArea,setSelectedArea ] = useState(null);
  const [listComissions,setListComissions] = useState(null);
  const [titleArea,setTitleArea] = useState(null);
  const [dataSelectedArea, setDataSelectedArea] = useState(null);
  const [areasAlly,setAreasAlly] = useState(null)

  const handleListComissions = (value) => {
    setListComissions(value)
  }


  const handleList = () => {
    handleStep(1)
    const dataSelected = areasAlly.find(element => element.CODAREA === selectedArea);
    setTitleArea(dataSelected.DESCAREA);
    setDataSelectedArea(dataSelected);
  }


  const handleStep = (value) => {
    setStep(value);
  }


  const handleAreasAlly = (value) => {
    setAreasAlly(value);
  }

  const getAreasAlly = async () => {
    let params = {
      p_cod_ally: selectedRow.CODALIADO,
      p_cod_supervisor: selectedRow.CODSUPERVISOR,
      p_level: selectedRow.NIVEL
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const { data } = await Axios.post('/dbo/insurance_broker/get_areas_by_ally', params);
    handleAreasAlly(data.p_cur_data);
  }


  const addComissionArea = async (newRow) => {
    let params = {
      p_cod_ally: selectedRow.CODALIADO,
      p_comission: newRow.PORCENTCOMISION,
      p_effective_date: newRow.FECHAEFECTIVA,
      p_cod_area: selectedArea
    }
    params = {p_json_params: JSON.stringify(params)};
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    await Axios.post('/dbo/insurance_broker/add_comission_area', params);
  }


  const updateComissionArea = async (newRow) => {
    let params = {
      p_cod_ally: selectedRow.CODALIADO,
      p_comission: newRow.PORCENTCOMISION,
      p_effective_date: newRow.FECHAEFECTIVA,
      p_cod_area: selectedArea,
      p_status: newRow.STSCOMISION
    }
    params = {p_json_params: JSON.stringify(params)};
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    await Axios.post('/dbo/insurance_broker/update_comission_area', params);
  }


  const getListComission = async () => {
    let params ={
      p_cod_ally: selectedRow.CODALIADO,
      p_cod_supervisor: selectedRow.CODSUPERVISOR,
      p_cod_area: selectedArea
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const { data } = await Axios.post('/dbo/insurance_broker/get_comissions_area', params);
    handleListComissions(data.p_cur_data)
  }



  const checkTitles = () => {
    let title;
    switch(step){
      case 0:
        title = 'Áreas a seleccionar:'
        break;
      case 1: 
        title = 'Comisiones por área:'
        break;
      default:
      title = 'Áreas a seleccionar:'
    }
    return title
  }


  useEffect(() => {
    if(step === 1){
      getListComission()
    }
  },[step])

  useEffect(() => {
    if(selectedRow !==null){
      getAreasAlly();
    }
  },[selectedRow])


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
                  areasAlly &&
                  <SelectSimple
                  id="1"
                  onChange={(e) => setSelectedArea(e)}
                  array={areasAlly}
                  label="Área"
                  value={selectedArea}
                  classNameForm={classes.containerSelect}
                  />
                }
                </GridItem>
                }                
                {
                  step === 1 && listComissions &&
                  <>
                  <GridContainer justify="center" alignItems="center">
                    <h4>{titleArea}</h4>
                  </GridContainer>
                  <GridItem xs={12} className={classes.containerTable}>
                  <TableMaterial
                    data={listComissions}
                    options={{
                      search: false,
                      toolbar: true,
                      sorting: false,
                      pageSize: 5,
                      cellStyle: {textAlign: 'center'},
                      draggable: false,
                      paging: false
                    }}
                    columns={[
                      { 
                        title: "Comisión",
                        field: "PORCENTCOMISION", 
                        headerStyle: {textAlign: 'center'},
                        render: rowData => (<span>{`${rowData.PORCENTCOMISION}%`}</span>),
                        editComponent:  ({value,onChange}) => (
                          <AmountFormatInput 
                            name={"PORCENTCOMISION"}
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
                        field: "FECHAEFECTIVA", 
                        headerStyle: {textAlign: 'center'},
                        editComponent: ({value,onChange, rowData}) => {
                          const isUpdate = rowData.tableData?.editing === 'update' ? true : false;
                          return (
                            <DateMaterialPicker 
                            name={"FECHAEFECTIVA"} 
                            auxiliarValue={value}
                            value={isUpdate === true ? value : new Date()}
                            onChange={onChange}
                            disablePast={isUpdate === true ? false : true}
                            disabled={isUpdate}
                            invalidDateMessage='Fecha no reconocida, por favor utilizar dd/mm/yyyy'
                            minDateMessage='La fecha no puede menor al día de hoy'
                            />
                          )
                        }
                      },
                      { 
                        title: "Estatus", 
                        field: "STSCOMISION", 
                        headerStyle: {textAlign: 'center'},
                        render: rowData => (<span>{`${rowData.STSCOMISION === 'ACT' ? 'Activo' : 'Suspendido'}`}</span>),
                        editComponent: ({value,onChange, rowData}) =>  {
                        const isUpdate = rowData.tableData?.editing === 'update' ? true : false;
                        return(
                          
                          <SelectSimple
                          id="2"
                          value={value}
                          onChange={onChange}
                          array={listStatus}
                          defaultValue="ACT"
                          disabled={isUpdate === true ? false : true}
                          label="Estatus"
                          classNameForm={classes.containerSelect}
                        />
                        )
                        }
                      },
                    ]}
                    editable={{
                      isEditable: () => dataSelectedArea.STATUSAREA === 'ACT',
                      ...(dataSelectedArea.STATUSAREA === 'ACT') && {
                        onRowAdd: (newData) =>
                        new Promise( async (resolve, reject) => {
                          try{
                            const newRow = {
                              ...newData,
                              FECHAEFECTIVA:format(new Date(newData.FECHAEFECTIVA), 'dd/MM/yyyy'),
                              PORCENTCOMISION: parseFloat(newData.PORCENTCOMISION),
                              STSCOMISION: 'ACT'
                            }
                            await addComissionArea(newRow);
                            handleListComissions([...listComissions, newRow])
                            resolve();
                          }catch(error){
                            console.log(error)
                            reject();
                          }
                                
                        }),
                      },
                      onRowUpdate: (newData, oldData) =>
                          new Promise( async (resolve, reject) => {
                              try {
                                let data = [...listComissions];
                                const newRow = {
                                  ...newData,
                                  PORCENTCOMISION: parseFloat(newData.PORCENTCOMISION)
                                }
                                const index = data.indexOf(oldData);
                                data[index] = newRow;
                                await updateComissionArea(newRow)
                                handleListComissions(data)
                                  resolve()
                              } catch (error) {
                                  reject()
                                  console.log(error)
                              }
                          }),
                      iconProps: { color: "primary" },
                  }}
                  icons={{
                    Clear: () => (<Icon color="primary">clear</Icon>),
                    Check: () => (<Icon color="primary">check</Icon>),
                    Edit: () => (<Icon color={dataSelectedArea.STATUSAREA === 'ACT' ? 'primary' : 'disabled'}>edit</Icon>),
                    Add: () => (
                      <Icon 
                        color='primary' 
                        style={{ fontSize: 30 }}
                        >
                          add_circle
                        </Icon>
                    ),
                  }}
                  />
                </GridItem>
                </>
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
                  <Button  onClick={() => handleStep(0)}> <Icon>fast_rewind</Icon>Regresar</Button>
                  <Button color="primary" onClick={handleClose}> <Icon>save</Icon>Confirmar</Button>
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
