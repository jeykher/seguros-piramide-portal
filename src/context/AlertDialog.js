import React, { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import Button from "components/material-kit-pro-react/components/CustomButtons/Button";

export default function AlertDialog(props){
    const { successFnc, cancelFnc, alertMsj1, alertMsj2, successButtonTxt, cancelButtonTxt, openAlertDialog, setOpenAlertDialog, title } = props;

    function cancel(){
        setOpenAlertDialog(false)
        cancelFnc(props)
    }

    function success(){
        setOpenAlertDialog(false)        
        if(successFnc){
            successFnc(props)
        }        
    }

    return( 
        <Dialog open={openAlertDialog}>
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {alertMsj1}
                </DialogContentText>
                {alertMsj2 &&
                    <DialogContentText>
                        {alertMsj2}
                    </DialogContentText>
                }
            </DialogContent>
            <DialogActions>
                {successButtonTxt &&
                    <Button size={"sm"} onClick={() => success()} autoFocus>
                        {successButtonTxt}
                    </Button>
                }
                {cancelButtonTxt &&cancelFnc&&
                    <Button size={"sm"} onClick={() => cancel()}  autoFocus>
                        {cancelButtonTxt}
                    </Button>
                }
            </DialogActions>
        </Dialog>
    )
}


