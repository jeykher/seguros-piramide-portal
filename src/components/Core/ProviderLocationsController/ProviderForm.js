import React, {useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Button from "components/material-kit-pro-react/components/CustomButtons/Button.js";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Card from "components/material-kit-pro-react/components/Card/Card.js";
import CardBody from "components/material-kit-pro-react/components/Card/CardBody.js";
import Icon from "@material-ui/core/Icon";
import Axios from 'axios';
import { Typography } from '@material-ui/core'
import smallMap from '../../../../static/map-algor.png';
import providerLocationsControllerStyle from "./providerLocationsControllerStyle"
const useStyles = makeStyles(providerLocationsControllerStyle);

export default function ProviderForm(props) {
  const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
  const classes = useStyles();
  const [category, setCategory] = useState('')
  const [service, setService] = useState('')
  const [address, setAddress] = useState('')
  const [providers, setProviders] = useState(null)
  const [providerServices, setProviderServices] = useState(null)
  const [providerService, setProviderService] = useState(null)
  const [lvalProviderServices, setLvalProviderServices] = useState(null)

  const [errorMessage, setErrorMessage] = useState(''); 
  let filterCategory = ''
  let servType = ''
  let textCompany = ''
  let serviceTypeForValidate = undefined

  if ( props.serviceTypeForValidate && props.serviceTypeForValidate !== undefined) {
    serviceTypeForValidate = props.serviceTypeForValidate
  }
  if ( props.serviceType && props.serviceType !== undefined && props.serviceType === "04") {
    servType = props.serviceType
  }
  if (insuranceCompany === 'OCEANICA') {
    textCompany = "Si el centro que buscas no se encuentra en el listado, por favor comunícate con el 0800-OCEANIC (6232642)"
  } else {
    textCompany = "Si el centro que buscas no se encuentra en el listado, por favor comunícate con el 0800-SPIRAMI (7747264)"
  }
  async function getProviders() {
    const params = { p_service_type: serviceTypeForValidate }
    const result = await Axios.post('/dbo/providers/get_providers_types_byservtype',params)
    setProviders(result.data.result)
  }

  async function getProviderServices(listCode) {
    const params = { p_list_code: listCode }
    const result = await Axios.post('/dbo/toolkit/get_values_list', params)
    setProviderServices(result.data.p_cursor)
  }

  async function getLvalProviderServices() {
    const params = { p_list_code: 'TIPCLISV' }
    const result = await Axios.post('/dbo/toolkit/get_values_list', params)
    setLvalProviderServices(result.data.p_cursor)
  }

  useEffect(() => {
    getProviders()
    getLvalProviderServices()
  }, [props.callFrom])

  const changeInput = (event) => {
    event.preventDefault()
    event.target.name === 'provider_service' && setProviderService(event.target.value)
    event.target.name === 'category' && setCategory(event.target.value)
    event.target.name === 'service' && setService(event.target.value)
    event.target.name === 'address' && setAddress(event.target.value)
    //Los Servicios asociados a los Proveedores de cargan solo si se encuentran configurados en 'TIPCLISV'. Ej. AMP/SERVCLIN
    if (event.target.name === 'category' && event.target.value && 
          lvalProviderServices && lvalProviderServices.length>0){
          const searchLval = lvalProviderServices.filter(inputParam => inputParam.VALOR===event.target.value)
      if(searchLval[0]&&searchLval[0].DESCRIPCION){
        getProviderServices(searchLval[0].DESCRIPCION.toUpperCase())
      }else{
        setProviderServices(null)
      }
      
    }
    setErrorMessage('')}

  const handleSubmitProviders = async (e) => {
    e.preventDefault()
    if (service.length > 0 && address.length > 0) {
      setErrorMessage("No debe ingresar nombre y dirección de forma simultánea")
      return undefined
    } else if ((!servType||servType.length === 0) && (!service||service.length === 0) 
        && (!address||address.length === 0) && (!category||category.length === 0) && (!providerService||providerService.length === 0)){
      setErrorMessage("Debe ingresar al menos un parámetro de búsqueda")
      return undefined
    }
    
    

    const params = 
      { p_service_type_for_scales_val: servType, 
        p_name_to_find: service,  
        p_direction_to_find: address, 
        p_provider_type: category,
        p_service_code: (!providerService?'':providerService),
        p_tipopreadmin: serviceTypeForValidate
      }
    try {
      let apiUrl = (serviceTypeForValidate? '/dbo/providers/get_providers_info_by_tipopreadmin' : '/dbo/providers/get_providers_info')
      const result = await Axios.post(apiUrl, params)
      if (result.data.result.length > 0){
        providers.map( item => {
          if (item.PROVIDER_TYPE_CODE === category) {
            filterCategory = item.SEARCH_IN_MAP_AS
          }
          return null
        })
        props.providerData([result.data.result, filterCategory])
      }else{
        props.providerData([])
        setErrorMessage("La busqueda no mostró ningún resultado")
      }
    } catch (e) {
      props.providerData("error")
      setErrorMessage("El servidor no responde. Por favor intenta más tarde")
    }
  }

  function backReturn(){
    props.retToProvLocContr(null)
  }

  return (
    <GridContainer>
        <GridItem xs={12} sm={5} md={5} className={classes.pTop30}>
          <form className={classes.root} onSubmit={handleSubmitProviders}>
            <FormControl fullWidth className={classes.selectFormControl}  style={{marginBottom: '20px'}}>
                <InputLabel htmlFor="my-id-category">¿Qué deseas ubicar?</InputLabel>
                <Select
                    id="my-id-category"
                    fullWidth
                    native
                    value={category}
                    onChange={changeInput}
                    inputProps={{
                        name: 'category',
                        id: 'my-id-category',
                    }}>
                    <option key="" aria-label="None" value="" />
                    {providers && providers.map( (item,index) => <option
                      key={`abc__${index}`}
                      value={item.PROVIDER_TYPE_CODE}>
                      {item.PROVIDER_TYPE_DESCRIPTION}</option>)
                    }
                </Select>
            </FormControl>
            {providerServices&&lvalProviderServices&&
              <FormControl fullWidth className={classes.selectFormControl}  style={{marginBottom: '20px'}}>
                  <InputLabel htmlFor="provider_service_id">Tipos de Servicios</InputLabel>
                  <Select
                      id="provider_service_id"
                      fullWidth
                      native
                      value={providerService}
                      onChange={changeInput}
                      inputProps={{
                          name: 'provider_service',
                          id: 'provider_service_id',
                      }}>
                    <option key="" aria-label="None" value="" />
                    {providerServices && providerServices.map( (item,index) => <option
                        key={`abc__${index}`}
                        value={item.VALOR}>
                        {item.DESCRIPCION}</option>)
                      }
                    </Select>
              </FormControl>
            }
            <TextField id="service" name="service" label="Buscar por nombre" onChange={changeInput} />
            <TextField id="address" name="address" label="Buscar por dirección" onChange={changeInput} />
            <span className={classes.errorMessage}>{errorMessage}</span>
            {props.callFrom === "SectionLocations"
            ? <GridContainer justify="center">
                <GridItem xs={6} sm={12} md={12}>
                    <Button className={classes.buttonLanding} fullWidth round color="primary" type="submit">
                    <Icon>search</Icon> Buscar
                    </Button>
                </GridItem>
              </GridContainer>
            : <>
                <GridContainer justify="center">
                  <GridItem xs={6}>
                      <Button fullWidth onClick={backReturn}>
                      <Icon>fast_rewind</Icon> Regresar
                      </Button>
                  </GridItem>
                  <GridItem xs={6}>
                      <Button fullWidth  color="primary" type="submit">
                      <Icon>search</Icon> Buscar
                      </Button>
                  </GridItem>
                </GridContainer>
                { servType &&
                  <GridContainer>
                    <GridItem xs={12} style={{ textAlign: "justify", marginTop: "20px"}}>
                      <Typography align="center" color="primary" variant="inherit">{ textCompany }</Typography>
                    </GridItem>
                  </GridContainer>
                }
              </>
            }
          </form>
        </GridItem>
        <GridItem xs={12} sm={7} md={7} align="center">
          <GridContainer>
            <GridItem xs={12} sm={3} md={3}>
            </GridItem>
            <GridItem xs={12} sm={9} md={9}>
                <Card background style={{ backgroundImage: `url(${smallMap})` }}>
                  <CardBody background><h3>Ubicación de Aliados</h3>
                    <p>
                      Con este formulario puedes conocer la ubicación de todos
                      nuestros aliados y recibir las indicaciones de como llegar.
                    </p>
                  </CardBody>
                </Card>
              </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
  )
}
