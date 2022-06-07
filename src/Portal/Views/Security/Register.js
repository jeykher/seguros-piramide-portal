import React, { useState } from "react"
import { navigate } from "gatsby";
import Wizard from 'components/Core/Wizard/Wizard';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import RegisterIdentification from './RegisterIdentification'
import RegisterResult from './RegisterResult'
import RegisterCredentials from './RegisterCredentials'
import RegisterQuestions from './RegisterQuestions'
import RegisterTerms from './RegisterTerms'
import RegisterActivate from './RegisterActivate'
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from "@material-ui/icons/Close"
import Hidden from "@material-ui/core/Hidden"

const styles = {
    textCenter: {
      textAlign: "center"
    },
    floatRigth: {
      float: 'right'
    },
    root: {
      flexGrow: 1,
      maxWidth: 600,
    },
    hideContent: {
      display: "none"
    },
    showContent: {
      display: "block"
    },
    dialogSize:{
      "@media (min-width: 60px)": {
        width: 330,
        height:510,
        align: 'center'
      },
      "@media (min-width: 760px)": {
        width: 550,
        height:530,
      }
    },
    tab:{
      padding: '10px 10px 10px 10px !important',
      alignSelf: 'center'
    }
  };
  const useStyles = makeStyles(styles);

export default function Register() {
    const classes = useStyles();
    const [openInbox, setOpenInbox] = useState(true)
    const [showModal, setShowModal] = useState(true)
    const [state, setState] = useState()

    function finishRegister(){
        navigate('/')
    }

    function onClose() {
        setOpenInbox(false)
        setShowModal(false)
        finishRegister()
    }
    
    function onOpen() {
        setShowModal(true)
    }

    const windowGlobal = typeof window !== 'undefined' && window;
    const smallView = windowGlobal &&window.innerWidth < 600;

    function getRegisterWizard(){
        return (
            <GridContainer justify="center">
                <GridItem xs={12} sm={12}>
                <Wizard
                    validate
                    steps={[
                        { stepName: "Identificación", stepComponent: RegisterIdentification, stepId: "step_identification" },
                        { stepName: "Credenciales", stepComponent: RegisterCredentials, stepId: "step_credential" },
                        { stepName: "Preguntas de Seguridad", stepComponent: RegisterQuestions, stepId: "step_questions" },
                        { stepName: "Términos y Condiciones", stepComponent: RegisterTerms, stepId: "step_terms" },
                        { stepName: "Confirmar", stepComponent: RegisterResult, stepId: "step_result" },
                        { stepName: "Finalizar", stepComponent: RegisterActivate, stepId: "step_activate" }                 
                    ]}
                    title=""
                    subtitle={!smallView?"Regístrate y disfruta de todos los servicios que te ofrecemos en nuestro portal.":"Regístrate y disfruta de nuestros servicios"}
                    finishButtonClick={e => finishRegister(e)}
                    smallView={true}
                />
                </GridItem>
            </GridContainer>
        )
    }

    return (
    <>
        <Hidden mdUp>
            <Dialog
                open={openInbox}            
                fullScreen={true}
                className={showModal?classes.showContent:classes.hideContent}
            >
                <DialogTitle id="alert-dialog-title">Autoregistro      
                    <IconButton onClick={onClose} className={classes.floatRigth}>
                        <CloseIcon />
                    </IconButton>        
                </DialogTitle>
                <DialogContent className={classes.tab}>
                    <DialogContentText className={classes.dialogSize}>
                        { getRegisterWizard() }
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </Hidden>
        <Hidden smDown>
            { getRegisterWizard() }
        </Hidden>
    </>

        
    )
}
