import React from 'react'
import { Text,View } from '@react-pdf/renderer';
import styles from 'components/Core/PDF/comparePDFStyles';

export default function CardAgesPDF(props){
  const {budgetInfo} = props
  return (
    <View style={styles.rowDataAdvisor}>
      <Text style={styles.boldText}>Asesor:</Text>
      <Text>{budgetInfo.partner_code}</Text>
      {budgetInfo.partner_name && <Text>{`/${budgetInfo.partner_name}`}</Text>}
    </View>
  )
}