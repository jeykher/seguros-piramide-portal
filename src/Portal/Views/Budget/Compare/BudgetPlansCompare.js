import React, { useEffect, useState, useRef, Fragment } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import PlansCobertSlick from './PlansCobertSlick'
import PlansPropertyCobertSlick from './PlansPropertyCobertSlick'
import PlansAgesSlick from './PlansAgesSlick'
import PlansPaySlick from './PlansPaySlick'
import PricingDetails from 'components/material-kit-pro-react/components/Pricing/PricingDetails'
import { distinctArray } from 'utils/utils'
import BudgetPlansCompareActions from './BudgetPlansCompareActions'
import SlickCard from 'components/Core/Slick/SlickCard'
import PlansCardPays from '../Plans/PlansCardPays'
import ModalComparePlansPDF from 'components/Core/PDF/ModalComparePlansPDF'
import ContainerCard from './ContainerCard'

import Hidden from "@material-ui/core/Hidden";
import RowPaySlick from './RowPaySlick'
import RowAgesSlick from './RowAgesSlick'
import RowCobertSlick from './RowCobertSlick'
import RowCobertPropertySlick from './RowCobertPropertySlick'
import AccordionComparePanel from 'components/Core/AccordionPanel/AccordionComparePanel'

const useStyles = makeStyles((theme) => ({
    containerPlans: {
        position: '-webkit-sticky',
        position: 'sticky',
        top: '0px',
        zIndex: '1100',
    },
    titleSpace: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#FFF3F3',
        textAlign: 'center',
        fontSize: '0.95em',
        textTransform: 'capitalize',
        color: '#999'
    },
}));


export default function BudgetPlansCompare(props) {
    const classes = useStyles();
    const { objBudget, BudgetType, onSelectPay, onSelectBuy, onClose, objCompare } = props
    const { plansCompare, handleRemoveCompare, handleSelectCompare } = objCompare
    const { plans, info, budgetInfo,selectedPays, handleSelectedPay, refreshMethodsPayment,handleSelectMethodsPlan } = objBudget
    const refSliderPay = useRef();
    const refSliderAges = useRef();
    const refSliderDetails = useRef();
    const [cobertsDescrip, setcobertsDescrip] = useState([])
    const [paysDescrip, setpaysDescrip] = useState([])
    const [agesDescrip, setAgesDescrip] = useState([])
    const [isOpenModalPDF, setIsOpenModalPDF] = useState(false);
    const [typeModal, setTypeModal] = useState('');
    const [paysMobile, setPaysMobile] = useState([])
    const [propertyDescrip, setPropertyDescrip] = useState([])
    const [cobertsProperty, setCobertsProperty] = useState([])

    const propertyRef = useRef([])
    const paysRef = useRef([])
    const agesRef = useRef([])
    const cobertsRef = useRef([])
    const propertyRefMob = useRef([])
    let indexRefProperty = 0

    function onChange(current, next) {
        if (plansCompare.length > 0) {
            if(cobertsRef.current[0].current != undefined && cobertsRef.current[0].current != null ){
                handleMobileRef(current,next);
            }
            if (refSliderDetails.current != undefined && refSliderDetails.current != null) {
                handleRef(current, next)
            }
        }
    }

    function handleRef(current, next) {
        if (agesDescrip.length > 0) {
            current < next ? refSliderAges.current.slickNext() : refSliderAges.current.slickPrev()
        }

        if (paysDescrip.length > 0) {
            current < next ? refSliderPay.current.slickNext() : refSliderPay.current.slickPrev()
        }

        current < next ? refSliderDetails.current.slickNext() : refSliderDetails.current.slickPrev()

        if (propertyDescrip.length > 0) {
            propertyRef.current.forEach((el) => {
                current < next ? el.current.slickNext() : el.current.slickPrev()
            })
        }
    }

    function handleMobileRef(current, next) {
        if (agesDescrip.length > 0) {
            agesDescrip.length > 0 && agesRef.current.forEach((el) => {
                current < next ? el.current.slickNext() : el.current.slickPrev()
            })
        }
        if (paysDescrip.length > 0) {            
            paysRef.current.forEach((el) => {
                current < next ? el.current.slickNext() : el.current.slickPrev()
            })
        }
        cobertsRef.current.forEach((el) => {
            current < next ? el.current.slickNext() : el.current.slickPrev()
        })
        if (propertyDescrip.length > 0) {
            propertyRefMob.current.forEach((el) => {
                current < next ? el.current.slickNext() : el.current.slickPrev()
            })
        }
    }

    function generateDistinctCobert() {
        let coberts = []
        for (const plan of plansCompare) {
            coberts = [...coberts, ...plan.coberturas.filter((c) => c.indincluida === 'S' && c.indvisible === 'S')]
        }
        const distinctCobert = distinctArray(coberts, "codcobert", "desccobert")
        cobertsRef.current = distinctCobert.map(() => React.createRef());
        setcobertsDescrip(distinctCobert)
    }

    function generateDistinctPay() {
        let pays = []
        plansCompare.map((plan) => (pays = [...pays, ...plan.fraccionamiento]))
        const distinctPays = distinctArray(pays, "maxgiro", "nomplan").sort((a,b) => a.id - b.id);
        const paysWithAnual = [{ id: 0, name: 'Anual' }, ...distinctPays];
        paysRef.current = paysWithAnual.map(() => React.createRef());
        setpaysDescrip(distinctPays)
        setPaysMobile(paysWithAnual)
    }

    function generateDistinctAges() {
        let ages = []
        plansCompare.map(() => (ages = [...ages, ...budgetInfo.insured]))
        const distinctAges = distinctArray(ages, "insured_id", "age")
        agesRef.current = distinctAges.map(() => React.createRef());
        setAgesDescrip(distinctAges)
    }

    function generateDictinctProperty() {
        let properties = []
        for (const pp of plansCompare) {
            properties = [...properties, ...pp.bienes]
        }
        const propDescrip = distinctArray(properties, 'descbien', 'descbien')
        propertyRef.current = propDescrip.map(() => React.createRef())
        setPropertyDescrip(propDescrip)

        let coberts = []
        for (const property of properties) {
            coberts = [...coberts, ...property.coberturas]
        }
        setCobertsProperty(coberts)

        propertyRefMob.current = distinctArray(coberts, "codcobert", "desccobert").map(() => React.createRef())
    }

    function getDistinctCobertPropertyDescrip(descbien) {
        const coberts = cobertsProperty.filter((c) => c.descbien === descbien)
        return distinctArray(coberts, "codcobert", "desccobert")
    }

    function handleShowModalPDF(value) {
        value && setTypeModal(value.currentTarget.name)
        setIsOpenModalPDF(!isOpenModalPDF);
    }

    function initIndex() {
        indexRefProperty = 0
        return true
    }

    function getIndex() {
        return indexRefProperty++
    }

    useEffect(() => {
        BudgetType !== 'VIAJE' &&  generateDistinctPay()
        generateDistinctCobert()
        if (BudgetType === 'PERSONAS' || BudgetType === 'VIAJE') generateDistinctAges()
        BudgetType === 'HOGAR' && generateDictinctProperty()
    }, [plansCompare])

    useEffect(() => {
        refreshMethodsPayment();
    },[])

    return (
        <Fragment>
            {/* Desktop View */}
            <Hidden xsDown>
                <GridContainer>
                    <GridItem xs={12} sm={4} md={4} lg={3}>
                        <GridContainer className={classes.containerPlans}>
                            <BudgetPlansCompareActions
                                objBudget={objBudget}
                                plansCompare={plansCompare}
                                plans={plans}
                                onSelect={handleSelectCompare}
                                onClose={onClose}
                                handleModalPDF={handleShowModalPDF}
                                handleMethodsPlan={handleSelectMethodsPlan}

                            />
                        </GridContainer>
                        {paysDescrip.length > 0 && <ContainerCard>
                            <PricingDetails index="distpay">
                                <ul>
                                    <li key={100}><b>Forma de Pago</b></li>
                                    <li key={101}>Anual</li>
                                    {paysDescrip.map((reg, index) => (
                                        <li key={index}>{reg.name}</li>
                                    ))}
                                </ul>
                            </PricingDetails>
                        </ContainerCard>}
                        {agesDescrip.length > 0 && <ContainerCard>
                            <PricingDetails index="distAges">
                                <ul>
                                    <li key={102}><b>Edades</b></li>
                                    {agesDescrip.map((reg, index) => (
                                        <li key={index}>{reg.name}</li>
                                    ))}
                                </ul>
                            </PricingDetails>
                        </ContainerCard>}
                        {propertyDescrip.map((p) => (
                            <ContainerCard>
                                <PricingDetails index="properties">
                                    <ul>
                                        <li key={105}><b>{p.name}</b></li>
                                        {getDistinctCobertPropertyDescrip(p.name).map((reg, index) => (
                                            <li key={index}>{reg.name}</li>
                                        ))}
                                    </ul>
                                </PricingDetails>
                            </ContainerCard>
                        ))}
                        <ContainerCard>
                            <PricingDetails index="distcobert">
                                <ul>
                                    <li key={100}><b>Coberturas</b></li>
                                    {cobertsDescrip.map((reg, index) => (
                                        <li key={index}>{reg.name}</li>
                                    ))}
                                </ul>
                            </PricingDetails>
                        </ContainerCard>
                    </GridItem>
                    <GridItem xs={12} sm={8} md={8} lg={9}>
                        <GridItem xs={12} sm={12} md={12} lg={12} className={classes.containerPlans}>
                            <SlickCard arrows={true} slidesToShow={3} onBeforeChange={onChange}>
                                {plansCompare.map((plan, index) => (
                                    <PlansCardPays
                                        objBudget={objBudget}
                                        key={index}
                                        index={index}
                                        plan={plan}
                                        onSelectPay={onSelectPay}
                                        onSelectBuy={onSelectBuy}
                                        onRemove={handleRemoveCompare}
                                        showPay={true}
                                        showFooter={true}
                                        showMount={true}
                                        selectedPays={selectedPays}
                                        handleSelectedPay={handleSelectedPay}
                                        showCheckbox
                                        disableSelects={true}
                                    />
                                ))}
                            </SlickCard>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12} lg={12}>
                            {paysDescrip.length > 0 && <PlansPaySlick plans={plansCompare} paysDescrip={paysDescrip} sliderRef={refSliderPay} buttonBuy={false} />}
                            {agesDescrip.length > 0 && <PlansAgesSlick plans={plansCompare} agesDescrip={agesDescrip} sliderRef={refSliderAges} />}
                            {propertyDescrip.map((p, index) => (
                                <PlansPropertyCobertSlick
                                    plans={plansCompare}
                                    cobertsProperty={cobertsProperty}
                                    cobertsDescrip={getDistinctCobertPropertyDescrip(p.name)}
                                    sliderRef={propertyRef.current[index]}
                                />
                            ))}
                            <PlansCobertSlick plans={plansCompare} cobertsDescrip={cobertsDescrip} sliderRef={refSliderDetails} />
                        </GridItem>
                    </GridItem>
                </GridContainer>
            </Hidden>

            {/* Mobile View */}
            <Hidden smUp>
                <Fragment>
                    <GridItem xs={12}>
                        <GridContainer>
                            <BudgetPlansCompareActions
                                objBudget={objBudget}
                                plansCompare={plansCompare}
                                plans={plans}
                                onSelect={handleSelectCompare}
                                onClose={onClose}
                                handleModalPDF={handleShowModalPDF}
                                handleMethodsPlan={handleSelectMethodsPlan} />
                        </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12} className={classes.containerPlans}>
                        <SlickCard arrows={true} slidesToShow={3} onBeforeChange={onChange}>
                            {plansCompare.map((plan, index) => (
                                <PlansCardPays
                                objBudget={objBudget}
                                key={index}
                                index={index}
                                plan={plan}
                                onSelectPay={onSelectPay}
                                onSelectBuy={onSelectBuy}
                                onRemove={handleRemoveCompare}
                                showPay={true}
                                showFooter={true}
                                showMount={true}
                                selectedPays={selectedPays}
                                handleSelectedPay={handleSelectedPay}
                                showCheckbox
                                disableSelects={true}
                                />
                            ))}
                        </SlickCard>
                    </GridItem>
                    {paysDescrip.length > 0 && <AccordionComparePanel id={12} title='Forma de pago'>
                        {paysMobile.map((el, index) => {
                            return (
                                <Fragment key={index + 25}>
                                    <div className={classes.titleSpace} >{el.name}</div>
                                    <RowPaySlick position={index} plans={plansCompare} paysDescrip={paysDescrip} sliderRef={paysRef.current[index]} />
                                </Fragment>
                            )
                        })}
                    </AccordionComparePanel>}
                    {agesDescrip.length > 0 && <AccordionComparePanel id={13} title="Edades">
                        {agesDescrip.map((el, index) => {
                            return (
                                <Fragment key={index + 20}>
                                    <div className={classes.titleSpace} >{el.name}</div>
                                    <RowAgesSlick position={index} plans={plansCompare} agesDescrip={agesDescrip} sliderRef={agesRef.current[index]} />
                                </Fragment>
                            )
                        })}
                    </AccordionComparePanel>}
                    {initIndex() && propertyDescrip.map((p, inx) => {
                        return (<AccordionComparePanel id={20 * inx} key={`row_row_${inx}`} title={p.name}>
                            {getDistinctCobertPropertyDescrip(p.name).map((el, index) => (
                                <Fragment>
                                    <div className={classes.titleSpace} key={index + 10}>{el.name}</div>
                                    <RowCobertPropertySlick
                                        plans={plansCompare}
                                        cobertsDescrip={el}
                                        cobertsProperty={cobertsProperty}
                                        sliderRef={propertyRefMob.current[getIndex()]}
                                    />
                                </Fragment>
                            ))}
                        </AccordionComparePanel>)
                    })}
                    <AccordionComparePanel id={14} title="Coberturas">
                        {cobertsDescrip.map((el, index) => {
                            return (
                                <Fragment key={index + 10}>
                                    <div className={classes.titleSpace} >{el.name}</div>
                                    <RowCobertSlick position={index} plans={plansCompare} cobertsDescrip={cobertsDescrip} sliderRef={cobertsRef.current[index]} />
                                </Fragment>
                            )
                        })}
                    </AccordionComparePanel>
                </Fragment>
            </Hidden>

            <ModalComparePlansPDF
                open={isOpenModalPDF}
                handleClose={handleShowModalPDF}
                infoClient={info}
                plans={plansCompare}
                cobertsDescrip={cobertsDescrip}
                payments={paysDescrip}
                type={BudgetType}
                agesDescrip={agesDescrip}
                budgetInfo={budgetInfo}
                typeModal={typeModal}
                propertyDescrip={propertyDescrip}
                cobertsProperty={cobertsProperty}
                selectedPays={selectedPays}
            />
        </Fragment>
    )
}
