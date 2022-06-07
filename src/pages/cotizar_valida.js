import Axios from 'axios';
import { useLocation } from "@reach/router"
import { navigate } from "gatsby"
import MuiAlert from '@material-ui/lab/Alert'
import React, { useRef, useEffect } from 'react'
import queryString from 'query-string'
import { initAxiosInterceptors } from 'utils/axiosConfig'
import { useDialog } from 'context/DialogContext'
import { useLoading } from 'context/LoadingContext'
import TemplateBlank from 'LandingPageMaterial/Layout/TemplateBlank'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import BudgetTitle from 'Portal/Views/Budget/BudgetTitle'
import InputBase from '@material-ui/core/InputBase';
import { fade, withStyles } from '@material-ui/core/styles';
import { useForm, Controller } from "react-hook-form";
import cotizarValidaStyles from '../styles/cotizarValidaStyles'
import { makeStyles } from "@material-ui/core/styles"
import { Alert } from '@material-ui/lab';
import IconButton from "@material-ui/core/IconButton"
import TouchAppIcon from '@material-ui/icons/TouchApp';

const useStyles = makeStyles(cotizarValidaStyles);
const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(2),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 18,
    width: '10px',
    padding: '10px 12px',
    margin: '0 7px 0 7px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}))(InputBase)

export default function CotizarValida(props) {
  const classes = useStyles()
  const dialog = useDialog()
  const loading = useLoading()
  const location = useLocation()
  const { handleSubmit, errors, control } = useForm();
  const inputNumbers = 4;
  const params_url = queryString.parse(props.location.search)

  useEffect(() =>{
    initAxiosInterceptors(dialog,loading)
  },[])

  const inputRef = useRef([]);
  inputRef.current = new Array(inputNumbers);

  function AlertEl(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
  }

  function onFinish(hash) {
    navigate(`/cotizar?id=${hash}`, { replace: true })
  }

  const getCode = () => {
    let data = '';
    inputRef.current.map((el) => {
      data = `${data}${el.value}`
    })
    return data;
  }

  async function onSubmit(data, e) {
    const code = {
      code_validation: `${getCode()}`
    }
    try {
      const params = {
        p_budget_id: params_url.id,
        p_json_info: JSON.stringify(code)
      }
      const response = await Axios.post('/dbo/budgets/validate_sms', params)
      const paramsSend = { p_budget_id: params_url.id, p_location: location.origin }
      Axios.post('/dbo/budgets/send_budget', paramsSend)
      onFinish(response.data.p_hash)
    } catch (error) {
      console.error(error)
    }
  }

  async function reSendSms() {
    try {
      const params = { p_budget_id: params_url.id }
      await Axios.post('/dbo/budgets/re_send_sms_code', params)
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Exito",
        description: "Se ha enviado un nuevo codigo SMS"
      })
    } catch (error) {
      console.error(error)
    }
  }

  const focusNext = (i) => {
    return inputRef.current[i + 1] !== undefined && inputRef.current[i + 1].focus()
  }

  return (
    <TemplateBlank>
      <BudgetTitle title="Validación de datos" />
      <GridContainer>
      <GridItem xs={12} sm={12} md={3} ></GridItem>
        <GridItem xs={12} sm={12} md={6} >
          <GridItem xs={12} sm={12} md={12} className="sections30">
            <AlertEl severity="success">Para continuar con su cotización le hemos enviado el código de verificación via SMS a su teléfono </AlertEl>
          </GridItem>
          <form onSubmit={handleSubmit(onSubmit)}>
            <GridContainer className="sections30" spacing={3} justify="center">
              <GridItem xs={12} sm={12} md={12} className={classes.styleItem}>
                {[...Array(inputNumbers)].map((el, i) => {
                  return (
                    <Controller
                      as={BootstrapInput}
                      control={control}
                      name={`numero${i + 1}`}
                      inputRef={el => inputRef.current[i] = el}
                      onChange={([e]) => {
                        focusNext(i);
                        return e.target.value;
                      }}
                      inputProps={{ maxLength: 1 }}
                    />
                  )
                })}
              </GridItem>
            </GridContainer>
            <GridContainer justify="center">
              <Button color="primary" type="submit"><Icon>send</Icon> Enviar</Button>
            </GridContainer>
          </form>
          <GridItem xs={12} sm={12} md={12} style={{ textAlign: 'center' }}>
            <Alert severity='warning' className={classes.alertStyle}>
              <br></br>¿No le ha llegado el SMS?<br></br>Solicite el envío nuevamente presionando aquí<br></br>
              <IconButton color="secondary" aria-label="add an alarm" onClick={reSendSms}><TouchAppIcon /></IconButton>
            </Alert>
          </GridItem>
        </GridItem>
      </GridContainer>
    </TemplateBlank>
  )
}
