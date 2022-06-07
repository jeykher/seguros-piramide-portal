import React, { useState, useEffect } from "react"
import Axios from "axios"
import { useForm, Controller } from "react-hook-form"
import Icon from "@material-ui/core/Icon"
import CardPanel from "components/Core/Card/CardPanel"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import AutoCompleteWithData from "components/Core/Autocomplete/AutoCompleteWithData"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import "./ConsignmentsList.scss"
import DateMaterialPickerController from "components/Core/Controller/DateMaterialPickerController"
import Backdrop from "@material-ui/core/Backdrop"
import CircularProgress from "@material-ui/core/CircularProgress"
import { useDialog } from "context/DialogContext"
import SelectSimpleController from "components/Core/Controller/SelectSimpleController"
import SearchIcon from "@material-ui/icons/Search"
import InputController from "components/Core/Controller/InputController"
import { format } from "date-fns"
import { subYears } from "date-fns"
import DownloadButton from "./ButtonDownloadExcel"


export default function ConsignmentsList({ insuranceArea }) {
  const [optionsProvider, setOptionsProvider] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [consignments, SetConsignments] = useState(null)
  const dialog = useDialog()
  const [dateTo, setDateTo] = useState()
  const [dateFrom, setDateFrom] = useState()
  const [dateRange, setDateRange] = useState("")
  const { handleSubmit, errors, control } = useForm()
  const { ...objForm2 } = useForm()
  const { ...objForm3 } = useForm()
  const [inputValueProvider, setInputValueProvider] = useState("")
  const [inputFilter, setInputFilter] = useState("")

  const descriptionArea =
    "Consulta de Remesas " +
    (insuranceArea === "0004"
      ? " Personas"
      : insuranceArea === "0002"
      ? " Automóvil"
      : "")

  const arrayFilter = [
    { value: "Orden", label: "Nro Orden" },
    { value: "Remesa", label: "Nro Remesa" },
    { value: "Factura", label: "Nro Factura" },
    { value: "Control", label: "Nro Control" },
  ]

 

  async function onSubmit(dataform, e) {
    e.preventDefault()
    SetConsignments(null)
    setInputFilter("")
    setDateTo()
    setDateFrom()
    const params = {
      p_provider_code: dataform.p_provider_code,
      p_insurance_area: insuranceArea,
      p_portal_user_id: JSON.parse(sessionStorage.getItem("PROFILE"))
        .P_PORTAL_USER_ID,
      p_core_batch_invoicing_number: null,
      p_date_from: null,
      p_date_to: null,
      p_invoice_number: null,
      p_invoice_control_number: null,
      p_preadmission_id: null,
      p_complement_id: null,
      p_order_number: null,
    }

    Axios.post("/dbo/consignment/get_batchs_processed_invocing", params).then(
      result => {
        SetConsignments(result.data.result)
        if(result.data.p_date_from_out!=null && result.data.p_date_from_out!=null ){
            if(result.data.p_date_from_out.search("-")===-1 && result.data.p_date_to_out.search("-")===-1){
              setDateRange("Desde "+ result.data.p_date_from_out + " Hasta " + result.data.p_date_to_out)
            }else{
              let dateFrom = new Date(result.data.p_date_from_out)
              let dataTo = new Date(result.data.p_date_to_out)
              setDateRange("Desde "+ format(dateFrom, "dd/MM/yyyy") + " Hasta " + format(dataTo, "dd/MM/yyyy"))

            }
        }else{
            setDateRange("")
        }
      }
    )
  }

  function handleBack(e) {
    e.preventDefault()
    window.history.back()
  }

  function handleClick(event, rowData) {
    //navigate(`/app/workflow/service/${rowData.WORKFLOW_ID}`, { state: { indBack: true } });
  }

  async function getProviderForConsignment() {
    const params = { p_insurance_area: insuranceArea } //For now only 0004
    const response = await Axios.post(
      "/dbo/consignment/get_providers_list_for_consignment",
      params
    )
    const jsonCursor = response.data.result
    setOptionsProvider(jsonCursor)
  }

  useEffect(() => {
    setInputValueProvider([])
    SetConsignments(null)
    setInputFilter("")
    setDateTo()
    setDateFrom()


    if (
      JSON.parse(sessionStorage.getItem("PROFILE")).PROFILE_CODE ===
      "admin_clinic"
    ) {
      setIsLoading(true)
      const params = {
        p_provider_code: JSON.parse(sessionStorage.getItem("PROFILE")).p_provider_code,
        p_insurance_area: insuranceArea,
        p_portal_user_id: JSON.parse(sessionStorage.getItem("PROFILE"))
          .P_PORTAL_USER_ID,
          p_core_batch_invoicing_number: null,
          p_date_from: null,
          p_date_to: null,
          p_invoice_number: null,
          p_invoice_control_number: null,
          p_preadmission_id: null,
          p_complement_id: null,
          p_order_number: null,
      }

      Axios.post("/dbo/consignment/get_batchs_processed_invocing", params).then(
        result => {
          SetConsignments(result.data.result)
          if(result.data.p_date_from_out!=null && result.data.p_date_from_out!=null ){
            if(result.data.p_date_from_out.search("-")===-1 && result.data.p_date_to_out.search("-")===-1){
              setDateRange("Desde "+ result.data.p_date_from_out + " Hasta " + result.data.p_date_to_out)
            }else{
              let dateFrom = new Date(result.data.p_date_from_out)
              let dataTo = new Date(result.data.p_date_to_out)
              setDateRange("Desde "+ format(dateFrom, "dd/MM/yyyy") + " Hasta " + format(dataTo, "dd/MM/yyyy"))

            }        }else{
            setDateRange("")
        }
          setIsLoading(false)
        }
      )
    } else {
      getProviderForConsignment()
    }
  }, [insuranceArea])

  const handleDateInputFrom = value => {
    const dateFromCurrent = format(value[0], "dd/MM/yyyy")
    const validDate = value[0] !== null ? value[0].toString() : "Invalid Date"
    const valid = validDate !== "Invalid Date"
    if (valid) {
      setDateFrom(value[0])
      if (dateTo != undefined && value[0].getTime() > dateTo.getTime()) {
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Alerta",
          description: "La fecha Desde no puede ser mayor a la fecha Hasta",
        })
      } else {
        if (dateTo != undefined && value[0].getTime() < dateTo.getTime()) {
          const params = {
            p_provider_code: inputValueProvider.VALUE,
            p_insurance_area: insuranceArea,
            p_portal_user_id: JSON.parse(sessionStorage.getItem("PROFILE"))
              .P_PORTAL_USER_ID,
            p_core_batch_invoicing_number: null,
            p_date_from: dateFromCurrent,
            p_date_to: format(dateTo, "dd/MM/yyyy"),
            p_invoice_number: null,
            p_invoice_control_number: null,
            p_preadmission_id: null,
            p_complement_id: null,
            p_order_number: null,
          }

          Axios.post(
            "/dbo/consignment/get_batchs_processed_invocing",
            params
          ).then(result => {
            SetConsignments(result.data.result)
            if(result.data.p_date_from_out!=null && result.data.p_date_from_out!=null ){
                setDateRange("Desde "+ result.data.p_date_from_out + " Hasta " + result.data.p_date_to_out)
            }else{
                setDateRange("")
            }
          })
        }
      }
    }
  }

  const handleDateInputTo = value => {
    const dateToCurrent = format(value[0], "dd/MM/yyyy")
    const validDate = value[0] !== null ? value[0].toString() : "Invalid Date"
    const valid = validDate !== "Invalid Date"
    if (valid) {
      setDateTo(value[0])
      if (dateFrom != undefined && value[0].getTime() < dateFrom.getTime()) {
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Alerta",
          description: "La fecha Desde no puede ser mayor a la fecha Hasta",
        })
      } else {
        if (dateFrom != undefined && value[0].getTime() > dateFrom.getTime()) {
          const params = {
            p_provider_code: inputValueProvider.VALUE,
            p_insurance_area: insuranceArea,
            p_portal_user_id: JSON.parse(sessionStorage.getItem("PROFILE"))
              .P_PORTAL_USER_ID,
            p_core_batch_invoicing_number: null,
            p_date_from: format(dateFrom, "dd/MM/yyyy"),
            p_date_to: dateToCurrent,
            p_invoice_number: null,
            p_invoice_control_number: null,
            p_preadmission_id: null,
            p_complement_id: null,
            p_order_number: null,
          }

          Axios.post(
            "/dbo/consignment/get_batchs_processed_invocing",
            params
          ).then(result => {
            SetConsignments(result.data.result)
            if(result.data.p_date_from_out!=null && result.data.p_date_from_out!=null ){
                setDateRange("Desde "+ result.data.p_date_from_out + " Hasta " + result.data.p_date_to_out)
            }else{
                setDateRange("")
            }
          })
        }
      }
    }
  }

  const handleFormat = value => {
    if (value != undefined) {
      setInputFilter(value)
    } else {
      setInputFilter("")
    }
  }
  const handleSearch = () => {
    const searchValue = objForm2.control.fieldsRef.current.p_agreement_number?.ref.value

    if (searchValue === undefined || searchValue === "" ||searchValue === null) {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "Ingrese un valor válido",
      })
    } else {
        if (inputFilter!=""){

            switch (inputFilter) {
                case 'Orden':
                    let paramsOrder
                    if (insuranceArea==="0002"){
                     paramsOrder = {
                        p_provider_code: inputValueProvider.VALUE,
                        p_insurance_area: insuranceArea,
                        p_portal_user_id: JSON.parse(sessionStorage.getItem("PROFILE"))
                          .P_PORTAL_USER_ID,
                        p_core_batch_invoicing_number: null,
                        p_date_from: null,
                        p_date_to: null,
                        p_invoice_number: null,
                        p_invoice_control_number: null,
                        p_preadmission_id: null,
                        p_complement_id: null,
                        p_order_number: searchValue,
                    }
                    Axios.post(
                        "/dbo/consignment/get_batchs_processed_invocing",
                        paramsOrder
                      ).then(result => {
                        SetConsignments(result.data.result)
                        if(result.data.p_date_from_out!=null && result.data.p_date_from_out!=null ){
                            setDateRange("Desde "+ result.data.p_date_from_out + " Hasta " + result.data.p_date_to_out)
                        }else{
                            setDateRange("")
                        }
                      })
                    }else { 
                        const searchValue2 = objForm2.control.fieldsRef.current.p_agreement_number2?.ref.value? objForm2.control.fieldsRef.current.p_agreement_number2?.ref.value:null
                        paramsOrder = {
                            p_provider_code: inputValueProvider.VALUE,
                            p_insurance_area: insuranceArea,
                            p_portal_user_id: JSON.parse(sessionStorage.getItem("PROFILE"))
                              .P_PORTAL_USER_ID,
                            p_core_batch_invoicing_number: null,
                            p_date_from: null,
                            p_date_to: null,
                            p_invoice_number: null,
                            p_invoice_control_number: null,
                            p_preadmission_id: searchValue,
                            p_complement_id: searchValue2,
                            p_order_number: null,
                        }
                        Axios.post(
                            "/dbo/consignment/get_batchs_processed_invocing",
                            paramsOrder
                          ).then(result => {
                            SetConsignments(result.data.result)
                            if(result.data.p_date_from_out!=null && result.data.p_date_from_out!=null ){
                                setDateRange("Desde "+ result.data.p_date_from_out + " Hasta " + result.data.p_date_to_out)
                            }else{
                                setDateRange("")
                            }
                          })
                        
                    }
                break;
                case 'Remesa':
                    const paramsRemesa = {
                        p_provider_code: inputValueProvider.VALUE,
                        p_insurance_area: insuranceArea,
                        p_portal_user_id: JSON.parse(sessionStorage.getItem("PROFILE"))
                          .P_PORTAL_USER_ID,
                        p_core_batch_invoicing_number: searchValue,
                        p_date_from: null,
                        p_date_to: null,
                        p_invoice_number: null,
                        p_invoice_control_number: null,
                        p_preadmission_id: null,
                        p_complement_id: null,
                        p_order_number: null,
                    }
                    Axios.post(
                        "/dbo/consignment/get_batchs_processed_invocing",
                        paramsRemesa
                      ).then(result => {
                        SetConsignments(result.data.result)
                        if(result.data.p_date_from_out!=null && result.data.p_date_from_out!=null ){
                            setDateRange("Desde "+ result.data.p_date_from_out + " Hasta " + result.data.p_date_to_out)
                        }else{
                            setDateRange("")
                        }
                      })
                break;
                case 'Factura':
                    const paramsFactura = {
                        p_provider_code: inputValueProvider.VALUE,
                        p_insurance_area: insuranceArea,
                        p_portal_user_id: JSON.parse(sessionStorage.getItem("PROFILE"))
                          .P_PORTAL_USER_ID,
                        p_core_batch_invoicing_number: null,
                        p_date_from: null,
                        p_date_to: null,
                        p_invoice_number: searchValue,
                        p_invoice_control_number: null,
                        p_preadmission_id: null,
                        p_complement_id: null,
                        p_order_number: null,
                    }
                    Axios.post(
                        "/dbo/consignment/get_batchs_processed_invocing",
                        paramsFactura
                      ).then(result => {
                        SetConsignments(result.data.result)
                        if(result.data.p_date_from_out!=null && result.data.p_date_from_out!=null ){
                            setDateRange("Desde "+ result.data.p_date_from_out + " Hasta " + result.data.p_date_to_out)
                        }else{
                            setDateRange("")
                        }
                      })
                break;
                case 'Control':
                    const paramsControl = {
                        p_provider_code: inputValueProvider.VALUE,
                        p_insurance_area: insuranceArea,
                        p_portal_user_id: JSON.parse(sessionStorage.getItem("PROFILE"))
                          .P_PORTAL_USER_ID,
                        p_core_batch_invoicing_number: null,
                        p_date_from: null,
                        p_date_to: null,
                        p_invoice_number: null,
                        p_invoice_control_number: searchValue,
                        p_preadmission_id: null,
                        p_complement_id: null,
                        p_order_number: null,
                    }
                    Axios.post(
                        "/dbo/consignment/get_batchs_processed_invocing",
                        paramsControl
                      ).then(result => {
                        SetConsignments(result.data.result)
                        if(result.data.p_date_from_out!=null && result.data.p_date_from_out!=null ){
                            setDateRange("Desde "+ result.data.p_date_from_out + " Hasta " + result.data.p_date_to_out)
                        }else{
                            setDateRange("")
                        }
                      })
                break;
            }
        }
    }
  }

  return (
    <>
      <Backdrop style={{ zIndex: "9999" }} open={isLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
      {JSON.parse(sessionStorage.getItem("PROFILE")).PROFILE_CODE ===
      "corporate" ? (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardPanel
            titulo={descriptionArea}
            icon="playlist_add_check"
            iconColor="primary"
          >
            <GridContainer justify="center">
              <GridItem
                xs={10}
                sm={10}
                md={11}
                style={{ padding: "0 0 0 15px" }}
              >
                <Controller
                  label="Seleccionar el proveedor"
                  options={optionsProvider}
                  as={AutoCompleteWithData}
                  noOptionsText="Cargando"
                  inputValue={inputValueProvider}
                  name="p_provider_code"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  onChange={([e, value]) => {
                    setInputValueProvider(value)
                    return value ? value["VALUE"] : null
                  }}
                  helperText={
                    errors.p_provider_code && "Debe indicar un proveedor"
                  }
                />
              </GridItem>
            </GridContainer>
            <CardFooter>
              <GridContainer justify="center">
                <Button color="secondary" onClick={handleBack}>
                  <Icon>fast_rewind</Icon> Regresar
                </Button>
                <Button color="primary" type="submit">
                  <Icon>send</Icon> Seleccionar
                </Button>
              </GridContainer>
            </CardFooter>
          </CardPanel>
        </form>
      ) : null}

      {consignments != null && insuranceArea === "0002" ? (
        <>
          <CardPanel
            titulo={"Consulta de Remesas Generadas " + dateRange}
            icon="list_alt"
            iconColor="primary"
          >
            <div className="container-select">
              <SelectSimpleController
                objForm={objForm2}
                label="Buscar por"
                name="p_type_filter"
                defaultValue={inputFilter}
                array={arrayFilter}
                onChange={handleFormat}
                required={false}
              />
              {inputFilter != "" ? (
                <div className="selected-search">
                    <InputController
                    objForm={objForm2}
                    label={"Ingrese Nro de " + inputFilter}
                    name={"p_agreement_number"}
                    />
                  <Button color="primary" onClick={handleSearch}>
                    <SearchIcon /> Buscar
                  </Button>
                </div>
              ) : (
                <div />
              )}
            </div>
            <div className="form-dataPicker">
              <DateMaterialPickerController
                objForm={objForm3}
                label="Fecha desde"
                onChange={handleDateInputFrom}
                name="p_start_date"
                disableFuture
                onKeyDown={(e) => e.preventDefault()}
                minDate={subYears(new Date(),1)}
                required
              />
              <DateMaterialPickerController
                objForm={objForm3}
                onChange={handleDateInputTo}
                label="Fecha hasta"
                name="p_end_date"
                disableFuture
                onKeyDown={(e) => e.preventDefault()}
                minDate={subYears(new Date(),1)}
                required
              />
              {consignments?.length>0?
                <DownloadButton consignments={consignments} insuranceArea={insuranceArea}/>
              :null}
            </div>
            <TableMaterial
              options={{
                pageSize: 10,
              }}
              columns={[
                { title: "Nro.Orden", field: "NUMORDEN" },
                { title: "Nro Remesa", field: "NUMREMESA" },
                { title: "Nro. Declaración", field: "NUMDECLA" },
                { title: "Subtotal Orden", field: "SUBTOT" },
                { title: "Monto Iva", field: "MTOIMPUESTO" },
                { title: "Monto Total Factura", field: "MTOTOT" },
                { title: "Facturar a", field: "FACTA" },
                { title: "Nro. Factura", field: "NROFACTURA" },
                { title: "Nro. Control", field: "NROCTRFACTURA" },
                { title: "Fecha Factura", field: "FECFACTEMI" },
              ]}
              data={consignments}
              isLoading={false}
              onRowClick={(event, rowData) => handleClick(event, rowData)}
            />
          </CardPanel>
        </>
      ) : null}

      {consignments != null && insuranceArea === "0004" ? (
        <CardPanel
        titulo={"Consulta de Remesas Generadas " + dateRange}
        icon="list_alt"
          iconColor="primary"
        >
          <div className="container-select">
            <SelectSimpleController
              objForm={objForm2}
              label="Buscar por"
              name="p_type_filter"
              defaultValue={inputFilter}
              array={arrayFilter}
              onChange={handleFormat}
              required={false}
            />
            {inputFilter != "" ? (
              <div className="selected-search">
                          {inputFilter==="Orden"?
                    <div className="container-order-persona">
                        <InputController
                            objForm={objForm2}
                            label=" "
                            type="number"
                            name={"p_agreement_number"}
                        />
                        <span>-</span>
    
                        <InputController
                            objForm={objForm2}
                            label=" "
                            type="number"
                            name={"p_agreement_number2"}
                        />
                    </div>
                   :
                   <InputController
                   objForm={objForm2}
                   label={"Ingrese Nro de " + inputFilter}
                   name={"p_agreement_number"}
                    />
                   }
                <Button color="primary" onClick={handleSearch}>
                  <SearchIcon /> Buscar
                </Button>
              </div>
            ) : (
              <div />
            )}
          </div>
          <div className="form-dataPicker">
            <DateMaterialPickerController
              objForm={objForm3}
              label="Fecha desde"
              onChange={handleDateInputFrom}
              name="p_start_date"
              disableFuture
              onKeyDown={(e) => e.preventDefault()}
              minDate={subYears(new Date(),1)}
              required
            />
            <DateMaterialPickerController
              objForm={objForm3}
              onChange={handleDateInputTo}
              label="Fecha hasta"
              name="p_end_date"
              disableFuture
              onKeyDown={(e) => e.preventDefault()}
              minDate={subYears(new Date(),1)}
              required
            />
              {consignments?.length>0?
                <DownloadButton consignments={consignments} insuranceArea={insuranceArea}/>
              :null}
          </div>
          <TableMaterial
            options={{
              pageSize: 10,
            }}
            columns={[
              { title: "Nro.Orden ", field: "NUMORDEN" },
              { title: "Nro Remesa", field: "NUMREMESA" },
              { title: "Titular/Paciente", field: "TIT_PAC" },
              { title: "Monto Amparado", field: "MTOINDEMLOCAL" },
              { title: "Facturar a", field: "FACTA" },
              { title: "Nro. Factura", field: "NROFACTURA" },
              { title: "Nro. Control", field: "NROCTRFACTURA" },
              { title: "Fecha Factura", field: "FECFACTEMI" },
              { title: "Monto Factura", field: "MTOFACT" },
            ]}
            data={consignments}
            isLoading={false}
            onRowClick={(event, rowData) => handleClick(event, rowData)}
          />
        </CardPanel>
      ) : null}
    </>
  )
}
