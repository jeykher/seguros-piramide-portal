import React from 'react'
import { Text,View } from '@react-pdf/renderer';
import styles from 'components/Core/PDF/comparePDFStyles';

export default function CardAgesPDF(props){
  const {budgetInfo} = props
  return (
      <View style={styles.wrapper}>
          <View style={styles.rowDataAdvisor}>
              {budgetInfo.sum_modified_esp &&
                  
                <View style={styles.textCondition}>
                    <View style={styles.rowDataAdvisor}>
                        <Text style={styles.boldText}>Suma Modificada:</Text>
                        <Text> {budgetInfo.sum_modified_esp === 'S' ? <Text> Si</Text> : <Text> No</Text>} </Text>
                    </View>
                </View>
                  }
          </View>
          <View style={styles.rowDataAdvisor}>
              {budgetInfo.rate_modified_esp &&
                  
                <View style={styles.textCondition}>
                    <View style={styles.rowDataAdvisor}>
                            <Text style={styles.boldText}>Tasa Modificada:</Text>
                            <Text> {budgetInfo.rate_modified_esp === 'S' ? <Text> Si</Text> : <Text> No</Text>} </Text>
                        </View>
                    </View>
                  }
          </View>
          <View style={styles.rowDataAdvisor}><Text style={styles.boldText}>T</Text></View>
      </View>
      
  )
}