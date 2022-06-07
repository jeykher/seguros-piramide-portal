import React from 'react'
import { Text, View } from '@react-pdf/renderer';
import styles from 'components/Core/PDF/comparePDFStyles';

export default function ConditionHumanTextPiramide(){
  return (
      <>
        <View style={styles.textCondition} >
          <Text style={styles.boldText}>Plazo de espera: CON PLAZO DE ESPERA</Text>
          <Text>- La emisión de la póliza estará sujeta al análisis de la solicitud. Estas primas pueden ser modificadas sin previo aviso.</Text>
          <Text>- El Grupo posible a Asegurar será: Titular Cónyuge, Padres, Hijos, Hermanos, Nietos y Suegros.</Text>
          <Text>- Edad de Admisibilidad hasta los 69 años (Hospitalización/Accidentes Personales/Vida)</Text>
          <Text>- Edad de Admisibilidad hasta los 75 años (Funerario)</Text>
          <Text>- Las condiciones de dichas pólizas se rigen por la gaceta oficial N° 40.316 de la fecha 16/12/2013</Text>
        </View>
        <View style={styles.textNote}>
          <Text style={styles.boldText}>Nota:</Text>
          <Text>La aceptación y la emisión del riesgo
            dependerá del análisis que la compañia realice de acuerdo a la declaración de salud.
          </Text>
          <View style={styles.textNoteCondition}>

            <View style={styles.textNoteSection}>
              <Text style={styles.boldText}>- Hospitalización:</Text>
              <Text>Todo aspirante masculino mayor o igual a 65 años deberán consignar Exámenes de 
                laboratorio(Perfil 20, perfil lipídico, PSA total y libre), ecosonograma abdominal y pélvico, radiografía de tórax, PA y Lat. Izq. Electrocardiograma en reposo, 
                evaluación médica integral (Internista o Cardiólogo). Evaluación urológica.
              </Text>
            </View>
            <View style={styles.textNoteSection}>
              <Text style={styles.boldText}>- Hospitalización:</Text>
              <Text>Todo aspirante femenino mayor o igual a 65 años deberán consignar Exámenes de 
              laboratorio(Perfil 20 y perfil lipídico), ecosonograma abdominal y pélvico, radiografía de tórax, PA y Lat. Izq. Electrocardiograma en reposo,
              evluación médica integral (Internista o Cardiólogo). (Citología, Mamografía bilateral y eco mamario).
              </Text>
            </View>
            <View style={styles.textNoteSection}>
              <Text style={styles.boldText}>- Hospitalización:</Text> 
              <Text>Todo niño menor a 4 años le debe ser incorporado informe médico o control de niño sano con su esquema de vacunación, este último deberá
              haber sido realizado dentro de los 6 meses anteriores a la fecha de presentación de la solicitud.
              </Text>
            </View>
          </View>
        </View>
      </>
  )
}
