import React, { useEffect, Fragment } from "react"
import MuiAlert from "@material-ui/lab/Alert"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Icon from "@material-ui/core/Icon"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"


export default function Result(props) {
  const { income, handleBack, titleButton, notificationType} = props

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
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
      <GridContainer justify={"center"}>
        <Alert severity={income ? "success" : "warning"}>
        <p>
          {`Su notificación de ${notificationType === 'T' ? 'transferencia': 'depósito'} fue realizada con éxito. Su pago será verificado
           y se enviará el ingreso de caja el próximo día hábil.
          `}
        </p>
        </Alert>
        {income && <p>Su número de notificación es:</p>}
      </GridContainer>
      {income && <Fragment>
        <GridContainer justify={"center"}>
          <h3>{income}</h3>
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