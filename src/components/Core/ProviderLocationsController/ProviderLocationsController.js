import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import providerLocationsControllerStyle from "./providerLocationsControllerStyle"
import ProviderForm from "./ProviderForm"
import ProviderList from "./ProviderList"
import ProviderMap from "./ProviderMap"
import ProviderSearchEngine  from "./ProviderSearchEngine"
import Button from "components/material-kit-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import LinearProgress from '@material-ui/core/LinearProgress';
const useStyles = makeStyles(providerLocationsControllerStyle); 

let providMapSearch = []
let dataProvSelected = []
let searchLevel = 0
let providerList = []
let mapMessage = ''
let mapMessageAddress = 'Direcciones cercanas. Colocando el ratón sobre los indicadores\
                        de color azúl, puede ver la dirección de cada uno. Haga click \
                        sobre estos para recibir instrucciones de como llegar. \
                        Los de color verde muestran más direcciones.'
let mapMessageName = 'Sitio encontrado. Colocando el ratón sobre los indicadores \
                          de color azúl, puede ver la dirección de cada uno. Haga \
                          click sobre estos para recibir instrucciones de como llegar. \
                          Los de color verde muestran más direcciones.'
let mapMessageRed = 'No es posible indicar una calle o avenida cercana.'
let fontColour = ''
let fontColourRed = '#FC2D22'
let fontColourGreen = '#00838f'
let classArray = []
let valueLoading = true
let loadingTmp = ''
let engineStatus = false

export default function ProviderLocationsController(props) {

  const classes = useStyles()
  const [viewManager, setViewManager] = useState('ProviderForm')
  const [searchActive, setSearchActive] = useState(false)
  const providerData = (data) => {
    if (data.length > 0) {
      providerList = data
      setViewManager('ProviderList')}
  }

  const funcClassMsg = (fontColour) => {
    classArray = fontColour === '#FC2D22'
    ? [classes.messageMap, classes.colorMessageRed]
    : classArray = [classes.messageMap, classes.colorMessageGreen]
    return classArray.join(' ')}

  const coordProvReturned = (item) => {
    if (item.statusType === 'empty' && searchLevel === 0) {
      searchLevel = 1
      valueLoading = true
      setSearchActive(true)
    }else if(item.statusType === 'address' && searchLevel === 1){
      providMapSearch = item
      searchLevel = 2
      mapMessage = mapMessageAddress
      fontColour = fontColourGreen
      valueLoading = false
      engineStatus = false
      setSearchActive(true)
    }else if(item.statusType === 'name' && searchLevel === 0){
      providMapSearch = item
      searchLevel = 2
      mapMessage = mapMessageName
      fontColour = fontColourGreen
      valueLoading = false
      engineStatus = false
      setSearchActive(true)
    }else{
      providMapSearch = {providerMap:[[6.745673, -65.275475, "Jauja-Sarisariñama"]]}
      searchLevel = 2
      mapMessage = mapMessageRed
      fontColour = fontColourRed
      valueLoading = false
      engineStatus = false
      setSearchActive(true)
    }
  }

  const providerSelected = (item) => {
    if (!engineStatus) {
      searchLevel = 0
      dataProvSelected = item
      mapMessage = ''
      fontColour = ''
      valueLoading = true
      engineStatus = true
      setSearchActive(true)
    }else{
    }
  }

  const markerData = (item) => {
    //Permite capturar las coordenadas de latitud y longitud del marcador al
    //que el usuario ha hecho click. adema de traer la url para Google maps.
  }

  const goToWithOut = () => {
    providMapSearch = {providerMap:[[6.745673, -65.275475, "Jauja-Sarisariñama"]]}
    setViewManager('ProviderForm')
  }

  const showLoading = (valueLoading) => {
    loadingTmp = valueLoading
    ? [classes.linealShow]
    : [classes.linealHide]
    return loadingTmp.join(' ')
  }

  const gotoSectionLocation = () => {
    if (props.callFrom !== "SectionLocations") {
      props.returnToForm({codProvider: dataProvSelected[0].CODIGO_PROVEEDOR, nameProvider: dataProvSelected[0].NOMBRE_PROVEEDOR})
    }
  }

  const retToProvLocContr = (item) => {
    if (props.callFrom !== "SectionLocations") {
      props.returnToForm(item)
    }
  }

  useEffect(() => {
    if (searchActive) {

      ProviderSearchEngine({item: dataProvSelected, searchLevel:searchLevel, coordProvReturned:coordProvReturned})
      setSearchActive(false)
    }
  }, [searchActive])

  return (
    <>
      {
        viewManager === 'ProviderForm'
        ?<ProviderForm
          serviceType={props.serviceType}
          callFrom={props.callFrom}
          providerData={providerData}
          retToProvLocContr={retToProvLocContr}
          serviceTypeForValidate={props.serviceTypeForValidate}
          />
        :<>
          <GridContainer>
            <GridItem xs={12} sm={5} md={5}>
              <ProviderList
                callFrom={props.callFrom}
                providerList={providerList}
                providerSelected={providerSelected}
                />
            </GridItem>
            <GridItem xs={12} sm={7} md={7}>
              <ProviderMap
                providMapSearch={providMapSearch}
                markerData={markerData}
              />
              <LinearProgress className={showLoading(valueLoading)}/>
            </GridItem>
          </GridContainer>
            {props.callFrom !== "SectionLocations"
            ? <><GridContainer className={classes.containerTopLef}>
              <GridItem xs={12} sm={5} md={5}>
                <Button fullWidth onClick={goToWithOut}>
                  <Icon>fast_rewind</Icon> Regresar
                </Button>
              </GridItem>
              <GridItem xs={12} sm={7} md={7} className={classes.tCenter}>
                { fontColour === "#00838f"
                  ? <Button fullWidth color="primary" onClick={gotoSectionLocation}>
                    <Icon>check_box</Icon> Seleccionar
                    </Button>
                  :  <span className={funcClassMsg(fontColour)}>{mapMessage}</span>
                }
              </GridItem>
            </GridContainer>
            { fontColour === "#00838f" && <GridContainer className={classes.containerTopLef}>
              <GridItem xs={12} className={funcClassMsg(fontColour)}>
                {mapMessage}
              </GridItem>
            </GridContainer> }</>
            : <><GridContainer className={classes.containerTopLef}>
              <GridItem xs={12} sm={5} md={5}>
                <Button fullWidth round color="primary" onClick={goToWithOut}>
                  Regresar
                </Button>
              </GridItem>
              <GridItem xs={12} sm={7} md={7} className={funcClassMsg(fontColour)}>
                {mapMessage}
              </GridItem>
            </GridContainer></>
          }
        </>
      }
    </>
  )
}
