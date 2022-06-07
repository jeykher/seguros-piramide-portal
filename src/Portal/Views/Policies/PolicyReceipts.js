import React, { useState, useEffect, Fragment   } from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import Cardpanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem"
import Axios from 'axios';


export default function PolicyReceipts(props) {
    const {policy_id, certified_id} = props
    const [receipts, setReceipts] = useState([])
    const [showReceipts, setShowReceipts] = useState(false)

    
    async function getPolicyReceipts() {
        const params = { p_policy_id: policy_id, p_certified_id: certified_id }
        const result = await Axios.post('dbo/general_policies/get_policy_receipts_by_cert', params)

        if (result.data && result.data.c_receipts && result.data.c_receipts.length > 0) {
          setShowReceipts(true)
        }

        setReceipts(result.data.c_receipts)
    }

    useEffect(() => {
        getPolicyReceipts()
    }, [])

    return (

      <Fragment>
        {showReceipts && <Cardpanel titulo="Recibos" icon="article" iconColor="primary">
        <GridContainer alignItems="center" align = "center" justify = "center" >
          <GridItem xs={12} sm={12} md={12}>
            <TableMaterial
                options={{ actionsColumnIndex: -1, paging: false, search: false, toolbar: false, sorting: false }}
                columns={[
                    { title: 'Nro', field: 'NUMREC' , width: '25%' , 
                    headerStyle: {
                        backgroundColor: '#f3f3f0',
                        fontWeight: 'bold',
                        textAlign: 'center'
                      },
                      cellStyle: {
                        fontSize: '0.9em',
                        textAlign: 'center',
                        borderStyle:'none'
                      }
                    },
                    { title: 'Estatus', field: 'STSREC',  width: '20%', 
                    headerStyle: {
                        backgroundColor: '#f3f3f0',
                        fontWeight: 'bold',
                        textAlign: 'center'
                      },
                      cellStyle: {
                        fontSize: '0.9em',
                        textAlign: 'center',
                        borderStyle:'none'
                      }
                    },
                    {
                        title: 'Vigencia', field: 'FECINIVIG', alignTitle: 'center',
                        headerStyle: {
                            backgroundColor: '#f3f3f0',
                            fontWeight: 'bold',
                            textAlign: 'center'
                          },
                          cellStyle: {
                            fontSize: '0.9em', 
                            textAlign: 'center',
                            borderStyle:'none'
                          },
                        render: rowData => ((rowData.FECINIVIG + ' - ' + rowData.FECFINVIG  ))
                    }
                ]}
                data={receipts}
            />
            </GridItem>
        </GridContainer>
    </Cardpanel>}
      </Fragment>

      


  
      
    )
}
