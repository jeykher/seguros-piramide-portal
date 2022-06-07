import React, { useState, useEffect } from 'react'
import { useForm, Controller} from "react-hook-form"
import { makeStyles } from "@material-ui/core/styles"
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import CardPanel from "components/Core/Card/CardPanel"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import SelectSimple from 'components/Core/SelectSimple/SelectSimple'
import AmountFormatInput from 'components/Core/NumberFormat/AmountFormatInput'
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import Icon from "@material-ui/core/Icon"
import NumberOnlyFormat from 'components/Core/NumberFormat/NumberOnlyFormat'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Axios from 'axios'
import { ControlCameraOutlined } from '@material-ui/icons'


const useStyles = makeStyles(() => ({
    
    containerFilters:{
      marginBottom: '1.75em'
    },
    containerCurrency: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: '1.75em'
      },
  }))

export default function SparePartsTable(props) {
    const { spId, spList,
            currencyBudget,
            saveSpareParts,
            saveSparePartsInTable,
            arrayQuality,
            handleCurrencySelect,
            titleSpareList,
            selectListValue} = props
    const {  handleSubmit, ...objForm } = useForm()
    const [isSaving,setIsSaving] = useState(false)
    const [currencyValues, setCurrencyValues] = useState([])
    const classes = useStyles()

    async function getCurrencyList() {
        const params = { p_list_code: 'TPMOPPRO' }
        const result = await Axios.post('/dbo/toolkit/get_values_list', params)
        setCurrencyValues(result.data.p_cursor)
    }

    async function onSubmit(dataform, e) {
        e.preventDefault();
        saveSpareParts(dataform);
      }

      useEffect(() => {
        getCurrencyList()
    }, [])

    return(
        <CardPanel titulo=" Repuestos cotizados " icon="build" iconColor="info">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <GridContainer className={classes.containerCurrency}>
                    <GridItem xs={6} sm={6} md={8} lg={9}>
                    </GridItem>
                    <GridItem xs={6} sm={6} md={4} lg={3}>
                        <SelectSimple
                            label="Moneda"
                            array={currencyValues}
                            value={currencyBudget}                            
                            name={"currency"}
                            onChange={(e)=> handleCurrencySelect(e)}
                            id="currency"
                            rules={{ required: true }}
                        />
                    </GridItem>
                </GridContainer>
                <GridContainer >
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                        <TableMaterial
                            options={{
                                pageSize: 10, search: false, toolbar: false, sorting: false
                            }}
                            columns={[
                                {
                                    title: 'Código Repuesto', field: 'CODREPUESTO', editable: 'never'
                                },
                                {
                                    title: 'Descripcion', field: 'DESCREPUESTO', editable: 'never'
                                },
                                {
                                    title: 'Precio Unitario', field: 'PRECIO_UNITARIO', type: 'currency', headerStyle: { textAlign: 'center' },
                                    render: rowData => (<AmountFormatDisplay name={"sparePartsPrice_" + rowData.IDECOTIZACION} value={rowData.PRECIO_UNITARIO} />),
                                    editComponent: tableData => (<AmountFormatInput name={"sparePartsPriceI_" + tableData.rowData.IDECOTIZACION}  {...tableData} />)
                                },

                                {
                                    title: 'Entrega (días)', field: 'DIAS_TIEMPO_ENTREGA', editable: 'onUpdate', cellStyle: { textAlign: "center" }, headerStyle: { textAlign: 'center' },
                                    editComponent: tableData => (<NumberOnlyFormat name={"deliverDays_" + tableData.rowData.IDECOTIZACION}  {...tableData} />)
                                },
                                {
                                    title: 'Calidad', field: 'CALIDAD', editable: 'onUpdate',
                                    render: rowData => (<span>{selectListValue(arrayQuality, rowData.CALIDAD)}</span>),
                                    editComponent: tableData => (<SelectSimpleController
                                        label={'Calidad'}
                                        array={arrayQuality}
                                        objForm={objForm}
                                        value="O"
                                        name={"quality_" + tableData.rowData.IDECOTIZACION}  {...tableData} />)
                                }
                            ]}
                            data={spList}
                            icons={{
                                Clear: () => (<Icon color="primary">clear</Icon>),
                                Check: () => (<Icon onClick={() => setIsSaving(false)} color="primary">check</Icon>),
                                Edit: () => (<Icon onClick={() => setIsSaving(true)} color="primary">edit</Icon>)
                            }}
                            editable={{
                                isEditable: () => true,
                                onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve, reject) => {
                                        try {
                                            saveSparePartsInTable(newData, oldData)
                                            resolve()
                                        } catch (error) {
                                            reject()
                                        }
                                    }),
                                iconProps: { color: "primary" },
                            }}

                        />

                    </GridItem>
                </GridContainer>
                <GridContainer justify="center">
                    <GridItem xs={12} sm={6} md={4} lg={3}>
                        <Button type="submit" color="primary" fullWidth>
                            <Icon>send </Icon> Procesar
                        </Button>
                    </GridItem>
                </GridContainer>
            </form>
        </CardPanel>
    )
}
