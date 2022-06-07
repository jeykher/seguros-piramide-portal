

import React, { useState, useEffect } from "react"
import Axios from "axios"
import { useForm, Controller } from "react-hook-form"
import Icon from "@material-ui/core/Icon"
import CardPanel from "components/Core/Card/CardPanel"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter"
import NumberOnlyFormat from "../../../../components/Core/NumberFormat/NumberOnlyFormat"
import { getDefaultCurrencyCode, getddMMYYYDate, indentificationTypeNaturalMayor,indentificationTypeNaturalMayorRefund, getIdentification } from "utils/utils"
import SwitchYesNoController from "../../../../components/Core/Controller/SwitchYesNoController"
import SelectSimpleController from "../../../../components/Core/Controller/SelectSimpleController"
import IdentificationController from "../../../../components/Core/Controller/IdentificationController"
import GridItem from "../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import { useDialog } from "context/DialogContext"
import FormHelperText from "@material-ui/core/FormHelperText"

 
export default function UpdateBeneficiaryAccountForm(props) {
  const { preadmission_id, complement_id, workflow_id,handleUpdateAccountBeneficiary,
          handleClose } = props
  const { handleSubmit, ...objForm } = useForm()
  const [currency, setCurrency] = useState([])
  const [sameBeneficiary, setSameBeneficiary] = useState(null)
  const [checkedInvoiceer, setCheckedInvoiceer] = useState(false)
  const [identificationType, setIdentificationType] = useState(null)
  const [identificationNumber, setIdentificationNumber] = useState(null)
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [helperAccountTypeError, setHelperAccountTypeError] = useState("")
  const [showForm, setShowForm] = useState(true)
  const [disabledButton, setDisabledButton] = useState(false)
  const [accountTypes, setAccountTypes] = useState([])
  const [accountType, setAccountType] = useState(null)
  const dialog = useDialog()


  function handleIndetificationType(value) {
    setIdentificationType(value)
  }

  function handleAccountType(value) {
    setShowForm(false)
    setAccountType(value)
    objForm.reset({
      [`p_account_type`]: value,
      [`p_account_number_1`]: null,
      [`p_account_number_2`]: null,
      [`p_account_number_3`]: null,
      [`p_account_number_4`]: null
    })

  }

  function handleIndetificationNumber(val) {
    setIdentificationNumber(val)
  }

  function dataBeneficiary() {
    if (identificationType !== "" && identificationNumber !== "") {
      const [numid, dvid] = getIdentification(identificationType, identificationNumber)
      getDataBeneficiary(identificationType, numid, dvid.toString())
    }
  }

  async function getLvalAccountType() {
    const params = { p_list_code: "TIPOCTAS" }
    const result = await Axios.post("/dbo/toolkit/get_values_list", params)
    setAccountTypes(result.data.p_cursor)
  }

  async function getDataBeneficiary(type, number, id) {
    setShowForm(false)
    try {
      const params = {
        p_identification_type: type ? type : null,
        p_identification_number: number ? parseInt(number) : null,
        p_identification_id: id ? id.toString() : null,
        p_preadmission_id: preadmission_id,
        p_complement_id: complement_id,

      }
      const response = await Axios.post(`/dbo/health_claims/get_account_third`, params)
      if (response.data.result.length > 0) {
        setName(response.data.result[0].NOMBRES)
        setLastName(response.data.result[0].APELLIDOS)
        objForm.reset({
          [`p_account_type`]: response.data.result[0].TIPOCUENTA,
          [`p_account_number_1`]: response.data.result[0].CTA1,
          [`p_account_number_2`]: response.data.result[0].CTA2,
          [`p_account_number_3`]: response.data.result[0].CTA3,
          [`p_account_number_4`]: response.data.result[0].CTA4,
        })
        setDisabledButton(false)
        setShowForm(true)
      } else {
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Error",
          description: `El beneficiario no existe`,
        })
        setDisabledButton(true)
        setName("")
        setLastName("")
        objForm.reset({})
        setShowForm(true)
      }
    } catch (error) {
      console.log(error)

    }

  }

  function handleCheck(e) {
    setCheckedInvoiceer(e)
    setShowForm(false)
    setName("")
    setLastName("")
    objForm.reset({})
    if (!e) {
      setHelperAccountTypeError(null)
      getDataBeneficiary()
    } else {
      setDisabledButton(true)
    }

  }

  useEffect(() => {
    if (checkedInvoiceer)
      setShowForm(true)
  }, [checkedInvoiceer])

  useEffect(() => {
      setShowForm(true)
  }, [accountType])


  useEffect(() => {
    getLvalAccountType()
  }, [])

  useEffect(() => {
    getDataBeneficiary()
  }, [])

  async function updateDataBeneficiaryAccount(baseParams) {
    const params = {
      ...baseParams,
    }
    const response = await Axios.post("/dbo/health_claims/update_account_beneficiary", params)    
    //return response.data.result
  }


  async function onSubmit(dataform, e) {
    e.preventDefault()
    let vDvid = null
    let numid = null
    let dvid = null
    if (validateAccount(dataform)) {
      try {
        if (identificationType !== null && identificationNumber !== null) {
          [numid, dvid] = getIdentification(identificationType, identificationNumber)
          vDvid = dvid.toString()
       }
        const params = {
          p_is_beneficiary: dataform.p_check_beneficiary,
          p_account_type: dataform.p_account_type,
          p_account_number: dataform.p_account_number_1 + dataform.p_account_number_2 + dataform.p_account_number_3 + dataform.p_account_number_4,
          p_identification_type: identificationType,
          p_identification_number: numid,
          p_identification_id: vDvid,
          p_preadmission_id: preadmission_id,
          p_complement_id: complement_id
        }
        console.log(params)
        await updateDataBeneficiaryAccount(params)
        handleUpdateAccountBeneficiary();
        handleClose(true);
      } catch (error) {
        console.error(error)
      }
    }
  }

  function validateAccount(dataform) {
    const accountNumber = dataform.p_account_number_1 + dataform.p_account_number_2 + dataform.p_account_number_3 + dataform.p_account_number_4
    if ((dataform.p_account_number_1 === null || dataform.p_account_number_1 === "") || (dataform.p_account_number_2 === null || dataform.p_account_number_2 === "") || (dataform.p_account_number_3 === null || dataform.p_account_number_3 === "") || (dataform.p_account_number_4 === null || dataform.p_account_number_4 === "")) {
      setHelperAccountTypeError("Deber completar el número de cuenta")
      return false
    } else {
      setHelperAccountTypeError(null)
    }
    if ((accountNumber.trim()).length < 20) {
      setHelperAccountTypeError("El número de cuenta de ser un total de 20 caracteres")
      return false
    } else {
      setHelperAccountTypeError(null)
    }

    
    return true

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <CardPanel titulo="Modificación de datos de beneficiario" icon="playlist_add_check" iconColor="primary">
        
        <h5>¿El beneficiario del pago es diferente al Titular del certificado?</h5>
        <SwitchYesNoController
          objForm={objForm}
          name={`p_check_beneficiary`}
          checked={checkedInvoiceer}
          onChange={(value) => handleCheck(value)}
        />
        {checkedInvoiceer &&
        <>
          <SelectSimpleController style={{ width: "200px", marginRight: "1em" }}
                                  onChange={(e) => handleIndetificationType(e)}
                                  objForm={objForm}
                                  label="Tipo de identificación" name={`p_identification_type_1`}
                                  array={indentificationTypeNaturalMayorRefund}/>
          <IdentificationController style={{ width: "200px" }} onBlur={(e) => dataBeneficiary(e)}
                                    onChange={(e) => handleIndetificationNumber(e)}
                                    objForm={objForm} label="Número de identificación" index={1}/>
          <h5>{name} {lastName}</h5>
        </>
        }
        {showForm &&
        <>
          <GridContainer>
            <GridItem className="flex-col-scroll" item xs={12} sm={4} md={4} lg={4}>
              <SelectSimpleController fullWidth label="Tipo de cuenta"
                                      onChange={(e) => handleAccountType(e)} rules={{ required: true }}
                                      objForm={objForm} name={`p_account_type`}
                                      array={accountTypes}/>
            </GridItem>
            <GridItem xs={12} sm={8} md={8} lg={8} container alignItems="flex-end">
              <Controller
                name="p_account_number_1"
                as={NumberOnlyFormat}
                control={objForm.control}
                style={{ width: "45px" }}
                inputProps={{ minLength: 4, maxLength: 4 }}
                allowLeadingZeros
              />
              _
              <Controller
                name="p_account_number_2"
                as={NumberOnlyFormat}
                control={objForm.control}
                style={{ width: "45px" }}
                inputProps={{ minLength: 4, maxLength: 4 }}
                allowLeadingZeros
              />
              _
              <Controller
                name="p_account_number_3"
                as={NumberOnlyFormat}
                control={objForm.control}
                style={{ width: "25px" }}
                inputProps={{ minLength: 2, maxLength: 2 }}
                allowLeadingZeros
              />
              _
              <Controller
                name="p_account_number_4"
                as={NumberOnlyFormat}
                control={objForm.control}
                style={{ width: "100px" }}
                inputProps={{ minLength: 10, maxLength: 10 }}
                allowLeadingZeros
              />
            </GridItem>
          </GridContainer>

          <GridContainer justify={"center"}>
            <FormHelperText>{helperAccountTypeError}</FormHelperText>
          </GridContainer>
        </>
        }


        <CardFooter>
          <GridContainer justify="center">
            <Button onClick={() => handleClose(true)}>
              <Icon>fast_rewind</Icon> Regresar
            </Button>
            <Button color="primary" disabled={disabledButton} type="submit">
              <Icon>send</Icon> Aceptar
            </Button>
          </GridContainer>
        </CardFooter>
      </CardPanel>
    </form>
  )
}
