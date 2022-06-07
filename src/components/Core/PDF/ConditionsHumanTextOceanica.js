import React from 'react'
import { Text, View } from '@react-pdf/renderer';
import styles from 'components/Core/PDF/comparePDFStyles';

export default function ConditionHumanTextPiramide({diffDays}){
  return (
      <>
        <View style={styles.textCondition}>
          <Text style={styles.titleTextNote}>CONDICIONES HOSPITALIZACIÓN CIRUGÍA Y MATERNIDAD</Text>
          <Text>- El grupo posible a Asegurar será Titular, Cónguye y Padre hasta los 69 años. Hijos, nietos, sobrinos y Hermanos hasta 25 años.</Text>
          <Text>Demás parentescos estarán sujetos a Revision por parte de la compañia de seguros previa presentación de depedencia económica hasta los 25 años.</Text>
          <Text>- Exámenes Médicos de acuerdo al protocolo a partir de los 65 años. (Ver protocolo médico).</Text>
          <Text>- La cobertura de Maternidad aplica solo para Titulares, cónyuges femeninas entro 18 y 50 años.</Text>
          <Text>- No aplica la subscripción para menores de edad, solo en los planes de $ 500.000 y $ 1.000.000,
             las cotizaciones de menores de edad solo serán una referencia, ya que no podrá emitirse sin un titular adulto</Text>
          <Text style={styles.titleTextNote}>CONDICIONES FUNERARIO</Text>
          <Text>- Parentesco permisibles: Titular, cónyuges, padres, suegros, Hijos, Hermanos y Nietos.</Text>
          <Text>- Edad de admisibilidad hasta 70 años en planes indivuales. En plan grupal hasta 6 con hasta una persona mayor a los 70 hasta 75 
               y Plan Grupal hasta 8 con hasta dos personas mayor a los 70 hasta 75. Edad máxima en los siguientes parentescos: 
               Hijos, Hermanos, Nietos, Sobrinos hasta 30 años.</Text>
          <Text>- Las personas a incluir en la prima por grupo deben ser incluidad desde el inicio de las vigencia(no puede incluirse a Posterior).</Text>
          <Text style={styles.titleTextNote}>CONDICIONES ACCIDENTES PERSONALES</Text>
          <Text>- El Asegurado Titular cuya edad sea menor o igual a 69 años. Personas Riesgo Tipo I y II</Text>
          <Text style={styles.textCenterTextNote}>Las condiciones de dicha póliza se rigen por la gaceta oficial N° 40.316 de la fecha 16/12/13.</Text>
        </View>
        <View style={styles.textNote}>
          <Text style={styles.boldText}>Nota:</Text>
          <Text>La aceptación y la emisión del riesgo dependerá del análisis que la compañía realice de acuerdo a la declaración de salud. Caracas, 05 de enero de 2021
          </Text>
          <View style={styles.textNoteCondition}>

            <View style={styles.textNoteSection}>
              <Text style={styles.boldText}>- Hospitalización:</Text>
              <Text>Todo aspirante masculino mayor o igual a 65 años deberán consignar: 
                Exámenes de laboratorio (Perfil 20, perfil lipídico, PSA total y libre), 
                ecosonograma abdominal y pélvico, radiografía de tórax, PA y Lat. Izq. Electrocardiograma en reposo,
                evaluación médica integral (Internista o Cardiólogo). Evaluación urológica. 
              </Text>
            </View>
            <View style={styles.textNoteSection}>
              <Text style={styles.boldText}>- Hospitalización:</Text>
              <Text>Todo aspirante femenino mayor o igual a 65 años deberán consignar: 
                Exámenes de laboratorio (Perfil 20, perfil lipídico, PSA total y libre), 
                ecosonograma abdominal y pélvico, radiografía de tórax, PA y Lat. Izq. Electrocardiograma en reposo, 
                evaluación médica integral (Internista o Cardiólogo) 
                (Citología, Mamografía bilateral y eco mamario). 
              </Text>
            </View>
            <View style={styles.textNoteSection}>
              <Text style={styles.boldText}>- Hospitalización:</Text> 
              <Text>Todo niño menor a 4 años  le debe ser incorporado: 
                Informe médico con antecedentes médicos y situación actual del niño con su esquema de vacunación. 
                Deberá haber sido realizado dentro de los 6 meses anteriores a la fecha de presentación de la solicitud. 
              </Text>
            </View>
          </View>
          <Text style={styles.textCenterTextNote}>Esta Cotización sólo tendrá validez ({diffDays}) días continuos después de su emisión.</Text>
        </View>
      </>
  )
}
