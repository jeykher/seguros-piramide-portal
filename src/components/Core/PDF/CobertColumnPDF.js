import React from 'react'
import { Text, View } from '@react-pdf/renderer';
import styles from 'components/Core/PDF/comparePDFStyles';
import CardVehiclePDF from 'components/Core/PDF/CardVehiclePDF';
import CardHumanPDF from 'components/Core/PDF/CardHumanPDF';
import CardAgesPDF from 'components/Core/PDF/CardAgesPDF';
import { distinctArray } from 'utils/utils'
import CardTravelPDF from './CardTravelPDF'
import CardHomePDF from './CardHomePDF'

export default function cobertColumnPDF(props) {
  const { distinctPayments, infoClient, cobertsDescription, type, budgetInfo, propertyDescrip, cobertsProperty, objPDF} = props;
  const {plans} = objPDF
  const arrayTipoClinicas = [] 

  if (type==="PERSONAS"){
    plans.map((plan)=>{
      if(plan.tipoclibase !="N"){
        const foundTypeCli= arrayTipoClinicas.find(element => element === plan.tipoclibase); 
        console.log(foundTypeCli)   
        if (foundTypeCli ==undefined) {
          arrayTipoClinicas.push(plan.tipoclibase)
        }
      }
    })
  }

  function getDistinctCobertPropertyDescrip(descbien) {
    const coberts = cobertsProperty.filter((c) => c.descbien === descbien)
    return distinctArray(coberts, "codcobert", "desccobert")
  }
  return (

    <View style={styles.wrapperCobert}>

      <View>
        {type === 'AUTOMOVIL' ? <CardVehiclePDF vehicle={budgetInfo} infoClient={infoClient} /> :
          type === 'VIAJE' ? <CardTravelPDF infoClient={infoClient} budgetInfo={budgetInfo}/> :
          type === 'HOGAR' ? <CardHomePDF infoClient={infoClient} budgetInfo={budgetInfo}/> :
          <CardHumanPDF infoClient={infoClient} budgetInfo={budgetInfo} />
        }
      </View>
        {type==="PERSONAS"?
          <View style={styles.card}>
            <View style={styles.rowTitlePlan}><Text style={styles.titleCard}>Tipo de Clínica</Text></View>
              {arrayTipoClinicas.map((tipo, index) => {
                return(
                  <View style={index % 2 === 0 ?  styles.rowData :  styles.rowDataEven} key={index} >
                    <Text style={styles.paymentInfo}>{tipo}</Text>
                  </View>
                )
              })}

          </View>
        :null}

      <View style={styles.card}>
        <View style={styles.rowTitlePlan}><Text style={styles.titleCard}>Forma de pago</Text></View>
        {distinctPayments.map((payment, index) => (
          <View style={index % 2 === 0 ? styles.rowData : styles.rowDataEven} key={index}>
            <Text style={styles.paymentInfo}>{payment.name}</Text>
          </View>
        ))}
      </View>

      {type === 'PERSONAS' && <CardAgesPDF/>}

      {type === 'HOGAR' && <>
        {propertyDescrip.map((p, index) => (
          <View style={styles.card} key={index + 'alfa'}>
          <View style={styles.rowTitlePlan}><Text style={styles.titleCard}>{p.name}</Text></View>
          {getDistinctCobertPropertyDescrip(p.name).map((reg, index) => (
            <View style={index % 2 === 0 ? styles.rowData : styles.rowDataEven} key={index + 50}>
              <Text style={styles.cobertInfo}>{reg.name}</Text>
            </View>
          ))}
          </View>
        ))}
      </>
      }

      <View style={styles.card}>
        <View style={styles.rowTitlePlan}><Text style={styles.titleCard}>Coberturas</Text></View>
        {cobertsDescription.map((cobert, index) => (
          <View style={index % 2 === 0 ? styles.rowData : styles.rowDataEven} key={index}>
            <Text style={styles.cobertInfo}>{cobert.name}</Text>
          </View>
        ))}
      </View>

    </View>
  )
}