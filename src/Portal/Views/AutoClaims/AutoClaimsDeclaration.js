import React, { Fragment, useEffect, useState } from "react"
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import InfoCard from "./InfoCard"
import VehicleFormOnClaims from "./Forms/VehicleFormOnClaims";
import ClaimViewForms from "./Forms/ClaimViewForms"

export default function AutoClaimsDeclaration({ location }) {
  const [showFormVehicle, setShowFormVehicle] = useState(false);
  const [showFormClaim, setShowFormClaim] = useState(false);
  const [insured, setInsured] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [identification, setIdentification] = useState([])
  const dialog = useDialog()

  function handleShowVehicle() {
    setShowFormClaim(false);
    setShowFormVehicle(true);
  }
  function updateVehicle(vehicle) {
    setShowFormVehicle(false);
    if (vehicle) {
      const dataVehicle = {
        'Marca/Modelo': vehicle.MARK_OF_VEHICLE+' '+ vehicle.VEHICLE_MODEL,
        'Año': vehicle.VEHICLE_YEAR,
        'Color': vehicle.VEHICLE_COLOR,
        'Placa': vehicle.PLATE_NUMBER,
        'Serial Motor': vehicle.ENGINE_SERIAL,
        'Serial Carroceria': vehicle.VEHICLE_CHASSIS_SERIAL
      }
      const dataInsured = {
        'Póliza': vehicle.POLICY_NUMBER,
        'Propietario': vehicle.INSURED_NAME,
        'C.I': vehicle.IDENTIFICATION_TYPE + ' ' + vehicle.IDENTIFICATION_NUMBER,
        'Edad': vehicle.AGE,
        'Correo Electrónico': vehicle.CLIENT_EMAIL,
        'Teléfonos': vehicle.COD_CELL_PHONE + '.' + vehicle.CELL_PHONE_NUMBER + '-' + vehicle.ROOM_PHONE_NUMBER
      }
      const dataIdentification = {
        'TipoId': vehicle.IDENTIFICATION_TYPE,
        'NumId': vehicle.IDENTIFICATION_NUMBER,
        'Idepol': vehicle.IDEPOL,
        'Numcert': vehicle.CERTIFIED_NUMBER,
        'TipoVehicle': vehicle.TYPE_OF_VEHICLE,
        'Propietario': vehicle.INSURED_NAME,
        'Email': vehicle.CLIENT_EMAIL,
        'Phone': vehicle.COD_CELL_PHONE + '' + vehicle.CELL_PHONE_NUMBER,
        'Sexo': vehicle.SEX,
        'Edad': vehicle.AGE
      }
      setVehicle(Object.entries(dataVehicle))
      setInsured(Object.entries(dataInsured))
      setIdentification(dataIdentification);
    }
    setShowFormClaim(true);
  }

  function newClaim() {
    setVehicle(null);
    setShowFormVehicle(true);
  }

  async function setVehiclePolicy(policy) {
    const params = { p_policy_id: policy.policy_id, p_certified_id: policy.certified_id }
    const response = await Axios.post('dbo/auto_claims/get_vehicle', params)
    const cursorVeh = response.data.p_cursor
    if (cursorVeh.length !== 1) {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "La póliza no permite la declaración de siniestros"
      })
      window.history.back()
    } else {
      updateVehicle(cursorVeh[0])
    }
  }

  async function verifyData() {
    const { Datavehicle, policy } = location.state;
    if (Datavehicle) {
      updateVehicle(Datavehicle)
    } else if (policy) {
      setVehiclePolicy(policy)
    } else {
      setShowFormVehicle(true)
    }
  }
  useEffect(() => {
    verifyData()
  }, [])


  return (
    <Fragment>
      {showFormVehicle && <VehicleFormOnClaims updateVehicle={updateVehicle} update={!!vehicle} />}
      <GridContainer>
        <GridItem item xs={12} sm={12} md={12} lg={12}>
          {(insured && showFormClaim) && <InfoCard titulo="Datos del Asegurado" icono="perm_identity" colores="primary" showForm={handleShowVehicle} dataInsured={insured} dataVehicle={vehicle} />}
        </GridItem>
        <GridItem item xs={12} sm={12} md={12} lg={12}>
          {showFormClaim && <ClaimViewForms identification={identification} index={'CLAIM'} />}
        </GridItem>
      </GridContainer>
    </Fragment>
  )
}