import React, { useState, useEffect } from "react"
import { Text, Image, View } from '@react-pdf/renderer';
import LogoPiramide from "../../../../static/logo-piramides.png";
import LogoOceanica from "../../../../static/oceanica_original.png";
import Axios from "axios"
import styles from 'components/Core/PDF/comparePDFStyles';

const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
const Logo = insuranceCompany === 'OCEANICA' ? LogoOceanica : LogoPiramide;

export default function HeaderPDF(){
  
  const [direction, setDirection] = useState("")
  const [insuranceActivityNumber, setInsuranceActivityNumber] = useState("")
  const [suscribedCapital, setSuscribedCapital ] = useState("") 
  const [paidInCapital, setPaidInCapital ] = useState("") 
  const [fiscalRegistrationNumber, setFiscalRegistrationNumber ] = useState("") 
  const [contactNumbers, setContactNumbers ] = useState("") 


  const handleCompanyInfo = (objectInfo) => {
    setDirection(objectInfo.DIRECCION)
    setInsuranceActivityNumber(objectInfo.NUMSUPINTSEG)
    setSuscribedCapital(objectInfo.CAPITALSUSC)
    setPaidInCapital(objectInfo.CAPITALPAG)
    setFiscalRegistrationNumber(objectInfo.NUMRIF)

    const joinNumbers = objectInfo.TELEF01 + ' - ' + objectInfo.TELEF02 + ' - ' + objectInfo.FAX01
    setContactNumbers(joinNumbers)

  }
  
  const getCompanyInfo = async () => {
    try {
      const { data } = await Axios.post("/dbo/portal_admon/get_company_general_info")
      
      handleCompanyInfo(data.cur_cia_info[0])
      
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getCompanyInfo()
  }, [])
  
  return(
    <View style={styles.header} fixed>
      <View style={styles.headerLogo}>
        <View style={styles.rowLogo}>
          <Image style={styles.logo} src={Logo}/>
        </View>
        <View style={styles.rowDataHeader}>
          <Text>{direction}</Text>
        </View>
        <View style={styles.rowDataHeader}>
          <Text> {contactNumbers} </Text>
        </View>
      </View>
      <View style={styles.headerInfo}>
        <View style={styles.rowDataHeader}>
          <Text>Inscrita en la Superintendencia de la Actividad Aseguradora bajo el N°{insuranceActivityNumber}</Text>
        </View>
        <View style={styles.rowDataHeader}>
          <Text>Capital Suscrito Bs.{suscribedCapital}</Text>
        </View>
        <View style={styles.rowDataHeader}>
          <Text>Capital Pagado Bs.{paidInCapital}</Text>
        </View>
        <View style={styles.rowDataHeader}>
          <Text>R.I.F {fiscalRegistrationNumber}</Text>
        </View>
      </View>
    </View>
  )
}