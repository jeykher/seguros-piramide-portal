import React from 'react'
import { Text, Image, View } from '@react-pdf/renderer';
import redCarIcon from "../../../../static/car-icon.png";
import blueCarIcon from "../../../../static/blue-car-icon.png";
import redAppIcon from "../../../../static/app-icon.png";
import blueAppIcon from "../../../../static/blue-app-icon.png";
import styles from 'components/Core/PDF/comparePDFStyles';

const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
const carIcon = insuranceCompany === 'OCEANICA' ? blueCarIcon : redCarIcon
const appIcon = insuranceCompany === 'OCEANICA' ? blueAppIcon : redAppIcon

export default function CardVehiclePDF(props){
  const {infoClient, vehicle} = props;
  return (

      <View style={styles.cardInfo}>
        <View style={styles.rowDataIconAuto}>
          <Image style={styles.iconAuto} src={appIcon} />
          <Text style={styles.quotationInfo}>{`Cotización numero: ${infoClient[0].BUDGET_ID}`}</Text>
        </View>
        <View style={styles.rowDataIconAuto}>
          <Image style={styles.iconAuto} src={carIcon} />
          <Text style={styles.quotationInfo}>{`${vehicle.descmarca.toLowerCase()} ${vehicle.descmodelo.toLowerCase()} ${vehicle.p_year}`} </Text>
        </View>
        <View style={styles.rowDataIconAuto}>
          <Text style={styles.quotationInfo}> {vehicle.desversion}</Text>
        </View>
        <View style={styles.rowDate}>
          <Text style={styles.cobertInfoAuto}>{`Fecha: ${infoClient[0].DATE_CREATION}`}</Text>
          <Text style={styles.cobertInfoAuto}>{`Vence: ${infoClient[0].EXPIRED_ON}`}</Text>
        </View>
      </View>

  )
}