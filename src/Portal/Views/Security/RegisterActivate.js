import React, { useState, forwardRef, useImperativeHandle, useRef,useEffect } from 'react'
import { useForm, Controller } from "react-hook-form";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import InputBase from '@material-ui/core/InputBase';
import { Alert } from '@material-ui/lab';
import { fade, withStyles } from '@material-ui/core/styles';
import { makeStyles } from "@material-ui/core/styles"
import registerStyles from './registerStyle'
import { navigate } from "gatsby";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton"
import TouchAppIcon from '@material-ui/icons/TouchApp';
import { Link } from 'gatsby'
import Axios from 'axios'

const useStyles = makeStyles(registerStyles);

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
    fontSize: 15,
    width: '14px',
    "@media (min-width: 401px)": {
      padding: '10px 12px'
    },
    "@media (max-width: 400px)": {
      padding: '10px 10px'
    },   
    textAlign: 'center',
    margin: '0 0px 0 7px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
  reloadSection: {
    textAlign: 'center',
  }
}))(InputBase)


const RegisterActivate = forwardRef((props, ref) => {
    const { triggerValidation, getValues, control, ...objForm } = useForm();
    const [state, setState] = useState()
    const [codeSendingType, setCodeSendingType] = useState()
    const [message, setMessage] = useState()
    const [registered, setRegistered] = useState()
    const [severity, setSeverity] = useState('info')
    const inputNumbers = 6;
    const inputRef = useRef([]);
    const classes = useStyles()
    inputRef.current = new Array(inputNumbers);

    useImperativeHandle(ref, () => ({
        isValidated(postValidate) {
          triggerValidation()
            .then((result) => {
              if (result) {
                const values = getValues()
                setActivate(values, postValidate)
              }
            }).catch((error) => { console.error(error) })
        },
        sendState() {
          return state
        }
    }));

    useEffect(() => {
      if(props&&props.allStates&&props.allStates['step_result']){
        let email = props.allStates['step_credential'].email
        let areaCode = props.allStates['step_credential'].area_code
        let phoneNumber = props.allStates['step_credential'].phone_number
        let sendingType = props.allStates['step_result'].code_sending_type;
        let message = ''

        if(sendingType=='MAIL'){
          message = `Le enviamos un enlace al correo "${email}" para validar el registro y pueda ingresar a nuestro portal.`
          setRegistered(true)
          setSeverity('success')
        }else{
          message = `Ingrese el código de validación enviado al Número Telefónico "0${areaCode}-${phoneNumber}" para completar su registro`
          setRegistered(false)
        }
        
        setCodeSendingType(sendingType)
        setMessage(message)
        
        
      }
    }, [props.allStates])

    const getCode = () =>{
      let data = '';
      inputRef.current.map((el) => {
        data =`${data}${el.value}`
      })
      return data;
    }

    function finishRegister(){
      navigate('/')
    }

    async function setActivate(dataform, postFnc){
        let portalUser = props.allStates['step_credential'].portal_user
        if(!registered){
          let inputCode = getCode()
          const params = {
            p_portal_username: portalUser,
            p_random_value: inputCode
          }
        
          if(inputCode&&inputCode.length==6){
            //console.log(params)
            const jsonResult = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/security/validate_register_by_sms`,  params )
            //console.log(jsonResult)
  
            setMessage(`El registro del usuario ${portalUser} fue completado exitosamente. Ya puedes iniciar sesión`)
            setRegistered(true)
            setSeverity('success')
          }else{
            setMessage(`Debe ingresar el código de validación`)
          }
        }else{
          finishRegister()
        } 

    }

    const focusNext = (i) => {
      return inputRef.current[i + 1] !== undefined  && inputRef.current[i + 1].focus()
    }

    function backButton(){
      props.previousAction()
    }

    return (
      <GridContainer justify="center">
        <br></br>
        {codeSendingType&&
          <GridItem xs={12} sm={8}>                    
            <Alert severity={severity}>
                {message}
            </Alert>
            {(codeSendingType=='SMS')&&
              <>
                <br></br>
                {!registered&&
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12} className={classes.styleItem}>
                    {[...Array(inputNumbers)].map((el,i) => {
                      return(
                        <Controller 
                        as={BootstrapInput} 
                        control={control} 
                        name={`numero${i + 1}`}
                        inputRef={el => inputRef.current[i] = el}
                        onChange={([e]) => {
                          focusNext(i);
                          return e.target.value;
                        }}
                      />
                      )
                    })}
                  </GridItem>
                </GridContainer>
                }
                {registered&&
                  <Link to={`/login`}>
                      <Button type="button" color="primary" fullWidth>Inicia sesión</Button>
                  </Link>}
              </>
            }  
              
            <br></br><br></br>
            <Alert severity='warning'>
              <br></br>
              El mensaje de confirmación puede tomar varios minutos en llegar.<br></br><br></br>
              ¿No le ha llegado el {codeSendingType=='MAIL'?'correo':'SMS'}?<br></br>
              Solicite el envío nuevamente presionando aquí<br></br>
              <IconButton 
                color="secondary" 
                aria-label="add an alarm" 
                onClick={e => {
                  e.preventDefault();
                  backButton();
                }}>
                  <TouchAppIcon />
              </IconButton>
            </Alert>              
              
          </GridItem>
        }
      </GridContainer>
    )
})
export default RegisterActivate;
