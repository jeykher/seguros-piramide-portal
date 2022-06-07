import React, { useState, useEffect } from "react"
import Axios from "axios"
import CardPanel from "components/Core/Card/CardPanel"

import { getIdentification } from "utils/utils"
import SwitchYesNoController from "../../../../components/Core/Controller/SwitchYesNoController"
import { getProfileCode } from 'utils/auth'
import BeneficiaryAccountForm from "./BeneficiaryAccountForm"
import BeneficiariesCtteOptions from "./BeneficiariesCtteOptions"
import InvoicesCardPanel from "./InvoicesCardPanel"

export default function RequestRefundAccountForm(props) {
  const { dataRequest, objForm, clientCodeRequest, handleSetInvoices, invoices, handleDataIdentification, objAccountForm, titularCodClient, isMinor,ideaseg } = props
  const {setIdentificationType,setIdentificationNumber,setIdentificationId,incidenceDate,setDisableTextfieldBank,setShowAccountss,setActivesAccountss,setShowAddNewAccountt,showForm, setShowForm,checkedInvoiceer, setCheckedInvoiceer} = objAccountForm

  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [disabledButton, setDisabledButton] = useState(false)
  const [beneficiaries, setBeneficiaries] = useState([])
  const [optionRadio, setOptionRadio] = useState("CTTE")
  const [showTipoId, setShowTipoId] = useState(true)
  const [readOnly, setReadOnly] = useState(false)
  const [showBeneficiaries, setShowBeneficiaries] = useState(false)
  const [policySelected, setPolicySelected] = useState(null)

  function handleIndetificationType(value) {
    handleDataIdentification(value, null, null)
    // setIdentificationType(value)
  }

  function handleIndetificationNumber(val) {
    handleDataIdentification(null, val, null)
    //setIdentificationNumber(val)
  }

  function dataBeneficiary() {

    if (objForm.control.getValues()[`p_identification_type_1`] !== "" && objForm.control.getValues()[`p_identification_number_1`] !== "") {
      const [numid, dvid] = getIdentification(objForm.control.getValues()[`p_identification_type_1`], objForm.control.getValues()[`p_identification_number_1`])
      getDataBeneficiary(objForm.control.getValues()[`p_identification_type_1`], numid, objForm.control.getValues()[`p_identification_id_1`])
    }

  }

  async function getDataBeneficiary(type, number, id) {

    try {
      let beneficiaryCodCli
      let paramsBeneficiary = {
        p_identification_type: type?.toString(),
        p_identification_number: number?.toString(),
        p_identification_verified: id
      }
      const { data } = await Axios.post(`/dbo/budgets/get_customer`, paramsBeneficiary)
      beneficiaryCodCli = data.p_cursor[0]?.CODCLI

      const paramsAcount = {
        p_client_code: beneficiaryCodCli,
        centfinan: null,
        cctamoneda: null,
        ctipocuenta: null,
        ccodmoneda: objForm.getValues().currency
      }
      const { data:holderData } = await Axios.post(`/dbo/toolkit/get_account_third`, paramsAcount,{
        headers:{
          'Authorization':`Bearer ${null}`
        }
      })
      if (holderData?.result?.length > 0) {

        objForm.setValue('currencyType', holderData.result[0].CTAMONEDA)
        objForm.setValue('accountType', holderData.result[0].TIPOCUENTA)
        objForm.setValue('bank', holderData.result[0].CTA1)
        objForm.setValue('accounts', holderData.result[0].NUMCUENTA)
        setDisableTextfieldBank(false)
        setActivesAccountss(holderData.result)
        setShowAccountss(true)
        setShowAddNewAccountt(false)
        setName(holderData.result[0].NOMBRES)
        setLastName(holderData.result[0].APELLIDOS)
        return
      }

      setName('')
      setLastName('')
      objForm.setValue('currencyType', '')
      objForm.setValue('accountType', '')
      objForm.setValue('bank', '')
      objForm.setValue('accounts', '')

    } catch (error) {
      console.log(error)
    }

  }

  async function handleCheck(e) {
    setCheckedInvoiceer(e)
    setShowForm(e)

    setName("")
    setLastName("")
    // objForm.reset({})

    if (!e) {
      setShowAccountss(false)
      setActivesAccountss([])
      setIdentificationType(null)
      setIdentificationNumber(null)
      setIdentificationId(null)

      const params = {
        p_client_code: getProfileCode() === 'insured' ? JSON.parse(sessionStorage.getItem('PROFILE')).p_client_code : titularCodClient,
        centfinan: null,
        cctamoneda: null,
        ctipocuenta: null,
        ccodmoneda: objForm.getValues().currency 
      }
      const { data: holderData } = await Axios.post(`/dbo/toolkit/get_account_third`, params, {
        headers: {
          "Authorization": `Bearer${null}`
        }
      })
      if (holderData?.result?.length > 0) {
        objForm.setValue('currencyType', holderData.result[0].CTAMONEDA)
        objForm.setValue('accountType', holderData.result[0].TIPOCUENTA)
        objForm.setValue('bank', holderData.result[0].CTA1)
        objForm.setValue('accounts', holderData.result[0].NUMCUENTA)
        setDisableTextfieldBank(false)
        setActivesAccountss(holderData.result)
        setShowAccountss(true)
        setShowAddNewAccountt(false)
        return
      }

      if (holderData?.result?.length == 0) {
        objForm.setValue('currencyType', '')
        objForm.setValue('accountType', '')
        objForm.setValue('bank', '')
        objForm.setValue('accounts', '')
        setDisableTextfieldBank(true)
        setActivesAccountss([])
        setShowAccountss(false)
        setShowAddNewAccountt(false)
        return
      }

    } else {
      get_hiring()
    }

  }

  const handleOptionRadio = (e) => {
    setOptionRadio(e.target.value)
    objForm.reset({
      [`p_currency_type`]: null,
      [`p_account_type`]: null,
      [`p_account_number_1`]: null,
      [`p_account_number_2`]: null,
      [`p_account_number_3`]: null,
      [`p_account_number_4`]: null,
    })
    if (e.target.value === 'CTTE') {
      get_hiring()
    } else {
      getBeneficiaries()
      objForm.reset({
        [`p_identification_type_1`]: '',
        [`p_identification_number_1`]: '',
        ['p_name_1']: '',
        [`accounts`]: ''
      })
      setActivesAccountss([])
      setShowAccountss(false)
    }
    setShowForm(false)
  }

  async function getBeneficiaries() {
    const params = {
      p_ideaseg: ideaseg,
    }
    const result = await Axios.post('/dbo/health_claims/get_beneficiaries_pag', params)
    setBeneficiaries(result.data.p_cursor)
    if (result.data.p_cursor.length > 0) {
      setShowBeneficiaries(true)
    }

  }

  async function get_hiring() {
    setOptionRadio('CTTE')
    setDisabledButton(true)
    setShowAccountss(false)
    const params = {
      p_idepol: policySelected?.policyId,
      p_numcert: policySelected?.certificateId
    }
    const { data } = await Axios.post('/dbo/health_claims/get_hiring', params)
    objForm.reset({
      [`p_identification_type_1`]: data.p_tipoid,
      [`p_identification_number_1`]: data.p_numid,
      [`p_identification_id_1`]: data.p_dvid,
      [`p_name_1`]: data.p_name,
    })

    setShowTipoId(false)
    setReadOnly(false)
    handleDataIdentification(data.p_tipoid, parseInt(data.p_numid), data.p_dvid)

    // setTimeout(() => {
    setShowTipoId(true)
    dataBeneficiary()
    // }, 500)

    setReadOnly(true)
    getBeneficiaries()
  }

  async function getPolicySelected() {

    const params = {
      p_verification_id: dataRequest.verification_id,
      p_service_amount: dataRequest.service_amount,
      p_currency_code: dataRequest.currency_code,
      p_codenftit: dataRequest.codenftit,
      p_codenfstit: dataRequest.codenfstit,
      p_codenfer: dataRequest.codenfer,
      p_claim_date_as_string: dataRequest.claim_date_as_string
    }

    const { data } = await Axios.post('/dbo/health_claims/get_policy_selection', params);
    const result = JSON.parse(data.result);
    setPolicySelected(result)
  }

  useEffect(() => {
    if (checkedInvoiceer)
      setShowForm(true)
  }, [checkedInvoiceer])

  useEffect(() => {
    if (!showForm)
      setShowForm(true)
  }, [showForm])

  useEffect(() => {
    if (policySelected && isMinor)
      handleCheck(isMinor)
  }, [policySelected,isMinor])

  useEffect(() => {
    getPolicySelected()
  }, [])

  console.log('isMinor', isMinor,ideaseg)

  const changeInput = (event) => {
    event.preventDefault()
    setShowTipoId(false)
    setReadOnly(false)
    var arrayData = event.target.value.split('-');
    handleDataIdentification(arrayData[0], parseInt(arrayData[1]), arrayData[2])

    objForm.reset({
      [`p_identification_type_1`]: arrayData[0],
      [`p_identification_number_1`]: arrayData[1],
      [`p_identification_id_1`]: arrayData[2],
    })

    setTimeout(() => {
      setShowTipoId(true)
      dataBeneficiary()
    }, 500)

    setReadOnly(true)
  }

  return (
    <>
      <CardPanel titulo="Cuenta del Beneficiario" icon="playlist_add_check" iconColor="primary" >
        {
          !isMinor?
          <h5>¿El beneficiario del pago es diferente al Titular del certificado?</h5>
          :
          <h5>Toda poliza de menor, se paga a favor del contratante</h5>
        }

        {
          !isMinor && 
          <SwitchYesNoController
          objForm={objForm}
          name={`p_check_beneficiary`}
          checked={checkedInvoiceer}
          onChange={(value) => handleCheck(value)}
        />}

        {checkedInvoiceer && (
          <BeneficiariesCtteOptions
            objForm={objForm}
            optionRadio={optionRadio}
            showBeneficiaries={showBeneficiaries}
            handleOptionRadio={handleOptionRadio}
            changeInput={changeInput}
            showTipoId={showTipoId}
            beneficiaries={beneficiaries}
            handleIndetificationType={handleIndetificationType}
            handleIndetificationNumber={handleIndetificationNumber}
            readOnly={readOnly}
            dataBeneficiary={dataBeneficiary}
            isMinor={isMinor}
          />
        )}

        {showForm && (
          <BeneficiaryAccountForm
            objForm={objForm}
            clientCodeRequest={clientCodeRequest}
            objAccountForm={objAccountForm}
          />
        )}
      </CardPanel>

      <InvoicesCardPanel
        objForm={objForm}
        handleSetInvoices={handleSetInvoices}
        invoices={invoices}
        incidenceDate={incidenceDate}
      />
    </>
  )
}

