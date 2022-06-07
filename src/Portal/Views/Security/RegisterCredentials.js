import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import Axios from 'axios'
import { useForm } from "react-hook-form";
import { useDialog } from "context/DialogContext";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import PasswordController from 'components/Core/Controller/PasswordController'
import PasswordConfirmController from 'components/Core/Controller/PasswordConfirmController'
import { useLocation } from "@reach/router"
import { useLoading } from 'context/LoadingContext'
import { initAxiosInterceptors } from 'utils/axiosConfig'
import UserNameController from 'components/Core/Controller/UserNameController'
import EmailController from 'components/Core/Controller/EmailController'
import PhoneController from 'components/Core/Controller/PhoneController'

const RegisterCredentials = forwardRef((props, ref) => {
  const { triggerValidation, getValues, ...objForm } = useForm();
  const data = props.allStates.step_identification
  const [state, setState] = useState()
  const [name, setname] = useState(null)
  const [email, setemail] = useState(null)
  const [cellphone, setCellphone] = useState(null)
  const [isInsured, setIsInsured] = useState(null)
  const [userName, setUserName] = useState(null)
  const dialog = useDialog();
  const location = useLocation();
  const prefixPathSite = (process.env.GATSBY_PREFIX_SITE) ? process.env.GATSBY_PREFIX_SITE : ""
  const loading = useLoading();

  useEffect(() => {
    data && setname(data.name)
    data && setemail(data.email?data.email.trim():null)
    data && setCellphone(data.cellphone?data.cellphone.trim():null)
    data && setIsInsured(data.profile_id==6?true:false)
    data && data.hasUserCreatedNotActivated == 'S' && setUserName(data.username)

  }, [props])

  useEffect(() => {
    email && objForm.setValue('p_email', email)
    cellphone && objForm.setValue('p_phone', cellphone)
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
            //console.log(values)
            setRegister(values, postValidate)
          }
        }).catch((error) => { console.error(error) })
    },
    sendState() {
      return state
    }
  }));

  async function setRegister(dataform, postFnc) {
    
    const url = location.origin + prefixPathSite +"/"+ 'valida_registro?id=';
    let phoneBase = ''
    let mailBase = ''
    let userNameBase = ''

    if(isInsured){
      phoneBase = dataform.p_phone
      mailBase = dataform.p_email
    }else{
      phoneBase = cellphone
      mailBase = email
    }
    if(userName){
      userNameBase = userName
    }else{
      userNameBase = dataform.p_username
    }

    const areaCode = (phoneBase&&phoneBase.length>4?phoneBase.substring(0,4):undefined)
    const phoneNumber = (phoneBase&&phoneBase.length>4?phoneBase.substring(4,phoneBase.length):undefined)

    const params = {
      Profiles: [{ Profile_id: data.profile_id }],
      principal_profile: data.profile_id,
      tipoid: data.tipoid,
      numid: data.numid,  
      dvid: data.dvid,
      first_name: data.first_name,
      last_name: data.last_name,
      email: mailBase,
      phone_number: phoneNumber?parseInt(phoneNumber):phoneNumber,
      area_code: areaCode?parseInt(areaCode):areaCode,
      portal_user: userNameBase,
      pwd: dataform.p_password,
      core_user: "",
      url_validate_register_page: url,
    }

    setState(params)    
    postFnc()

  }

  return (
    <GridContainer justify="center">
      <GridItem xs={12} sm={8}>
        <form>
          <h5>{name}</h5>          
          {!isInsured&&
            <>
              <h6>Email: {email}</h6>
              {cellphone&&<h6>Phone: {cellphone}</h6>}
            </>
          }
          <h6>Usuario: {userName}</h6>
          {isInsured&&
            <>
              <EmailController objForm={objForm} label="Correo Electrónico" name={'p_email'} defaultValue={email} />
              <PhoneController objForm={objForm} label="Número de Teléfono" name={'p_phone'} defaultValue={cellphone} />
            </>
          }
          {!userName&&<UserNameController
              objForm={objForm} 
              label="Usuario" 
              name="p_username"
            />
          }
          <PasswordController objForm={objForm} label="Clave" />
          <PasswordConfirmController objForm={objForm} label="Confirmar clave" />
        </form>
      </GridItem>
    </GridContainer>
  )
})
export default RegisterCredentials;
