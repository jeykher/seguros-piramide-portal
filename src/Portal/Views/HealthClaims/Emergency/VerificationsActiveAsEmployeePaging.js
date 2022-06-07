import React, {useState} from 'react'
import Axios from 'axios'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'

export default function VerificationsActiveAsEmployeePaging() {

  const[isLoading, setIsLoading] = useState(false);
  
  return (
    <TableMaterial
      options={{
        search: false,
        toolbar: false,
        sorting: false,
        pageSize: 10
      }}
      columns={[
        { title: 'Fecha y Hora', field: 'VERIFICATION_DATE' },
        { title: 'Clinica', field: 'CLINIC_NAME' },
        { title: 'Cliente', field: 'CLIENT_NAME' }
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
          Axios.post('/dbo/health_claims/get_recents_verif4employees',params)
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
    />
  )
}





