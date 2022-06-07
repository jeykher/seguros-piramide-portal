import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useForm, Controller } from "react-hook-form";
import Icon from "@material-ui/core/Icon";
import CardPanel from 'components/Core/Card/CardPanel'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import ProviderLocationsController from "components/Core/ProviderLocationsController/ProviderLocationsController"
import Tooltip from '@material-ui/core/Tooltip';
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import IconButton from '@material-ui/core/IconButton';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import AutoCompleteWithData from 'components/Core/Autocomplete/AutoCompleteWithData'
import { Typography } from '@material-ui/core' 

export default function SelectServiceProviderAsInsured(props) {
  const { serviceType, clientCodeRequest, titleServiceRequest } = props
  const { handleSubmit, errors, control } = useForm()
  const [toggleFormMap, setToggleFormMap] = useState(true)
  const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
  const [optionsProvider, setOptionsProvider] = useState([])
  const [inputValueProvider, setInputValueProvider] = useState("")
  const [defaultValueProvider, setDefaultValueProvider] = useState("")
  const [viewProvider, setViewProvider] = useState(true)
  let textCompany = ''
  let iconStyled = null
  const buttonStyle = {
    color: "#F0252B",
    padding: "5px",
  }
  const controllerStyle = {
    flexGrow: "1",
    width: "100%",
    zIndex: "1301",
  }
  const iconStylePiramide = {
    fontSize: "35px",
    color: "#F0252B"
  }
  const iconStyleOceanica = {
    fontSize: "35px",
    color: "#00838f"
  }

  const styleInsured = insuranceCompany => {
    if (insuranceCompany === 'OCEANICA') {
      iconStyled = iconStyleOceanica
    } else {
      iconStyled = iconStylePiramide
    }
    return iconStyled
  }

  if (insuranceCompany === 'OCEANICA') {
    textCompany = "Si el centro que buscas no se encuentra en el listado, por favor comunícate con el 0800-OCEANIC (6232642)"
  } else {
    textCompany = "Si el centro que buscas no se encuentra en el listado, por favor comunícate con el 0800-SPIRAMI (7747264)"
  }

  function handleBack(e) {
    e.preventDefault();
    window.history.back()
  }

  async function onSubmit(dataform, e) {
    e.preventDefault();
    if (props.onSelectProvider) {
      await props.onSelectProvider(dataform.p_provider_code)
    }
  }

  function handleCallMap(e) {
    e.preventDefault();
    if (toggleFormMap) {
      setToggleFormMap(false)
    } else {
      setToggleFormMap(true);
    }
  }

  const returnToForm = (dataProvider) => {
    setViewProvider(false)
    setViewProvider(true)
    if (dataProvider) {
      setInputValueProvider({ VALUE: dataProvider.codProvider.toString().toUpperCase(), NAME: dataProvider.nameProvider.toString().toUpperCase() })
      setDefaultValueProvider(dataProvider.codProvider)
    } else {
      setInputValueProvider(null)
      setDefaultValueProvider(null)
    }
    setToggleFormMap(true)
  }

  async function getHealtProvider() {
    const params = { p_service_type_for_scales_val: (serviceType && serviceType === '04') ? serviceType : null }
    const response = await Axios.post('/dbo/health_claims/get_health_providers_list', params);
    const jsonCursor = response.data['p_health_providers_list']
    setOptionsProvider(jsonCursor)
  }
  useEffect(() => {
    getHealtProvider()
  }, [])

  return (
    <>
      { toggleFormMap
        ? <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardPanel titulo={titleServiceRequest} icon="playlist_add_check" iconColor="primary" >
            <GridContainer justify="center">
              <GridItem xs={10} sm={10} md={11} style={{ padding: "0 0 0 15px" }}>
                <Controller
                  label="Seleccione donde desea ser atendido"
                  options={optionsProvider}
                  as={AutoCompleteWithData}
                  noOptionsText="Cargando"
                  defaultValue={defaultValueProvider ? defaultValueProvider : undefined}
                  inputValue={inputValueProvider}
                  name="p_provider_code"
                  control={control}
                  rules={{ required: true }}
                  onChange={([e, value]) => {
                    setInputValueProvider(value)
                    return value ? value["VALUE"] : null
                  }}
                  helperText={errors.p_provider_code && "Debe indicar un proveedor"}
                />
              </GridItem>
              <GridItem xs={2} sm={2} md={1} style={{ padding: "0" }}>
                <Tooltip title="Buscar en el mapa un centro de atención" placement="right-start" arrow style={{ fontSize: "70px" }}>
                  <IconButton style={buttonStyle} onClick={handleCallMap}>
                    <AddLocationIcon style={styleInsured(insuranceCompany)} />
                  </IconButton>
                </Tooltip>
              </GridItem>
            </GridContainer>
            <CardFooter>
              <GridContainer justify="center">
                <Button color="secondary" onClick={handleBack}>
                  <Icon>fast_rewind</Icon> Regresar
                          </Button>
                <Button color="primary" type="submit">
                  <Icon>send</Icon> Seleccionar
                          </Button>
              </GridContainer>
            </CardFooter>
            <GridContainer justify="center">

              <Typography align="center" color="primary" variant="inherit">{textCompany}</Typography>

            </GridContainer>
          </CardPanel>
        </form>
        : <CardPanel titulo={titleServiceRequest} icon="playlist_add_check" iconColor="primary">
          <ProviderLocationsController
            serviceType={serviceType}
            serviceTypeForValidate={serviceType}
            callFrom={"SelectServiceProviderAsInsured"}
            returnToForm={returnToForm}
          />
        </CardPanel>
      }
    </>
  )
}
