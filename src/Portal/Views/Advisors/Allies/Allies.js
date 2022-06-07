import React, {useState, useEffect} from 'react';
import AlliesTable from './AlliesTable';
import CardPanel from "components/Core/Card/CardPanel"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Slide from "@material-ui/core/Slide"
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import { makeStyles } from "@material-ui/core/styles"
import AlliesForm from './AlliesForm';
import { getProfileCode} from 'utils/auth'
import AdvisorController from 'components/Core/Controller/AdvisorController'
import { useForm } from "react-hook-form"
import Axios from 'axios'
import Digitization from './Digitization/Digitization'
import DetailAlly from './DetailAlly'
import SelectSimple from 'components/Core/SelectSimple/SelectSimple'
import styles from "./AlliesStyles"


const goToTop = async () => {
  if (typeof window !== undefined) {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.getElementById('main_panel').scrollTo(0,0);
  }
}

const useStyles = makeStyles(styles)

export default function Allies(){

  const classes = useStyles()
  const { ...objForm } = useForm()

  const [isBroker,setIsBroker] = useState(getProfileCode() === 'insurance_broker')
  const [brokerSelected, setBrokerSelected] = useState(null)
  const [alliesData,setAlliesData] = useState()
  const [selectedAlly,setSelectedAlly] = useState(null);
  const [isReadonly,setIsReadonly] = useState(false);
  const [isCreation,setIsCreation] = useState('Y');
  const [codSupervisor,setCodSupervisor] = useState(null);
  const [levelAlly,setLevelAlly] = useState(1);
  const [isNewAlly,setIsNewAlly] = useState(true);
  const [codAlly,setCodAlly] = useState();
  const [isUpdate,setIsUpdate] = useState(false);
  const [toUpdateAlly,setToUpdateAlly] = useState(null)
  const [step, setStep] = useState(0)
  const [dataReqAlly,setDataReqAlly] = useState(null);
  const [isCodPortal, setIsCodPortal] = useState(false);
  const [levelsAlly,setLevelsAlly] = useState([]);

  const handleAlliesData = (value) => {
    setAlliesData(value);
  }

  const handleStep = (value) => {
    setStep(value);
  }

  const handleSelectedAlly = (value) => {
    setSelectedAlly(value);
  }

  const handleIsReadonly = (value) => {
    setIsReadonly(value);
  }

  const handleIsCreation = (value) => {
    setIsCreation(value)
  }

  const handleLevelAlly = (value) => {
    setLevelAlly(value)
  }

  const handleCodSupervisor = (value) => {
    setCodSupervisor(value)
  }

  const handleIsNewAlly = (value) => {
    setIsNewAlly(value)
  }

  const handleCodAlly = (value) => {
    setCodAlly(value)
  }

  const handleIsUpdate = (value) => {
    setIsUpdate(value)
  }

  const handleToUpdateAlly = (value) => {
    setToUpdateAlly(value)
  }

  const handleDataReqAlly = (value) => {
    setDataReqAlly(value)
  }

  const handleIsCodPortal = (value) => {
    setIsCodPortal(value)
  }

  const handleLevelsAlly = (value) => {
    setLevelsAlly(value);
  }

  const handleCreateAlly = () => {
    handleLevelAlly(1)
    handleStep(1)
  }

  const getAllAllies = async () => {
    let params = {
      p_cod_supervisor: null,
      p_level: levelAlly
    }    
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const { data } = await Axios.post('/dbo/insurance_broker/get_all_allies',params);
    handleAlliesData(data.p_cur_data);

   
  }

  const getLevelsAllies = async () => {
    if(brokerSelected !== null){
      const params = {
        p_insurance_broker_code: `${brokerSelected}`
      }
      const { data } = await Axios.post('dbo/insurance_broker/get_levels',params);
      handleLevelsAlly(data.p_cur_data)
    }else{
      const { data } = await Axios.post('dbo/insurance_broker/get_levels');
      handleLevelsAlly(data.p_cur_data)
    }
    
  }

  const setCreationSubAlly = (rowData) => {
    handleCodSupervisor(rowData.CODALIADO)
    handleLevelAlly(rowData.PROXIMONIVEL)
    handleStep(1);
  }

  const setUpdateAlly = async (rowData) => {
    handleCodSupervisor(rowData.CODSUPERVISOR)
    handleLevelAlly(rowData.NIVEL)
    handleCodAlly(rowData.CODALIADO)
    let params = {
      p_cod_supervisor: rowData.CODSUPERVISOR,
      p_level: rowData.NIVEL,
      p_cod_ally: rowData.CODALIADO,
    }    
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const { data } = await Axios.post('/dbo/insurance_broker/get_ally',params)
    handleStep(1)
    handleIsUpdate(true)
    handleToUpdateAlly(data.p_cur_data[0])
    handleIsNewAlly(false);
  }


  const getDetailAlly = async (rowData) => {
    handleCodSupervisor(rowData.CODSUPERVISOR)
    handleLevelAlly(rowData.NIVEL)
    handleCodAlly(rowData.CODALIADO)
    let params = {
      p_cod_supervisor: rowData.CODSUPERVISOR,
      p_level: rowData.NIVEL,
      p_cod_ally: rowData.CODALIADO,
    }    
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const { data } = await Axios.post('/dbo/insurance_broker/get_ally',params)
    handleStep(3)
    handleSelectedAlly(data.p_cur_data[0])
  }


  const getRequiremntsAlly = async (rowElement = null) => {
    let params = {
      p_cod_ally: rowElement ? rowElement.CODALIADO : codAlly
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const { data } = await Axios.post(`/dbo/insurance_broker/get_all_req_ally`,params);
    handleReqAlly(data.p_cur_data);
    handleSelectedAlly(rowElement)
    rowElement && handleCodAlly(rowElement.CODALIADO)
  }



  const checkAllyButton = () =>{
    if(isBroker === true){
      return true
    }else if(brokerSelected !== null){
      return true
    }else{
      return false
    }
  }

  const checkLevelsAllies = () => {
    if(isBroker === true){
      return true
    }else if(brokerSelected !== null){
      return true
    }else{
      return false
    }
  }

  const handleReqAlly = (value) => {
    handleDataReqAlly(value);
    handleStep(2);
  }

  const handleLevelAllySelect = (value) => {
    const val = value ? value : 0
    setLevelAlly(val)
  }



  //Si consigue data, modo editar el formulario.
  useEffect(() => {
    if(selectedAlly){
      //handleIsReadonly(true)
      selectedAlly.ESALIADO === 'S' && handleIsCreation('Y')
    }
  },[selectedAlly])


  //Cuando voy a regresar o cuando termine el registro
  useEffect(() => {
    if(step === 0){
      handleLevelAlly(1);
      handleIsCreation('Y');
      handleSelectedAlly(null);
      handleToUpdateAlly(null);
      handleIsReadonly(false);
      handleCodSupervisor(null);
      getAllAllies();
      handleIsUpdate(false);
      handleCodAlly(null);
      handleIsNewAlly(true);
      handleIsCodPortal(false);
      goToTop();
    }
  },[step])

  //Cuando consulto desde otro perfil diferente a broker

  useEffect(() => {
    if(brokerSelected){
      getAllAllies()
    }
  },[brokerSelected])

//Cuando se seleccione un nivel
  useEffect(() => {
    getAllAllies();
  },[levelAlly])

  useEffect(() => {
    getLevelsAllies();
  },[])

  useEffect(() => {
    if(brokerSelected !== null){
      getLevelsAllies();
    }
  },[brokerSelected])



  return(
    <GridContainer>
      <GridItem xs={12} sm={12} md={12} lg={12}>
      <Slide in={true} direction='up' timeout={1000}>
          <div>
            {
              step === 0 &&
              <>
                <CardPanel titulo="Mis vendedores" icon="group" iconColor="primary">
                  <GridContainer justify='space-between' alignItems="center">
                    {isBroker !== true &&
                      <GridItem xs={12} md={6} className={classes.containerGrid}>
                        <AdvisorController
                          objForm={objForm}
                          label="Asesor de seguros"
                          name={"p_advisor_selected"}
                          onChange={(e)=> setBrokerSelected(e) }
                          codBroker={brokerSelected}
                        />       
                      </GridItem>
                    }
                    {
                        checkLevelsAllies() === true && levelsAlly !== null &&
                        <GridItem xs={12} md={3} className={classes.containerGrid}>
                          <SelectSimple
                            id="1"
                            label="Niveles"
                            onChange={(e)=> handleLevelAllySelect(e)}
                            array={levelsAlly}
                            value={levelAlly}
                          />       
                        </GridItem>
                                          
                    }
                    { checkAllyButton() === true &&
                       <GridItem xs={12} md={3} className={classes.buttonContainer}>
                       <Tooltip title="Agregar Vendedor" placement="right-start" arrow >
                         <IconButton onClick={handleCreateAlly}>
                           <Icon style={{ fontSize: 36, color: "red" }}>person_add_alt_1</Icon>
                         </IconButton>
                       </Tooltip>
                     </GridItem>
                    }
                  </GridContainer>
                  {
                    <AlliesTable 
                      alliesData={alliesData}
                      setCreationSubAlly={setCreationSubAlly}
                      getAllAllies={getAllAllies}
                      brokerSelected={brokerSelected}
                      setUpdateAlly={setUpdateAlly}
                      getRequiremntsAlly={getRequiremntsAlly}
                      isBroker={isBroker}
                      getDetailAlly={getDetailAlly}
                      levelsAlly={levelsAlly}
                      />
                  }
                </CardPanel> 
              </>
            }
            {
              step === 1 &&
              <>
                <AlliesForm 
                  handleStep={handleStep}
                  handleSelectedAlly={handleSelectedAlly}
                  isReadonly={isReadonly}
                  selectedAlly={selectedAlly}
                  isCreation={isCreation}
                  levelAlly={levelAlly}
                  codSupervisor={codSupervisor}
                  handleIsNewAlly={handleIsNewAlly}
                  isNewAlly={isNewAlly}
                  brokerSelected={brokerSelected}
                  codAlly={codAlly}
                  isUpdate={isUpdate}
                  toUpdateAlly={toUpdateAlly}
                  handleIsCodPortal={handleIsCodPortal}
                  isCodPortal={isCodPortal}
                  handleCodAlly={handleCodAlly}
                  handleLevelAlly={handleLevelAlly}
                  levelsAlly={levelsAlly}
                  />
              </>
            }
            {
              step === 2 && 
              <Digitization 
                handleStep={handleStep}
                dataReqAlly={dataReqAlly}
                selectedAlly={selectedAlly}
                getRequiremntsAlly={getRequiremntsAlly}
                brokerSelected={brokerSelected}
                handleDataReqAlly={handleDataReqAlly}
              />
            }
            {
            step === 3 && selectedAlly &&
            <DetailAlly
              selectedAlly={selectedAlly}
              handleStep={handleStep}
              levelAlly={levelAlly}
              codSupervisor={codSupervisor}
              brokerSelected={brokerSelected}
              handleLevelAlly={handleLevelAlly}
              levelsAlly={levelsAlly}
            />
          }             
          </div>
        </Slide>
      </GridItem>
    </GridContainer>
  )
}