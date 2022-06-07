import React, { useEffect, useState } from "react"
import Axios from "axios"
import CardPanel from "components/Core/Card/CardPanel"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import IdentificationFormatDisplay from "components/Core/NumberFormat/IdentificationFormatDisplay"

export default function VehicleFormOnClaims({ updateVehicle, update }) {
  const [openVehicle, setopenVehicle] = useState(false)
  const [dataVehicle, setdataVehicle] = useState(null)

  const onSelectionVehicle = (e, rowData) => {
    updateVehicle(rowData);
    setopenVehicle(false);
  };

  async function onVerifyVehicle() {
    const response = await Axios.post('/dbo/auto_claims/get_list_of_vehicules')
    const arrayResult = response.data.p_cursor
    if (arrayResult.length > 1) {
      setdataVehicle(arrayResult)
      setopenVehicle(true)
    } else {
      updateVehicle(arrayResult[0])
    }
  }

  useEffect(() => {
    onVerifyVehicle()
  }, [])

  return (
    openVehicle &&
    <GridContainer>
      <GridItem item xs={12} sm={12} md={12} lg={12}>
        <CardPanel
          titulo="Seleccione un Vehículo"
          icon="drive_eta"
          iconColor="primary"
        >
          <TableMaterial
            options={{
              pageSize: 10
            }}
            width= '60%'
            columns={[
              { title: 'Póliza', field: 'POLICY_NUMBER',  width: '10%'},
              { title: 'Certificado', field: 'CERTIFIED_NUMBER',  width: '5%', cellStyle: {textAlign: 'center'}, headerStyle: {textAlign: 'center'}},
              { title: 'Nombre Cliente', field: 'INSURED_NAME',  width: '20%'},
              { title: 'Cédula Cliente', field: 'IDENTIFICATION_NUMBER',  width: '15%', editable: 'never', cellStyle: {textAlign: 'center'}, headerStyle: {textAlign: 'center'}, 
              render: rowData => (<IdentificationFormatDisplay name={"IDENTIFICATION_NUMBER_" + rowData.IDEPOL + "_" + rowData.CERTIFIED_NUMBER} value={rowData.IDENTIFICATION_NUMBER}/>) },
              { title: 'Placa', field: 'PLATE_NUMBER',  width: '10%'},
              { title: 'Marca', field: 'MARK_OF_VEHICLE' ,  width: '10%'},
              { title: 'Modelo', field: 'VEHICLE_MODEL',  width: '10%' },
              { title: 'Año', field: 'VEHICLE_YEAR',  width: '10%' }
            ]}
            data={dataVehicle}
            onRowClick={(event, rowData) => onSelectionVehicle(event, rowData)}
          />
        </CardPanel>
      </GridItem>
    </GridContainer>
  )
}