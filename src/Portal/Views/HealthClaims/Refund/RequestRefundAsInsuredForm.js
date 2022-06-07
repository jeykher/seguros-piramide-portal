import React, { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import Icon from "@material-ui/core/Icon"
import CardPanel from "components/Core/Card/CardPanel"
import AutocompleteForm from "components/Core/Autocomplete/AutocompleteControl"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter"
import AmountFormatInput from "components/Core/NumberFormat/AmountFormatInput"
import Axios from 'axios'
import DateMaterialPicker from "components/Core/Datetime/DateMaterialPicker"
import GridItem from "../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController';
import RequestRefundAccountForm from './RequestRefundAccountForm';
import { getddMMYYYDate } from "utils/utils"
import { useAccountForm } from "./useAccountForm"
import { getProfileCode } from 'utils/auth'
import ValidationServiceRequest from "../ValidationServiceRequest"

export default function RequestRefundAsInsuredForm(props) {

  const { serviceType, clientCodeRequest, identType, identNumber, verificationId, titularCodClient, isMinor, ideaseg, contractCode} = props
  const { handleSubmit, ...objForm } = useForm()
  const [dataRequest, setDataRequest] = useState({ verification_id: verificationId })
  const [isAccountVal, seAccountVal] = useState(false)

  const { ...objAccountForm } = useAccountForm(clientCodeRequest, verificationId, serviceType, dataRequest, objForm, titularCodClient, isMinor, contractCode)
  const { handleQuestion, validRequest, disabledAmount, onSubmit, helperAccountTypeError, setHelperAccountTypeError, invoices, setInvoices, identificationType, setIdentificationType, identificationId, setIdentificationId, identificationNumber, setIdentificationNumber, setIncidenceDate, isVerifiedAccept, setVerifiedAccept, getBeneficiaryAccountData } = objAccountForm;

  const currencies = [
    { value: "BS", label: "Bolívares" },
    { value: "DL", label: "Dólares" },
  ]

  function handleSetInvoices(values) {
    setInvoices(values)
  }

  function handleDataIdentification(p_tipoid, p_numid, p_dvid) {
    p_tipoid !== null ? setIdentificationType(p_tipoid) : setIdentificationType(null)
    p_numid !== null ? setIdentificationNumber(p_numid) : setIdentificationNumber(null)
    p_dvid !== null ? setIdentificationId(p_dvid) : setIdentificationId(null)
  }

  function handleHelperAccountTypeError(value) {
    setHelperAccountTypeError(value)
  }

  function handleBack(e) {
    e.preventDefault()
    window.history.back()
  }
  const getVerificationId = async (value) => {
    try {
      if (value && typeof value === 'string') {
        const params = {
          p_identification_type: identType,
          p_identification_number: identNumber,
          p_service_type: "03",
          p_claim_date_as_string: value.includes('NaN') ? null : value,
          p_client_code: clientCodeRequest
        }
        const response = await Axios.post(getProfileCode() !== 'insured' ? '/dbo/health_claims/verify_insurability_as_broker' : '/dbo/health_claims/verify_insurability', params,{
          headers:{
            'Authorization':`Bearer ${null}`
          }
        })
        const jsonResult = response.data.result
        if (jsonResult.resultType === "oneInsuredPersonFound") {
          setDataRequest({
            ...dataRequest,
            verification_id: jsonResult.verificationId
          })
          setVerifiedAccept(false)
        }
      }
    } catch (e) {
      console.log(e, 'error con verification id')
      setVerifiedAccept(true)
    }
  }
  useEffect(() => {
    getVerificationId(dataRequest.claim_date_as_string)
  }, [dataRequest.claim_date_as_string])

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column' }}>
      <CardPanel titulo="Reembolso" icon="playlist_add_check" iconColor="primary"  >

        <Controller
          label="Diagnóstico"
          as={AutocompleteForm}
          api='/dbo/health_claims/get_details_diseases_allcode'
          cursor='c_det_diseases'
          name="p_diagnosis"
          control={objForm.control}
          defaultValue=""
          rules={{ required: true }}
          onChange={([e, value]) => {

            setDataRequest({
              ...dataRequest,
              codenftit: value["VALUE"].split("*")[0],
              codenfstit: value["VALUE"].split("*")[1],
              codenfer: value["VALUE"].split("*")[2],
              coddetenfer: value["VALUE"].split("*")[3]

            })

            return value ? { value: value["VALUE"] } : null
          }}
          helperText={objForm.errors.p_diagnosis && "Debe indicar el Diagnóstico"}
        />

        <GridContainer justify="left" style={{ marginTop: 15, minHeight: 60 }}>

          <GridItem xs={12} md={4} >
            <SelectSimpleController
              objForm={objForm}
              label="Moneda"
              name="currency"
              array={currencies}
              onChange={getBeneficiaryAccountData}
              style={{ width: '100%' }}
            />
          </GridItem>

          <GridItem xs={12} md={4}>
            <Controller
              label={"Monto Facturado"}
              name="p_service_amount"
              as={AmountFormatInput}
              control={objForm.control}
              rules={{ required: true }}
              helperText={objForm.errors.p_service_amount && `Debe indicar el Monto Facturado`}
              prefix={objForm.getValues().currency == 'BS' ? 'BS' + " " : 'DL' + " "}
              fullWidth={true}
              disabled={disabledAmount}
              onChange={
                ([value]) => {
                  setDataRequest({
                    ...dataRequest,
                    service_amount: value
                  })
                  return value
                }
              }
            />
          </GridItem>

          <GridItem xs={12} md={4}>
            <Controller
              label={"Fecha de Ocurrencia"}
              name="p_claim_date"
              as={DateMaterialPicker}
              control={objForm.control}
              rules={{ required: true }}
              helperText={objForm.errors.p_claim_date && `Debe indicar la Fecha de Ocurrencia`}
              disableFuture
              style={{ width: "100%" }}
              onChange={([value]) => {
                setDataRequest({
                  ...dataRequest,
                  claim_date_as_string: getddMMYYYDate(value)
                })
                setIncidenceDate(value)
                return value
              }}
            />
          </GridItem>

        </GridContainer>

      </CardPanel>

      <RequestRefundAccountForm
        dataRequest={dataRequest}
        clientCodeRequest={clientCodeRequest}
        objForm={objForm}
        handleSetInvoices={handleSetInvoices}
        invoices={invoices}
        handleDataIdentification={handleDataIdentification}
        identificationType={identificationType}
        identificationNumber={identificationNumber}
        identificationId={identificationId}
        helperAccountTypeError={helperAccountTypeError}
        setHelperAccountTypeError={setHelperAccountTypeError}
        handleHelperAccountTypeError={handleHelperAccountTypeError}
        seAccountVal={seAccountVal}
        objAccountForm={objAccountForm}
        isMinor={isMinor}
        ideaseg={ideaseg}
        titularCodClient={titularCodClient}
      />

      {(validRequest) && <ValidationServiceRequest handleQuestion={handleQuestion} />}

      <CardFooter>
        <GridContainer justify="center">
          <Button onClick={handleBack}>
            <Icon>fast_rewind</Icon> Regresar
          </Button>
          <Button color="primary" type="submit" disabled={isVerifiedAccept || isAccountVal}>
            <Icon>send</Icon> Enviar
          </Button>
        </GridContainer>
      </CardFooter>
    </form>
  )
}



