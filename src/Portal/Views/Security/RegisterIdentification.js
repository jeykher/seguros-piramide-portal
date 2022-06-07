import React, { useState, useEffect, forwardRef, useImperativeHandle,useRef } from 'react'
import Axios from 'axios'
import { useForm } from "react-hook-form"
import { useDialog } from "context/DialogContext"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem"
import { getIdentification, indentificationTypeAll } from 'utils/utils'
import Identification from 'components/Core/Controller/Identification'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import { useLoading } from 'context/LoadingContext'
import { initAxiosInterceptors } from 'utils/axiosConfig'
import DateMaterialPickerController from "components/Core/Controller/DateMaterialPickerController"
import { makeStyles } from "@material-ui/core/styles"
import registerStyles from './registerStyle'
import ReCAPTCHA from "react-google-recaptcha";

const useStyles = makeStyles(registerStyles);

const RegisterIdentification = forwardRef((props, ref) => {
    const { triggerValidation, getValues, ...objForm } = useForm();
    const [profiles, setprofiles] = useState([])
    const [state, setstate] = useState()
    const [showBirthDay , setShowBirthDay] = useState(false)
    const [isCaptchaVerified , setIsCaptchaVerified] = useState(false)
    const [captchaKey , setCaptchaKey] = useState()
    const dialog = useDialog();
    const loading = useLoading();
    const classes = useStyles()
    let captcha;

    const setCaptchaRef = (ref) => {
        if (ref) {
          return captcha = ref;
        }
     };

    async function getProfiles() {
        const jsonProfiles = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/security/get_profiles_for_register`)
        setprofiles(jsonProfiles.data.p_results)
    }

    async function getCaptchaKey() {
        const jsonKey = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/security/get_captcha_key`)
        if(jsonKey&&jsonKey.data&&jsonKey.data.result){
            setCaptchaKey(jsonKey.data.result)
        }        
    }

    useEffect(() => {
        getCaptchaKey()
    }, [])

    useEffect(() => {
        getProfiles()
    }, [])

    useEffect(() =>{
        initAxiosInterceptors(dialog,loading)
    },[])

    function handleShowBirthDate(value) {
        //Mostrar fecha de nacimiento solo para asegurados
        setShowBirthDay(value==6?true:false)
    }

    function onChangeCaptcha(value) {
        setIsCaptchaVerified(value?true:false)
    }

    async function getUser(data, postFnc) {
        if(isCaptchaVerified){
            const [numid, dvid] = getIdentification(data.p_identification_type_1, data.p_identification_number_1)
            const params = {
                p_profile_id: data.p_profile_id,
                p_json_params: JSON.stringify({
                    tipoid: data.p_identification_type_1,
                    numid: numid,
                    dvid: dvid,
                    fecnac:data.p_birthdate
                })
            }
            const response = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/security/get_user_for_register`, params)
            setstate({
                profile_id: data.p_profile_id,
                tipoid: data.p_identification_type_1,
                numid: numid,
                dvid: dvid,
                ...response.data.p_results
            })
            
            postFnc()
        }else{
            captcha.reset();
        }
        
    }

    useImperativeHandle(ref, () => ({
        isValidated(postValidate) {
            triggerValidation().then((result) => {
                if (result) {
                    const values = getValues()
                    getUser(values, postValidate)
                }
            })
        },
        sendState() {
            return state
        }
    }));

    return (
        <GridContainer justify="center">
            {captchaKey&&
            <GridItem xs={12} sm={8}>
                <form noValidate>
                    <SelectSimpleController objForm={objForm} label="Perfil" name="p_profile_id" array={profiles} onChange={handleShowBirthDate}/>
                    <Identification objForm={objForm} index={1} arrayType={indentificationTypeAll} />
                    {showBirthDay&&<DateMaterialPickerController objForm={objForm} label="Fecha de Nacimiento" name={`p_birthdate`}/>}
                    <br></br>
                    <br></br>
                    <div className={classes.tCenter}>
                        <ReCAPTCHA
                            ref={(r) => setCaptchaRef(r) }
                            className={classes.gRecaptcha}
                            sitekey={captchaKey}
                            onChange={onChangeCaptcha}
                        />
                    </div>
                </form>
            </GridItem>
            }
        </GridContainer>
    )
})
export default RegisterIdentification;
