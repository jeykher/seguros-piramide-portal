import Axios from 'axios'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getddMMYYYDate, getIdentification } from "utils/utils"
import { getProfileCode } from 'utils/auth'
import pendingAction from "../../Workflow/pendingAction"
import { useDialog } from "context/DialogContext"
import { id } from 'date-fns/locale'

export const useAccountForm = (clientCodeRequest, verificationId, serviceType, dataRequest, objForm, titularCodClient, isMinor, contractCode) => {

  const [disabledAmount, setDisabledAmount] = useState(true)
  const [invoices, setInvoices] = useState([])
  const [identificationType, setIdentificationType] = useState(null)
  const [identificationNumber, setIdentificationNumber] = useState(null)
  const [identificationId, setIdentificationId] = useState(null)
  const [incidenceDate, setIncidenceDate] = useState('')
  const [validRequest, setValidRequest] = useState(false)
  const [isVerifiedAccept, setVerifiedAccept] = useState(true)
  const [activesAccountss, setActivesAccountss] = useState([])
  const [disableTextfieldBank, setDisableTextfieldBank] = useState(true)
  const [showAccountss, setShowAccountss] = useState(false)
  const [showAddNewAccountt, setShowAddNewAccountt] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [checkedInvoiceer, setCheckedInvoiceer] = useState(false)
  const [optionAddNewAccountt, setOptionAddNewAccountt] = useState(true)
  const dialog = useDialog()

  const getBeneficiaryAccountData = async (value) => {
    if (checkedInvoiceer) {
      if (value && !isMinor) setCheckedInvoiceer(false)
      setShowForm(false)
    }
    if (!isMinor){
      setIdentificationType(null)
      setIdentificationNumber(null)
      setIdentificationId(null)
    }
    objForm.setValue('p_check_beneficiary', 'N')

    setDisabledAmount(false)
    const params = {
      p_client_code: getProfileCode() === 'insured'? JSON.parse(sessionStorage.getItem('PROFILE'))?.p_client_code : !isMinor?titularCodClient:contractCode,
      centfinan: null,
      cctamoneda: null,
      ctipocuenta: null,
      ccodmoneda: value
    }
    const { data } = await Axios.post(`/dbo/toolkit/get_account_third`, params)
    if (data.result.length > 0) {

      objForm.setValue('currencyType', data.result[0].CTAMONEDA)
      objForm.setValue('accountType', data.result[0].TIPOCUENTA)
      objForm.setValue('bank', data.result[0].CTA1)
      setDisableTextfieldBank(false)
      setShowAccountss(true)
      setShowAddNewAccountt(false)
      setActivesAccountss(data.result)
      objForm.setValue('accounts', data.result[0].NUMCUENTA)

    }
    if (data.result.length == 0) {
      objForm.setValue('currencyType', '')
      objForm.setValue('accountType', '')
      objForm.setValue('bank', '')
      setDisableTextfieldBank(true)
      setShowAccountss(false)
      setShowAddNewAccountt(false)
      setActivesAccountss([])
      objForm.setValue('accounts', '')
    }

  }

  async function request_refund_service(baseParams) {
    const params = {
      ...baseParams,
      //   p_verification_id: verificationId,
    }
    const response = await axios.post("/dbo/health_claims/request_refund_after_verify_as_broker", params)
    return response.data.result
  }

  async function request_refund_service_as_insured(baseParams) {
    const params = {
      ...baseParams,
      p_client_code_request: clientCodeRequest !== undefined ? clientCodeRequest : null,
    }
    const response = await Axios.post("/dbo/health_claims/request_refund_service_as_insured", params)
    return response.data.result
  }

  function validateAccount(dataform) {

    if (!dataform.p_account_number) {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "Debe completar el número de cuenta",
      })
      return true
    }

    if (dataform.p_account_number.length < 20) {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "El número de cuenta debe tener 20 caracteres",
      })
      return true
    }

    if (dataform.p_claim_invoice_number == dataform.p_claim_control_number) {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "El número de control de la factura no puede ser igual al número de la factura",
      })
      return true
    }

    return false
  }

  async function validRequestInProgress(data) {
    let params = {
      p_verification_id: dataRequest.verification_id,
      p_title_disease_code: data[0],
      p_subtitle_disease_code: data[1],
      p_disease_code: data[2],
    }
    const response = await Axios.post('/dbo/health_claims/valid_amp_request_in_progress', params)
    return response.data.result;
  }

  const handleQuestion = (v) => {
    if (v)
      window.history.back()
    else
      setValidRequest(false)
  }

  async function onSubmit(dataform, e) {
    try {

      let JsonString = JSON.stringify(invoices);
      const unquoted = JsonString.replace(/"([^"]+)":/g, '$1:');

      let vDvid = null
      let numid = null
      let dvid = null
      const invoiceNumber = parseInt(dataform.p_claim_invoice_number)
      const controlNumber = dataform.p_claim_control_number
      const invoiceDate = dataform.p_claim_invoice_date
      const diagnosisArray = dataform.p_diagnosis.value.split("*")
      const serviceAmount = dataform.p_service_amount
      const claimDate = dataform.p_claim_date


      if (identificationType !== null && identificationNumber !== null) {
        [numid, dvid] = getIdentification(identificationType, identificationNumber)
        vDvid = dvid.toString()
      }

      const accounNumber = dataform.accounts === "NUEVA CUENTA"
                          ? dataform.cardNumber?.replaceAll("(", "")?.replaceAll(")", "")?.replaceAll("-", "")?.replaceAll("_", "")?.trim()
                          : dataform.accounts;

      const insureCodCli = getProfileCode() == 'insured' 
                          ? JSON.parse(sessionStorage.getItem('PROFILE')).p_client_code
                          : clientCodeRequest

      const titularClientCode = getProfileCode() == 'insured' 
                          ? JSON.parse(sessionStorage.getItem('PROFILE')).p_client_code 
                          : titularCodClient
    
      const jsonAccountForm = {
        p_is_beneficiary: isMinor? 'Y':dataform.p_check_beneficiary,
        p_currency_type: dataform.currencyType,
        p_account_type: dataform.accountType,
        p_account_number: accounNumber,
        p_identification_type: identificationType,
        p_identification_number:numid !== null ? numid: null,
        p_identification_id: identificationId !== null ? identificationId : vDvid,
        p_claim_invoice_number: invoiceNumber,
        p_claim_control_number: controlNumber,
        p_claim_invoice_date: getddMMYYYDate(invoiceDate),
        p_string_json_data: unquoted
      }

      const params = {
        p_service_type: serviceType,
        p_title_disease_code: diagnosisArray[0],
        p_subtitle_disease_code: diagnosisArray[1],
        p_disease_code: diagnosisArray[2],
        p_det_disease_code: diagnosisArray[3],
        p_service_amount: serviceAmount,
        p_currency_code: dataform.currency,
        p_claim_date_as_string: getddMMYYYDate(claimDate),
        p_json_param_account: JSON.stringify(jsonAccountForm),
        p_client_code_request: insureCodCli,
        p_client_code: titularClientCode
      }

      if (validateAccount(jsonAccountForm)) return

      let validService = await validRequestInProgress(diagnosisArray)
      if (validService === 0) {

        const jsonResult = (getProfileCode() !== 'insured')
          ? await request_refund_service({ ...params, p_verification_id: dataRequest.verification_id, })
          : await request_refund_service_as_insured(params)
        await pendingAction(jsonResult.workflowId)

      }
      else {
        setValidRequest(true)
      }

    } catch (error) {
      console.error(error)
    }

  }

  // useEffect(() => {
  //   if (getProfileCode() === 'insurance_broker') {
  //     setShowAddNewAccountt(false)
  //     setOptionAddNewAccountt(false)
  //   }
  // }, [])

  return {
    disabledAmount,
    onSubmit,
    invoices, setInvoices,
    identificationType, setIdentificationType,
    identificationNumber, setIdentificationNumber,
    identificationId, setIdentificationId,
    incidenceDate, setIncidenceDate,
    isVerifiedAccept,
    setVerifiedAccept,
    validRequest,
    handleQuestion,
    activesAccountss,
    setActivesAccountss,
    getBeneficiaryAccountData,
    disableTextfieldBank,
    setDisableTextfieldBank,
    showAccountss,
    setShowAccountss,
    showAddNewAccountt,
    setShowAddNewAccountt,
    showForm, setShowForm,
    checkedInvoiceer, setCheckedInvoiceer,
    optionAddNewAccountt
  }

}




