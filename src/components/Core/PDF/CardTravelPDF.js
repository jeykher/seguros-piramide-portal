import React from 'react'
import { Text, Image, View } from '@react-pdf/renderer';
import redTravelIcon from "../../../../static/travel-icon.png";
import BlueTravelIcon from "../../../../static/blue-travel-icon.png";
import redAppIcon from "../../../../static/app-icon.png";
import BlueAppIcon from "../../../../static/blue-app-icon.png";
import styles from 'components/Core/PDF/comparePDFStyles';
const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
const TravelIcon = insuranceCompany === 'OCEANICA' ? BlueTravelIcon : redTravelIcon
const appIcon = insuranceCompany === 'OCEANICA' ? BlueAppIcon : redAppIcon

export default function CardTravelPDF(props){
  const {infoClient,budgetInfo} = props;
  return (
      <View style={styles.cardInfo}>
        <View style={styles.rowDataIcon}>
          <Image style={styles.icon} src={appIcon} />
          <Text style={styles.quotationInfo}>{`Cotización numero: ${infoClient[0].BUDGET_ID}`}</Text>
        </View>
        <View style={styles.rowDataIcon}>
        <Image style={styles.iconTravel} src={TravelIcon} />
        <Text style={styles.quotationInfo}>Destino: {budgetInfo.desc_destination_region}</Text>
        </View>
        <View style={styles.rowDataIcon}>
        <Text style={styles.quotationInfo}>Duración: {budgetInfo.days_travel} Dias</Text>
        </View>
        <View style={styles.rowDate}>
          <Text style={styles.cobertInfoCard}>{`Fecha: ${infoClient[0].DATE_CREATION}`}</Text>
          <Text style={styles.cobertInfoCard}>{`Vence: ${infoClient[0].EXPIRED_ON}`}</Text>
        </View>
      </View>
  )
}