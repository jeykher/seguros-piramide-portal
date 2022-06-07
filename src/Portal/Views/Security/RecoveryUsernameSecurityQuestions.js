import React , { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem"
import { useForm } from "react-hook-form";
import { Alert } from '@material-ui/lab';
import InputController from 'components/Core/Controller/InputController'
import Axios from 'axios'

const RecoveryUsernameSecurityQuestions = forwardRef((props, ref) => {
    const { triggerValidation, getValues, ...objForm } = useForm();
    const data = props.allStates.step_identification
    const [state, setState] = useState()
    const [securityQuestion1, setSecurityQuestion1] = useState(null)
    const [securityQuestion2, setSecurityQuestion2] = useState(null)

    useEffect(() => {
        data && setSecurityQuestion1(data.security_question_i)
        data && setSecurityQuestion2(data.security_question_ii)
        //console.log('useefect')
        //console.log(data)
    
      }, [props.allStates])

    useImperativeHandle(ref, () => ({
        isValidated(postValidate) {
          triggerValidation()
            .then((result) => {
              if (result) {
                const values = getValues()
                //console.log(values)
                setRecoverUsername(values, postValidate)
              }
            }).catch((error) => { console.error(error) })
        },
        sendState() {
          return state
        }
      }));

    async function setRecoverUsername(dataform, postFnc){
        const jsonAnswers = {
            security_answer_i: dataform.security_answer_i,
            security_answer_ii: dataform.security_answer_ii
        }
        const params = {
            p_portal_user_id_to_recover: data.portal_user_id,
            p_json_answers: JSON.stringify(jsonAnswers)
        }
        //console.log(params)
        const jsonResult = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/security/answer_security_questions`, params )

        setState({
            email: jsonResult.data.result,
        })

        postFnc()

    }
    return (
        <GridContainer justify="center">
            <GridItem xs={12} sm={12}>
                <br></br>
                <Alert severity="info">
                    Responda las siguientes preguntas de seguridad
                </Alert>
                <br></br>
                {securityQuestion1}
                <InputController 
                    objForm={objForm} 
                    label={`Respuesta N° 1`}
                    name={`security_answer_i`}
                    fullWidth 
                    inputProps={{maxLength:30}}/>
                <br></br>
                {securityQuestion2}
                <InputController 
                    objForm={objForm} 
                    label={`Respuesta N° 2`}
                    name={`security_answer_ii`}
                    fullWidth 
                    inputProps={{maxLength:30}}/>
            </GridItem> 
        </GridContainer>
    )
})

export default RecoveryUsernameSecurityQuestions;