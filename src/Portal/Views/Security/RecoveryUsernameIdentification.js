import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
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

const RecoveryUsernameIdentification = forwardRef((props, ref) => {
    const { triggerValidation, getValues, ...objForm } = useForm();
    const [profiles, setprofiles] = useState([])
    const [state, setstate] = useState()
    const [showBirthDay , setShowBirthDay] = useState(false)
    const dialog = useDialog();
    const loading = useLoading();

    async function getProfiles() {
        const jsonProfiles = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/security/get_profiles_for_register`)
        setprofiles(jsonProfiles.data.p_results)
    }

    useEffect(() => {
        getProfiles()
    }, [])

    function handleShowBirthDate(value) {
        //Mostrar fecha de nacimiento solo para asegurados
        setShowBirthDay(value==6?true:false)
    }

    async function getUser(data, postFnc) {
        const [numid, dvid] = getIdentification(data.p_identification_type_1, data.p_identification_number_1)
        const params = {
            p_profile_id: data.p_profile_id,
            p_json_params: JSON.stringify({
                tipoid: data.p_identification_type_1,
                numid: numid,
                dvid: dvid,
                fecnac: data.p_birthdate
            })
        }
        console.log(params)
        const response = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/security/user_recovery_request`, params)
        setstate({
            profile_id: data.p_profile_id,
            tipoid: data.p_identification_type_1,
            numid: numid,
            dvid: dvid,
            fecnac: data.p_birthdate,
            ...response.data.result
        })
        
        postFnc()
        
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

    useEffect(() =>{
        initAxiosInterceptors(dialog,loading)
    },[])

    return (
        <GridContainer justify="center">
            <GridItem xs={12} sm={12}>
                <form noValidate>
                    <SelectSimpleController objForm={objForm} label="Perfil" name="p_profile_id" array={profiles} onChange={handleShowBirthDate}/>
                    <Identification objForm={objForm} index={1} arrayType={indentificationTypeAll} />
                    {showBirthDay&&<DateMaterialPickerController objForm={objForm} label="Fecha de Nacimiento" name={`p_birthdate`} format={"dd/MM/yyyy"}/>}
                </form>
            </GridItem>
        </GridContainer>
    )
})
export default RecoveryUsernameIdentification;
