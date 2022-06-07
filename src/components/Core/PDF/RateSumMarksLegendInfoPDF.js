import React from 'react'
import { Text,View } from '@react-pdf/renderer';
import styles from 'components/Core/PDF/comparePDFStyles';

export default function CardAgesPDF(props){
  const {budgetInfo} = props
  return (
    <View style={styles.wrapper}>
        <View style={styles.rowFootNote}>
              <Text>{budgetInfo.sum_modified_esp && budgetInfo.sum_modified_esp === 'S' ? ' (*) Plan con suma modificada ' : null}</Text>
              <Text>{budgetInfo.rate_modified_esp && budgetInfo.rate_modified_esp === 'S' ? ' (**) Plan con tasa modificada ' : null}</Text>
          </View>
    </View>
          
  )
}