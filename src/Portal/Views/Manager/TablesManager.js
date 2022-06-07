import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import {navigate} from 'gatsby'
import { Link } from '@reach/router'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'

export default function TablesManager(props) {
    const {jsonFather,dataFilter,schema}=props
    const [owner,setOwner] = useState()
    const [tablesmanager, settablesmanager] = useState()
    const [titleTable,setTitleTable]=useState()

    async function getTables(schema){
        const params = {
            p_owner: schema,
            p_json_father:jsonFather && JSON.stringify(jsonFather)
        }
        const response = await Axios.post('/dbo/portal_admon/getTables',params)
        setTitleTable(response.data.p_title)
        settablesmanager(response.data.p_tables)

    }
    useEffect(()=>{
        setOwner(schema)
        getTables(schema)
    },[schema,jsonFather,dataFilter])

    function handleClick(event, rowData){
        navigate(`/app/manager/table_columns_data/${rowData.OWNER}/${rowData.TABLE_NAME}`,{state:{ data: rowData,dataFilter:dataFilter,jsonFather:jsonFather}});
    }

    return (
        <GridContainer justify={'center'}>
            <GridItem xs={12} sm={12} md={12}>
                <CardPanel titulo={titleTable} icon="list_alt" iconColor="primary">
                    <TableMaterial
                        options={{
                            pageSize: 10
                        }}
                        columns={[
                            { title: 'Nombre de la Tabla', field: 'TITLE'}
                        ]}
                        data={tablesmanager}
                        onRowClick={(event, rowData) => handleClick(event, rowData)}
                    />
                </CardPanel>
            </GridItem>
        </GridContainer>
    )
}
