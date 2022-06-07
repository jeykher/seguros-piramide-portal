import Check from "@material-ui/icons/Check"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import PauseIcon from "@material-ui/icons/Pause"
import CloseIcon from "@material-ui/icons/Close"
import HelpIcon from "@material-ui/icons/Help"
import moment from "moment"
import Payment from "payment";
import Axios from 'axios'
import format from "date-fns/format"
import parse from "date-fns/parse";

function formatPhoneNumber(phone) {
    return `${phone.substring(0, 4)}-${phone.substring(4)}`
}

function IdentificationToString(string) {
    return string.replace(/\./g, '')
}

function getIdentification(tipoid, numid) {
    const arrIdent = []
    if (tipoid === undefined || numid === undefined) {
        arrIdent[0] = null
        arrIdent[1] = null
    } else {
        if ((numid.length > 1) && ((tipoid === 'J') || (tipoid === 'G'))) {
            arrIdent[0] = numid.substring(0, numid.length - 1)
            arrIdent[1] = numid.substring(numid.length - 1)
        } else {
            arrIdent[0] = numid
            arrIdent[1] = 0
        }
    }
    return arrIdent
}

function getIdentificationCustomer(tipoid, numid) {
    const arrIdent = [null, null, null]
    if ((tipoid !== 'undefined') && (tipoid !== 'null')) {
        arrIdent[0] = tipoid
        if ((numid !== 'undefined') && (numid !== 'null')) {
            if (numid.length > 1) {
                if ((tipoid === 'J') || (tipoid === 'G')) {
                    arrIdent[1] = numid.substring(0, numid.length - 1)
                    arrIdent[2] = numid.substring(numid.length - 1)
                } else {
                    arrIdent[1] = numid
                    arrIdent[2] = null
                }
            } else {
                arrIdent[1] = numid.length === 1 ? numid : null
            }
        }
    } else if ((numid !== 'undefined') && (numid !== 'null')) {
        arrIdent[1] = numid
    }
    return arrIdent
}

function getIdentificationType(tipoid) {
    if ((tipoid === 'J') || (tipoid === 'G')) {
        return 'ENTERPRISE'
    } else {
        return 'PERSONAL'
    }
}

const insuranceArea = {
    "0001": { title: "Patrimoniales", color: "warning", icon: "apartment" },
    "0002": { title: "Automovil", color: "info", icon: "drive_eta" },
    "0003": { title: "Fianzas", color: "primary", icon: "account_balance" },
    "0004": { title: "Personas", color: "success", icon: "group" },
}

const insuranceAreaTitle = {
    "PATRIMONIALES": { title: "Patrimoniales", color: "warning", icon: "apartment" },
    "AUTOMOVIL": { title: "Automóvil", color: "info", icon: "drive_eta" },
    "PERSONAS": { title: "Personas", color: "success", icon: "group" },
    "FIANZAS": { title: "Fianzas", color: "primary", icon: "account_balance" },
    "Total": { title: "Total", color: "primary", icon: "folder" },
    "GENERAL": { title: "General", color: "primary", icon: "folder" }
}

const statusColors = {
    "Procesado": { color: "success", icon: Check },
    "En Proceso": { color: "info", icon: PlayArrowIcon },
    "Pendiente": { color: "warning", icon: PauseIcon },
    "Rechazado": { color: "danger", icon: CloseIcon },
    "Pregunta": { color: "warning", icon: HelpIcon },
    "Anulado": { color: "warning", icon: CloseIcon },
    "Aprobado": { color: "success", icon: Check },
}

const statusTransactionColors = {
    "Procesado": { color: "success" },
    "Cancelado": { color: "info" },
    "Rechazado": { color: "danger" },
    "Pendiente": { color: "warning" }
}



const statusPayColors = {
    "Anulada": { color: "danger", icon: CloseIcon },
    "Pagada": { color: "success", icon: Check },
    "Cobrada": { color: "success", icon: Check },
    "Pendiente": { color: "warning", icon: PauseIcon }
}

const statusFeesColors = {
    "ACT": { color: "warning", title: "PENDIENTE" },
    "ANU": { color: "danger", title: "ANULADO" },
    "COB": { color: "info", title: "COBRADO" },
    "INU": { color: "dange", title: "INUTILIZADO" },
}

const statusClaimsColors = {
    "ACT": { color: "info", title: "ACTIVO" },
    "ANU": { color: "danger", title: "ANULADO" },
    "INC": { color: "warning", title: "INCLUIDO" },
    "MOD": { color: "info", title: "MODIFICADO" },
    "PAG": { color: "success", title: "PAGADO" },
    "VAL": { color: "warning", title: "VALIDO" },
    "INU": { color: "warning", title: "INUTILIZADO" },
}

const statusSupervisorServicesColors = {
    "ONTIME": { color: "success", title: "AL DIA" },
    "DELAY": { color: "danger", title: "ATRASADO" },
    "CRITIC": { color: "warning", title: "CRÍTICO" },
}

const statusRequerimentPending = {
    "N": { title: "Entregados", color: "success" },
    "S": { title: "Pendientes", color: "warning" }
}

const indentificationTypeNatural = [
    { value: "V", label: "Venezolano" },
    { value: "M", label: "Menor sin Cédula" },
    { value: "E", label: "Extranjero" },
    { value: "P", label: "Pasaporte" }
]

const indentificationTypeNaturalMayor = [
    { value: "V", label: "Venezolano" },
    { value: "E", label: "Extranjero" },
    { value: "P", label: "Pasaporte" }
]

const indentificationTypeNaturalMayorRefund = [
    { value: "V", label: "Venezolano" },
    { value: "E", label: "Extranjero" },
    { value: "P", label: "Pasaporte" },
    { value: "J", label: "Jurídico" }
]

const indentificationTypeAll = [
    { value: "V", label: "Venezolano" },
    { value: "J", label: "Jurídico" },
    { value: "E", label: "Extranjero" },
    { value: "P", label: "Pasaporte" },
    { value: "G", label: "Gubernamental" },
]

const indentificationTypeCliente = [
    { value: "V", label: "Venezolano" },
    { value: "J", label: "Jurídico" },
    { value: "E", label: "Extranjero" },
    { value: "P", label: "Pasaporte" },
    { value: "G", label: "Gubernamental" },
    { value: "M", label: "Menor sin Cédula" }
]

const listSex = [
    { value: "F", label: "Femenino" },
    { value: "M", label: "Masculino" }
]

const listSexAllies = [
    { value: "F", label: "Femenino" },
    { value: "M", label: "Masculino" },
    { value: "N", label: 'N/A'}
]

const listNacionality = [
    { value: "N", label: "Venezolano" },
    { value: "E", label: "Extranjero" }
]

const listCivilStatus = [
    { value: "S", label: "Soltero" },
    { value: "C", label: "Casado" },
    { value: "D", label: "Divorciado" },
    { value: "V", label: "Viudo" }
]

const listCivilStatusAllies = [
    { value: "S", label: "Soltero" },
    { value: "C", label: "Casado" },
    { value: "D", label: "Divorciado" },
    { value: "V", label: "Viudo" },
    { value: "N", label: 'N/A'}
]

const currencyValues = [
    { value: "DL", label: "Dólares Americanos", symbol: '$' },
    { value: "BS", label: "Bolívares", symbol: 'Bs.' },
    { value: "EU", label: "Euros", symbol: '€' }
]

const listAccountType = [
    { value: "CA", label: "Cuenta de Ahorro" },
    { value: "CC", label: "Cuenta Corriente" }
]


const statusReceipts = [
    { value: "ACT", label: "PENDIENTES (ACT)" },
    { value: "COB", label: "COBRADOS" },
    { value: "PAG", label: "PAGADOS" }

]
const typeReceipts = [
    { value: "EMI", label: "EMISIÓN" },
    { value: "REN", label: "RENOVACIÓN" },
    { value: "ADI", label: "ADICIONAL" },
    { value: "REV", label: "REVALORIZACIÓN" },
    { value: "FAC", label: "FACTURACIÓN" }
]

const daysOfTheWeek = [
    { value: 1, label: "Lunes" },
    { value: 2, label: "Martes" },
    { value: 3, label: "Miercoles" },
    { value: 4, label: "Jueves" },
    { value: 5, label: "Viernes" },
    { value: 6, label: "Sabado" },
    { value: 7, label: "Domingo" }
]

const statusSettlementsColors = {
    "Pendiente": { color: "warning", title: "Su solicitud está siendo procesada." },
    "Liquidado": { color: "gray", title: "Su solicitud se encuentra en proceso de pago." },
    "Aprobado": { color: "info", title: "Su solicitud está siendo procesada." },
    "Pagado": { color: "success", title: "Su solicitud fue procesada." },
    "Rechazado": { color: "danger", title: "Debe dirigirse a las oficinas de Seguros Pirámide para más información." },
}

const iconsForManagementAdvisors = {
    "Primas Cobradas Netas":{icon: 'monetization_on'},
    "Prima Devengada": {icon: 'hvac'},
    "Siniestros Incurridos":{icon: 'multiline_chart'},
    "Siniestralidad":{icon: 'priority_high'},
    "Primas Cobradas":{icon: 'check_circle'},
    "Primas Devueltas":{icon: 'assignment_return'}
}

const statusTaxReceipts = {
    "VAL": { color: "warning", label: "Válido" },
    "ACT": { color: "success", label: "Activo" }
}

const backgroundColorPieChart = [
    '#f14024',
    '#fc9e29',
    '#4fb222',
    '#296419'
]

const backgroundColorBarChart = [
    {background: '#f56183', hoverBackground: '#f5618366'},
    {background: '#37a2eb', hoverBackground: '#37a2eb66'},
    {background: '#4bbfc0', hoverBackground: '#4bbfc066'},
    {background: '#ffce56', hoverBackground: '#ffce5666'},
    {background: '#fc9f3f', hoverBackground: '#fc9f3f66'},
]

const optionsLabelPieChartJS = {
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const currentValue = dataset.data[tooltipItem.index];
          return ` ${currentValue}%`
        },
        title: function(tooltipItem, data) {
            return data.labels[tooltipItem[0].index];
          }
      }
    }
  }

function getSymbolCurrency(value) {
  let out = value;
  currencyValues.forEach(item => {
    if(item.value === value ){
      out = item.symbol;
    }
  });
    return out;
}

const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: item,
        }
    }, initialValue);
}

function validatePassword(value) {
    const regPwd = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.!@#$%&*])(?=.{8,})");
    return regPwd.test(value)
}

function getAge(FechaNacimiento) {

    var birthday = new Date(FechaNacimiento);
    var today = new Date()
    var month = today.getMonth();
    var day = today.getDate();
    var year = today.getFullYear();

    today.setDate(day);
    today.setMonth(month);
    today.setFullYear(year);

    return Math.floor(((today - birthday) / (1000 * 60 * 60 * 24) / 365));
}

function getAgeFromDDMMYYYYDate(FechaNacimiento) {
    var parts = FechaNacimiento.split("/");
    var birthday = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    var today = new Date()
    var month = today.getMonth();
    var day = today.getDate();
    var year = today.getFullYear();

    today.setDate(day);
    today.setMonth(month);
    today.setFullYear(year);

    return Math.floor(((today - birthday) / (1000 * 60 * 60 * 24) / 365));
}

function distinctArray(array, id, name) {
    const result = [];
    const map = new Map();
    for (const reg of array) {
        if (!map.has(reg[id])) {
            map.set(reg[id], true);
            result.push({
                id: reg[id],
                name: reg[name]
            });
        }
    }
    return result
}

function getAges(ages) {
    const agesInput = ages.replace(/_/g, '').split('-')
    return agesInput.filter(element => element !== '')
}

const formatAmount = amount => new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 }).format(amount);
const formatAmountDL = amount => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(amount);

function getISODate(date) {
    const day = date.substr(0, 2);
    const month = date.substr(3, 2);
    const year = date.substr(6, 4);
    const hour = timeConversion(date.substr(12, 8));
    const result = `${month}/${day}/${year} ${hour}`;
    return moment(new Date(result)).toDate();
}


function timeConversion(hour) {
    let AMPM = hour.slice(-2);
    let hourArray = hour.slice(0, -2).split(":");
    if (AMPM === "AM" && hourArray[0] === "12") {
        hourArray[0] = "00";
    } else if (AMPM === "PM") {
        hourArray[0] = (hourArray[0] % 12) + 12;
    }
    return hourArray.join(":")
}

function hourFormat24to12(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = (H % 12) || 12;
    h = (h < 10) ? ("0" + h) : h;  // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
};

function clearNumber(value = "") {
    return value.replace(/\D+/g, "");
}

function clearIdentificacionNumber(value = "") {
    return new Intl.NumberFormat('de-DE').format(clearNumber(value));
}

function formatCreditCardNumber(value) {
    if (!value) {
        return value;
    }

    const issuer = Payment.fns.cardType(value);
    const clearValue = clearNumber(value);
    let nextValue;

    switch (issuer) {
        case "amex":
            nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
                4,
                10
            )} ${clearValue.slice(10, 15)}`;
            break;
        case "dinersclub":
            nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
                4,
                10
            )} ${clearValue.slice(10, 14)}`;
            break;
        default:
            nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
                4,
                8
            )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
            break;
    }

    return nextValue.trim();
}

function formatCVC(value, prevValue, allValues = {}) {
    const clearValue = clearNumber(value);
    let maxLength = 4;

    if (allValues.number) {
        const issuer = Payment.fns.cardType(allValues.number);
        maxLength = issuer === "amex" ? 4 : 3;
    }

    return clearValue.slice(0, maxLength);
}

function formatExpirationDate(value) {
    const clearValue = clearNumber(value);

    if (clearValue.length >= 3) {
        return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 6)}`;
    }

    return clearValue;
}

function formatFormData(data) {
    return Object.keys(data).map(d => `${d}: ${data[d]}`);
}

function sumaDiasFecha(d, fecha) {
    var Fecha = new Date();
    var sFecha = fecha || (Fecha.getDate() + "/" + (Fecha.getMonth() + 1) + "/" + Fecha.getFullYear());
    var sep = sFecha.indexOf('/') != -1 ? '/' : '-';
    var aFecha = sFecha.split(sep);
    var fecha = aFecha[2] + '/' + aFecha[1] + '/' + aFecha[0];
    fecha = new Date(fecha);
    fecha.setDate(fecha.getDate() + parseInt(d));
    var anno = fecha.getFullYear();
    var mes = fecha.getMonth() + 1;
    var dia = fecha.getDate();
    mes = (mes < 10) ? ("0" + mes) : mes;
    dia = (dia < 10) ? ("0" + dia) : dia;
    var fechaFinal = dia + sep + mes + sep + anno;
    return (fechaFinal);
}



function toImage(data) {
    return btoa(String.fromCharCode.apply(null, data))
}

async function getDefaultCurrencyCode(serviceType) {
    const params = {
        p_service_type: serviceType
    }
    const response = await Axios.post('/dbo/health_claims/get_servs_avail_currencies', params)
    const jsonCurrency = response.data.result

    if (jsonCurrency && jsonCurrency[0] && jsonCurrency[0].CURRENCY_CODE) {
        return jsonCurrency[0].CURRENCY_CODE;
    }
    else {
        return 'BS';
    }
}

function padLeft(n) {
    return ("00" + n).slice(-2);
}

function getddMMYYYDate(date) {
    if (date) {
        return (
            padLeft(date.getDate()) + '/' +
            padLeft(date.getMonth() + 1) + '/' +
            date.getFullYear()
        );
    } else {
        return date;
    }
}

function getYYYYMMddDate(date){
    return format(date, 'yyyyMMdd')
}

function getddMMYYYYDate(date){
    return format(date, 'dd/MM/yyyy')
}

function getddMMYYYYHHDate(dateString){
    const exactDate = dateString.substr(0, dateString.length - 5)
    const date = new Date(exactDate)
    return date.toLocaleString();
}

function getddMMYYYDateFromBi(date){
    const data =  parse (date, 'yyyyMMdd', new Date());
    return format(data,'dd/MM/yyyy')
  }

function isSameOrBefore(startDate, endDate) {
    const start = moment(startDate, "DD MM YYYY hh:mm:ss");
    const end = moment(endDate, "DD MM YYYY hh:mm:ss");
    console.log('In moment:' + start + '-' + end)
    return moment(start).isSameOrBefore(end);
}
function difDays(startDate, endDate) {
    const start = moment(startDate, "DD MM YYYY hh:mm:ss");
    const end = moment(endDate, "DD MM YYYY hh:mm:ss");
    const days = end.diff(start, 'days');
    return days;
}

function isAfter(startDate, endDate) {
    let days;
    const start = moment(startDate, "DD MM YYYY hh:mm:ss");
    console.log(start);
    const end = moment(endDate, "DD MM YYYY hh:mm:ss");
    days= start.diff(end, 'days');
    console.log(end);
    console.log(days);
    return days > 0;
}

function getSwitchCheck(value) {
    return value === 'S' ? true : false
}

function decimalConvert(valor) {
    if (valor == null) {
        return valor;
    }
    while (valor.toString().indexOf('.') !== -1) {
        valor = valor.toString().replace('.', '');
    }
    valor = valor.toString().replace(',', '.');
    return valor;
};

function bufferToImageBase64(buffer) {
  const image = Buffer.from(buffer)
  return image.toString("base64")
}



function formatCard(num) {
    if (num.length > 3)
        return num.substring(0, num.length - 4).replace(/[0-9]/g, "*") + num.substring(num.length - 4, num.length)
    else
        return num
}

function isValidDate(cardDate) {
    let dateCard=cardDate.split('/')[0]+' '+cardDate.split('/')[1]
    let today= new Date();
    let currentDate= (today.getMonth() +1) +' '+ today.getFullYear();
    const start = moment(dateCard, "MM YYYY");
    const end = moment(currentDate, "MM YYYY");
    return moment(start).isSameOrBefore(end);
}

function getStatusColor(statusForColor){
    if(statusForColor&&statusColors[statusForColor]){
        return statusColors[statusForColor].color
    }else{
        return 'warning'
    }
}

function getIconManagement(labelName){
    if(labelName&&iconsForManagementAdvisors[labelName]){
        return iconsForManagementAdvisors[labelName].icon
    }else{
        return 'sync_problem'
    }
}

function getInsuranceAreaData(labelName,dataToFind){
    let valToReturn;
    if(labelName&&insuranceAreaTitle[labelName]){
        switch(dataToFind){
            case 'icon':
                valToReturn = insuranceAreaTitle[labelName].icon
                break;
            case 'title':
                valToReturn = insuranceAreaTitle[labelName].title
                break;
            case 'color':
                valToReturn = insuranceAreaTitle[labelName].color
                break;
            default:
                valToReturn = 'n/a'
        }
        return valToReturn
    }else{
        switch(dataToFind){
            case 'icon':
                valToReturn = 'sync_problem'
                break;
            case 'title':
                valToReturn = 'TITLE NOT FOUND'
                break;
            case 'color':
                valToReturn = 'default'
                break;
            default:
                valToReturn = 'n/a'
        }
        return valToReturn
    }
}

async function downloadExcelDocument(parameters = null, urlAPI, titleDocument = 'testing'){
    const params = {
      ...parameters,
      responseContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
    const urlApiGetDocument = `${urlAPI}/get_blob/result/BLOB_FILE`
    const {data} = await Axios.post(urlApiGetDocument,params, {
      responseType: 'arraybuffer',
      responseEncoding: 'binary'
    })
    const file = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})
    const fileURL = URL.createObjectURL(file)
    let tempLink = document.createElement('a')
    const date = format(new Date(),'yyyy/MM/dd');
    const hour = format(new Date,'HH/mm');
    tempLink.href = fileURL
    tempLink.setAttribute('download', `${titleDocument}_${date}_${hour}.xlsx`)
    tempLink.click()
    tempLink.remove()
    URL.revokeObjectURL(fileURL)
  }

  async function downloadReportDocument(params, apiUrl, titleDocument, typeDocument, ext, dialog ){
    const bodyParams = (params) ? params : {}
    try {
        const response = await Axios.post(apiUrl, bodyParams)

        let buffer = response.data
        const file = new Blob([buffer], { type: typeDocument });

        const fileURL = URL.createObjectURL(file);

        let tempLink = document.createElement('a');
        tempLink.href = fileURL;
        //tempLink.setAttribute('download', titleDocument+'.'+ext);
        tempLink.download = titleDocument+'.'+ext;
        tempLink.target = "_blank";
        tempLink.click();
        tempLink.remove();

        URL.revokeObjectURL(fileURL);

        if(dialog){
        dialog({
            variant: 'info',
            catchOnCancel: false,
            title: "Alerta",
            description: 'El archivo se ha descargado. Haga click en aceptar y revise su carpeta de descargas'
            })
        }

    } catch (e) {
        console.log(`Error al descargar documento ${titleDocument}.${ext}`, e)
    }
  }

function getStatusColor2(statusForColor,arrayStatusColor){
    if(statusForColor&&arrayStatusColor[statusForColor]){
        return arrayStatusColor[statusForColor]
    }else{
        return { color: "warning", title: statusForColor }
    }
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
export {
    getIdentification,
    getIdentificationCustomer,
    getIdentificationType,
    formatPhoneNumber,
    IdentificationToString,
    insuranceArea,
    statusColors,
    statusPayColors,
    statusClaimsColors,
    statusTransactionColors,
    statusRequerimentPending,
    indentificationTypeNatural,
    indentificationTypeNaturalMayor,
    indentificationTypeNaturalMayorRefund,
    indentificationTypeAll,
    indentificationTypeCliente,
    listSex,
    listCivilStatus,
    listAccountType,
    currencyValues,
    getSymbolCurrency,
    convertArrayToObject,
    validatePassword,
    distinctArray,
    getAges,
    formatAmount,
    getAge,
    getAgeFromDDMMYYYYDate,
    getISODate,
    timeConversion,
    clearNumber,
    formatCreditCardNumber,
    formatCVC,
    formatExpirationDate,
    formatFormData,
    formatAmountDL,
    toImage,
    sumaDiasFecha,
    getDefaultCurrencyCode,
    getddMMYYYDate,
    getddMMYYYYDate,
    getddMMYYYYHHDate,
    clearIdentificacionNumber,
    statusReceipts,
    typeReceipts,
    isSameOrBefore,
    difDays,
    getSwitchCheck,
    bufferToImageBase64,
    statusFeesColors,
    statusSupervisorServicesColors,
    hourFormat24to12,
    statusSettlementsColors,
    statusTaxReceipts,
    formatCard,
    isValidDate,
    getStatusColor,
    insuranceAreaTitle,
    getYYYYMMddDate,
    getddMMYYYDateFromBi,
    getIconManagement,
    backgroundColorPieChart,
    optionsLabelPieChartJS,
    backgroundColorBarChart,
    downloadExcelDocument,
    getInsuranceAreaData,
    getStatusColor2,
    listNacionality,
    listSexAllies,
    listCivilStatusAllies,
    downloadReportDocument,
    isAfter,
    daysOfTheWeek,
    capitalize
}
