import React, { useState, useEffect } from 'react'
import {navigate} from 'gatsby'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import TablesManager from "./TablesManager"
import TableFilter from './TableFilter'
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import styles from "components/Core/Card/cardPanelStyle"
import { makeStyles } from "@material-ui/core/styles"
import Quote from "../../../components/material-dashboard-pro-react/components/Typography/Quote"
const useStyles = makeStyles((theme) => ({
    ...styles,
    containerGrid: {
        padding: "0 20%",
    },
    containerTitle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    buttonContainer: {
        alignSelf: "flex-end",
    },
    quoteContainer: {
        alignSelf: "flex-start",
    },
}))

export default function TableColumnsData({location, owner, table,dataFilter}) {
    const [columns, setcolumns] = useState()
    const [data,setdata] = useState()
    const [layout,setLayout] = useState(location.state.data)
    const [father,setFather]=useState(location.state.jsonFather)

    const classes = useStyles()

    async function getColumnsData(){
        const params = {p_owner: owner,p_table: table}
        const response = await Axios.post('/dbo/portal_admon/getTableColumns',params)
        const jsonColumns = response.data.p_columns.map((reg)=> {
            return {title: reg.TITLE, field: reg.FIELD }
        })
        setcolumns(response.data.p_columns)

    }

    function eventFilter(dataFilter){
        getTableData(dataFilter)
    }

    async function getTableData(dataFilter,jsonFather){
        const params = {
            p_owner: owner,
            p_table: table,
            p_filter: dataFilter && JSON.stringify(dataFilter),
            p_json_father: jsonFather && JSON.stringify(jsonFather)
        }
        const response = await Axios.post('/dbo/portal_admon/getTableData',params)
        setdata(response.data.p_data)
    }

    useEffect(()=>{
        getColumnsData()
        getTableData(location.state.dataFilter,location.state.jsonFather)
    },[owner,table,location])

    function handleClick(event, rowData){
        navigate(`/app/formulario/${layout.LAYOUT_CODE}`,{state:{ data: rowData }})
    }

    function handleClickIcons(event,rowData){
        navigate(`/app/formulario/${layout.LAYOUT_CODE}`,{state:{ father: location.state.dataFilter, data: null}})
    }

    function onBack(event){
        navigate(`/app/manager/tables/${owner}/`,{state:{ data: layout }})
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <CardPanel titulo={`${layout.TITLE}`} icon="list_alt" iconColor="primary">
                    { layout.DESCRIPTION &&
                    <GridContainer justify="flex-start">
                        <Quote className={classes.quoteContainer}
                               text={layout.DESCRIPTION}
                        />
                    </GridContainer>}
                    <GridContainer justify="flex-end">

                        <Tooltip title={`Agregar ${layout.TITLE}`} placement="right-start" arrow className={classes.buttonContainer}>
                            <IconButton onClick={(event) =>handleClickIcons(event)}>
                                <Icon style={{ fontSize: 36 }} color={"primary"}>add_circle</Icon>
                            </IconButton>
                        </Tooltip>
                    </GridContainer>
                    <TableMaterial
                        options={{
                            pageSize: 10
                        }}
                        columns={columns}
                        data={data}
                        onRowClick={(event, rowData) => handleClick(event, rowData)}
                    />                   
                </CardPanel>
            </GridItem>
            <GridContainer justify="center">
                <Button onClick={onBack}><Icon>fast_rewind</Icon> Regresar</Button>
            </GridContainer>
        </GridContainer>
    )
}

