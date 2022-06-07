import React, { useEffect, useState } from "react"
import CardPanel from "../../../../components/Core/Card/CardPanel"
import GridContainer from "../../../../components/material-dashboard-pro-react/components/Grid/GridContainer"
import GridItem from "../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import SelectSimpleController from "../../../../components/Core/Controller/SelectSimpleController"
import InputController from "../../../../components/Core/Controller/InputController"
import PhoneController from "../../../../components/Core/Controller/PhoneController"
import AddressController from "../../../../components/Core/Controller/AddressController"
import Axios from "axios"

export default function WorkshopForm(props) {
  const {objForm, index } = props;
  const [localidades,setLocalidades]=useState([]);
  const [talleres,setTalleres]=useState([]);
  const [mostrarDatosTaller,setMostarDatosTaller]=useState(false)


  async function get_list_location() {
    const response = await Axios.post('/dbo/auto_claims/get_list_location')
    const arrayResult = response.data.p_cursor
    setLocalidades(arrayResult)
  }

  async function get_list_automotive_workshop(e) {
    const params = {
      p_location: e
    }
    const response = await Axios.post('/dbo/auto_claims/get_list_automotive_workshop',params)
    const arrayResult = response.data.p_cursor
    setTalleres(arrayResult)
  }

   function handleWorkshop(e) {
    if(e==''){
      setMostarDatosTaller(false)
      return
    }
   talleres.find(taller => {
         if (taller.CODIGO_PROVEEDOR === e)
           if (taller.INDTALLERAFILIADO === "N")
             setMostarDatosTaller(true)
           else
             setMostarDatosTaller(false)

       })


  }



  useEffect(() => {
    get_list_location()
  }, [])

  return (
    <CardPanel titulo="Selección de taller" icon="home_work" iconColor="success">
      <GridContainer>
        <GridItem className="flex-col-scroll " item xs={12} sm={12} md={12} lg={12}>
          <SelectSimpleController objForm={objForm} label="Seleccione localidad" onChange={v => get_list_automotive_workshop(v)} name={`p_localidad_${index}`} array={localidades}/>
          <SelectSimpleController objForm={objForm} label="Seleccione un taller" onChange={v => handleWorkshop(v)} array={talleres} name={`p_taller_${index}`}/>
          {mostrarDatosTaller && <InputController objForm={objForm} label="Nombre del taller" name={`p_nombre_taller_${index}`}/>}
        </GridItem>
        {mostrarDatosTaller &&  <GridItem className="flex-col-scroll " item xs={12} sm={12} md={12} lg={12}>
          <InputController objForm={objForm} label="Nombre de contacto" name={`p_nombre_contacto_${index}`}/>
          <PhoneController objForm={objForm} label="Teléfono fijo" name={`p_telefono_${index}`}/>
          <PhoneController objForm={objForm} label="Teléfono móvil" name={`p_movil_${index}`}/>
          <AddressController
            index={index}
            objForm={objForm}
            isPublic={true}
            showCountry={false}
            showUrbanization={false}
            showDetails={false}
          />
          <InputController  objForm={objForm} label="Direccion" name={`p_direccion_taller_${index}`} multiline />
          <InputController  objForm={objForm} label="Punto de Referencia" name={`p_referencia_taller_${index}`}/>
        </GridItem>}
      </GridContainer>
    </CardPanel>
  )
}