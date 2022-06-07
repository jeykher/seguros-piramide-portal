import React, { useState, useEffect } from "react"
import Axios from "axios"
import { navigate } from "gatsby"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import CustomerSearch from "./CustomerSearch"
import CustomersTable from "./CustomersTable"
import { getIdentificationCustomer } from "utils/utils"
import { getProfileCode } from "utils/auth"
import { useForm } from "react-hook-form";

export default function Customers({ location }) {
  const index = "CUSTOMER"
  const [numplaca, setNumPlaca] = useState("01");
  const [customersList, setCustomersList] = useState([])
  const { triggerValidation, getValues, ...objForm } = useForm()
  const [showForm, setShowForm] = useState(false)
  const [paramsSearch, setParamsSearch] = useState(null)
  const [isLoading, setIsLoading] = useState(false);


  function handleSelectCustomer(codcli) {
    navigate(`/app/cliente/${codcli}/general`, { state: { client: true, placa: numplaca, search: { ...paramsSearch } } })
  }

  async function onSubmit(data) {
    setIsLoading(true);
    const [tipoid, numid, dvid] = getIdentificationCustomer(`${data[`p_identification_type_${index}`]}`, `${data[`p_identification_number_${index}`]}`)
    const dataName = `${data[`p_names_${index}`]}`
    const names = dataName === 'undefined' ? null : dataName.trim() === '' ? null : dataName.trim()
    const dataPlateNumber = `${data[`p_license_plate_${index}`]}`
    const plateNumber = dataPlateNumber === 'undefined' ? null : dataPlateNumber.trim() === '' ? null : dataPlateNumber.trim()
    setNumPlaca(plateNumber);
    const params = {
      p_identification_type: tipoid,
      p_identification_number: numid,
      p_identification_verified: dvid,
      p_customers_full_name: names === 'undefined' ? null : names === '' ? null : names,
      p_license_plate: plateNumber === 'undefined' ? null : plateNumber === '' ? null : plateNumber
    }
    setParamsSearch(data)
    const response =
      (!["corporate","alo24", "supervisor"].includes(getProfileCode()))
        ? await Axios.post("/dbo/customers/get_customers", params)
        : await Axios.post("/dbo/customers/get_customers_all", params)
    setCustomersList(response.data.p_cursor)
    setIsLoading(false);
  }

  useEffect(() => {
    setShowForm(false)
    if ((location.state) &&(location.state.client) && (location.state.search)) {
      const params = { ...location.state.search }
      objForm.reset({
        [`p_identification_type_${index}`]: params[`p_identification_type_${index}`],
        [`p_identification_number_${index}`]: params[`p_identification_number_${index}`],
        [`p_names_${index}`]: params[`p_names_${index}`],
        [`p_license_plate_${index}`]: params[`p_license_plate_${index}`]
      })
      setShowForm(true)
      triggerValidation().then((result) => {
        if (result) {
          onSubmit(getValues())
        }
      }).catch((error) => { console.error(error) })
    } else {
      setShowForm(true)
    }
  }, [])


  return (
    <GridContainer>
      <GridItem item xs={12} sm={12} md={3} lg={3}>
        <CustomerSearch
          onSubmit={onSubmit}
          showForm={showForm}
          dataForm={objForm}
          index={index}
        />
      </GridItem>
      <GridItem item xs={12} sm={12} md={9} lg={9}>
        <CustomersTable
          customersList={customersList}
          onSelectCustomer={handleSelectCustomer}
          isLoading = {isLoading}
        />
      </GridItem>
    </GridContainer>
  )
}
