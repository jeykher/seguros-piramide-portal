import React, { useState, Fragment } from 'react'
import Axios from 'axios'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'

export default function ErrorsLog() {
    const [errorDetail, setErrorDetail] = useState(null)
    return (
        <GridContainer>
            <GridItem item xs={12} sm={12} md={4} lg={4}>
                <CardPanel titulo="Log" icon="error" iconColor="primary">
                    <TableMaterial
                        options={{ search: false, pageSize: 10, toolbar: false, sorting: false }}
                        columns={[
                            { title: 'ID', field: 'ID_ERROR_LOG', width: 100 },
                            { title: 'Fecha/Hora', field: 'DATE_COMPLETE' }
                        ]}
                        data={query =>
                            new Promise((resolve, reject) => {
                                console.log(query)
                                const params = { p_page_number: query.page, p_rows_by_page: 10 }
                                Axios.post('/dbo/portal_admon/get_errors_log', params)
                                    .then(result => {
                                        let count = result.data.c_errors_log.length > 0 ? result.data.c_errors_log[0].TOTAL : 0
                                        resolve({
                                            data: result.data.c_errors_log,
                                            page: query.page,
                                            totalCount: count,
                                        })
                                    })
                            })
                        }
                        onRowClick={(event, rowData) => setErrorDetail(rowData)}
                    />
                </CardPanel>
            </GridItem>
            <GridItem item xs={12} sm={12} md={8} lg={8}>
                {errorDetail && <Fragment>
                    <CardPanel titulo="Error" icon="message" iconColor="primary">
                        <h6>{errorDetail.EXCEPTION_MESSAGE}</h6>
                    </CardPanel>
                    <CardPanel titulo="Detalle" icon="info" iconColor="primary">
                        <h6><strong>ID: </strong>{errorDetail.ID_ERROR_LOG} </h6>
                        <h6><strong>Codigo error: </strong>{errorDetail.EXCEPTION_CODE} </h6>
                        <h6><strong>Mensaje error: </strong></h6><h6>{errorDetail.EXCEPTION_MESSAGE} </h6>
                        <h6><strong>Aplicacion: </strong>{errorDetail.APPLICATION} </h6>
                        <h6><strong>Codigo Aplicacion: </strong>{errorDetail.APPLICATION_CODE} </h6>
                        <h6><strong>Mensaje Aplicacion: </strong></h6><h6>{errorDetail.APPLICATION_MESSAGE} </h6>
                        <h6><strong>Parametros: </strong></h6><h6>{errorDetail.JSON_PARAMS_TRANSACTION} </h6>
                        <h6><strong>Fecha: </strong>{errorDetail.ERROR_DATE} </h6>
                        <h6><strong>Usuario: </strong>{errorDetail.ERROR_USER} </h6>
                    </CardPanel>
                </Fragment>}
            </GridItem>
        </GridContainer>
    )
}



