import React, { Fragment, useRef, useState } from "react"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import GridContainer from "../../../components/material-kit-pro-react/components/Grid/GridContainer"
import { clearIdentificacionNumber, formatCVC, formatExpirationDate,clearNumber,indentificationTypeNaturalMayor,listAccountType } from "utils/utils"
import {isMobile} from 'react-device-detect';
import "react-credit-cards/es/styles-compiled.css"
import TextField from "@material-ui/core/TextField"
import { makeStyles } from '@material-ui/core/styles';
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import FormHelperText from '@material-ui/core/FormHelperText';
import { useDialog } from "context/DialogContext"
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"
import NumberFormat from "react-number-format"
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
}));
export default function FormDebitCard(props) {
  const dialog = useDialog()
  const classes = useStyles();
  const {handlePay}=props;
  const [dataPay, setDataPay] = useState({
    identificationType:"",
    identification:'',
    number: "",
    accountType:"",
    key_number:"",
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
  const [cvcError,setCvcError]=useState(false)
  const [helperCvcError,setHelperCvcError]=useState('')
  const [accountTypeError,setAccountTypeError]=useState(false)
  const [helperAccountTypeError,setHelperAccountTypeError]=useState('')
  const [keyError,setKeyError]=useState(false)
  const [helperKeyError,setHelperKeyError]=useState('')
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
      event.currentTarget.value = clearNumber(event.currentTarget.value)
    }  else if (event.currentTarget.name === "cvc") {
      event.currentTarget.value = formatCVC(event.currentTarget.value)
    } else if (event.currentTarget.name === "identification") {
      event.currentTarget.value = clearIdentificacionNumber(event.currentTarget.value)
    }else if (event.currentTarget.name === "key_number") {
      event.currentTarget.value = formatCVC(event.currentTarget.value)
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

    if(dataPay.identification.length< 3){
      setIdentificationError(true)
      setHelperIdentificationError('La cédula o rif debe tener al menos 3 dígitos')
      return true;
    }else{
      setIdentificationError(false)
      setHelperIdentificationError('')
    }

    if(dataPay.number.length< 15){
      setNumberError(true)
      setHelperNumberError('El número de llave merrcantil debe ser de 18 dígitos')
      return true;
    }else{
      setNumberError(false)
      setHelperNumberError('')
    }
    if(dataPay.accountType===''){
      setAccountTypeError(true)
      setHelperAccountTypeError('Debe seleccionar un tipo de cuenta')
      return true;
    }else{
      setAccountTypeError(false)
      setHelperAccountTypeError('')
    }

    if(dataPay.key_number.length<4){
      setKeyError(true)
      setHelperKeyError('La llave telefónica debe ser de 4 digitos')
      return true;
    }else{
      setKeyError(false)
      setHelperKeyError('')
    }


    if(dataPay.cvc.length<3){
      setCvcError(true)
      setHelperCvcError('El cvc de la tarjeta debe ser minimo 3 digitos')
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
      <GridContainer justify={"center"}>
        <form  ref={formRef} onSubmit={onSubmit} onautocomplete={true} autoComplete="off" className={classes.formColumn}>
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
            <MenuItem value="" selected>
              <em>Tipo de identificación</em>
            </MenuItem>
            {indentificationTypeNaturalMayor && indentificationTypeNaturalMayor.map( item => <MenuItem value={item.value} >{item.label}</MenuItem>) }
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
            inputProps={{ maxLength: 12}}
            error={!!identificationError}
            helperText={helperIdentificationError}
            className={ isMobile?classes.textFieldMobile:classes.textField}
          />
          <TextField
            type="tel"
            id="standard-basic"
            name="number"
            label="Llave mercantil"
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            inputProps={{ maxLength: 18 }}
            error={!!numberError}
            helperText={helperNumberError}
            className={ isMobile?classes.textFieldMobile:classes.textField}
            autoComplete="off"
          />
          <FormControl>
            <InputLabel htmlFor="accountType">Tipo de cuenta</InputLabel>
          <Select
            labelId="Tipo cuenta"
            id="accountType"
            onChange={handleChange}
            label="Tipo de cuenta"
            name="accountType"
            error={!!accountTypeError}
            helperText={helperAccountTypeError}
          >
            <MenuItem value="">
              <em>Tipo de cuenta</em>
            </MenuItem>
            {listAccountType && listAccountType.map( item => <MenuItem value={item.value} >{item.label}</MenuItem>) }
          </Select>
          <FormHelperText>{helperAccountTypeError}</FormHelperText>
          </FormControl>
         <TextField
            inputProps={{ className: classes.security }}
            type="text"
            id="standard-basic"
            name="key_number"
            label="Clave telefónica"
            onChange={handleInputChange}
            error={!!keyError}
            helperText={helperKeyError}
            className={ isMobile?classes.textFieldMobile:classes.textField}
          />
          <TextField
            inputProps={{ className: classes.security }}
            type="text"
            id="standard-basic"
            name="cvc"
            label="Código de Seguridad"
            pattern="\d{3,4}"
            onChange={handleInputChange}
            error={!!cvcError}
            helperText={helperCvcError}
            className={ isMobile?classes.textFieldMobile:classes.textField}
          />
          <GridContainer justify={"center"}>
            <input type="hidden" name="issuer" value={dataPay.issuer}/>
            <br/>
            <Button className={isMobile?classes.PagarMobile:classes.Pagar} color="primary" type="submit">
              Pagar
            </Button>
          </GridContainer>
        </form>
      </GridContainer>
    </>

  )

}

