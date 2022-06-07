import { useState } from 'react'
import Axios from 'axios'
import { useDialog } from "context/DialogContext";
import { getIdentification } from 'utils/utils'

export default function UseCustomerAdvisor() {
    const dialog = useDialog();
    const [identificationType, setIdentificationType] = useState('')
    const [identificationNumber, setIdentificationNumber] = useState('')
    const [identificationVerified, setIdentificationVerified] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [customer, setcustomer] = useState(null)
    const [isClient,setIsClient] = useState(null);

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
            if (data.length > 0) {
                setValuesForm(data[0], index, objForm)
                setIsClient('Y');
            } else {
                setValuesFormEmpty(objForm, index)
                setIsClient('N');
                console.log('hola')
            }
        } catch (error) {
            console.error(error)
        }
    }

    function setValuesFormEmpty(objForm, index) {
        objForm.reset({
            [`p_identification_type_${index}`]: identificationType,
            [`p_identification_number_${index}`]: identificationNumber
        })
        setcustomer(null)
        setShowForm(true)
    }

    function setFormEmptyYounger() {
        setcustomer(null)
        setShowForm(true)
    }

    function setValuesForm(reg, index, objForm, idenType, idenNumber) {
        const objCust = {
            [`p_identification_type_${index}`]: idenType || identificationType,
            [`p_identification_number_${index}`]: idenNumber || identificationNumber,
            [`p_name_one_${index}`]: reg.NOMTER1,
            [`p_name_two_${index}`]: reg.NOMTER2,
            [`p_surmane_one_${index}`]: reg.APETER1,
            [`p_surmane_two_${index}`]: reg.APETER2,
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
            [`p_passport_${index}`]: reg.NUMPASAPORTE,
            [`p_rif_${index}`]: (idenType || identificationType) + '-' + (idenNumber || identificationNumber) + '-' +(reg.DVID),
            [`p_ind_national_${index}`]: reg.INDNACIONAL,
            [`p_date_exp_ci_${index}`]: reg.FECEXPCEDULA,
            [`p_date_venc_ci_${index}`]: reg.FECVENCEDULA,
            [`p_date_exp_passport_${index}`]: reg.FECEXPPASAPORTE,
            [`p_date_venc_passport_${index}`]: reg.FECVENPASAPORTE,
            [`p_date_exp_rif_${index}`]: reg.FECEXPRIF,
            [`p_date_venc_rif_${index}`]: reg.FECVENRIF,
            [`p_superint_code_${index}`]: reg.CODSUPERINT, 
            [`p_full_name_${index}`]: (reg.NOMTER?reg.NOMTER:'') + (reg.APETER1?' ' + reg.APETER1:'') + (reg.APETER2?' ' + reg.APETER2:''),     
            //[`p_ofic_${index}`]: undefined,              
        }

        objForm.reset({ ...objCust })
        setcustomer(objCust)
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
        setFormEmptyYounger,
        setShowForm,
        showForm,
        customer,
        setcustomer,
        identificationVerified,
        setIsClient,
        isClient
    }
}
