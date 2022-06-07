import React,{useState, useEffect} from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import Icon from "@material-ui/core/Icon"
import Axios from 'axios'
import SelectSimple from 'components/Core/SelectSimple/SelectSimple'
import AmountFormatInput from 'components/Core/NumberFormat/AmountFormatInput'
import NumberOnlyFormat from 'components/Core/NumberFormat/NumberOnlyFormat'
import { useDialog } from "context/DialogContext"
import {getSymbolCurrency, formatAmount} from 'utils/utils'

export default function DepositTable(props){
  
  const { 
    currency, 
    paymentType,
    handleResultTable, 
    resultTable, 
    notificationType 
  } = props
  const [dataListType,setDataListType] = useState({});
  const [dataListBanks,setDataListBanks] = useState({});
  const dialog = useDialog()

  const renderAmount = (value) =>{
    return `${formatAmount(value)} ${getSymbolCurrency(currency)}`
  }

  const getListType = async () =>{
    const { data } = await Axios.post("/dbo/treasury/get_document_type",
    {
      p_option: notificationType
    })
    setDataListType(data.result);
  }

  const getListBanks = async () =>{
    const { data } = await Axios.post("/dbo/treasury/get_banks");
    setDataListBanks(data.result);
  }


  const getNameType = (value) =>{
    const finding = dataListType.find(element => element.DOCUMENT_TYPE === value)
    return finding ? finding.DESCRIPTION : 'N/A'
  }

  const getNameBank = (value) =>{
    const finding = dataListBanks.find(element => element.COMPANY_BANK_CODE === value)
    return finding ? finding.NAME_BANK : 'N/A'
  }

  const validateDeposit = async (value) => {
    let flag = false
    const validate = value.document_type && value.document_type.length > 0 && value.detail_company_bank_code && value.detail_company_bank_code.length > 0 &&
      value.detail_document_number && value.detail_document_number.length > 0 && value.detail_account_number && value.detail_account_number.length > 0 && 
      value.amount_value && value.amount_value.length > 0 ? true : false
      if(validate){
        const params = {
          p_detail_company_bank_code: value.detail_company_bank_code,
          p_detail_document_number: value.detail_document_number,
          p_detail_account_number: value.detail_account_number,
          p_document_type: value.document_type,
          p_payment_type: paymentType
        }
        const { data } = await Axios.post("/dbo/treasury/validate_deposit",params);
        if(data.result){
          dialog({
            variant: "info",
            catchOnCancel: false,
            title: "Alerta",
            description: data.result
          })
        }else{
        flag = true;
        }
      }else{
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Alerta",
          description: 'Debe de llenar todos los campos.'
        })
      }
      return flag
  }

  const handleClearData = (value) => {
    return {
      ...value,
      detail_account_number: 'N/A',
      detail_document_number: 'N/A',
      detail_company_bank_code: 'N/A'
    }
  }

  const validateDataCash = (value) =>{
    return value.document_type && value.document_type.length > 0 && value.amount_value && value.amount_value.length > 0 ? true : false
  }

  useEffect(() =>{
    getListType();
    getListBanks();
  },[])

  return(
    <TableMaterial
      options={{
        pageSize: 5,
        search: false,
        toolbar: true,
        sorting: false,
        draggable: false
      }}
      data={resultTable}
      columns={[
        { title: 'Tipo', field: 'document_type',
          render: rowData => getNameType(rowData.document_type),
          editComponent: ({value,onChange}) => (
          <SelectSimple
            id="1"
            value={value}
            onChange={onChange}
            array={dataListType}
          />
          )
        },
        { title: 'Banco', field: 'detail_company_bank_code',
          render: rowData => getNameBank(rowData.detail_company_bank_code),
          editComponent: ({value,onChange,rowData}) => {
          if(rowData && rowData.document_type === 'EFE'){
            return (
              <div></div>
              )
          }else{
            return(
              <SelectSimple
                id="2"
                value={value}
                onChange={onChange}
                array={dataListBanks}
              />
            )
          }
        }
        },
        { title: 'Nro.Cheque', field: 'detail_document_number', editComponent: ({value,onChange,rowData}) => {
          if(rowData && rowData.document_type === 'EFE'){
            return (
              <div></div>
            )
          }else{
            return (
            <NumberOnlyFormat
              value={value}
              onChange={onChange}
              name="detail_document_number"
              inputProps={{maxLength: 16}}
              allowLeadingZeros
            />
            )
          }
        }
        },
        {
          title: 'Nro.Cuenta',field: 'detail_account_number', editComponent: ({value,onChange,rowData}) => {
          if(rowData && rowData.document_type === 'EFE'){
            return (
              <div></div>
            )
          }else{
            return(
              <NumberOnlyFormat
                value={value}
                onChange={onChange}
                name="detail_account_number"
                inputProps={{maxLength: 20}}
                allowLeadingZeros
              />
            )
          }
        }
        },
        {
          title: 'Monto', field: 'amount_value', type: 'currency',
          render: rowData => renderAmount(rowData.amount_value),
          editComponent: props => (<AmountFormatInput name={"amount_value"} prefix={currency} {...props} />)
        }
      ]}
      icons={{
        Add: () => (<Icon color="primary" style={{ fontSize: 30 }}>add_circle</Icon>),
        Clear: () => (<Icon color="primary">clear</Icon>),
        Check: () => (<Icon color="primary">check</Icon>),
        Edit: () => (<Icon color="primary">edit</Icon>),
        Delete: () => (<Icon color="primary">delete_outline</Icon>),
      }}
      editable={{
        onRowAdd: (newData) =>
          new Promise( async (resolve, reject) => {
            if(newData.document_type === 'EFE'){
              const filteredData = handleClearData(newData);
              if(validateDataCash(filteredData) === true){
                handleResultTable([...resultTable, filteredData])
                resolve();
              }else{
                dialog({
                  variant: "info",
                  catchOnCancel: false,
                  title: "Alerta",
                  description: 'Debe de llenar todos los campos.'
                })
                reject()
              }
            }else{
              const result = await validateDeposit(newData);
              if(result === true){
                handleResultTable([...resultTable, newData])
                resolve();
              }else{
                reject();
              }
            }
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise( async (resolve, reject) => {
              const dataUpdate = [...resultTable];
              if(newData.document_type === 'EFE'){
                const filteredData = handleClearData(newData);
                const index = oldData.tableData.id;
                if(validateDataCash(filteredData) === true){
                  dataUpdate[index] = filteredData;
                  handleResultTable([...dataUpdate])
                  resolve();
                }else{
                  dialog({
                    variant: "info",
                    catchOnCancel: false,
                    title: "Alerta",
                    description: 'Debe de llenar todos los campos.'
                  })
                  reject()
                }
              }else{
                const result = await validateDeposit(newData)
                if(result === true){
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  handleResultTable([...dataUpdate])
                  resolve();
                }else{
                  reject();
                }
              }
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...resultTable];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              handleResultTable([...dataDelete])
              resolve()
            }, 300)
          }),
      }}
    />
  )
}