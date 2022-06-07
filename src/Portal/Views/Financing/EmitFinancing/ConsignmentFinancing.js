import React, { Fragment } from "react"
import Axios from "axios"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import DigitizationView from "Portal/Views/Digitization/DigitizationView"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Icon from "@material-ui/core/Icon"
import { useDialog } from "context/DialogContext"


export default function ConsignmentFinancing(props) {
  const {
    financingEmited,
    handleStep,
    checkPendingDocuments,
    documentParams,
    buttonBack,
    isFeeFinancing,
    isValidPayment,
    isDomiciliedPlan
  } = props
  const dialog = useDialog()

  async function onDownloadPayroll() {
    const paramsSecondDocument = {
      p_report_id: 82,
      p_json_parameters: JSON.stringify({ p_numfin: financingEmited.financing_number }),
    }
    const secondResult = await Axios.post("/reports/get", paramsSecondDocument)
    const secondBlob = new Blob([secondResult.data], { type: "application/pdf" })
    const secondUrl = URL.createObjectURL(secondBlob)
    window.open(`/reporte?urlReport=${btoa(secondUrl)}`, "_blank")
  }

  async function onNext(step) {
    const result = await checkPendingDocuments()
    if (result === true) {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "Debe de entregar todos los recaudos solicitados para poder continuar.",
      })
    } else {
      handleStep(step)
    }
  }

  return (
    <GridContainer justify="center">
      <GridItem xs={12} sm={12} md={10}>
        <Fragment>
          <GridItem xs={12} sm={12} md={12} className="sections30">
            <h5>Para culminar con el financiamiento debe:</h5>
            <ul>
              <li>Imprimir y firmar la Planilla de Solicitud de Financiamiento.</li>
              <li>Escanear la Planilla de Solicitud de Financiamiento y adjuntar con el resto de los requisitos.</li>
            </ul>
          </GridItem>
          <GridContainer justify="center" className="sections30">
            <Button color="primary" onClick={onDownloadPayroll}>
              <Icon>cloud_download</Icon> Descargar Planilla de Solicitud de Financiamiento
            </Button>
          </GridContainer>
        </Fragment>
        <GridContainer className="sections30" spacing={3}>
          <GridItem xs={12} sm={12} md={12}>
            Tiene 5 días para completar estos pasos.
            Puede acceder en cualquier momento y culminar con la carga de los requisitos.
          </GridItem>
        </GridContainer>
        {documentParams && <DigitizationView params={documentParams}/>}
        <GridContainer xs={12} sm={12} md={12} justify="center" className="sections30">
          {buttonBack && <>
            <Button type="submit" onClick={() => handleStep(0)}>
              <Icon>fast_rewind</Icon> Regresar
            </Button>
          </>
          }
          {
            isFeeFinancing ?
              <>
                {
                  isValidPayment &&
                  <Button color="primary" type="submit" onClick={()=>{onNext(5)}}>
                    Pagar<Icon>fast_forward</Icon>
                  </Button>
                }
                {
                  isDomiciliedPlan &&
                  <Button color="primary" type="submit" onClick={()=>{onNext(3)}}>
                    Domiciliar <Icon>fast_forward</Icon>
                  </Button>
                }
              </>
              :
              <Button color="primary" type="submit" onClick={()=>{onNext(3)}}>
                Siguiente<Icon>fast_forward</Icon>
              </Button>
          }

        </GridContainer>
      </GridItem>
    </GridContainer>
  )
}
