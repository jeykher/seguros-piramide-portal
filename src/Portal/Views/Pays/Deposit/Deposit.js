import React, {useEffect, useState} from 'react'
import { useForm} from "react-hook-form";
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import Axios from 'axios'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import NumberController from 'components/Core/Controller/NumberController'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Icon from "@material-ui/core/Icon"
import DepositTable from './DepositTable'
import DepositTableTotal from './DepositTableTotal'
import { useDialog } from "context/DialogContext"

const getInvoicesNumber = (dataPay) => {
  const invoices = dataPay.map((obj) => {
    const rObj = {}
    rObj["invoice_number"] = obj.NUMFACT
    return rObj
  })
  return invoices
}


export default function Deposit(props){
  const { handleSubmit, getValues, ...objForm } = useForm();
  const { currency, paymentType, amount, dataInvoice, onSuccess, propsParams} = props
  const [banks, setBanks] = useState();
  const [bankAccounts,setBankAccounts] = useState();
  const [formData,setFormData] = useState();
  const [totalAmount,setTotalAmount] = useState(0);
  const [resultTable, setResultTable] = useState([]);
  const [invoices,setInvoices] = useState(getInvoicesNumber(dataInvoice));
  const dialog = useDialog()
  const notificationType = "D"


  const handleResultTable = (value) =>{
    setResultTable(value)
  }

  const handleTotalAmount = (value) =>{
    setTotalAmount(value)
  }

  const handleBanks = (value) =>{
    setBanks(value);
  }

  const handleBankAccounts = (value) =>{
    setBankAccounts(value)
  }

  const handleFormData = (value) =>{
    setFormData(value);
  }

  const getFilteredTableData = (data) => {
    const result = data.map(element => {
      return{
        document_type: element.document_type,
        detail_company_bank_code: element.detail_company_bank_code,
        detail_document_number: element.detail_document_number,
        detail_account_number: element.detail_account_number,
        amount_value: parseFloat(element.amount_value)
      }
    })
    return result
  };

  const getAccountNumber = async (value) =>{
    const { data } = await Axios.post("/dbo/treasury/get_bank_account_numbers",
    {
      p_company_bank_code: value,
      p_payment_type: paymentType,
      p_currency_company: currency
    })
    handleBankAccounts(data.result);
  }
  
  
  const onSubmit = (dataform) => {
    handleFormData(dataform);
  }

  const calculateTotalAmount = (data) =>{
    const total = data.reduce((total,currentValue) => {
      return total + parseFloat(currentValue.amount_value) 
    },0)
    handleTotalAmount(total);
  }

  const handleRequestDeposit = async () =>{
    if(amount !== totalAmount){
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: 'El monto total de los depósitos no coinciden con el del pago. Por favor, verifique las cantidades ingresadas.'
      })
    }else{
      const filteredTableData = getFilteredTableData(resultTable);
      const params = {
        ...propsParams,
        p_payment_type: paymentType,
        p_str_json_deposit_data: JSON.stringify({...formData,
                                                notification_type: notificationType, 
                                                total_amount_operation: amount,
                                                transaction_number: parseInt(formData.transaction_number)}),
        p_str_detail_json_deposit_data: JSON.stringify(filteredTableData),
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
    setInvoices(getInvoicesNumber(dataInvoice))
  },[dataInvoice])

  useEffect(() =>{
    resultTable && calculateTotalAmount(resultTable)
  },[resultTable])

  return(
    <>
      <GridItem xs={6}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridContainer justify="center" alignItems="center">
            <GridItem xs={7}>
              <NumberController
                objForm={objForm}
                label="Número del documento"
                name="transaction_number"
                inputProps={{ maxLength: 15 }} 
              />
              { banks && 
                <SelectSimpleController 
                  objForm={objForm} 
                  label="Entidad bancaria"  
                  name="company_bank_code" 
                  array={banks} 
                  onChange={(e) => getAccountNumber(e)}
                />
              }
              {bankAccounts && <>
                <SelectSimpleController 
                  objForm={objForm} 
                  label="Número de cuenta"  
                  name="company_account_id" 
                  array={bankAccounts} 
                />
                <DateMaterialPickerController 
                  fullWidth 
                  objForm={objForm} 
                  label="Fecha del depósito" 
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
          <DepositTable 
            currency={currency} 
            paymentType={paymentType}
            handleResultTable={handleResultTable}
            resultTable={resultTable}
            notificationType={notificationType}
          />
        </GridItem>
        <GridItem xs={11}>
          <DepositTableTotal currency={currency} total={totalAmount} />
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