import React, { useEffect, useState, Fragment } from "react"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import { getSymbolCurrency, formatAmount } from "utils/utils"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import InvoicesTableTotal from "./InvoicesTableTotal"
import PaymentMethods from "../Pays/PaymentMethods"
import { useDialog } from "context/DialogContext"
import Result from "../Pays/Result"
import Icon from "@material-ui/core/Icon"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Typography from "@material-ui/core/Typography"
import Axios from "axios"
import ResultNotification from '../Pays/ResultNotification'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import ClearIcon from '@material-ui/icons/Clear'
import RemoveIcon from '@material-ui/icons/Remove'
import useDomiciliation from "../Pays/useDomiciliation"
import "./InvoicesTable.scss"

export default function InvoicesTable(props) {
  const userSessionInfo = JSON.parse(sessionStorage.getItem('PROFILE'))
  const { currency, handleBack, handleEnviar, invoicesToPay, paymentOptions, amount, handleReturn, paymentType, propsParams, invoiceAmount, IGTFAmount } = props
  const [invoices, setInvoices] = useState()
  const [total, setTotal] = useState(0)
  const [count, setCount] = useState(0)
  const [viewResult, setResultView] = useState(false)
  const [income, setIncome] = useState()
  const [viewMethod, setViewMethod] = useState(false)
  const [viewTable, setViewTable] = useState(false)
  const [companyOperationNumber, setCompanyOperationNumber] = useState()
  const [checkAll, setCheckAll] = useState(false)
  const [viewBack, setViewBack] = useState(true)
  const dialog = useDialog()
  const [reportId, setReportId] = useState(null);
  const [viewResultNotification,setViewResultNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('');
  const [domiciliationAmount, setDomiciliationAmount] = useState(0)
  const [domiciliationInvoice, setDomiciliationInvoice] = useState([])
  const [domiciliationFromInvoicesFlat, setDomiciliationFromInvoicesFlat] = useState(false)
  const [userInfo, setUserInfo] = useState(undefined)
  const { getPoliciesClient } = useDomiciliation()

  async function onSuccess(data) {
    setIncome(data.result.income_ratio_number)
    setReportId(data.result.report_id);
    setViewTable(false)
    setViewMethod(false)
    setResultView(true)
  }

  async function onSuccessNotification(data){
    setIncome(data.income)
    setNotificationType(data.notification_type)
    setViewTable(false)
    setViewMethod(false)
    setViewResultNotification(true)
  }


  function setTotals(data, rowData) {
    let dataInvoices = null
    let dataInvoicesFinan = null
    let dataQuotes = null
    let flag = false
    const lenghData = data.length
    if (rowData) {
      if (rowData.VALIDAFACT !== null) {
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Alerta",
          description: rowData.VALIDAFACT,
        })
        dataInvoices = invoices.map(invoice => {
          if (invoice.NUMFACT === rowData.NUMFACT) {
            invoice.tableData.checked = false
          }
          return invoice
        })
      } else {
        if (data.some(elem => elem.TIPOFACT !== rowData.TIPOFACT)) {
          dialog({
            variant: "info",
            catchOnCancel: false,
            title: "Alerta",
            description: rowData.MSJTIPOFACT,
          })
          dataInvoices = invoices.map(invoice => {
            if (invoice.NUMFACT === rowData.NUMFACT) {
              invoice.tableData.checked = false
            }
            return invoice
          })
        }
        if (paymentType === "financing") {
          dataInvoicesFinan = dataInvoices !== null ? dataInvoices : invoices
          data = dataInvoicesFinan.map(invoice => {
            if (invoice.NUMFINANC === rowData.NUMFINANC) {
              if (!rowData.tableData.checked) {
                if (rowData.NUMGIRO < invoice.NUMGIRO) {
                  invoice.tableData.checked = false
                }
                if (rowData.NUMGIRO === invoice.NUMGIRO)
                  invoice.tableData.checked = false
              }
              if (rowData.tableData.checked) {
                if (rowData.NUMGIRO > invoice.NUMGIRO) {
                  if (invoice.VALIDAFACT === null) {
                    invoice.tableData.checked = true
                  } else {
                    invoice.tableData.checked = false
                  }
                }
              }
            }
            return invoice
          })
          dataQuotes = data.filter(invoice => (invoice.NUMFINANC === rowData.NUMFINANC && invoice.NUMGIRO < rowData.NUMGIRO));
          if (dataQuotes.some(elem => elem.tableData.checked === false)) {
            dialog({
              variant: "info",
              catchOnCancel: false,
              title: "Alerta",
              description: 'No puede seleccionar una cuota con giros pendientes',
            })

            data = data.map(invoice => {
              if (invoice.NUMFINANC === rowData.NUMFINANC)
                invoice.tableData.checked = false

              return invoice
            })
          }

        }

        if (paymentType === "policy") {
          if (rowData.NUMFRACC !== null) {
            dataInvoicesFinan = dataInvoices !== null ? dataInvoices : invoices
            data = dataInvoicesFinan.map(invoice => {
              if (invoice.NUMFRACC === rowData.NUMFRACC) {
                if (!rowData.tableData.checked) {
                  if (rowData.NUMGIRO < invoice.NUMGIRO) {
                    invoice.tableData.checked = false
                  }
                  if (rowData.NUMGIRO === invoice.NUMGIRO)
                    invoice.tableData.checked = false
                }
                if (rowData.tableData.checked) {
                  if (rowData.NUMGIRO > invoice.NUMGIRO) {
                    if (invoice.VALIDAFACT === null) {
                      invoice.tableData.checked = true
                    }
                  }
                  if (rowData.NUMGIRO === invoice.NUMGIRO)
                    invoice.tableData.checked = true
                }


              }
              return invoice
            })
          }
          dataQuotes = data.filter(invoice => (invoice.NUMFRACC === rowData.NUMFRACC && invoice.NUMGIRO < rowData.NUMGIRO));
          if (dataQuotes.some(elem => elem.tableData.checked === false)) {
            dialog({
              variant: "info",
              catchOnCancel: false,
              title: "Alerta",
              description: 'No puede seleccionar una cuota con giros pendientes',
            })

            data = data.map(invoice => {
              if (invoice.NUMFRACC === rowData.NUMFRACC)
                invoice.tableData.checked = false

              return invoice
            })
          }


        }


      }
    } else {
      if (lenghData === invoices.length) {
        if (checkAll) {
          data = data.map(invoice => {
            invoice.tableData.checked = false
            return invoice
          })
          setCheckAll(false)
        } else {
          data = validaError(data)
        }
      } else {
        data = validaError(data)
      }
    }
    const dataTotal = data.filter(invoice => invoice.tableData.checked === true)
    setCount(dataTotal.length)
    handleEnviar(dataTotal, dataInvoices)
  }

  const renderAmount = (value) => {
    return `${formatAmount(value)} ${getSymbolCurrency(currency)}`
  }
  const handleNext = () => {
    setDomiciliationAmount(0)
    setDomiciliationInvoice([])
    setDomiciliationFromInvoicesFlat(false)
    let data;
    let dataQuotes;
    if (amount === 0) {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "Debe seleccionar al menos una factura",
      })

      return
    }
    const dataControl = invoicesToPay.filter(invoice => invoice.STSCONTROL === "SOL")
    if (dataControl.length > 0) {
      setTechnicalControl(dataControl).then(() => {
        data = invoices.map(invoice => {
          dataControl.find(control => {
            if (control.NUMFACT === invoice.NUMFACT) {
              invoice.tableData.checked = false
              invoice.VALIDAFACT = "Factura esperando por aprobación"
              invoice.STSCONTROL = "VAL"
            }
          })
          return invoice
        })

        if (paymentType === "financing") {
          data.map(dato => {
            dataQuotes = data.filter(invoice => (invoice.NUMFINANC === dato.NUMFINANC && invoice.NUMGIRO < dato.NUMGIRO));
            if (dataQuotes.some(elem => elem.tableData.checked === false)) {
              data = data.map(invoice => {
                if (invoice.NUMFINANC === dato.NUMFINANC)
                  invoice.tableData.checked = false
                return invoice
              })
            }
          })
        }
        if (paymentType === "policy") {
          data.map(dato => {
            dataQuotes = data.filter(invoice => (invoice.NUMFRACC === dato.NUMFRACC && invoice.NUMGIRO < dato.NUMGIRO));
            if (dataQuotes.some(elem => elem.tableData.checked === false)) {
              data = data.map(invoice => {
                if (invoice.NUMFRACC === dato.NUMFRACC)
                  invoice.tableData.checked = false
                return invoice
              })
            }
          })
        }

        const dataTotal = data.filter(invoice => invoice.tableData.checked === true)
        setTotal(dataTotal.reduce(function (total, currentValue) {
          return total + currentValue.MTOFACTMONEDA
        }, 0))
        setCount(dataTotal.length)
        handleEnviar(dataTotal, data)
        return
      })

    }

    setViewTable(false)
    setViewMethod(true)


  }
  const handleReturnButton = (a) => {
    if (a === 1) {
      companyOperationNumber && deleteMerchantOperation()
      setViewMethod(false)
      setDomiciliationAmount(0)
      setDomiciliationInvoice([])
      setDomiciliationFromInvoicesFlat(false)
      setViewTable(true)
    } else {
      handleReturn()
    }

  }

  function validaError(data) {
    let tipofact
    let flag = false
    let dataQuotes = null
    data = data.map((invoice, index) => {
      flag = false
      if (index === 0)
        tipofact = invoice.TIPOFACT
      if (invoice.VALIDAFACT !== null) {
        invoice.tableData.checked = false
      } else {
        if (tipofact !== invoice.TIPOFACT) {
          invoice.tableData.checked = false
        }
      }
      return invoice
    })

    if (paymentType === "financing") {
      data.map(dato => {
        dataQuotes = data.filter(invoice => (invoice.NUMFINANC === dato.NUMFINANC && invoice.NUMGIRO < dato.NUMGIRO));
        if (dataQuotes.some(elem => elem.tableData.checked === false)) {
          data = data.map(invoice => {
            if (invoice.NUMFINANC === dato.NUMFINANC)
              invoice.tableData.checked = false
            return invoice
          })
        }
      })
    }
    if (paymentType === "policy") {
      data.map(dato => {
        dataQuotes = data.filter(invoice => (invoice.NUMFRACC === dato.NUMFRACC && invoice.NUMGIRO < dato.NUMGIRO));
        if (dataQuotes.some(elem => elem.tableData.checked === false)) {
          data = data.map(invoice => {
            if (invoice.NUMFRACC === dato.NUMFRACC)
              invoice.tableData.checked = false
            return invoice
          })
        }
      })
    }

    setCheckAll(true)

    return data
  }

  useEffect(() => {
    setInvoices(props.invoices)
    setViewTable(true)
    setViewMethod(false)
    // searchPoliciesClient()
  }, [props.invoices])

  const setOperationNumber = (operationNumber) => {
    setCompanyOperationNumber(operationNumber)
  }
  const handleInicio = () => {
    setViewBack(false)
  }

  async function deleteMerchantOperation() {
    const params = {
      p_operation_number: companyOperationNumber,
    }
    await Axios.post("/dbo/treasury/delete_merchant_operation", params)
    setCompanyOperationNumber(null)
  }

  async function setTechnicalControl(dataControl) {
    var invoices = dataControl.map(function (obj) {
      var rObj = {}
      rObj["invoice_number"] = obj.NUMFACT
      return rObj
    })
    dialog({
      variant: "info",
      catchOnCancel: false,
      resolve: () => RequestTechnicalControl(invoices),
      title: "Las factura(s) no se pueden pagar sin ser autorizadas, se procederá con la solicitud de su aprobación, intente mas tarde.",
      description: (JSON.stringify(dataControl.map(function (obj) {
        return obj.NUMFACT
      })).replace("[", "")).replace("]", ""),
    })

  }

  async function RequestTechnicalControl(invoices) {
    const params = {
      p_string_json_invoices_data: JSON.stringify(invoices),
      p_payment_type: paymentType,
    }
    const { data } = await Axios.post("/dbo/treasury/request_technical_control", params)


    dialog({
      variant: "info",
      catchOnCancel: false,
      title: "Fue solicitado la aprobación de las facturas",
      description: (JSON.stringify(data.result.map(function (obj) {
        return "Factura:" + obj.invoice_number + " Control:" + obj.control_id
      })).replace("[", "")).replace("]", ""),
    })
  }
  const searchPoliciesClient = async (p_client_code) => {
    const result = await getPoliciesClient(p_client_code)
    setUserInfo({
      cpTipoid: result.c_policies[0].TIPOID,
      npNumid: result.c_policies[0].NUMID,
      cpDvid: result.c_policies[0].DVID
    })
  }
  const handleInvoiceDomiciliation = (monto, numeroFactura) => {
    const invoicePicked = invoices.filter(invoice => invoice.NUMFACT === numeroFactura)
    if(userSessionInfo && userSessionInfo.PROFILE_CODE === "insured") {
      searchPoliciesClient(userSessionInfo.p_client_code)
    }
    else {
      setUserInfo({
        cpTipoid: propsParams.p_identification_type,
        npNumid: propsParams.p_identification_number,
        cpDvid: propsParams.p_identification_id
      })
    }
    setDomiciliationAmount(monto)
    setDomiciliationInvoice(invoicePicked)
    setDomiciliationFromInvoicesFlat(true)
    setViewTable(false)
    setViewMethod(true)
  }
  return (
    <Fragment>
      <GridContainer justify="center">
        {viewResult && <GridItem xs={12} sm={12} md={4} lg={4}>
          <Result reportId={reportId} income={income} handleBack={handleBack} titleButton={"Inicio"} />
        </GridItem>
        }
        { viewResultNotification && <GridItem xs={12} sm={12} md={4} lg={4}>
          <ResultNotification 
            notificationType={notificationType} 
            income={income} 
            handleBack={handleBack} 
            titleButton={"Inicio"} 
          />
        </GridItem> 
        }
      </GridContainer>
      {viewTable && <GridContainer justify={"center"} spacing={0}>
        <GridItem xs={12} sm={12} md={12} lg={12}>
          <TableMaterial
            options={{
              selection: true, pageSize: 5, search: true, toolbar: true, sorting: false,
              selectionProps: rowData => ({
                color: "primary",
              }),
              registro: "Factura",
            }}
            columns={[
              {
                title: "",
                field: "NUMFACT",
                width: "1%",
                cellStyle: { textAlign: "left" },
                headerStyle: { textAlign: "left" },
                render: rowData =>
                  <Icon style={{
                    color: rowData.VALIDAFACT !== null ? "red" : "green",
                    fontSize: 16,
                    verticalAlign: "top",
                  }}>{rowData.VALIDAFACT !== null ? "clear" : "done"}</Icon>,
              },
              {
                title: "Descripción", field: "DESCRIPCION", width: "42%", cellStyle: { textAlign: "left" },
              },
              {
                title: "Número de factura",
                field: "NUMFACT",
                width: "20%",
                cellStyle: { textAlign: "center" },
                headerStyle: { textAlign: "center" },
              },
              {
                title: "Monto",
                field: "MTOFACTMONEDA",
                cellStyle: { textAlign: "center" },
                headerStyle: { textAlign: "center" },
                type: "currency",
                render: (rowData) => renderAmount(rowData.MTOFACTMONEDA), 
                width: "15%"
              },
              {
                title: "Domiciliación",
                field: "DOMICILIATION",
                cellStyle: { textAlign: "center" },
                headerStyle: { textAlign: "center" },
                render: (rowData) => {
                  return (
                    <>
                      {
                        rowData.INDPLANDOMIC === "S"
                          ?
                            (
                              <>
                                <Button
                                  color="primary"
                                  size="small"
                                  style={{
                                    padding: '0.5rem',
                                    fontSize: '0.5rem'
                                  }}
                                  onClick={() => handleInvoiceDomiciliation(rowData.MTOFACTMONEDA, rowData.NUMFACT)}
                                >
                                  <AccountBalanceIcon />
                                  Domiciliar
                                </Button>
                              </>
                            )
                          :
                            (
                              <>
                                <RemoveIcon
                                  style={{
                                    color: '#F12E30'
                                  }}
                                />
                              </>
                            )
                      }
                    </>     
                  )
                }
              }
            ]}
            data={invoices}
            onSelectionChange={(data, rowData) => {
              setTotals(data, rowData)
            }}
          />
          <InvoicesTableTotal total={invoiceAmount} count={count} currency={currency} />
        </GridItem>
        <GridContainer justify={"center"} spacing={0}>
          <Regresar />
          <Button color="primary" type="submit" onClick={handleNext}>
            Siguiente<Icon>fast_forward</Icon>
          </Button>
        </GridContainer>
      </GridContainer>}
      {viewMethod && <GridContainer justify={"center"} spacing={0}>
        <h2>Realice su pago</h2>
        <GridContainer xs={12} sm={12} md={12} lg={12} justify={"center"}>
          <div className="container-pays">
              <div className="item-pay">
                <div className="title-pay">Monto Factura</div>
                <div className="price-pay">
                {
                    domiciliationAmount === 0 ? formatAmount(invoiceAmount) : formatAmount(invoiceAmount)
                  }
                  {getSymbolCurrency(currency)}
                </div>
              </div>
              <div className="item-pay">
                <div className="title-pay">IGTF</div>
                <div className="price-pay">
                {
                    domiciliationAmount === 0 ? formatAmount(IGTFAmount) : formatAmount(IGTFAmount)
                  }
                  {getSymbolCurrency(currency)}
                </div>
              </div>
              <div className="item-pay" style={{marginTop:"5px"}}>
                <div className="title-pay title-total" style={{paddingTop:"14px", fontSize:"15px"}}>Total a Pagar</div>
                <div className="price-pay total-pay">
                  {
                    domiciliationAmount === 0 ? formatAmount(amount) : formatAmount(domiciliationAmount)
                  } 
                  {getSymbolCurrency(currency)}
                </div>
              </div>
          </div>
          {/* <Typography variant="h3" color="primary">
            {
              domiciliationAmount === 0 ? formatAmount(amount) : formatAmount(domiciliationAmount)
            } 
            {getSymbolCurrency(currency)}</Typography> */}
        </GridContainer>
        <GridContainer justify={"center"} spacing={0}>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <br />
            <PaymentMethods
              dataInvoice={domiciliationAmount === 0 ? invoicesToPay : domiciliationInvoice}
              paymentOptions={paymentOptions}
              amount={domiciliationAmount === 0 ? amount : domiciliationAmount}
              onSuccess={onSuccess}
              direction={"down"}
              OperationNumber={setOperationNumber}
              hiddenBack={handleInicio}
              currency={currency}
              paymentType={paymentType}
              onSuccessNotification={onSuccessNotification}
              propsParams={propsParams}
              domiciliationFromInvoicesFlat={domiciliationFromInvoicesFlat}
              userInfo={userInfo}
            />
          </GridItem>
        </GridContainer>
        {viewBack && <GridContainer justify={"center"} spacing={0}>
          <br /><br />
          <Regresar a={1} />
        </GridContainer>}
      </GridContainer>}
    </Fragment>
  )

  function Regresar({ a }) {
    return (
      <>
      {viewMethod===false?
        <Button type="submit" onClick={() => {
          handleReturnButton(a)
        }}>
          <Icon>fast_rewind</Icon> Regresar
        </Button>
        :
        <Button color="primary" type="submit" style={{padding:"10px 18px"}} onClick={() => {
          handleReturnButton(a)
        }}>
          <Icon>fast_rewind</Icon> Regresar
        </Button>
      }
      </>
    )
  }

}

