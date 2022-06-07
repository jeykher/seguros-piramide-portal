import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import SelectMultiple from 'components/Core/SelectMultiple/SelectMultiple'
import Button from "components/material-kit-pro-react/components/CustomButtons/Button";
import { distinctArray } from 'utils/utils'
import ComparePDFViewer from 'components/Core/PDF/ComparePDFViewer';
import FormMailPDF from 'components/Core/PDF/FormMailPDF';
import { objectOf } from 'prop-types';


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    width: "50%",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
}));


export default function ModalResumePDF(props) {
  const classes = useStyles();
  const {  open, handleClose, idPlans, plans, type, budgetInfo, infoClient, typeModal } = props;
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [nextStep, setNextStep] = useState(false);
  const [filteredPlans, setFilteredPlans] = useState();
  const [objPDF, setObjPDF] = useState({});

  const [cobertsDescrip, setcobertsDescrip] = useState([])
  const [paysDescrip, setpaysDescrip] = useState([])
  const [agesDescrip, setAgesDescrip] = useState({})
  const [propertiesDescrip,setPropertiesDescrip] = useState([])
  const [cobertsProperties, setCobertsProperties] = useState([])


  function generateDistinctCobert(plans) {
        let coberts = []
        for (const plan of plans) {
            coberts = [...coberts, ...plan.coberturas.filter((c) => c.indincluida === 'S' && c.indvisible === 'S')]
        }
    const distinctCobert = distinctArray(coberts, "codcobert", "desccobert")
    setcobertsDescrip(distinctCobert)
  }

  function generateDistinctPay(plans) {
    let pays = []
    plans.map((plan) => (pays = [...pays, ...plan.fraccionamiento]))
    const distinctPays = distinctArray(pays, "maxgiro", "nomplan").sort((a,b) => a.id - b.id);
    setpaysDescrip(distinctPays)
  }

  function generateDistinctAges(plans) {
    let ages = []
    plans.map(() => (ages = [...ages, ...budgetInfo.insured]))
    const distinctAges = distinctArray(ages, "insured_id", "age")
    setAgesDescrip(distinctAges)
  }

  function generateDictinctProperty(plans) {
    let properties = []
    for (const pp of plans) {
      properties = [...properties, ...pp.bienes]
  }
    const propDescrip = distinctArray(properties, 'descbien', 'descbien')
    setPropertiesDescrip(propDescrip);

    let coberts = []
    for (const property of properties) {
      coberts = [...coberts, ...property.coberturas]
  }
    setCobertsProperties(coberts)

}


  const handleSelect = (values) => {
    handleFilteredPlans(values);
  }

  const handleFilteredPlans = (values) => {
    const filteredData = values.map(element => {
      const dataPlan = plans.filter(plan => plan.tipo_plan == element);
      return dataPlan
    })
    const filteredArray = filteredData.flat();

    setFilteredPlans(filteredArray)
    generateDistinctPay(filteredArray)
    generateDistinctCobert(filteredArray)
    type === 'PERSONAS' && generateDistinctAges(filteredArray)
    type === 'HOGAR' && generateDictinctProperty(filteredArray)
  }


  const handleNextStep = () => {
    setNextStep(!nextStep);
  }



  useEffect(() => {
    const allPlans = idPlans.map((el) => el.id);
    setSelectedPlans(allPlans);
    handleFilteredPlans(allPlans);
  }, [idPlans])



  useEffect(() => {
    idPlans.length > 1 ? setNextStep(false) : setNextStep(true);
  }, [open])

  useEffect(() => {
    const formatedPayments = paysDescrip.map(payment => {
      return {
        id: payment.id,
        name : payment.name
      }
    });
    let differentPayments= [
      {
        id: 0,
        name: 'Anual'
      },
      ...formatedPayments
    ]
    differentPayments = differentPayments.sort((a,b) => a.id - b.id);
    setObjPDF({
      plans: filteredPlans,
      infoClient: infoClient,
      cobertsDescrip: cobertsDescrip,
      payments: differentPayments,
      type: type,
      agesDescrip: agesDescrip,
      budgetInfo: budgetInfo,
      propertyDescrip: propertiesDescrip,
      cobertsProperty: cobertsProperties,
      selectedPays: null
    })
    return () => setObjPDF({});
  },[filteredPlans])

  return (
    <>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <div className={classes.paper}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={8} lg={12} style={{ style: "margin:0px;padding:0px;overflow:hidden" }}>
                {!nextStep &&
                  <>
                    <SelectMultiple
                      name="select_plans"
                      label="Seleccione los tipos de planes"
                      arrayValues={idPlans}
                      idvalue="id"
                      descrip="name"
                      arraySelected={selectedPlans}
                      onChange={handleSelect}
                    />
                    <GridContainer justify='center'>
                      <Button color="primary" onClick={handleNextStep}>Proceder</Button>
                    </GridContainer>
                  </>
                }

                { nextStep && typeModal === 'PRINT' && 
                <>
                  <ComparePDFViewer objPDF={objPDF} />
                  <GridContainer justify='center'>
                    <Button color="primary" onClick={handleClose}>Cerrar</Button>
                  </GridContainer>
                </>}

                { nextStep && typeModal === 'MAIL' && <FormMailPDF handleClose={handleClose} objPDF={objPDF} /> }
                
              </GridItem>
            </GridContainer>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
