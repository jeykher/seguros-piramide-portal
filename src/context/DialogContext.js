import React, { Fragment, useState } from 'react'
import AlertDialog from '../components/Core/Dialog/AlertDialog';

const DialogContext = React.createContext();

// function translateDescription(description) {
//   const oraFirst = description.indexOf('ORA-', 0)
//   if (oraFirst >= 0) {
//     const oraSecond = description.indexOf('ORA-', oraFirst + 4)
//     if (oraSecond >= 0) {
//       return description.substring(oraFirst + 11, oraSecond)
//     } else {
//       return description.substring(oraFirst + 11)
//     }
//   } else {
//     return description
//   }
// }

  function translateDescription(data){
    const regex = /^ORA-\d+:/
    let result = data
    let isOra = true
    let lastOra = result.indexOf("ORA-");
    if(lastOra >= 0){
      while(isOra === true){
        result = result.replace(regex,"").trim()
        if(regex.test(result) === false){
          isOra = false
        }
      }
      lastOra = result.indexOf("ORA-");
      result = result.substring(0,lastOra).trim();
    }
    return result;
  }

export function DialogProvider({ children }) {
  const [alertDialogState, setAlertDialog] = useState(null);

  const openConfirmation = (options) => {
    const { description, ...rest } = options
    const descriptionShow = translateDescription(description)
    const params = { ...rest, 'description': descriptionShow }
    setAlertDialog(params);
  };

  const handleClose = () => {
    setAlertDialog(null);
  };

  const handleSubmit = () => {
    alertDialogState.resolve && alertDialogState.resolve()
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

export function useDialog() {
  const context = React.useContext(DialogContext);
  return context;
}