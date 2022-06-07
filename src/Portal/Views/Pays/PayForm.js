import React, { Fragment, useRef, useState } from "react"
import Card from "react-credit-cards"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import GridContainer from "../../../components/material-kit-pro-react/components/Grid/GridContainer"
import GridItem from "../../../components/material-kit-pro-react/components/Grid/GridItem"
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
  clearIdentificacionNumber,
  indentificationTypeNaturalMayor,
  isValidDate,
} from "utils/utils"
import { isMobile } from "react-device-detect"
import "react-credit-cards/es/styles-compiled.css"
import TextField from "@material-ui/core/TextField"
import { makeStyles } from '@material-ui/core/styles';
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import FormHelperText from '@material-ui/core/FormHelperText';
import { useDialog } from "context/DialogContext"
import NumberFormat from "react-number-format"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"

const useStyles = makeStyles((theme) => ({
  formColumn:{
    display: 'flex',
    flexDirection: 'column'
  },
  textField: {
    width: '30ch',
  },
  textFieldMobile: {
    width: '20ch',
  },
  Pagar:{
   // marginLeft: theme.spacing(16)
  },
  PagarMobile:{
   // marginLeft: theme.spacing(7)
  },
  security:{
    fontFamily: 'dotsfont !important',
    font: 'unset !important'
  }
}))

export default function PayForm(props) {
  const dialog = useDialog()
  const classes = useStyles();
  const {handlePay,acceptedCards,textButton}=props;
  const [dataPay, setDataPay] = useState({
    identificationType:"",
    identification:'',
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    issuer: "",
    focused: "",
  })

  const [identificationTypeError,setIdentificationTyeError]=useState(false)
  const [helperIdentificationTypeError,setHelperIdentificationTypeError]=useState('')
  const [identificationError,setIdentificationError]=useState(false)
  const [helperIdentificationError,setHelperIdentificationError]=useState('')
  const [numberError,setNumberError]=useState(false)
  const [helperNumberError,setHelperNumberError]=useState('')
  const [nameError,setNameError]=useState(false)
  const [helperNameError,setHelperNameError]=useState('')
  const [expiryError,setExpiryError]=useState(false)
  const [helperExpiryError,setHelperExpiryError]=useState('')
  const [cvcError,setCvcError]=useState(false)
  const [helperCvcError,setHelperCvcError]=useState('')
  const formRef = useRef()

  function handleCallback(issuer, isValid) {
    setDataPay({ ...dataPay, issuer: issuer })
  }

  function handleInputFocus(event) {
    setDataPay({
      ...dataPay,
      focused: event.currentTarget.name,
    })
  }

  const handleChange = (event) => {
    setDataPay({ ...dataPay, [event.target.name]: event.target.value })
  };

  function handleInputChange(event) {
    if (event.currentTarget.name === "number") {
      event.currentTarget.value = formatCreditCardNumber(event.currentTarget.value)
    } else if (event.currentTarget.name === "expiry") {
      event.currentTarget.value = formatExpirationDate(event.currentTarget.value)
    } else if (event.currentTarget.name === "cvc") {
      event.currentTarget.value = formatCVC(event.currentTarget.value)
    } else if (event.currentTarget.name === "identification") {
      event.currentTarget.value = clearIdentificacionNumber(event.currentTarget.value)
    }
    else if (event.currentTarget.name === "name") {
      event.currentTarget.value = event.currentTarget.value.toUpperCase()
    }
    setDataPay({ ...dataPay, [event.currentTarget.name]: event.currentTarget.value })
  }

  function validForm(){
    let errors=false;

    if(dataPay.identificationType===''){
      setIdentificationTyeError(true)
      setHelperIdentificationTypeError('Debe seleccionar un tipo de identificación')
      return true;
    }else{
      setIdentificationTyeError(false)
      setHelperIdentificationTypeError('')
    }

    if(dataPay.identification.length< 6){
      setIdentificationError(true)
      setHelperIdentificationError('La cédula debe tener al menos 6 dígitos')
      return true;
    }else{
      setIdentificationError(false)
      setHelperIdentificationError('')
    }

    if(dataPay.number.length< 15){
      setNumberError(true)
      setHelperNumberError('El número de tarjeta debe ser mínimo 16 dígitos')
      return true;
    }else{
      setNumberError(false)
      setHelperNumberError('')
    }

    if(dataPay.name===''){
      setNameError(true)
      setHelperNameError('El nombre no puede ser vacío')
      return true;
    }else{
      setNameError(false)
      setHelperNameError('')
    }
    if (dataPay.expiry.length < 7) {
      setExpiryError(true)
      setHelperExpiryError("La fecha de vencimiento no tiene el formato correcto")
      return true
    } else {
      if (isValidDate(dataPay.expiry)) {
        setExpiryError(true)
        setHelperExpiryError("La tarjeta se encuentra vencida")
        return true
      }

      setExpiryError(false)
      setHelperExpiryError('')
    }

    if(dataPay.cvc.length<3){
      setCvcError(true)
      setHelperCvcError('El numero de tarjeta debe ser minimo 3 digitos')
      return true;
    }else{
      setCvcError(false)
      setHelperCvcError('')
    }
    return errors;

  }


   function onSubmit(e) {
    e.preventDefault()
    if(!validForm())
       handlePay(dataPay);
  }

  return (
    <>
    <GridItem >
        <Card
          number={dataPay.number}
          name={dataPay.name}
          expiry={dataPay.expiry}
          cvc={dataPay.cvc}
          focused={dataPay.focused}
          callback={handleCallback}
          acceptedCards={acceptedCards}
          placeholders={{name:'Tu nombre aqui'}}
        />
    </GridItem>
      <GridContainer justify={"center"}>
        <form ref={formRef} onSubmit={onSubmit} autoComplete={"off"} noValidate className={classes.formColumn}>
          <FormControl>
            <InputLabel htmlFor="indentificationType">Tipo de identificación</InputLabel>
            <Select
              labelId="Tipo id"
              id="indentificationType"
              onChange={handleChange}
              name="identificationType"
              error={!!identificationTypeError}
              helperText={helperIdentificationTypeError}
            >
              <MenuItem value="">
                <em>Tipo de identificación</em>
              </MenuItem>
              {indentificationTypeNaturalMayor && indentificationTypeNaturalMayor.map(item => <MenuItem
                value={item.value}>{item.label}</MenuItem>)}
            </Select>
            <FormHelperText>{helperIdentificationTypeError}</FormHelperText>
          </FormControl>
          <TextField
            type="tel"
            id="standard-basic"
            name="identification"
            label="Número de Cédula"
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            inputProps={{ maxLength: 12 }}
            error={!!identificationError}
            helperText={helperIdentificationError}
            className={isMobile ? classes.textFieldMobile : classes.textField}
            autoComplete="off"
          />
          <TextField
            type="tel"
            id="standard-basic"
            name="number"
            label="Número de Tarjeta"
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            inputProps={{ maxLength: 19 }}
            error={!!numberError}
            helperText={helperNumberError}
            className={isMobile ? classes.textFieldMobile : classes.textField}
            autoComplete="off"
          />
          <TextField
            type="text"
            id="standard-basic"
            name="name"
            label="Nombre del Titular de la Tarjeta"
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            error={!!nameError}
            helperText={helperNameError}
            className={isMobile ? classes.textFieldMobile : classes.textField}
            autoComplete="off"
          />
          <TextField
            type="tel"
            id="standard-basic"
            name="expiry"
            label="Fecha de Vencimiento (MM/YYYY)"
            pattern="\d\d/\d\d\d\d"
            inputProps={{ maxLength: 7 }}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            error={!!expiryError}
            helperText={helperExpiryError}
            className={isMobile ? classes.textFieldMobile : classes.textField}
            autoComplete="off"
          />
          <TextField
            inputProps={{ className: classes.security }}
            type={"text"}
            id="cvc"
            name="cvc"
            label="Código de Seguridad"
            onChange={handleInputChange}
            error={!!cvcError}
            helperText={helperCvcError}
            className={(isMobile ? classes.textFieldMobile : classes.textField)}
          />
          <GridContainer justify={"center"}>
            <input type="hidden" name="issuer" value={dataPay.issuer}/>
            <br/>
            <Button className={isMobile?classes.PagarMobile:classes.Pagar} color="primary" type="submit">
              {textButton ? textButton: 'Pagar'}
            </Button>
          </GridContainer>
        </form>
    </GridContainer>
      </>

  )

}

