import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useForm } from "react-hook-form";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import InputController from "components/Core/Controller/InputController"
import RadioButtonController from 'components/Core/Controller/RadioButtonController'
import { useLoading } from 'context/LoadingContext'
import { useDialog } from "context/DialogContext";
import { initAxiosInterceptors } from 'utils/axiosConfig'
import Axios from 'axios'

const RegisterTerms = forwardRef((props, ref) => {
  const { triggerValidation, getValues, ...objForm } = useForm();
  const [state, setState] = useState()
  const [ terms, setTerms ] = useState(null)
  const dialog = useDialog();
  const loading = useLoading();

  async function getTerms() {
    const jsonTerms = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/security/get_terms_of_use`)
    
    if(jsonTerms&&jsonTerms.data&&jsonTerms.data.result){
      setTerms(jsonTerms.data.result)
    }
  }
  
  useEffect(() => {
    //GET TERMS
    getTerms()
    //objForm.setValue('p_accept_terms', 'Y')
  }, [])

  useEffect(() =>{
    initAxiosInterceptors(dialog,loading)
  },[])

  useImperativeHandle(ref, () => ({
    isValidated(postValidate) {
      triggerValidation()
        .then((result) => {
          if (result) {
            const values = getValues()
            setAcceptTerms(values, postValidate)
          }
        }).catch((error) => { console.error(error) })
    },
    sendState() {
      return state
    }
  }));

  async function setAcceptTerms(dataform, postFnc) {
    
    const params = {
      p_accept_terms: dataform['p_accept_terms'],
    }
    setState(params)
    
    if(dataform['p_accept_terms'] == 'Y'){
      postFnc()
    }
  }

  return (
    <GridContainer justify="center">
      <GridItem xs={12} sm={8}>
        <br></br>
        <form>         
          {terms&&
            <>
            <InputController 
              objForm={objForm} 
              label="Términos y Condiciones" 
              name={'p_terms'} 
              defaultValue={terms}
              multiline 
              fullWidth
              rows={10}
              variant="outlined"
               />

            <RadioButtonController
              row
              objForm={objForm}
              name="p_accept_terms"
              values={[{ label: "Aceptar", value: "Y" }, { label: "Cancelar", value: "N" }]}
              fullWidth={true}
           />
          </>     
          }
        </form>
      </GridItem>
    </GridContainer>
  )
})
export default RegisterTerms;
