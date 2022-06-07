import React, { useState} from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import { useDialog } from "context/DialogContext"
import {getSymbolCurrency, formatAmount, insuranceArea} from 'utils/utils'
import ButtonIconText from 'components/Core/ButtonIcon/ButtonIconText'
import Icon from "@material-ui/core/Icon";


export default function AvailableFinancingTable(props) {
  const dialog = useDialog();
  const [checkedAll,setCheckedAll] = useState(false);
  const {policies, isLoading, handleSetPolicies, codCurrency, handleCodCurrency, handleTotalAmountFinancing} = props;


  const handleChecked = () => {
    setCheckedAll(!checkedAll);
  }

  const renderAmount = (value) =>{
    return `${formatAmount(value.MONTO)} ${getSymbolCurrency(value.CODMONEDA)}`
  }

  const handleSelection = (data,rowData) =>{
    if(rowData !== undefined && rowData.VALIDA !== null){
      dialog({
        variant: 'info',
        catchOnCancel: false,
        title: "Alerta",
        description: rowData.VALIDA
      })
      const rowToFind = data.find(element => element.NUMPOL === rowData.NUMPOL);
      rowToFind.tableData.checked = false;
    }
    if(rowData !== undefined && data.length > 1){
      const currency = rowData.CODMONEDA === codCurrency;
      const rowToFind = data.find(element => element.NUMPOL === rowData.NUMPOL);
      if(rowToFind){
        if(!currency){
          dialog({
            variant: 'info',
            catchOnCancel: false,
            title: "Alerta",
            description: 'No se pueden seleccionar Pólizas de Diferentes Monedas'
          })
          rowToFind.tableData.checked = false;
        }
      }
    }
    if(data.length == policies.length){
      if(!checkedAll){
        const defaultCodCurrency = data[0].CODMONEDA;
        data = data.map(el => {
          const currency = el.CODMONEDA === defaultCodCurrency;

          if(el.VALIDA !== null){
            el.tableData.checked = false;
          }
          if(currency === false){
            el.tableData.checked = false;
          }
          return el
        })
        handleChecked();
      }else{
        data = data.map(el => {
          el.tableData.checked = false;
          return el;
        })
        handleChecked();
      }
    handleSetPolicies(data);
    }
    if(data.length === 1){
      handleCodCurrency(data[0].CODMONEDA);
    }
    if(data.length === 0){
      handleCodCurrency('');
    }
    const filteredPolicies = data.filter(invoice => invoice.tableData.checked === true)
    var totalAmount = filteredPolicies.reduce((sum, value) => (sum + value.MONTO), 0)
    handleTotalAmountFinancing(totalAmount);
    return data
  }



  return (
    <>
      <TableMaterial
        options={{
          pageSize: 5,
          search: true,
          toolbar: true,
          sorting: false,
          selection: true,
          selectionProps: rowData => ({
            color: "primary",
          }),
          registro: "Poliza",
        }}
        data={policies}
        isLoading={isLoading}
        onSelectionChange={(data, rowData) => {
          handleSelection(data, rowData)
        }}
        columns={[
          {
            title: "", 
            field: "VALIDA", 
            width: "5%", 
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: 'center'},
            render: rowData => 
              <Icon style={{
                color: rowData.VALIDA !== null ? 'red' : 'green',
                fontSize: 16,
                verticalAlign: "top"
              }}>{rowData.VALIDA !== null ? "clear" : "done"}</Icon>
          },
          {
            title: 'Area', field: 'CODAREA', width: '5%', render: rowData =>
                <ButtonIconText 
                  tooltip={insuranceArea[rowData.CODAREA].title} 
                  color={insuranceArea[rowData.CODAREA].color} 
                  icon={insuranceArea[rowData.CODAREA].icon} 
                />
          },
          {
            title: "Num. Poliza", 
            field: "NUMPOL",
            headerStyle: { textAlign: 'center'},
          },
          {
            title: "Vigencia", 
            field: "VIGENCIA",
            cellStyle: { textAlign: 'center'},
            headerStyle: { textAlign: 'center'},
          },
          {
            title: "Monto", 
            field: "MONTO",
            type: 'currency',
            width: '20%',
            render: rowData => renderAmount(rowData)
          },
        ]}
      />
    </>
  )
}