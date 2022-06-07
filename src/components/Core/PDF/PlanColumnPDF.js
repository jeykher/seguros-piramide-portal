import React from 'react'
import { Text, Image, View } from '@react-pdf/renderer';
import doneIcon from "../../../../static/done-icon.png";
import closeIcon from "../../../../static/close-icon.png";
import { getSymbolCurrency, formatAmount } from 'utils/utils';
import styles from 'components/Core/PDF/comparePDFStyles';

export default function PlanColumnPDF(props){
  const {plan, type, objPDF} = props;
  const {plans} = objPDF;

  const arrayTipoClinicas = [] 

  if (type==="PERSONAS"){
    plans.map((plan)=>{
      if(plan.tipoclibase !="N"){
        const foundTypeCli= arrayTipoClinicas.find(element => element === plan.tipoclibase);    
        if (foundTypeCli ===undefined) {
          arrayTipoClinicas.push(plan.tipoclibase)
        }
      }
    })
  }
  
  const objPlan = plans.find(element => element.descplanprod.toLowerCase() === plan.title.toLowerCase());

  const markSumModified = (plan.sum_modified_esp && plan.sum_modified_esp === 'S')?' (*) ':' ' 
  const markRateModified = (plan.rate_modified_esp && plan.rate_modified_esp === 'S')?' (**) ':' '

  return (
    <View style={styles.planColumn}>
      
      <View style={styles.card}>
        <View style={styles.rowTitlePlan}>
          <Text style={styles.titleCard}> {plan.title + markSumModified + markRateModified} </Text>
        </View>
        <View style={styles.rowAmountPlan}>
          <Text>{`${getSymbolCurrency(plan.currency)}`}</Text>
          <Text style={styles.amount}>{`${formatAmount(plan.prima)}`}</Text>
        </View>
        </View>


        {type==="PERSONAS"?
          <View style={styles.card}>
            <View style={styles.rowTitlePlan}>
              <Text style={styles.titleCard}>Deducible</Text>
            </View>
            {arrayTipoClinicas.map((tipo, index)=>{
              return(
                <View style={index % 2 === 0 ?  styles.rowData :  styles.rowDataEven} key={index}>
                  {objPlan?.tipoclibase===tipo?
                  <Text style={styles.paymentInfo}>{objPlan?.mtodeducible}</Text>
                  :
                  <Image style={styles.icon} src={closeIcon} />
                  }
                </View>
              )
            })}

          </View>
        :null}
        <View style={styles.card}>
        <View style={styles.rowTitlePlan}>
          <Text style={styles.titleCard}>Precio</Text>
        </View>
        {plan.payment.map((payDescription, index) => {
          return payDescription === 'CLOSE' ?  (
            <View style={index % 2 === 0 ?  styles.rowData :  styles.rowDataEven} key={index}>
              <Image style={styles.icon} src={closeIcon} />
            </View>
            ) : (
              <View style={index % 2 === 0 ? styles.rowData : styles.rowDataEven } key={index}>
                <Text>{formatAmount(payDescription)}</Text>
              </View>
            )
        })}
      </View>

      {type === 'PERSONAS' && (
        <View style={styles.card}>
          <View style={styles.rowTitlePlan}>
            <Text style={styles.titleCard}>Edades</Text>
          </View>
          <View style={styles.rowDataAge}>
            {plan.ages.map((age,index) => (
              age.inc === 'S' ? <Text key={`row_${index}a`}>{age.age}<Image style={styles.iconAge} src={doneIcon} /></Text>
              :
              <Text key={`row_${index}b`}>{age.age}<Image style={styles.iconAge} src={closeIcon} /></Text>
            ))}
          </View>
        </View>
      )}

      {type === 'HOGAR' && <>
        {plan.properties.map((propertiesCoberts,index) => (
          <View style={styles.card} key={index * 12}>
            <View style={styles.rowTitlePlan}>
              <Text style={styles.titleCard}>Suma asegurada</Text>
            </View>
            {propertiesCoberts.map((propertyDesc, index) => {
              return propertyDesc === 'NO' ? (
                <View style={index % 2 === 0 ? styles.rowDataPlan : styles.rowDataPlanEven} key={index}>
                  <Image style={styles.icon} src={closeIcon} />
                </View>
                ) : propertyDesc === 0 ? (
                  <View style={index % 2 === 0 ? styles.rowDataPlan : styles.rowDataPlanEven} key={index}>
                    <Image style={styles.icon} src={doneIcon} />
                  </View>
                ) : (
                  <View style={index % 2 === 0 ? styles.rowDataPlan: styles.rowDataPlanEven} key={index}>
                    <Text>{formatAmount(propertyDesc)}</Text>
                  </View>
                )
            })}
          </View>
        ))
        }
        </>
      }

      <View style={styles.card}>
        <View style={styles.rowTitlePlan}>
          <Text style={styles.titleCard}>Suma asegurada</Text>
        </View>
        {plan.coberts.map((cobertDesc, index) => {
          return cobertDesc === undefined ? (
            <View style={index % 2 === 0 ? styles.rowDataPlan : styles.rowDataPlanEven} key={index}>
              <Image style={styles.icon} src={closeIcon} />
            </View>
            ) :
            //  cobertDesc.codcobert === 'DVEN' ? (
            //   <View style={index % 2 === 0 ? styles.rowDataPlan : styles.rowDataPlanEven} key={index}>
            //     <Text>{formatAmount(0)}</Text>
            //   </View>
            // ) :
             cobertDesc.suma_aseg === 0 ? (
              <View style={index % 2 === 0 ? styles.rowDataPlan : styles.rowDataPlanEven} key={index}>
                <Image style={styles.icon} src={doneIcon} />
              </View>
            ) : (
              <View style={index % 2 === 0 ? styles.rowDataPlan: styles.rowDataPlanEven} key={index}>
                <Text>{formatAmount(cobertDesc.suma_aseg)}</Text>
              </View>
            )
        })}
      </View>
    </View>
  )
}
