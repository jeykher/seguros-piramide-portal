import { format } from 'date-fns'
export default function UseAlly() {

    function setValuesForm(reg, index, objForm) {
        const objCust = {
            [`p_identification_type_${index}`]: reg.TIPOID,
            [`p_identification_number_${index}`]: ['J','G'].includes(reg.TIPOID) === true ? `${reg.NUMID}${reg.DVID}` : reg.NUMID,
            [`p_name_one_${index}`]: ['J','G'].includes(reg.TIPOID) === true ? `${reg.NOMTER1} ${reg.NOMTER2 !== null ? reg.NOMTER2 : '' }` : reg.NOMTER1,
            [`p_name_two_${index}`]: reg.NOMTER2,
            [`p_surname_one_${index}`]: reg.APETER1,
            [`p_surname_two_${index}`]: reg.APETER2,
            [`p_sex_${index}`]: reg.SEXO,
            [`p_birthdate_${index}`]: reg.FECNAC,
            [`p_edocivil_${index}`]: reg.EDOCIVIL,
            [`p_country_id_${index}`]: reg.CODPAIS,
            [`p_state_id_${index}`]: reg.CODESTADO,
            [`p_city_id_${index}`]: reg.CODCIUDAD,
            [`p_municipality_id_${index}`]: reg.CODMUNICIPIO,
            [`p_urbanization_id_${index}`]: reg.CODURBANIZACION,
            [`p_street_${index}`]: reg.AVENIDA,
            [`p_house_${index}`]: reg.EDIFICIO,
            [`p_house_number_${index}`]: reg.PISO,
            [`p_local_phone_${index}`]: `${reg.CODAREA1}${reg.TELEF1}`,
            [`p_mobile_phone_${index}`]:  `${reg.CODAREA3}${reg.TELEF3}`,
            [`p_email_${index}`]: reg.EMAIL,
            [`p_nacionality_${index}`]: reg.INDNACIONAL,
            //Datos de config
            [`p_portal_ally_code_${index}`]: reg.CODPORTAL || '',
            [`p_status_${index}`]: reg.STSALIADO || 'ACT',
            [`p_config_date_${index}`] : format(new Date(), 'dd/MM/yyyy'),
            [`p_payer_${index}`] : reg.PAGOPOR ? reg.PAGOPOR.trim() : '',
            [`p_portal_username_${index}`] : reg.PORTAL_USERNAME,
        }
        objForm.reset({ ...objCust })
    }

    function resetFormAlly(index,objForm,identificationAlly){
        const obj = {
            [`p_identification_type_${index}`]: identificationAlly.typeId,
            [`p_identification_number_${index}`]: ['J','G'].includes(identificationAlly.typeId) === true ?  
                                                    `${identificationAlly.numid}${identificationAlly.dvid}` : 
                                                    identificationAlly.numid,
            [`p_name_one_${index}`]: null,
            [`p_name_two_${index}`]: null,
            [`p_surname_one_${index}`]: null,
            [`p_surname_two_${index}`]: null,
            [`p_sex_${index}`]: null,
            [`p_birthdate_${index}`]: null,
            [`p_edocivil_${index}`]: null,
            [`p_country_id_${index}`]: '001',
            [`p_state_id_${index}`]: null,
            [`p_city_id_${index}`]: null,
            [`p_municipality_id_${index}`]: null,
            [`p_urbanization_id_${index}`]: null,
            [`p_street_${index}`]: null,
            [`p_house_${index}`]: null,
            [`p_house_number_${index}`]: null,
            [`p_local_phone_${index}`]: null,
            [`p_mobile_phone_${index}`]:  null,
            [`p_email_${index}`]: null,
            [`p_nacionality_${index}`]: null,
            //Datos de config
            [`p_portal_ally_code_${index}`]: null,
            [`p_status_${index}`]: 'ACT',
            [`p_config_date_${index}`] : format(new Date(), 'dd/MM/yyyy'),
            [`p_payer_${index}`] : null,
            [`p_portal_username_${index}`] : null,
        }
        objForm.reset({...obj})
    }

    function getLabelAlly(levelAlly,arrayAlly = []){
        const value = arrayAlly.find(element => element.NIVEL === levelAlly);
        if(value){
            return value.DESCRIPCION.toLowerCase()
        }else{
            return 'sub-asistente'
        }
    }

    function checkLevelAlly(levelAlly,arrayAlly = []){
        const value = arrayAlly.some(element => element.NIVEL === levelAlly);
        return value
    }

    return {
        setValuesForm,
        getLabelAlly,
        resetFormAlly,
        checkLevelAlly
    }
}
