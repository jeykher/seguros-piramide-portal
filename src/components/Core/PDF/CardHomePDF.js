import React from 'react'
import { Text, Image, View } from '@react-pdf/renderer';
import redAppIcon from "../../../../static/app-icon.png";
import BlueAppIcon from "../../../../static/blue-app-icon.png";
import BlueHomeIcon from "../../../../static/blue-home-icon.png";
import redHomeIcon from "../../../../static/home-icon.png";
import styles from 'components/Core/PDF/comparePDFStyles';
const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
const HomeIcon = insuranceCompany === 'OCEANICA' ? BlueHomeIcon : redHomeIcon
const appIcon = insuranceCompany === 'OCEANICA' ? BlueAppIcon : redAppIcon

export default function CardHomePDF(props){
  const {infoClient} = props;

  return (
      <View style={styles.cardInfo}>
        <View style={styles.rowDataIcon}>
          <Image style={styles.icon} src={appIcon} />
          <Text style={styles.quotationInfo}>{`Cotización numero: ${infoClient[0].BUDGET_ID}`}</Text>
        </View>
        <View style={styles.rowDataIcon}>
          <Image style={styles.icon} src={HomeIcon} />
          <Text style={styles.quotationInfo}>Cotización de Hogar</Text>
        </View>
        <View style={styles.rowDate}>
          <Text style={styles.cobertInfo}>{`Fecha: ${infoClient[0].DATE_CREATION}`}</Text>
          <Text style={styles.cobertInfo}>{`Vence: ${infoClient[0].EXPIRED_ON}`}</Text>
        </View>
      </View>
  )
}