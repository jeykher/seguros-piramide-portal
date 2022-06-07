import React, { useState, useEffect, Fragment } from 'react'
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import PlansCardPays from '../Plans/PlansCardPays';
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import { makeStyles } from "@material-ui/core/styles";
import Success from 'components/material-kit-pro-react/components/Typography/Success'
import Check from "@material-ui/icons/Check";
import AccordionComparePanel from 'components/Core/AccordionPanel/AccordionComparePanel'
import styles from "./budgetPlanInfoStyle";
import { distinctArray } from 'utils/utils'

const useStyles = makeStyles(styles);

export default function BudgetPlanInfo(props) {
  const { AreaName, plan, onReturn, onSelectPay, onSelectBuy, objBudget } = props;
  const [payments, setPayments] = useState([]);
  const [cobertsByAge, setCobertsByAge] = useState([]);
  const [ages, setAges] = useState([]);
  const [property, setProperty] = useState([])
  const classes = useStyles();

  useEffect(() => {
    if (AreaName === 'PERSONAS' || AreaName === 'VIAJE') {
      const ages = distinctArray(plan.coberturas, 'insured_id', 'age');
      const filterAges = Array.from(new Set(ages));
      const filterCobert = filterAges.map(element => {
        return plan.coberturas.filter((el) => el.insured_id === element.id);
      });
      setCobertsByAge(filterCobert);
      setAges(filterAges);
    } else if (AreaName === 'HOGAR') {
      setProperty(distinctArray(plan.bienes, 'descbien', 'descbien'))
    }
  }, [plan])


  useEffect(() => {
    let pays = plan.fraccionamiento.map((el) => {
      return {
        nomplan: el.nomplan,
        prima: el.prima
      }
    });
    pays = [
      {
        nomplan: 'Anual',
        prima: plan.prima
      },
      ...pays
    ]
    setPayments(pays);
  }, [plan]);


  return (
    <Fragment>
      <GridItem xs={12} sm={3} md={3} >
        <PlansCardPays
          objBudget={objBudget}
          index={1}
          plan={plan}
          onSelectPay={onSelectPay}
          onSelectBuy={onSelectBuy}
          onReturn={onReturn}
          showValue={plan.indsumaaseg === 'S' ? true : false}
          showPay={plan.indpago === 'S' ? true : false}
          showFooter
          showReturn
          showMount={true}
          disableDetails={true}
        />
      </GridItem>
      <GridItem xs={12} sm={9} md={9}>
        {plan.indpago === 'S' && <AccordionComparePanel key={2} title={'Metodos de pago'} unmount>
          {payments.map((el, index) => {
            return (
              <GridContainer>
                <GridItem xs={6} md={6} lg={6}>
                  <div className={classes.containerPayment}>{`${el.nomplan}`}</div>
                </GridItem>
                <GridItem xs={6} md={6} lg={6}>
                  <div className={classes.containerAmount}><AmountFormatDisplay name={`plan_${index}`} value={el.prima} /></div>
                </GridItem>
              </GridContainer>
            )
          })}
        </AccordionComparePanel>}
        {(AreaName === 'PERSONAS' || AreaName === 'VIAJE') && ages.map((el, index) => (
          <AccordionComparePanel key={index + 3} title={`Edad: ${el.name}`} unmount>
            <GridContainer>
              <GridItem sm={12} md={6} lg={6} className={classes.containerTitleColumn} >
                <div>Coberturas</div>
              </GridItem>
              <GridItem sm={12} md={3} lg={3} className={classes.containerTitleColumn} >
                <div>Suma asegurada</div>
              </GridItem>
              <GridItem sm={12} md={3} lg={3} className={classes.containerTitleColumn} >
                <div>Prima</div>
              </GridItem>
              {cobertsByAge[index].map((el) => {
                return (el.indincluida === 'S' && el.indvisible === 'S' &&
                  <Fragment>
                    <GridItem sm={12} md={6} lg={6} >
                      <div className={classes.title}>{el.desccobert}</div>
                    </GridItem>
                    <GridItem sm={12} md={3} lg={3} >
                      <div className={classes.containerData}>
                        <span className={classes.titleResponsive}>Suma asegurada: </span>
                        {
                        // el.codcobert === 'DVEN' ? 
                        //   <AmountFormatDisplay name={`plan_${index}`} value={0} /> :
                           el.suma_aseg === 0 ? <Success className={classes.check}><Check /></Success> : 
                           <AmountFormatDisplay name={`plan_${index}`} value={el.suma_aseg} />
                        }
                      </div>
                    </GridItem>
                    <GridItem sm={12} md={3} lg={3} >
                      <div className={classes.containerData}>
                        <span className={classes.titleResponsive}>Prima:</span>
                        {
                        // el.codcobert === 'DVEN' ? 
                        //   <AmountFormatDisplay name={`plan_${index}`} value={0} /> : 
                          el.prima === 0 ? <Success className={classes.check}><Check /></Success> : 
                          <AmountFormatDisplay name={`plan_${index}`} value={el.prima} />
                        }
                      </div>
                    </GridItem>
                  </Fragment>
                )
              })}
            </GridContainer>
          </AccordionComparePanel>
        ))}
        {AreaName === 'AUTOMOVIL' && <Fragment>
          <AccordionComparePanel key={100} title='Coberturas' unmount>
            <GridContainer>
              <GridItem sm={12} md={6} lg={6} className={classes.containerTitleColumn} >
                <div>Coberturas</div>
              </GridItem>
              <GridItem sm={12} md={3} lg={3} className={classes.containerTitleColumn} >
                <div>Suma asegurada</div>
              </GridItem>
              <GridItem sm={12} md={3} lg={3} className={classes.containerTitleColumn} >
                <div>Prima</div>
              </GridItem>
              {plan.coberturas.map((el, index) => (
                el.indincluida === 'S' && el.indvisible === 'S' && <Fragment>
                  <GridItem sm={12} md={6} lg={6} >
                    <div className={classes.title}>{el.desccobert}</div>
                  </GridItem>
                  <GridItem sm={12} md={3} lg={3} >
                    <div className={classes.containerData}>
                      <span className={classes.titleResponsive}>Suma asegurada: </span>
                      {el.indcobley === 'S' ? 'Según Ley' : el.suma_aseg === 0 
                        ? <Success className={classes.check}><Check /></Success> 
                        : <AmountFormatDisplay name={`plan_${index}`} value={el.suma_aseg} />
                      }
                      </div>
                  </GridItem>
                  <GridItem sm={12} md={3} lg={3} >
                    <div className={classes.containerData}>
                      <span className={classes.titleResponsive}>Prima:</span>
                      {el.prima === 0 ? <Success className={classes.check}><Check /></Success> : <AmountFormatDisplay name={`plan_${index}`} value={el.prima} />}</div>
                  </GridItem>
                </Fragment>
              )
              )}
            </GridContainer>
          </AccordionComparePanel>
        </Fragment>}
        {AreaName === 'HOGAR' && <Fragment>
          {property.map((p) => (
            <AccordionComparePanel key={100} title={p.name} unmount>
              <GridContainer>
                <GridItem sm={12} md={6} lg={6} className={classes.containerTitleColumn} >
                  <div>Coberturas</div>
                </GridItem>
                <GridItem sm={12} md={3} lg={3} className={classes.containerTitleColumn} >
                  <div>Suma asegurada</div>
                </GridItem>
                <GridItem sm={12} md={3} lg={3} className={classes.containerTitleColumn} >
                  <div>Prima</div>
                </GridItem>
                {plan.bienes.map((b) => {
                  return b.descbien === p.name ?
                    b.coberturas.map((el, index) => (
                      <Fragment>
                        <GridItem sm={12} md={6} lg={6} >
                          <div className={classes.title}>{el.desccobert}</div>
                        </GridItem>
                        <GridItem sm={12} md={3} lg={3} >
                          <div className={classes.containerData}>
                            <span className={classes.titleResponsive}>Suma asegurada: </span>
                            {el.suma_aseg === 0 ? <Success className={classes.check}><Check /></Success> : <AmountFormatDisplay name={`plan_${index}`} value={el.suma_aseg} />}</div>
                        </GridItem>
                        <GridItem sm={12} md={3} lg={3} >
                          <div className={classes.containerData}>
                            <span className={classes.titleResponsive}>Prima:</span>
                            {el.prima === 0 ? <Success className={classes.check}><Check /></Success> : <AmountFormatDisplay name={`plan_${index}`} value={el.prima} />}</div>
                        </GridItem>
                      </Fragment>
                    )) : null
                })}
              </GridContainer>
            </AccordionComparePanel>
          ))}
        </Fragment>}
        {AreaName === 'HOGAR' && <Fragment>
          <AccordionComparePanel key={100} title='Coberturas Complementarias' unmount>
            <GridContainer>
              <GridItem sm={12} md={6} lg={6} className={classes.containerTitleColumn} >
                <div>Coberturas</div>
              </GridItem>
              <GridItem sm={12} md={3} lg={3} className={classes.containerTitleColumn} >
                <div>Suma asegurada</div>
              </GridItem>
              <GridItem sm={12} md={3} lg={3} className={classes.containerTitleColumn} >
                <div>Prima</div>
              </GridItem>
              {plan.coberturas.map((el, index) => (
                el.indincluida === 'S' && el.indvisible === 'S' && <Fragment>
                  <GridItem sm={12} md={6} lg={6} >
                    <div className={classes.title}>{el.desccobert}</div>
                  </GridItem>
                  <GridItem sm={12} md={3} lg={3} >
                    <div className={classes.containerData}>
                      <span className={classes.titleResponsive}>Suma asegurada: </span>
                      {el.suma_aseg === 0 ? <Success className={classes.check}><Check /></Success> : <AmountFormatDisplay name={`plan_${index}`} value={el.suma_aseg} />}</div>
                  </GridItem>
                  <GridItem sm={12} md={3} lg={3} >
                    <div className={classes.containerData}>
                      <span className={classes.titleResponsive}>Prima:</span>
                      {el.prima === 0 ? <Success className={classes.check}><Check /></Success> : <AmountFormatDisplay name={`plan_${index}`} value={el.prima} />}</div>
                  </GridItem>
                </Fragment>
              )
              )}
            </GridContainer>
          </AccordionComparePanel>
        </Fragment>}
      </GridItem>
    </Fragment>
  )
}