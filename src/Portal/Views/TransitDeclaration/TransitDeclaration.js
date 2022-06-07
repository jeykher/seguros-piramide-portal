import React, { useState, useEffect} from 'react'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Icon from "@material-ui/core/Icon"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Cardpanel from 'components/Core/Card/CardPanel'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import AmountFormatInput from 'components/Core/NumberFormat/AmountFormatInput'
import DateMaterialPicker from 'components/Core/Datetime/DateMaterialPicker'
import { useDialog } from 'context/DialogContext'

export default function TransitDeclaration(props) {

  const [validated, setValidated] = useState(false)
  const [currency, setCurrency] = useState('')
  const [data, setData] = useState([])
  const dialog = useDialog()
  const [columns, setColumns] = useState([])
  const [rangeDate, setRangeDate] = useState([])
  let dataEdit = []
  let dataFormated = []

  const ValideteRow = (dataValidate) => {
    setValidated(false)
    if (typeof dataValidate.invoice === 'undefined' ||
        dataValidate.invoice === '') {
          msgDialog('Por favor ingrese un número de factura.')
          return false
    }
    if (typeof dataValidate.date_start === 'undefined' ||
        dataValidate.date_start === null) {
          msgDialog('Por favor ingrese "Fecha Desde".')
          return false
    }
    if (typeof dataValidate.date_end === 'undefined' ||
        dataValidate.date_end === null) {
          msgDialog('Por favor ingrese "Fecha Hasta".')
          return false
    }
    if (typeof dataValidate.date_start === 'object' &&
        typeof dataValidate.date_end === 'object' &&
        dataValidate.date_start > dataValidate.date_end) {
          msgDialog('"Fecha Desde" no debe ser mayor que "Fecha Hasta"')
          return false
    }
    if (typeof dataValidate.date_start === 'string' &&
        typeof dataValidate.date_end === 'string' &&
        new Date(dataValidate.date_start) > new Date(dataValidate.date_end)) {
          msgDialog('"Fecha Desde" no debe ser mayor que "Fecha Hasta"')
          return false
    }
    if (typeof dataValidate.date_start === 'object' &&
        typeof dataValidate.date_end === 'string' &&
        dataValidate.date_start > new Date(dataValidate.date_end)) {
          msgDialog('"Fecha Desde" no debe ser mayor que "Fecha Hasta"')
          return false
    }
    if (typeof dataValidate.date_start === 'string' &&
        typeof dataValidate.date_end === 'object' &&
        new Date(dataValidate.date_start) > dataValidate.date_end) {
          msgDialog('"Fecha Desde" no debe ser mayor que "Fecha Hasta"')
          return false
    }
    if (dataValidate.date_start.toString() === 'Invalid Date' ||
        dataValidate.date_end.toString() === 'Invalid Date') {
          msgDialog('La fecha ingresada no es válida')
          return false
    }
    if (typeof dataValidate.reg_number === 'undefined' ||
        dataValidate.reg_number === '' || dataValidate.reg_number == undefined) {
          msgDialog('Por favor ingrese un Nro. de placa de transportador.')
          return false
    }else
      if (dataValidate.reg_number.length>10 ) {
            msgDialog('Por favor ingrese un Nro. de placa de transportador válido. Máximo 10 caracteres.')
            return false
      }

    if (typeof dataValidate.declared_amount === 'undefined' ||
        dataValidate.declared_amount === '') {
          msgDialog('Por favor ingrese el monto a declarar.')
          return false
    }
    if (typeof dataValidate.declared_amount === 'undefined' ||
        dataValidate.declared_amount === '0.00') {
          msgDialog('El monto a declarar no debe ser cero.')
          return false
    }
    setValidated(true)
    return true
  }

  const FormatData = () => {
    dataEdit = []
    data.map( item => {
      if (typeof item.date_start === 'object'){
        item.date_start = item.date_start.toISOString()
      }
      if (typeof item.date_end === 'object'){
        item.date_end = item.date_end.toISOString()
      }
      item.reg_number = item.reg_number.toUpperCase()
      item.invoice = item.invoice.toUpperCase()
      dataEdit.push(item)
    })
  }

  const GetRowDate = ( dateST ) => {
    let dayDigit = new Date( dateST ).getDate()
    let monthDigit = ( new Date( dateST ).getMonth() + 1 )
    if (dayDigit.toString().length == 1) {
      dayDigit = "0" + dayDigit.toString()
    }
    if (monthDigit.toString().length == 1) {
      monthDigit = "0" + monthDigit.toString()
    }
    return   dayDigit
     +"/"+ monthDigit
     +"/"+   new Date( dateST ).getFullYear()
  }

  const msgDialog = ( dataErrors ) => {
    dialog({
      variant: "info",
      catchOnCancel: false,
      title: "Alerta",
      description: dataErrors
    })
  }

  const handleBack = (e) => {
    e.preventDefault()
    props.confirmation([])
  }

  const handleSend = async (e) => {
    e.preventDefault()
    let dataCopy = JSON.parse( JSON.stringify( data ) );     
    dataCopy.map( item => {
      item.date_start = GetRowDate(item.date_start)
      item.date_end = GetRowDate(item.date_end)
    })
    props.confirmation(dataCopy)
  }

  useEffect( () => {
    setCurrency(props.policyData.CODMONEDA)
  }, [])

  useEffect( () => {
    setColumns([
       {
         title: 'Nro. Factura',
         field: 'invoice',
         cellStyle: {
           textAlign: 'center'
         },
         headerStyle: {
           textAlign: 'center'
         }
       },
       {
          title: 'Fecha desde',
          field: 'date_start',
          type: 'date',
          editComponent: props => (
            <DateMaterialPicker
              minDate={rangeDate[0]}
              maxDate={rangeDate[1]}
              placeholder="Fecha desde"
              disablePast
              /*auxiliarValue={
                GetRowDate(props.rowData.date_start)
              }*/{...props}
            />
          ),
          cellStyle: {
            textAlign: 'center'
          },
          headerStyle: {
            textAlign: 'center'
          }
       },
       {
          title: 'Fecha hasta',
          field: 'date_end',
          type: 'date',
          editComponent: props => (
            <DateMaterialPicker
              minDate={rangeDate[0]}
              maxDate={rangeDate[1]}
              placeholder="Fecha hasta"
              disablePast
              /*auxiliarValue={
                GetRowDate(props.rowData.date_end)
              }*/{...props}
            />
          ),
          cellStyle: {
            textAlign: 'center'
          },
          headerStyle: {
            textAlign: 'center'
          }
       },
       {
         title: 'Nro. placa transportador',
         field: 'reg_number',
         cellStyle: {
           textAlign: 'center'
         },
         headerStyle: {
           textAlign: 'center'
         }
       },
       {
         title: 'Monto declarado',
         field: 'declared_amount',
         type: 'currency',
         render: rowData => (
           <AmountFormatDisplay
              value={ rowData.declared_amount }
              prefix={`${currency} `}
           />
         ),
         editComponent: props => (
           <AmountFormatInput
              placeholder="Monto declarado"
              prefix={`${currency} `} {...props}
           />
         ),
         cellStyle: {
           textAlign: 'center'
         },
         headerStyle: {
           textAlign: 'center'
         }
       },
     ])
     setRangeDate([
       new Date(props.policyData.FECINIVALIDA),
       new Date(props.policyData.FECFINVALIDA)
     ])
  }, [currency])

  return(
    <Cardpanel
      titulo="Formulario de Declaración"
      icon="list_alt"
      iconColor="success"
      >
        <GridContainer>
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <TableMaterial
                options={{
                  search: true,
                  pageSizeOptions: [3, 5, 10],
                  pageSize: 3,
                  sorting: false
                }}
                title=""
                columns={columns}
                data={data}
                editable={{
                  onRowAdd: newData =>
                    new Promise((resolve, reject) => {
                      if (ValideteRow(newData)){
                        setData([...data, newData])
                        resolve()
                      }else {
                        reject()
                      }
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise (( resolve, reject ) => {
                      if (ValideteRow(newData)){
                        const dataUpdate = [...data];
                        const index = oldData.tableData.id;
                        dataUpdate[index] = newData;
                        setData([...dataUpdate]);
                        resolve()
                      }else {
                        reject()
                      }
                  }),
                  onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        const dataDelete = [...data];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        setData([...dataDelete]);
                        resolve()
                      }, 500)
                    }),
                }}
                icons={{
                  Add: () => (<Icon color="primary" style={{ fontSize: 30 }}>add_circle</Icon>),
                  Clear: () => (<Icon color="primary">clear</Icon>),
                  Check: () => (<Icon color="primary">check</Icon>),
                  Edit: () => (<Icon color="primary">edit</Icon>),
                  Delete: () => (<Icon color="primary">delete_outline</Icon>),
                }}
                localization={{
                  body: {
                    deleteTooltip: 'Eliminar',
                    editTooltip: 'Editar',
                    addTooltip: 'Agregar',
                    emptyDataSourceMessage: 'No hay registros para mostar',
                    editRow: {
                      saveTooltip: 'Guardar',
                      cancelTooltip: 'Cancelar',
                      deleteText: 'Confirme para eliminar este registro'
                    }
                  },
                  toolbar: {
                    searchTooltip: 'Buscar',
                    searchPlaceholder: 'Buscar'
                  },
                  pagination: {
                    labelDisplayedRows: '{from}-{to} de {count}',
                    labelRowsSelect: 'filas',
                    labelRowsPerPage: 'Filas por página',
                    firstAriaLabel: 'Primera página',
                    firstTooltip: 'Primera página',
                    previousAriaLabel: 'Página anterior',
                    previousTooltip: 'Página anterior',
                    nextAriaLabel: 'Página siguiente',
                    nextTooltip: 'Página siguiente',
                    lastAriaLabel: 'Última página',
                    lastTooltip: 'Última página'
                  },
                  header: {
                    actions: 'Acción'
                  }
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer justify="center" style={{ padding: "15px 0 0 0"}}>
              {validated && <><Button color="primary" onClick={handleSend}>
                  <Icon>send</Icon> Enviar
              </Button></>}
          </GridContainer>
        </Cardpanel>
  )
}
