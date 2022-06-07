import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import TableFilter from './TableFilter'

export default function TableColumnsData({location, owner, table}) {
    const [columns, setcolumns] = useState()
    const [parents, setparents] = useState()
    const [listParents, setlistParents] = useState([])

    async function getColumnsData(){
        console.log('location')
        console.log(location)
        console.log(location.state.data)
        const params = {p_owner: owner,p_table: table}
        const response = await Axios.post('/dbo/portal_admon/getTableColumns',params)
        const jsonColumns = response.data.p_columns.slice(0, 8).map((reg)=> {
            return {title: reg.COLUMN_NAME, field: reg.COLUMN_NAME }
        })
        setcolumns(jsonColumns)
    }

    async function getParentTables(){
        const params = {p_owner: owner,p_table: table}
        const response = await Axios.post('/dbo/portal_admon/getParentTables',params)
        setparents(response.data.p_parent)
    }

    async function getListParents(){
        const params = {p_owner: owner,p_table: table}
        const response = await Axios.post('/dbo/portal_admon/getListParents',params)
        console.log('response.data.p_json')
        console.log(response.data.p_json)
        setlistParents(response.data.p_json)
    }

    useEffect(()=>{
        getColumnsData()
        getParentTables()
        getListParents()
    },[])

    function handleClick(event, rowData){
        alert(rowData)
        //navigate(`/app/workflow/service/${rowData.WORKFLOW_ID}`);
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={3}>
                <TableFilter data={listParents}/>
            </GridItem>
            <GridItem xs={12} sm={12} md={9}>
                <CardPanel titulo={`Tabla: ${table}`} icon="list_alt" iconColor="primary">           
                    <TableMaterial
                        options={{search: false,toolbar: false,sorting: false}}
                        columns={columns}
                        data={query => new Promise((resolve, reject) => {
                            console.log(query)
                            const params = {
                                p_owner: owner,p_table: table,
                                p_page_number: query.page + 1, p_rows_by_page: query.pageSize
                            }
                            Axios.post('/dbo/portal_admon/getTableData',params).then(result => {
                                resolve({
                                    data: result.data.p_data,
                                    page: query.page,
                                    totalCount: result.data.p_data[0].TOTAL_ROWS,
                                })
                            })
                        })}
                        onRowClick={(event, rowData) => handleClick(event, rowData)}
                    />           
                </CardPanel>
            </GridItem>
        </GridContainer>
    )
}

