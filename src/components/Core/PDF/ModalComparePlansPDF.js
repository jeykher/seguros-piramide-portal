import React, { useState, useEffect, Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import ComparePDFViewer from 'components/Core/PDF/ComparePDFViewer';
import FormMailPDF from 'components/Core/PDF/FormMailPDF';
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";

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
    padding: theme.spacing(3, 2, 2),
  },
}));

export default function ModalComparePlansPDF(props) {
  const { 
    type, 
    budgetInfo, 
    infoClient, 
    typeModal, 
    plans, 
    cobertsDescrip, 
    payments, 
    agesDescrip,
    propertyDescrip, 
    cobertsProperty,
    selectedPays
    } = props;
  const { open, handleClose } = props;
  const classes = useStyles();
  const [objPDF, setObjPDF] = useState({});

  useEffect(() => {
    const formatedPayments = payments.map(payment => {
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
    setObjPDF({
      plans: plans,
      infoClient: infoClient,
      cobertsDescrip: cobertsDescrip,
      payments: differentPayments,
      type: type,
      agesDescrip: agesDescrip,
      budgetInfo: budgetInfo,
      propertyDescrip: propertyDescrip,
      cobertsProperty: cobertsProperty,
      selectedPays: selectedPays
    }, [plans])

    return () => setObjPDF({});
  }, [props])


  return (
    <Fragment>
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
                {typeModal == 'PRINT' && 
                  <>
                  <ComparePDFViewer objPDF={objPDF}/>
                  <GridContainer justify='center'>
                    <Button color="primary" onClick={handleClose}>Cerrar</Button>
                  </GridContainer>
                  </>
                }
                {typeModal == 'MAIL' && <FormMailPDF handleClose={handleClose} objPDF={objPDF} />}
              </GridItem>
            </GridContainer>
          </div>
        </Fade>
      </Modal>
    </Fragment>
  );
}
