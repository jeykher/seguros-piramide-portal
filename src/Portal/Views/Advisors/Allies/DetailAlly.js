import React, {useEffect,useState} from 'react';
import CardPanel from 'components/Core/Card/CardPanel'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Card from "components/material-dashboard-pro-react/components/Card/Card"
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import Icon from "@material-ui/core/Icon"
import { listCivilStatusAllies, listSexAllies } from 'utils/utils'
import { listCountries } from 'utils/longList'
import Axios from 'axios';
import useAlly from './UseAlly';



function getCountryOfList(valueToFind,countriesArray){
  const val = countriesArray.find((element) => element.codpais === valueToFind)
  return val.descpais;

}

function getValueOfList(valueToFind,arrayToFind){
  const val = arrayToFind.find((element) => element.value === valueToFind);
  return val.label;
}

function getCityOfList(valueToFind,arrayToFind){
  const val = arrayToFind.find((element) => element.CODCIUDAD === valueToFind)
  return val.DESCCIUDAD
}

function getStateOflist(valueToFind,arrayToFind){
  const val = arrayToFind.find((element) => element.CODESTADO === valueToFind)
  return val.DESCESTADO
}

function getMunicipalityOfList(valueToFind,arrayToFind){
  const val = arrayToFind.find((element) => element.CODMUNICIPIO === valueToFind)
  return val.DESCMUNICIPIO
}

function getUrbanizationOfList(valueToFind,arrayToFind){
  const val = arrayToFind.find((element) => element.CODIGO === valueToFind)
  return val.DESCZONAPOSTAL
}


export default function DetailAlly(props){

  const {handleStep, selectedAlly, levelAlly, codSupervisor, isBroker, brokerSelected, handleLevelAlly,levelsAlly} = props;
  const [listCities,setListCities] = useState(null)
  const [listStates,setListStates] = useState(null)
  const [listMunicipalities,setListMunicipalities] = useState(null)
  const [listUrbanizations,setListUrbanizations] = useState(null)

  const [listAreasAlly,setListAreasAlly] = useState(null)

  const {getLabelAlly} = useAlly()


  const handleBack = () => {
    handleLevelAlly(1)
    handleStep(0)
  }


  useEffect(() => {

  async function getStates() {
      const params = { p_country_id: selectedAlly.CODPAIS }
      const result = await Axios.post('/dbo/toolkit/get_list_of_states', params)
      setListStates(result.data.p_cursor)
  }

  async function getCities() {
      const params = { p_country_id: selectedAlly.CODPAIS, p_state_id: selectedAlly.CODESTADO }
      const result = await Axios.post('/dbo/toolkit/get_list_of_cities', params)
      setListCities(result.data.p_cursor)
  }

  async function getMunicipalities() {
      const params = { p_country_id: selectedAlly.CODPAIS, p_state_id: selectedAlly.CODESTADO, p_city_id: selectedAlly.CODCIUDAD }
      const result = await Axios.post('/dbo/toolkit/get_list_of_municipalities', params)
      setListMunicipalities(result.data.p_cursor)
  }

  async function getUrbanizations() {
      const params = {  p_country_id: selectedAlly.CODPAIS, p_state_id: selectedAlly.CODESTADO, p_city_id: selectedAlly.CODCIUDAD, p_municipality_id: selectedAlly.CODMUNICIPIO }
      const result = await Axios.post('/dbo/toolkit/get_list_of_postal_code', params)
      setListUrbanizations(result.data.p_cursor)
  }

  async function getAreasAlly(){
    let params ={
      p_cod_ally: selectedAlly.CODALIADO,
      p_cod_supervisor: codSupervisor,
      p_level: levelAlly,
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    const { data } = await Axios.post('/dbo/insurance_broker/get_detail_areas', params);
    setListAreasAlly(data.p_cur_data);
  }

  selectedAlly && getStates()
  selectedAlly && getCities()
  selectedAlly && getMunicipalities()
  selectedAlly && getUrbanizations()
  selectedAlly && getAreasAlly()
  },[selectedAlly])



  return(
    <GridContainer>
      <GridItem item xs={12} md={12} lg={12}>
        <Card>
          <CardHeader color="primary"  className="text-center">
            <h5>Detalle del {getLabelAlly(levelAlly,levelsAlly)}</h5>
          </CardHeader>
          <CardBody>
          { selectedAlly &&
            <>
              <GridItem item xs={12}  md={12} lg={12}>
                <CardPanel titulo="Identificación y datos personales" icon="list" iconColor="info">
                  <GridContainer>
                    <GridItem item xs={12}  md={6} lg={3}>
                      <h5><strong>Cédula:</strong></h5>
                      <h5>{`${selectedAlly.TIPOID}-${selectedAlly.NUMID}`}</h5>
                    </GridItem>
                    <GridItem item xs={12}  md={6} lg={3}>
                      <h5><strong>Nombres:</strong></h5>
                      <h5>{`
                           ${selectedAlly.NOMTER1 !== null ? selectedAlly.NOMTER1 : ''} 
                           ${selectedAlly.NOMTER2 !==null ? selectedAlly.NOMTER2 : ''}
                          `}
                      </h5>
                    </GridItem>
                    <GridItem item xs={12}  md={6} lg={3}>
                      <h5><strong>Apellidos:</strong></h5>
                      <h5>{`
                            ${selectedAlly.APETER1 !==null ? selectedAlly.APETER1: '' } 
                            ${selectedAlly.APETER2 !==null ? selectedAlly.APETER2: ''}
                          `}
                      </h5>
                    </GridItem>
                    <GridItem item xs={12}  md={6} lg={3}>
                      <h5><strong>Fecha de nacimiento:</strong></h5>
                      <h5>{`${selectedAlly.FECNAC}`}</h5>
                    </GridItem>
                    <GridItem item xs={12}  md={6} lg={3}>
                      <h5><strong>Nacionalidad:</strong></h5>
                      <h5>{`${selectedAlly.INDNACIONAL === 'N' ? 'Venezolano' : 'Extranjero'}`}</h5>
                    </GridItem>
                    <GridItem item xs={12}  md={6} lg={3}>
                      <h5><strong>Sexo:</strong></h5>
                      <h5>{`${getValueOfList(selectedAlly.SEXO,listSexAllies)}`}</h5>
                    </GridItem>
                    <GridItem item xs={12}  md={6} lg={3}>
                      <h5><strong>Estado Civil:</strong></h5>
                      <h5>{`${getValueOfList(selectedAlly.EDOCIVIL,listCivilStatusAllies)}`}</h5>
                    </GridItem>
                  </GridContainer>
                </CardPanel>
              </GridItem>
              <GridItem item xs={12}  md={12} lg={12}>
                <CardPanel titulo="Dirección" icon="location_on" iconColor="danger">
                  <GridContainer>
                  <GridItem item xs={12}  md={6} lg={3}>
                      <h5><strong>País:</strong></h5>
                      <h5>{`${getCountryOfList(selectedAlly.CODPAIS,listCountries)}`}</h5>
                  </GridItem>
                  { listStates !== null &&
                     <GridItem item xs={12}  md={6} lg={3}>
                     <h5><strong>Estado:</strong></h5>
                     <h5>{`${getStateOflist(selectedAlly.CODESTADO,listStates)}`}</h5>
                    </GridItem>
                  }
                  {
                    listCities !== null &&
                    <GridItem item xs={12}  md={6} lg={3}>
                    <h5><strong>Ciudad:</strong></h5>
                    <h5>{`${getCityOfList(selectedAlly.CODCIUDAD,listCities)}`}</h5>
                    </GridItem>
                  }
                  {
                    listMunicipalities !== null &&
                    <GridItem item xs={12}  md={6} lg={3}>
                    <h5><strong>Municipio:</strong></h5>
                    <h5>{`${getMunicipalityOfList(selectedAlly.CODMUNICIPIO,listMunicipalities)}`}</h5>
                    </GridItem>
                  }
                  {
                    listUrbanizations !== null &&
                    <GridItem item xs={12}  md={6} lg={3}>
                    <h5><strong>Urbanización:</strong></h5>
                    <h5>{`${getUrbanizationOfList(selectedAlly.CODURBANIZACION,listUrbanizations)}`}</h5>
                    </GridItem>
                  }
                    <GridItem item xs={12}  md={6} lg={3}>
                      <h5><strong>Calle/Avenida:</strong></h5>
                      <h5>{`${selectedAlly.AVENIDA}`}</h5>
                    </GridItem>
                    <GridItem item xs={12}  md={6} lg={3}>
                      <h5><strong>Edificio/Casa:</strong></h5>
                      <h5>{`${selectedAlly.EDIFICIO}`}</h5>
                    </GridItem>
                    <GridItem item xs={12}  md={6} lg={3}>
                      <h5><strong>Piso/Nro. Casa:</strong></h5>
                      <h5>{`${selectedAlly.PISO}`}</h5>
                    </GridItem>
                  </GridContainer>
                </CardPanel>
              </GridItem>
              <GridItem item xs={12}  md={12} lg={12}>
                <CardPanel titulo="Datos de Contacto" icon="phone" iconColor="warning">
                  <GridContainer>
                    <GridItem item xs={12}  md={6} lg={5}>
                      <h5><strong>Correo Electrónico:</strong></h5>
                      <h5>{`${selectedAlly.EMAIL}`}</h5>
                    </GridItem>
                    <GridItem item xs={12}  md={6} lg={3}>
                      <h5><strong>Teléfono de habitación:</strong></h5>
                      <h5>{`${selectedAlly.CODAREA1}-${selectedAlly.TELEF1}`}</h5>
                    </GridItem>
                    <GridItem item xs={12}  md={6} lg={3}>
                      <h5><strong>Teléfono Celular:</strong></h5>
                      <h5>{`${selectedAlly.CODAREA3}-${selectedAlly.TELEF3}`}</h5>
                    </GridItem>
                  </GridContainer>
                </CardPanel>
              </GridItem>
              <GridItem item xs={12}  md={12} lg={12}>
                <CardPanel titulo="Configuración" icon="build_circle" iconColor="success" >
                  <GridContainer>
                    <GridItem item xs={12}  md={6} lg={3}>
                        <h5><strong>Usuario Portal:</strong></h5>
                        <h5>{`${selectedAlly.PORTAL_USERNAME}`}</h5>
                    </GridItem>
                    <GridItem item xs={12}  md={6} lg={3}>
                        <h5><strong>Estatus:</strong></h5>
                        <h5>{`${selectedAlly.STSALIADO === 'ACT' ? 'Activo' : 'Suspendido'}`}</h5>
                    </GridItem>
                    <GridItem item xs={12}  md={6} lg={3}>
                        <h5><strong>Fecha de Configuración:</strong></h5>
                        <h5>{`${selectedAlly.FECCONF}`}</h5>
                    </GridItem>
                    {
                      selectedAlly?.FECHAULTACT !== null &&
                      <GridItem item xs={12}  md={6} lg={3}>
                        <h5><strong>Fecha última activación:</strong></h5>
                        <h5>{`${selectedAlly.FECHAULTACT}`}</h5>
                      </GridItem>
                    }
                    {
                      selectedAlly?.FECHAULTSUSP !== null &&
                      <GridItem item xs={12}  md={6} lg={3}>
                        <h5><strong>Fecha última suspensión:</strong></h5>
                        <h5>{`${selectedAlly.FECHAULTSUSP}`}</h5>
                      </GridItem>
                    }
                  </GridContainer>
                </CardPanel>
              </GridItem>
              <GridItem item xs={12}  md={12} lg={12}>
                <CardPanel titulo="Áreas" icon="list" iconColor="rose" >
                  <GridContainer>
                    {
                      listAreasAlly && listAreasAlly.map(element => (
                        <GridItem item xs={12}  md={12} lg={12}>
                          <GridContainer>
                            <GridItem item xs={12} md={3}>
                              <h5><strong>Nombre de área:</strong></h5>
                              <h5>{`${element.DESCAREA}`}</h5>
                            </GridItem>
                            <GridItem item xs={12} md={2}>
                              <h5><strong>Estatus:</strong></h5>
                              <h5>{`${element.STATUSAREA === 'ACT' ? 'Activa' : 'Suspendida'}`}</h5>
                            </GridItem>
                            <GridItem item xs={12} md={3}>
                              <h5><strong>{element.CODAREA === '0002' ? 'Tipos de planes:' : 'Productos:'}</strong></h5>
                              <h5>{`${element.LIST_PRODUCTS}`}</h5>
                            </GridItem>
                            <GridItem item xs={12} md={2}>
                              <h5><strong>Fecha del estatus:</strong></h5>
                              <h5>{`${element.FECSTS}`}</h5>
                            </GridItem>
                            <GridItem item xs={12} md={2}>
                              <h5><strong>Comisión vigente:</strong></h5>
                              <h5>{element.COMISIONVIGENTE === 'SCV' ? 'Sin comisión vigente' : `${element.COMISIONVIGENTE}%`}</h5>
                            </GridItem>  
                          </GridContainer>
                        </GridItem>
                      ))
                    }
                  </GridContainer>
                </CardPanel>
              </GridItem>
              <GridContainer justify="center" alignItems="center">
                <Button onClick={handleBack}> <Icon>fast_rewind</Icon>Volver</Button>     
              </GridContainer>
              </>
            }
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  )
}