import React, {useState} from 'react'
import { navigate } from 'gatsby'
import Axios from 'axios'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'

export default function VerificationsActivePaging() {

  const[isLoading, setIsLoading] = useState(false);

  function handleVerification(event, rowData){
    navigate(`/app/siniestro_salud/solicitud_ingreso/${rowData.VERIFICATION_ID}`);
  }
  
  return (
    <TableMaterial
      options={{
        search: false,
        toolbar: false,
        sorting: false,
        pageSize: 10
      }}
      columns={[
        { title: 'Asegurado', field: 'CLIENT_NAME' },
        { title: 'Fecha', field: 'VERIFICATION_DATE' }
      ]}
      //data={verifications}
      data={query =>
        new Promise((resolve, reject) => {
          console.log(query)
          setIsLoading(true)
          const params = {
            p_service_type: "02", p_status: "PENDING", p_query_date: '01/02/2020',
            p_page_number: query.page + 1, p_rows_by_page: query.pageSize
          }
          Axios.post('/dbo/health_claims/get_recents_verifications_p',params)
            .then(result => {
              let count = result.data.result.length > 0 ? result.data.result[0].TOTAL_ROWS : 0
              console.log(count)
              resolve({
                data: result.data.result,
                page: query.page,
                totalCount: count
            })
          })
          setIsLoading(false)
        })
      }
      isLoading={isLoading}
      onRowClick={(event, rowData) => handleVerification(event, rowData)}
    />
  )
}





