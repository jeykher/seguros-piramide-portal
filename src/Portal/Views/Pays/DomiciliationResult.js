import React, { useEffect, Fragment } from "react"
import MuiAlert from "@material-ui/lab/Alert"
import IconButton from "@material-ui/core/IconButton"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Icon from "@material-ui/core/Icon"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import Tooltip from "@material-ui/core/Tooltip"
import Zoom from "@material-ui/core/Zoom"
import Axios from 'axios'


export default function DomiciliationResult(props) {
  const { income, handleBack, titleButton, reportId,domiciliation} = props

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
  }

  async function handleDocuments() {
    const params = {
      p_report_id: reportId ? reportId : 21,
      p_json_parameters: JSON.stringify({p_numreling: income})
    }
    const {data} = await Axios.post('/reports/get',params);
    const blob = new Blob([data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob);
    window.open(`/reporte?urlReport=${btoa(url)}`,"_blank");
  }

  const goToTop = () => {
    if (typeof window !== undefined) {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    }
  }
  useEffect(() => {
    goToTop();
  }, [])

  return (
    <Fragment>
      { domiciliation &&
      <GridContainer justify={"center"}>
        <Alert severity={income ? "success" : "warning"}>
          <p>{'El pago de la inicial y domiciliación se realizaron éxitosamente' }</p>
        </Alert>
        {income && <p>Por favor realiza la impresión de tu relación de ingreso</p>}
      </GridContainer>}
      {income && <Fragment>
        <GridContainer justify={"center"}>
          <h3>{income}</h3>
        </GridContainer>
        <GridContainer justify={"center"}>
          <Tooltip title="Ver documento" placement="right" arrow TransitionComponent={Zoom}>
            <IconButton onClick={handleDocuments}>
              <Icon color={"primary"} style={{ fontSize: 32 }}>picture_as_pdf</Icon>
            </IconButton>
          </Tooltip>
        </GridContainer>
      </Fragment>}
      <GridContainer justify={"center"}>
        <Button color="primary" type="submit" onClick={handleBack}>
          <Icon>send</Icon> {titleButton}
        </Button>
      </GridContainer>
    </Fragment>
  )
}