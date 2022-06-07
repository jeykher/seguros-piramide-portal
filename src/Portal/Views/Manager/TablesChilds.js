import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import {navigate} from 'gatsby'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'

export default function TablesChilds(props) {
    const [tableschilds, settableschilds] = useState()

    async function getTablesChilds(){
        const params = {p_owner: owner}
        const response = await Axios.post('/dbo/portal_admon/getTables',params)
        console.log(response.data.p_tables)
        settablesmanager(response.data.p_tables)

    }
    useEffect(()=>{
        getTablesChilds()
    },[])

    function handleClick(event, rowData){
        navigate(`/app/tables_manager/table_columns_data/${rowData.OWNER}/${rowData.TABLE_NAME}`);
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <CardPanel titulo={`Esquema: ${owner}`} icon="list_alt" iconColor="primary">
                    <TableMaterial
                        options={{
                            pageSize: 20
                        }}
                        columns={[
                            { title: 'TABLE_NAME', field: 'TABLE_NAME'}
                        ]}
                        data={tablesmanager}
                        onRowClick={(event, rowData) => handleClick(event, rowData)}
                    />
                </CardPanel>
            </GridItem>
        </GridContainer>
    )
}
