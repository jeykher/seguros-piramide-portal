import React , { useEffect, useState } from 'react'
import { Dialog,DialogContent,DialogTitle } from "@material-ui/core"
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from "@material-ui/core/styles"
import Hidden from "@material-ui/core/Hidden"
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from "@material-ui/icons/Close"
import UpdateBeneficiaryAccountForm from './UpdateBeneficiaryAccountForm'

const styles = {
    textCenter: {
      textAlign: "center"
    },
    floatRigth: {
      float: 'right'
    },
    root: {
      flexGrow: 1,
      maxWidth: 700,
    },
    hideContent: {
      display: "none"
    },
    showContent: {
      display: "block"
    },
    tab:{
      padding: '10px !important',
      alignSelf: 'center',
      "@media (min-width: 60px)": {
        width: 330,
        height:510,
        align: 'center'
      },
      "@media (min-width: 760px)": {
        width: 610,
        height:400,
      }
    }
    
  };
  const useStyles = makeStyles(styles);

export default function UpdateBeneficiaryAccount(props) {
    const { handleClose,openModal,workflowId,preAdmissionId,complementId,handleUpdateAccountBeneficiary} = props
    const smallView = !useMediaQuery('(min-width:600px)');
    const classes = useStyles()
    const [showModal, setShowModal] = useState(false)
    
    return (
        <Dialog
                open={openModal}
                onClose={() => handleClose(false)} 
                fullScreen={smallView}
                className={openModal?classes.showContent:classes.hideContent}
                >
        
        <DialogContent className={classes.tab}>
            <UpdateBeneficiaryAccountForm 
                   workflow_id={workflowId} 
                   preadmission_id={preAdmissionId} 
                   complement_id={complementId} 
                   handleUpdateAccountBeneficiary={handleUpdateAccountBeneficiary}
                   handleClose={handleClose}/>
        </DialogContent>
        </Dialog>
    )
}
