import {useState, useEffect} from 'react'
import { distinctArray } from 'utils/utils'
import { getProfileCode } from 'utils/auth'

export default function useBudgetPlans(objPDF){
  const [filteredPlans,setFilteredPlans] = useState([]);

  const { cobertsDescrip, plans, type, cobertsProperty,propertyDescrip, budgetInfo, selectedPays,payments} = objPDF

  function getDistinctCobertPropertyDescrip(descbien) {
    const coberts = cobertsProperty.filter((c) => c.descbien === descbien)
    return distinctArray(coberts, "codcobert", "desccobert")
  }

  const handlePays = (plan) => {
    const payment = payments.map((payment) => {
      if(payment.id === 0){
        return plan.prima  
      }else{
        const pay = plan.fraccionamiento.find(element => element.maxgiro === payment.id);
      if(pay === undefined){
        return 'CLOSE'
      }else{
        return pay.prima
      }
      }
    })
    return [...payment]
  }

  const checkSelectedPay = (plan_id) => {
    if(selectedPays !== null){
      const indexPlan = selectedPays.findIndex(element => element.plan_id === plan_id)
      const checkSelected = selectedPays[indexPlan].methods.some(element => element.checked === true)
      return checkSelected
    }else{
      return false
    }
  }

  const handleCheckPays = (plan) =>{
    let payment;
    if(checkSelectedPay(plan.plan_id) === true){
      payment = payments.map(payment => {
        if(payment.id === 0){
          const indexPlan = selectedPays.findIndex(element => element.plan_id === plan.plan_id)
          const indexMethod = selectedPays[indexPlan].methods.findIndex(element => element.id === payment.id)
          const methodChecked = selectedPays[indexPlan].methods[indexMethod].checked
          return methodChecked !== true ? 'CLOSE' : plan.prima
        }else{
          const pay = plan.fraccionamiento.find(element => element.maxgiro === payment.id);
          const indexPlan = selectedPays.findIndex(element => element.plan_id === plan.plan_id)
          const indexMethod = selectedPays[indexPlan].methods.findIndex(element => element.id === payment.id)
          const methodChecked = selectedPays[indexPlan].methods[indexMethod].checked
          if(pay === undefined || methodChecked !== true){
            return 'CLOSE'
          }else{
            return pay.prima
          }
        }
      })
    }else{
      payment = handlePays(plan);
    }
    return payment
  }

  const handleCoberts = (plan) => {
    const coberts = cobertsDescrip.map((cobertsDescrip) =>{
        const cobert = plan.coberturas.find(element=> element.codcobert === cobertsDescrip.id)
        if(cobert === undefined){
          return undefined
        }else if(cobert.indincluida === 'N'){
          return undefined
        }else if(cobert.suma_aseg === 0){
          return {
            codcobert: cobert.codcobert,
            suma_aseg: 0
          }
        }else{
          return {
            codcobert: cobert.codcobert,
            suma_aseg: cobert.suma_aseg
          }
        }
    })
    return coberts
  }

  const handleProperties = (plan) => {
    const properties = propertyDescrip.map((p) =>{
      const filteredProperties = getDistinctCobertPropertyDescrip(p.name);
      const result  = filteredProperties.map((description) =>{
        const resultProperty = cobertsProperty.find(cob => plan.codprod === cob.codprod && plan.codplan === cob.codplan && 
          plan.revplan === cob.revplan &&  cob.codcobert === description.id)
          if (resultProperty === undefined){
            return 'NO'
          }else if(resultProperty.suma_aseg === 0){
            return 0
          }else{
            return resultProperty.suma_aseg
          }
      })
      return result
    })
    return properties
  }

  const handleAges = (plan) =>{
    const ages = budgetInfo.insured.map((a) =>
      plan.coberturas.findIndex((p) => p.age === a.age) === -1 ? { age: a.age, inc: 'N' } : { age: a.age, inc: 'S' })
    return ages
  }


  const handlePlans = () =>{
    let arrayPlans = []
    let objectPlan = null
    let superArray = []
    let flagEven = 0
    for(let i = 0; i <= plans.length -1; i++){
      const pays = getProfileCode() === 'insurance_broker' ? handleCheckPays(plans[i]) : handlePays(plans[i])
      const coberts = handleCoberts(plans[i])
      const properties = type === 'HOGAR' ? handleProperties(plans[i]) : null
      const ages = type === 'PERSONAS' ? handleAges(plans[i]) : null
      const objectPlan = {
        title: plans[i].descplanprod.toLowerCase().replace('  '," "),
        currency: plans[i].codmoneda,
        prima: plans[i].prima,
        sum_modified_esp: plans[i].sum_modified_esp?plans[i].sum_modified_esp:'',
        rate_modified_esp: plans[i].rate_modified_esp?plans[i].rate_modified_esp:'',
        payment: [...pays],
        coberts: coberts,
        ...(ages !== null ) && {ages: ages},
        ...(properties !== null ) && {properties: properties},
      }
      flagEven++;
      arrayPlans.push(objectPlan)
      if(flagEven === 2){
        superArray.push(arrayPlans)
        arrayPlans = []
        flagEven = 0
      }else if(i === plans.length -1 && flagEven !== 2){
        superArray.push(arrayPlans)
        arrayPlans = []
        flagEven = 0
      }
      
    }
    setFilteredPlans(superArray);
  }



  useEffect(() =>{
    handlePlans();
  },[])

  return filteredPlans
}