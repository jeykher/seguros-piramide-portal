import React, {useState, useEffect} from 'react'
import { useForm} from "react-hook-form";
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import Axios from 'axios'
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import NumberController from 'components/Core/Controller/NumberController'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Icon from "@material-ui/core/Icon"
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import TransferTable from './TransferTable'
import TransferTableTotal from './TransferTableTotal'

const getInvoicesNumber = (dataPay) => {
  const invoices = dataPay.map((obj) => {
    const rObj = {}
    rObj["invoice_number"] = obj.NUMFACT
    return rObj
  })
  return invoices
}

export default function Transfers(props){
  const { handleSubmit, ...objForm } = useForm();
  const { currency, paymentType, amount, dataInvoice, onSuccess, propsParams} = props
  const [banks, setBanks] = useState();
  const [bankAccounts,setBankAccounts] = useState();
  const [formData,setFormData] = useState();
  const [accountDestination,setAccountDestination] = useState(null);
  const notificationType = "T"
  const [dataListType,setDataListType] = useState({});
  const [resultTable, setResultTable] = useState([]) 
  const [invoices,setInvoices] = useState(getInvoicesNumber(dataInvoice));



  const handleBanks = (value) =>{
    setBanks(value);
  }

  const handleBankAccounts = (value) =>{
    setBankAccounts(value)
  }

  const handleFormData = (value) =>{
    setFormData(value);
  }

  const handleResultTable = (value) =>{
    setResultTable(value)
  } 
  const handleAccountDestination = (value) =>{
    setAccountDestination(value);
  }
  const getAccountNumber = async (value) =>{
    handleAccountDestination(null)
    const { data } = await Axios.post("/dbo/treasury/get_bank_account_numbers",
    {
      p_company_bank_code: value,
      p_payment_type: paymentType,
      p_currency_company: currency
    })
    handleBankAccounts(data.result)
  }

  const getNumberAccount = (value) =>{
    const finding = bankAccounts.find(element => element.COMPANY_ACCOUNT_ID === value)
    return finding ? finding.COMPANY_ACCOUNT_NUMBER : 'N/A'
  }
  
  
  const onSubmit = (dataform) => {
    const dataTable = {
      document_type: dataListType[0].DOCUMENT_TYPE,
      detail_company_bank_code: dataform.company_bank_code,
      detail_document_number:dataform.transaction_number,
      detail_account_number: getNumberAccount(dataform.company_account_id),
      amount_value: amount
    }
    handleResultTable([dataTable])
    handleFormData(dataform)
  }

  const handleRequestDeposit = async () =>{
    const detailData = [
      {
        document_type: resultTable[0].document_type,
        detail_company_bank_code: resultTable[0].detail_company_bank_code,
        detail_document_number: resultTable[0].detail_document_number,
        detail_account_number: resultTable[0].detail_account_number,
        amount_value: resultTable[0].amount_value
      }
    ]
    const depositData = {
      notification_type: notificationType, 
      total_amount_operation: amount,
      transaction_number: parseInt(formData.transaction_number),
      company_bank_code: formData.company_bank_code,
      company_account_id: formData.company_account_id,
      transaction_date: formData.transaction_date
    }
    const params = {
      ...propsParams,
      p_payment_type: paymentType,
      p_str_json_deposit_data: JSON.stringify(depositData),
      p_str_detail_json_deposit_data: JSON.stringify(detailData),
      p_str_json_invoices_data: JSON.stringify(invoices)
    }
    const { data } = await Axios.post("/dbo/treasury/request_deposit_notification", params);
    if(data.result !== null){
      const dataResult = {
        income: data.result,
        notification_type: notificationType
      }
      onSuccess(dataResult);
    }
  }


  useEffect(() => {
    const getBanks =  async () => {
      const { data } = await Axios.post("/dbo/treasury/get_company_banks",
      {
        p_payment_type: paymentType,
        p_currency_company: currency
      });
      handleBanks(data.result);
    }
    getBanks();
  },[])

  useEffect(() => {
    const getListType =  async () => {
      const { data } = await Axios.post("/dbo/treasury/get_document_type",
      {
        p_option: notificationType
      })
      setDataListType(data.result);
    }
    getListType()
  },[])


  useEffect(() => {
    setInvoices(getInvoicesNumber(dataInvoice))
  },[dataInvoice])

  useEffect(() => {
    const result = objForm.getValues();
    handleAccountDestination(result.company_bank_code)
    objForm.setValue('p_bank_destination', result.company_bank_code)
  },[accountDestination])

  return(
    <>
      <GridItem xs={6}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridContainer justify="center" alignItems="center">
            <GridItem xs={7}>
              <NumberController
                objForm={objForm}
                label="Número de la transferencia"
                name="transaction_number"
                inputProps={{ maxLength: 15 }} 
              />
              { banks && 
                <SelectSimpleController 
                  objForm={objForm} 
                  label="Entidad bancaria origen"  
                  name="company_bank_code" 
                  array={banks} 
                  onChange={(e) => getAccountNumber(e)}
                />
              }
              {bankAccounts && accountDestination && <>
                <SelectSimpleController 
                  objForm={objForm} 
                  label="Entidad bancaria destino"  
                  name="p_bank_destination"
                  array={banks}
                  value={accountDestination}
                  inputProps={{defaultValue: accountDestination, disabled: true}}
                  required={false}
                />
                <SelectSimpleController 
                  objForm={objForm} 
                  label="Número de cuenta"  
                  name="company_account_id"
                  array={bankAccounts} 
                />
                <DateMaterialPickerController 
                  fullWidth 
                  objForm={objForm} 
                  label="Fecha de la transferencia" 
                  name="transaction_date"
                  limit 
                />
                {!formData && 
                  <GridContainer justify="center">
                    <Button color="primary" type="submit">
                      Siguiente<Icon>fast_forward</Icon>
                    </Button>
                  </GridContainer>
                }
              </>
              }
            </GridItem>
          </GridContainer>
        </form>
      </GridItem>
      {formData && <>
        <GridItem xs={11}>
          <TransferTable currency={currency} data={resultTable} banks={banks} bankAccounts={bankAccounts} dataListType={dataListType}/>
        </GridItem>
        <GridItem xs={11}>
          <TransferTableTotal currency={currency} total={amount} />
        </GridItem>
        <GridItem xs={12}>
          <GridContainer justify="center">
            <Button color="primary" onClick={handleRequestDeposit}>
              Procesar<Icon>fast_forward</Icon>
            </Button>
          </GridContainer>
        </GridItem>
      </>
      }
    </>
  )
}