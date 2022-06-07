import React,{useState, useEffect} from 'react'
import { Text, View } from '@react-pdf/renderer';
import styles from 'components/Core/PDF/comparePDFStyles';
import ConditionsHumanTextPiramide from './ConditionsHumanTextPiramide'
import ConditionsHumanTextOceanica from './ConditionsHumanTextOceanica'
import { difDays } from 'utils/utils';

const insuranceCompany= process.env.GATSBY_INSURANCE_COMPANY

export default function ConditionHumanCard({infoClient}){


  const [totalDays,setTotalDays] = useState(null);


  useEffect(() => {
    if(infoClient){
      const result = difDays(infoClient[0].DATE_CREATION,infoClient[0].EXPIRED_ON);
      setTotalDays(result);
    }
  },[])


  return (
      <View style={styles.cardConditional} wrap={false}>
        <View style={styles.rowTitlePlan}>
          <Text style={styles.titleCard}>Condiciones particulares de la propuesta</Text>
        </View>
        {
          insuranceCompany === 'OCEANICA' ? <ConditionsHumanTextOceanica diffDays={totalDays}/> : <ConditionsHumanTextPiramide/>
        }
      </View>
  )
}
