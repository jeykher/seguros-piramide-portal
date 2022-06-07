import { useState } from 'react'
import Axios from 'axios'
import { useDialog } from "context/DialogContext";
import { getIdentification } from 'utils/utils'

export default function UseCustomerV2() {
    const dialog = useDialog();
    const [identificationType, setIdentificationType] = useState('')
    const [identificationNumber, setIdentificationNumber] = useState('')
    const [identificationVerified, setIdentificationVerified] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [customer, setcustomer] = useState(null)

    async function handleIndetification(value, control) {
        if (control === "identificationType") setIdentificationType(value)
        if (control === "identificationNumber") setIdentificationNumber(value)
        if (control === "identificationVerified") setIdentificationVerified(value)
        setShowForm(false)
    }

    function handleCheckYounger() {
        setShowForm(false)
    }

    function getValuesIdentification() {
        if (identificationType === null || identificationType === "") {
            dialog({ variant: "info", catchOnCancel: false, title: "Alerta", description: "Debe indicar el tipo de identificación" })
            throw "Debe indicar el tipo de identificación"
        }
        if (identificationNumber === null || identificationNumber === "") {
            dialog({ variant: "info", catchOnCancel: false, title: "Alerta", description: "Debe indicar el número de identificación" })
            throw "Debe indicar el número de identificación"
        }

        const [numid, dvid] = getIdentification(identificationType, identificationNumber)
        return {
            p_identification_type: identificationType,
            p_identification_number: numid,
            p_identification_verified: dvid
        }
    }

    async function setValuesIdentification(objForm, index, identificationType, identificationNumber) {
        handleIndetification(identificationType, "identificationType")
        handleIndetification(identificationNumber, "identificationNumber")
        setShowForm(false)
        objForm.reset({
            [`p_identification_type_${index}`]: identificationType,
            [`p_identification_number_${index}`]: identificationNumber
        })
    }

    function setValuesIdentificationEmpty(objForm) {
        handleIndetification('', "identificationType")
        handleIndetification(null, "identificationNumber")
        objForm.reset({})
    }

    async function getCustomer(index, objForm) {
        try {
            const params = getValuesIdentification(index)
            const response = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/budgets/get_customer`, params)
            const data = response.data.p_cursor
            console.log(data)
            setIdentificationVerified(params['p_identification_verified'])

            if (data.length > 0) {
                setValuesForm(data[0], index, objForm)
            } else {
                //setValuesFormEmpty(objForm)
                setValuesFormNotRegistered(index, objForm,params)
            }
        } catch (error) {
            console.error(error)
        }
    }

    function setValuesFormEmpty(objForm) {
        objForm.reset({})
        setcustomer(null)
        setShowForm(true)
    }

    function setValuesFormNotRegistered(index, objForm) {
        objForm.reset({
            [`p_identification_type_${index}`]: identificationType,
            [`p_identification_number_${index}`]: identificationNumber,
            [`p_identification_verified_${index}`]: identificationVerified
        })
        setcustomer(null)
        setShowForm(true)
    }

    function setFormEmptyYounger() {
        setcustomer(null)
        setShowForm(true)
    }

    function setValuesForm(reg, index, objForm) {
        objForm.reset({
            [`p_identification_type_${index}`]: identificationType,
            [`p_identification_number_${index}`]: identificationNumber,
            [`p_identification_verified_${index}`]: reg.DVID,
            [`p_client_code_${index}`]: reg.CODCLI,
            [`p_name_one_${index}`]: reg.NOMTER1,
            [`p_name_two_${index}`]: reg.NOMTER2,
            [`p_surmane_one_${index}`]: reg.APETER1,
            [`p_surmane_two_${index}`]: reg.APETER2,
            [`p_first_name_${index}`]: reg.NOMTER1+' '+reg.NOMTER2,
            [`p_last_name_${index}`]: reg.APETER1+' '+reg.APETER2,
            [`p_sex_${index}`]: reg.SEXO,
            [`p_birthdate_${index}`]: reg.FECNAC,
            [`p_edocivil_${index}`]: reg.EDOCIVIL,
            [`p_codpaisorig_${index}`]: reg.CODPAISORIG,
            [`p_country_id_${index}`]: reg.CODPAIS,
            [`p_state_id_${index}`]: reg.CODESTADO,
            [`p_city_id_${index}`]: reg.CODCIUDAD,
            [`p_municipality_id_${index}`]: reg.CODMUNICIPIO,
            [`p_urbanization_id_${index}`]: reg.CODURBANIZACION,
            [`p_postal_code_${index}`]: reg.ZIP,
            [`p_street_${index}`]: reg.AVENIDA,
            [`p_house_${index}`]: reg.EDIFICIO,
            [`p_house_number_${index}`]: reg.PISO,
            [`p_local_phone_${index}`]: reg.TLFLOCAL,
            [`p_mobile_phone_${index}`]: reg.TLFMOVIL,
            [`p_email_${index}`]: reg.EMAIL,
            [`p_height_${index}`]: reg.ESTATURA,
            [`p_weight_${index}`]: reg.PESO,
            [`p_profession_${index}`]: reg.CODACT,
            [`p_monthly_income_${index}`]: reg.MTOINGMEN,
            [`p_passport_${index}`]: reg.NUMPASAPORTE
        })
        setcustomer(reg)
        setShowForm(true)
    }

    return {
        handleIndetification,
        //getActualIndetification,
        handleCheckYounger,
        setValuesIdentification,
        setValuesIdentificationEmpty,
        getValuesIdentification,
        getCustomer,
        setValuesForm,
        setValuesFormEmpty,
        setFormEmptyYounger,
        setShowForm,
        showForm,
        customer,
        identificationVerified
    }
}
