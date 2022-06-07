import React, { Fragment, useEffect, useState} from "react"
import MuiAlert from "@material-ui/lab/Alert"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Icon from "@material-ui/core/Icon"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import Axios from 'axios'
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip"
import Zoom from "@material-ui/core/Zoom"
import IconButton from "@material-ui/core/IconButton"
import {navigate} from 'gatsby'
import { getProfileHome } from 'utils/auth';

const useStyles = makeStyles((theme) => ({
  container:{
    margin: '2em 0'
  },
  titleAlert:{
    margin: '0'
  }
}));

export default function ResultReports({financingEmited, handleStep,isDomiciliedPlan}) {
  const [showPayment,setShowPayment] = useState();
  const [showButton,setShowButton] = useState(false);
  const classes = useStyles();
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
  }

  async function handleDocument() {
    const params = {
      p_report_id: 81,
      p_json_parameters: JSON.stringify({p_numfin: financingEmited.financing_number})
    }
    const firstResult = await Axios.post('/reports/get',params);
    const blob = new Blob([firstResult.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob);
    window.open(`/reporte?urlReport=${btoa(url)}`,"_blank");
  }

  async function checkMethodPayments(){
    const params = {
      p_financing_code: financingEmited.financing_code,
      p_financing: financingEmited.financing_number,
      p_quote_next: 'A'
    }
    const { data } = await Axios.post('/dbo/financing/get_financing_invoice',params);
    if(data.p_cur_payment_options.length > 0){
      setShowPayment(true)
    }else{
      setShowPayment(false)
    }
    setShowButton(true);
  }
  async function deleteDomicilied(){
    try {
      const params = {
        "p_financing_code": financingEmited.financing_code,
        "p_financing_number": financingEmited.financing_number,
      }
      const { data } = await Axios.post(`/dbo/financing/delete_domiciled_data`, params)
    } catch (error) {
      console.error(error)
    }
  }

  const returnHome = () => {
    navigate(getProfileHome());
  }


  useEffect(() => {
    checkMethodPayments();
    deleteDomicilied();
  },[])



  return (
    <Fragment>
      <GridContainer justify={"center"}>
        <Alert severity={"success"}>
          <h4 className={classes.titleAlert}>Se ha creado el financiamiento con exito!</h4>
        </Alert>
      </GridContainer>
      <GridContainer justify={"center"} className={classes.container}>
        <h4>Su número de contrato es: {financingEmited.financing_number}</h4>
      </GridContainer>
      <GridContainer justify={"center"}>
          <Tooltip title="Ver documento" placement="right" arrow TransitionComponent={Zoom}>
            <IconButton onClick={handleDocument}>
              <Icon color={"primary"} style={{ fontSize: 32 }}>picture_as_pdf</Icon>
            </IconButton>
          </Tooltip>
        </GridContainer>
        { showButton &&
          <GridContainer justify={"center"}>
            { showPayment ?
              <>
              <Button color="primary" type="submit" onClick={() => handleStep(5)}>
                <Icon>send</Icon>Pagar inicial
              </Button>
              {isDomiciliedPlan &&
              <Button color="primary" type="submit" onClick={() => handleStep(4)}>
                <Icon>send</Icon>Domiciliar
              </Button>
              }
              </>
              :
                <Button color="primary" type="submit" onClick={returnHome}>
                <Icon>send</Icon>Inicio
              </Button>
            }
          </GridContainer>
        }
    </Fragment>
  )
}