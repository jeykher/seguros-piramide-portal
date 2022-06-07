import React from 'react'
import { makeStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import Button from "components/material-kit-pro-react/components/CustomButtons/Button.js";
import Close from "@material-ui/icons/Close";

import styles from "./modalStyle";
const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function DialogAlert(props) {
    const { open, closeModal, errorMesagge, errorTitle } = props
    const classes = useStyles();
    return (
        <Dialog
            classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal
            }}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={closeModal}
            aria-labelledby="classic-modal-slide-title"
            aria-describedby="classic-modal-slide-description"
        >
        <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
        >
          <Button
            justIcon
            className={classes.modalCloseButton}
            key="close"
            aria-label="Close"
            color="transparent"
            onClick={closeModal}
          >
            <Close className={classes.modalClose} />
          </Button>
          <h4 className={classes.modalTitle}>{errorTitle}</h4>
        </DialogTitle>
        <DialogContent
          id="classic-modal-slide-description"
          className={classes.modalBody}
        >
          <p>
            {errorMesagge}
          </p>
        </DialogContent>
        <DialogActions className={classes.modalFooter}>
          <Button
            onClick={closeModal}
            color="danger"
            simple
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    )
}
