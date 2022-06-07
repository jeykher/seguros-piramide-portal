import React, { useState, forwardRef, useImperativeHandle,useEffect } from 'react'
import { useForm } from "react-hook-form";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem"
import RadioButtonController from 'components/Core/Controller/RadioButtonController'
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from "@material-ui/core/styles"
import registerStyles from './registerStyle'
import Axios from 'axios'

const useStyles = makeStyles(registerStyles);

const RegisterResult = forwardRef((props, ref) => {
    const { triggerValidation, getValues, ...objForm } = useForm();
    const [state, setState] = useState()
    const [sendOptions, setSendOptions] = useState()
    const classes = useStyles()

    useEffect(() => {
      if(props&&props.allStates&&props.allStates['step_terms']&&props.currentStep==4){
        let options = []
        let email = props.allStates['step_credential'].email
        let areaCode = props.allStates['step_credential'].area_code
        let phoneNumber = props.allStates['step_credential'].phone_number
        let profileId = props.allStates['step_identification'].profile_id
        if(email){
          options.push({ label: "Correo Electrónico", value: "MAIL" })
        }
        if((profileId==1||profileId==6)&&(areaCode&&phoneNumber)){ //Solo Asegurado y Asesor pueden confirmar por SMS
          options.push({ label: "SMS", value: "SMS" })
        }

        setSendOptions(options)
      }      
    }, [props.allStates])

    useEffect(() => {
      if(sendOptions){
        if(!objForm.control.getValues()['code_sending_type']){
          objForm.setValue('code_sending_type', sendOptions[0].value)
        }
        
        if(sendOptions.length==1&&!props.allStates['step_result']){
          props.nextAction()
        }
      }
    }, [sendOptions])

    useImperativeHandle(ref, () => ({
        isValidated(postValidate) {
          triggerValidation()
            .then((result) => {
              if (result) {
                const values = getValues()
                setLastStep(values, postValidate)
              }
            }).catch((error) => { console.error(error) })
        },
        sendState() {
          return state
        }
    }));

    async function setLastStep(dataform, postFnc){
        if(dataform['code_sending_type']){
            let lastStepParams = { code_sending_type: dataform['code_sending_type']}

            const params = {
                ... props.allStates['step_credential'],
                ... props.allStates['step_questions'],
                ... props.allStates['step_terms'],
                ... lastStepParams
            }
            //console.log('parametros finales')
            //console.log(params)

            const jsonResult = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/security/register`, { p_json_register: JSON.stringify(params) })
            //console.log(jsonResult)

            lastStepParams = { 
              ... lastStepParams,
              ... {register_result: ''}
            }
            
            setState(lastStepParams)
            postFnc()
          }
    }

    return (
        <GridContainer justify="center">
          {(sendOptions&&sendOptions.length>0)&&
            <GridItem xs={12} sm={8} className={classes.styleItem}>
              <br></br>
              <Alert severity="info">
                  {props.allStates['step_result']&&
                    <>Presione 'Siguiente' para intentar nuevamente<br></br><br></br></>}
                  {(sendOptions&&sendOptions.length>1)&&
                  <>
                    Seleccione la vía por la cual desea validar su registro
                  </>
                  }
                  {(sendOptions&&sendOptions.length==1)&&
                  <>
                    Su registro será validado por la siguiente vía
                  </>
                  }                  
              </Alert>
              <br></br>
              
              <RadioButtonController                
                objForm={objForm}
                name="code_sending_type"
                values={sendOptions}
                fullWidth={true}   
                defaultValue={ sendOptions[0].value }

              />
            </GridItem>
          }
          {(sendOptions&&sendOptions.length==0)&&
            <GridItem xs={12} sm={8} className={classes.styleItem}>
              <br></br>
              <Alert severity="error">
                Usted no posee datos de contacto registrados
              </Alert>
            </GridItem>
          }
        </GridContainer>
    )
})
export default RegisterResult;
