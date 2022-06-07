import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/styles'
import { graphql, useStaticQuery } from "gatsby"
import TabSimpleFormLanding from 'components/Core/Tabs/TabSimpleFormLanding'
import BudgetVehiclePublic from 'Portal/Views/Budget/BudgetVehicle/BudgetVehiclePublic'
import BudgetPersonsPublic from 'Portal/Views/Budget/BudgetPersons/BudgetPersonsPublic'
import BudgetHomePublic from 'Portal/Views/Budget/BudgetHome/BudgetHomePublic'
import BudgetTravelPublic from 'Portal/Views/Budget/BudgetTravel/BudgetTravelPublic'
import styles from './pestanasCotizadoresStyle';
const useStyles = makeStyles(styles);

export default function ScrollableTabsButtonForce(props) {
  let insuClass = null
  const { updateTitle, insuranceCompany } = props
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    updateTitle && updateTitle(tabs[newValue], newValue)
  };
  const handleChangeIndex = (index) => {
    setValue(index);
};

  const companyClass = (insuranceCompany) => {
   if (insuranceCompany === 'OCEANICA') {
    insuClass = [classes.titleBudgetOceanica]
   } else {
    insuClass =  [classes.titleBudget]
   }
   return insuClass.join(' ')
  }

   const data = useStaticQuery(
     graphql`
     query  {
       allStrapiCotizadores(sort: {fields: orden}) {
         edges {
           node {
             id
             orden
             codigo_cotizador
             nombre_cotizador
             texto_principal
             texto_secundario
             imagen_fondo {
               childImageSharp{
                 fluid(quality: 100, maxWidth: 2000){
                   ...GatsbyImageSharpFluid
                 }
               }
             }
             imagen_tablet {
              childImageSharp{
                fluid(quality: 100, maxWidth: 2000){
                  ...GatsbyImageSharpFluid
                }
              }
            }
            imagen_movil {
              childImageSharp{
                fluid(quality: 100, maxWidth: 2000){
                  ...GatsbyImageSharpFluid
                }
              }
            }
           }
         }
       }
     }`
   );

  const tabs = [];
  const cotizadores = data.allStrapiCotizadores.edges
  cotizadores.map((node) => {
    tabs.push({
      id: node.node.id, "titulo": node.node.nombre_cotizador,
      "value": node.node.orden,
      "texto_principal": node.node.texto_principal,
      "texto_secundario": node.node.texto_secundario,
      "imagen":  node.node.imagen_fondo.childImageSharp.fluid.src,
      "imagen_movil": node.node.imagen_movil.childImageSharp.fluid.src,
      "imagen_tablet": node.node.imagen_tablet.childImageSharp.fluid.src,
      "component":
        node.node.codigo_cotizador === 'COT_AUTO' ? <BudgetVehiclePublic />
          : node.node.codigo_cotizador === 'COT_SALUD' ? <BudgetPersonsPublic />
            : node.node.codigo_cotizador === 'COT_HOGAR' ? <BudgetHomePublic />
              : node.node.codigo_cotizador === 'COT_VIAJE' ? <BudgetTravelPublic /> : null
    });
  })
  return (
    <div className={classes.container}>
      {/*<p className={companyClass(insuranceCompany)}>¡Cotiza, compara y compra aquí!</p>*/}
      <p className={companyClass(insuranceCompany)}>Cotiza tu póliza de forma rápida y sencilla</p>
      <TabSimpleFormLanding
        value={value}
        onChange={handleChange}
        variant={tabs.length > 2 ? 'scrollable' : 'standard'}
        centered={tabs.length > 2 ? false : true}
        indicatorColor="primary"
        textColor="primary"
        scrollButtons="auto"
        data={tabs}
        handleChangeIndex={handleChangeIndex}
      />
    </div>
  );
}
