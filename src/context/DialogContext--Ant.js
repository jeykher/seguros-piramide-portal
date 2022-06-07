import React, { Fragment, useState } from 'react'
import AlertDialog from '../components/Core/Dialog/AlertDialog';

const DialogContext = React.createContext();

function translateDescription(description){
    const oraFirst = description.indexOf('ORA-', 0)
    if(oraFirst >= 0){
      const oraSecond = description.indexOf('ORA-', oraFirst + 4)
      if(oraSecond >= 0) {
        return description.substring(oraFirst + 11, oraSecond)
      }else{
        return description.substring(oraFirst + 11)
      }      
    }else{
      return description
    }
}

export function DialogProvider ({ children })  {
    const [alertDialogState, setAlertDialog] = useState(null);

    const awaitingPromiseRef = React.useRef;

    const  openConfirmation = (options) => {
        const {description, ...rest} = options
        const descriptionShow = translateDescription(description)
        const params = {...rest,'description': descriptionShow}
        setAlertDialog(params);
        return new Promise((resolve, reject) => {
          awaitingPromiseRef.current = { resolve, reject };
        });
    };

    const handleClose = () => {
        if (alertDialogState.catchOnCancel && awaitingPromiseRef.current) {
          awaitingPromiseRef.current.reject();
        }    
        setAlertDialog(null);
      };
    
    const handleSubmit = () => {
        if (awaitingPromiseRef.current) {
          awaitingPromiseRef.current.resolve();
        }    
        setAlertDialog(null);
    };

    return (
        <Fragment>
          <DialogContext.Provider
            value={openConfirmation}
            children={children}
          />
    
          <AlertDialog
            open={Boolean(alertDialogState)}
            onSubmit={handleSubmit}
            onClose={handleClose}
            {...alertDialogState}
          />
        </Fragment>
    );
}

export function useDialog(){
    const context = React.useContext(DialogContext);
    return context;
}