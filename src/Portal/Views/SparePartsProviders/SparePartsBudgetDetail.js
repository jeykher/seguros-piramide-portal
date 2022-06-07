import React, { useState, useEffect, Fragment } from 'react'
import SparePartsBudgetDetailHeader from 'Portal/Views/SparePartsProviders/SparePartsBudgetDetailHeader'
import SparePartsTable from 'Portal/Views/SparePartsProviders/SparePartsTable'
import SparePartsBudgetComment from 'Portal/Views/SparePartsProviders/SparePartsBudgetComment'
import SparePartsBudgetInspectionView from 'Portal/Views/SparePartsProviders/SparePartsBudgetInspectionView'
import { useDialog } from 'context/DialogContext'
import { getddMMYYYDate, currencyValues} from "utils/utils"
import {navigate} from 'gatsby'
import NavPills from "components/material-kit-pro-react/components/NavPills/NavPills.js";
import Icon from "@material-ui/core/Icon"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import Axios from 'axios'

export default function SparePartsBudgetDetail(props) {

    const {sparePartsBudgetsID, location} = props
    const [titleHeader, setTitleHeader] = useState()
    const [claim, setClaim] = useState()
    const [vehicle, setVehicle] = useState(null)

    const [currencyBudget, setCurrencyBudget] = useState('BS')
    const [sparePartsList, setSparePartsList] = useState([])
    const [qualityValues, setQualityValues] = useState([])
    const [inspectionImageList, setInspectionImageList] = useState()
    const [inspectionImageTitle, setInspectionImageTitle] = useState()
    const [showInspectionExpandButton, setShowInspectionExpandButton] = useState(null)
    const [titleHeaderInsp, setTitleHeaderInsp] = useState()
    const [observationsList, setObservationsList] = useState([])
    const dialog = useDialog()  

    const msgDialog = (dataErrors) => {
        dialog({
            variant: "info",
            catchOnCancel: false,
            title: "Alerta",
            description: dataErrors
        })
    }

    function backToStart (){
        navigate(`/app/home_proveedor_repuestos`)
    }

    function handleBack() {
        window.history.back()
    }

    const handleCurrencySelect = (value) => {
        const val = value ? value : 'BS'
        setCurrencyBudget(val)
        return val;
      }

    async function getCurrencyByBudget() {
        const params = { p_spare_parts_budget_id: sparePartsBudgetsID }
        const result = await Axios.post('/dbo/providers/get_currency_by_budget', params)
        const curr = result.data.result + ''
        setCurrencyBudget(curr)
    }

    function selectListValue (array, selectedValue)  {
        const arrayResult = array.filter(obj => obj.VALOR == selectedValue)
        const retorno = (selectedValue && arrayResult.length > 0 )?arrayResult[0].DESCRIPCION:''
        return retorno
    }

    async function getInfoHeader() {
        
        try {
            let paramSPIn = { p_sp_in_budget: "0" }
            if (location && location.state && location.state.spbudgetin) {
                paramSPIn.p_sp_in_budget = location.state.spbudgetin 

                console.log('REvisando el estado ' + location.state.spbudgetin)
            }

            if(paramSPIn.p_sp_in_budget == "1"){
                getCurrencyByBudget()
            }

            const service_mail = '/dbo/providers/get_mail_general_autoclaims'
            const service = '/dbo/providers/get_spareparts_budget'
            const params = {
                p_spare_parts_budget_id: sparePartsBudgetsID,

                ...paramSPIn
            }
            const response = await Axios.post(service, params)
            const response_mail = await Axios.post(service_mail)
            const data = response.data.c_sp_budget[0]
            const mail = response_mail.data.p_mail

            const dateMod = new Date(data.FECSTS)
            const dateNew = getddMMYYYDate(dateMod)

            const objHeaderV = {
                "marca": data.MARCA,
                "modelo": data.MODELO,
                "año": data.ANOVEH,
                "placa": data.NUMERO_PLACA,
                "serial carrocería": data.SERIALCARROCERIA,
                "motor": data.DESCMOTOR,
                "transmisión": data.CAJA,
                "versión": data.DESCVERSION,
                "serial motor": data.SERIALMOTOR

            }

            const objHeaderC = {
                "siniestro": data.NUMSIN,
                "sucursal": data.NOMBRE_OFICINA,
                "fecha": dateNew,
                "correo_contacto": mail
            }

            const titleHeader = "Cotización Nº " + data.IDECOTIZACION
            setVehicle(Object.entries(objHeaderV))
            setClaim(objHeaderC)
            setTitleHeader(titleHeader)

        } catch (error) {
            console.log(error)
        }
    }

    async function getSparePartsList() {
        const service = '/dbo/providers/get_spareparts_list'
        const params = {
            p_spare_parts_budget_id: sparePartsBudgetsID,
            p_selected:'N'
          }
        try {
            const response = await Axios.post(service, params)
            const dataSpareParts = response.data.c_spare_parts_list

            if (dataSpareParts) {
                setSparePartsList(dataSpareParts)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function getQualityList() {
        const params = { p_list_code: 'CALIREP' }
        const result = await Axios.post('/dbo/toolkit/get_values_list', params)
        setQualityValues(result.data.p_cursor)
    }

    async function saveSpareParts(dataform) {

        const data = [...sparePartsList]
        const dataForm = []

        data.map((element, key) => {
            let itemInfo = {"CODREPUESTO":element.CODREPUESTO,
                            "PRECIO_UNITARIO":element.PRECIO_UNITARIO?element.PRECIO_UNITARIO.toString():'',
                            "INDDISPONIBLE":element.INDDISPONIBLE,
                            "CALIDAD":element.CALIDAD?element.CALIDAD:'',
                            "DIAS_TIEMPO_ENTREGA":element.DIAS_TIEMPO_ENTREGA?element.DIAS_TIEMPO_ENTREGA.toString():''}
            dataForm.push(itemInfo)
        })

        try {

            if (dataForm.some(checkFieldsComplete)) {
                throw 'La información de cada repuesto a ofertar debe tener CALIDAD, DIAS_TIEMPO_ENTREGA y  PRECIO_UNITARIO'
            }

            const dataCurrency = dataform.currency?dataform.currency:currencyBudget
            const params = {p_spare_parts_budget_id : sparePartsBudgetsID,
                            p_currency_code : dataCurrency, 
                            p_spare_parts_prices:JSON.stringify(dataForm) } 
            console.log(params)
            await Axios.post('/dbo/providers/set_spareparts_budget_prices', params)
            setSparePartsList(data)    

            dialog({
                variant: "info",
                catchOnCancel: false,
                title: 'Información',
                description: 'Se cargaron los datos de la cotización' 
            })
            backToStart()

            
        } catch (error) {

            dialog({
                variant: "info",
                catchOnCancel: false,
                title: "Alerta",
                description: error
            })

            console.log(error)
        }
    }

    function saveSparePartsInTable(newData, oldData) {

        let data = [...sparePartsList];
        const index = data.indexOf(oldData);
        data[index] = newData;       
        setSparePartsList(data)    
    }

    function checkFieldsComplete(item, key, array){

        const emptyQuality   = item.CALIDAD.length == 0 && item.DIAS_TIEMPO_ENTREGA.length > 0 && item.PRECIO_UNITARIO.length > 0
        const emptyDelivery  = item.DIAS_TIEMPO_ENTREGA.length == 0 && item.CALIDAD.length > 0 && item.PRECIO_UNITARIO.length > 0
        const emptyUnitPrice = item.PRECIO_UNITARIO.length == 0 && item.DIAS_TIEMPO_ENTREGA.length > 0 && item.CALIDAD.length > 0

        return emptyQuality || emptyDelivery || emptyUnitPrice

    }

    async function getObservationsList() {

        const service = '/dbo/providers/get_observations_list'
        const params = {
            p_spare_parts_budget_id: sparePartsBudgetsID
          }
        const response = await Axios.post(service,params)
        const observations = response.data.p_cobservations_list

        if (observations) {
            setObservationsList(observations)    
        }
        
    }

    async function saveObservation(obs) {

        const service = '/dbo/providers/add_observation'
        const params = {
            p_spare_parts_budget_id: sparePartsBudgetsID,
            p_observation_text:obs
          }
        const response = await Axios.post(service,params)
        getObservationsList()
    }

    async function getInspectionInfo() {
        
        const params = {
            p_spare_parts_budget_id: sparePartsBudgetsID
          }
        const response = await Axios.post('/dbo/providers/get_inspection', params)
        const reg = response.data.c_inspection[0]
        const inspecTitle = ' Inspección Nº ' + reg.NUMEXP

        setTitleHeaderInsp(inspecTitle); 
        
        if (reg && reg.NUMEXP) {
            getInspectionImageList(reg.NUMEXP) 
        }
        
    }

    async function getInspectionImageList(inspectionID) {
        
        const params = {
            p_inspection_id: inspectionID
          }
        const response = await Axios.post('/dbo/providers/get_inspection_image_list', params)
        const imageList = response.data.p_image_list

          if (imageList.length > 0){
            includeGalleryData(imageList, inspectionID)
          }

        const titleImageSection = (imageList.length > 0)?'Imágenes de la Inspección ' + inspectionID:'No hay imágenes para esta Inspección'
        const showButtonView = (imageList.length > 0)?true:false
        setShowInspectionExpandButton(showButtonView)
        setInspectionImageTitle(titleImageSection)
        setInspectionImageList(imageList)
    }

    const includeGalleryData = (arrayExam, inspID) => {
        arrayExam.forEach(function(item,index,array){
            item.original = item.ENLACE
            item.thumbnail = item.ENLACE
            item.originalAlt = ' Imagen ' + index + ' de Inspección ' + inspID
        })
    }

  

    useEffect(() => {
        getInfoHeader()
        getQualityList()
        getSparePartsList()
        getObservationsList()
        getInspectionInfo()
    }, [])

    return(
        <Fragment>
            <SparePartsBudgetDetailHeader
                objectVehicleInfo={vehicle}
                objectClaimInfo={claim}
                titleHeader={titleHeader}
            />
            <NavPills
                tabs={[
                    {
                        tabButton: "Repuestos",
                        tabContent: (
                            <>
                                    <SparePartsTable
                                        spId={sparePartsBudgetsID}
                                        spList = {sparePartsList}
                                        arrayQuality={qualityValues}
                                        currencyBudget={currencyBudget}
                                        handleCurrencySelect={handleCurrencySelect}
                                        handleBack={handleBack}
                                        msgDialog={msgDialog}
                                        selectListValue={selectListValue}
                                        saveSparePartsInTable={saveSparePartsInTable}
                                        saveSpareParts = {saveSpareParts}
                                        
                                    />  
                            </>
                        )
                    },
                    {
                        tabButton: "Comentarios",
                        tabContent: (
                            <SparePartsBudgetComment
                                msgDialog={msgDialog}
                                observations={observationsList}
                                saveObservation={saveObservation}
                            />
                        )
                    },
                    {
                        tabButton: "Inspección",
                        tabContent: (
                            <SparePartsBudgetInspectionView
                                msgDialog={msgDialog}
                                titleHeader={titleHeaderInsp}
                                showButton={showInspectionExpandButton}
                                inspectionImages={inspectionImageList}
                                inspectionImageTitle={inspectionImageTitle}
                                
                            />
                        )
                    }
                ]}
             />

                <GridContainer justify="center">
                    <Button color="secondary" onClick={handleBack}>
                        <Icon>fast_rewind</Icon> Regresar
                    </Button>
                </GridContainer>


        </Fragment>
        
    )

}
