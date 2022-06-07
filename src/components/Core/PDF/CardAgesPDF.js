import React from 'react'
import { Text,View } from '@react-pdf/renderer';
import styles from 'components/Core/PDF/comparePDFStyles';

export default function CardAgesPDF(){

  return (
    <View style={styles.card}>
      <View style={styles.rowTitlePlan}><Text style={styles.titleCard}>Edades</Text></View>
            <View style={styles.rowData}>
              <Text style={styles.cobertInfo}>Aplica:</Text>
            </View>
    </View>
  )
}