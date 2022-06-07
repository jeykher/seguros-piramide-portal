import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'
import Axios from 'axios'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'

export default function VerificationsActive() {
  const [verifications, setVerifications] = useState()
  const[isLoading, setIsLoading] = useState(false);

  function handleVerification(event, rowData){
    navigate(`/app/siniestro_salud/solicitud_ingreso/${rowData.VERIFICATION_ID}`);
  }
  
  async function getVerifications(){
    try{
      setIsLoading(true);
      const params = {
        p_service_type: "02", p_status: "PENDING", p_query_date: '01/02/2020'
      }
      const result = await Axios.post('/dbo/health_claims/get_recents_verifications',params)
      console.log(result)
      setVerifications(result.data.result)
      setIsLoading(false);
    }catch(error){
  
    }
  }
  
  useEffect(()=>{
    getVerifications()
  }, [])
  
  return (
    <TableMaterial
      options={{
      }}
      columns={[
        { title: 'Asegurado', field: 'CLIENT_NAME' },
        { title: 'Fecha', field: 'VERIFICATION_DATE' }
      ]}
      data={verifications}
      isLoading={isLoading}
      onRowClick={(event, rowData) => handleVerification(event, rowData)}
    />
  )
}





