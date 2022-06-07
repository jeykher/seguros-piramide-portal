import React from "react"
import Card from "components/material-dashboard-pro-react/components/Card/Card"
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"

import Icon from "@material-ui/core/Icon"
import Button from "../../../components/material-kit-pro-react/components/CustomButtons/Button"
import CheckCircleOutlineRounded from "@material-ui/icons/CheckCircleOutlineRounded"
import ErrorOutlineRounded from "@material-ui/icons/ErrorOutlineRounded"
import pendingAction from "../Workflow/pendingAction"
import { sumaDiasFecha } from "../../../utils/utils"
import { format } from "date-fns"


export default function DeclarationAgreement(props) {
  const { declarationNumber, workflowId, status, daysdecla } = props
  const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
  const nameInsuranceCompany = (insuranceCompany == 'OCEANICA') ? 'Oceánica de Seguros' : 'Pirámide Seguros'

  async function goToWorkFlow() {
    await pendingAction(workflowId)
  }


  return (
    <Card>
      <CardHeader color={status === "REC" ? "warning" : "success"} className="text-center">
        {status === "REC" ? <ErrorOutlineRounded fontSize="large" /> : <CheckCircleOutlineRounded fontSize="large" />}
        <h5>La declaración de siniestro automóvil</h5>
        {status === "REC" ?
          <h5>Ha sido rechazada por extemporáneo</h5> :
          <>
            <h5>Se ha generado exitosamente</h5>
            <h5>Declaración Nro.{declarationNumber}</h5>
          </>
        }
      </CardHeader>
      <CardBody>
        <GridContainer className="text-center">
          {status !== "REC" &&
            <GridItem className="text-center" item xs={12} sm={12} md={12} lg={12}>
              <h6><strong>INFORMACIÓN IMPORTANTE</strong></h6>
              <>
                <p className="text-justify">En las próximas horas será informado acerca del proveedor de Respuestos a
                  donde debe acudir </p>
              </>
              <>
                <p className="text-justify">Debe cumplir con los siguientes pasos para continuar con el proceso de
                  reclamo:</p>
                <h6 className="text-justify"><strong>INSPECCIÓN DE VEHÍCULO:</strong></h6>
                <p className="text-justify">El vehículo debe ser inspeccionada por un perito autorizado por {nameInsuranceCompany} para evaluar 
                los daños declarados.</p>
                <p className="text-justify">Puede dirigirse a cualquiera de nuestras oficinas a nivel nacional.</p>
                <p className="text-justify">La inspección debe ser realizada antes de los ({daysdecla}) días hábiles
                  siguientes a esta declaración,
                  la fecha limite para realizar la inspección es {sumaDiasFecha(daysdecla, format(new Date(), 'dd/MM/yyyy'))} .</p>
                <p className="text-justify">Al momento de la inspección debe consignar los recaudos que se le soliciten,
                podrá observarlos al final del comprobante
                  de la declaración.</p>
                <h6 className="text-justify"><strong>IMPORTANTE</strong></h6>
                <p className="text-justify">Una vez inspeccionado el vehículo y consignados los recaudos, nuestro
                Departamento Técnico procederá con
                el análisis del caso, dependiendo del análisis, {nameInsuranceCompany} se reserva el derecho de solicitar
                nuevos
                recaudos
                  que considere necesarios.</p>
              </>
            </GridItem>
          }

          <GridItem className="text-center" xs={12} sm={12} md={12} lg={12}>
            {workflowId && <Button color="primary" type="submit" onClick={goToWorkFlow}>
              <Icon>description</Icon> Continuar
            </Button>}
          </GridItem>
        </GridContainer>
      </CardBody>

    </Card>
  )
}