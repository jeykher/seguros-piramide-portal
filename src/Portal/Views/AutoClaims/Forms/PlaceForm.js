import React,{ Fragment }  from "react"
import InputController from "../../../../components/Core/Controller/InputController"
import DateTimeMaterialPickerController from "../../../../components/Core/Controller/DateTimeMaterialPickerController"
import AddressController from "../../../../components/Core/Controller/AddressController"

export default function PlaceForm(props) {
  const { objForm, index } = props;
  return (<Fragment>
            <DateTimeMaterialPickerController disableFuture objForm={objForm} label="Fecha" name={`p_fecha_siniestro_${index}`}/>
            <AddressController
              index={index}
              objForm={objForm}
              isPublic={true}
              showCountry={false}
              showUrbanization={false}
              showDetails={false}
            />
            <InputController  objForm={objForm} label="Direccion"  onClick={(e)=>{
             e.preventDefault()
            }}  onFocus={(e)=>{
              e.preventDefault()
              e.target.autocomplete = "whatever";
            }} name={`p_direccion_${index}`} multiline />
            <InputController  objForm={objForm} label="Punto de Referencia" name={`p_referencia_${index}`}/>
    </Fragment>
  )
}