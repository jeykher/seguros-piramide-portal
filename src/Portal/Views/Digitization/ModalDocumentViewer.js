import React, { useState } from 'react'
import Axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";


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

export default function ModalDocumentViewer(props) {
  const classes = useStyles();
  const [url, seturl] = useState(null);
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + ' ' + time;
  const frameIdentifier = props.params ? props.params.identifier + dateTime : null

  async function getDocument() {
    try {
      const expedientType = props.params?.expedientType;
      const response = await Axios.post(props.apiGetDocument,
         expedientType === "SIP" ||  expedientType === "SIN" ||  expedientType === "SOF"
          ? props.params.p_json_params 
          : props.params, 
          {
        responseType: 'arraybuffer',
        responseEncoding: 'binary'
      });
      toBlob(response.data)
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error)
    }
  }

  function toBlob(buffer) {
    const file = new Blob([buffer], { type: props.params.responseContentType });
    const fileURL = URL.createObjectURL(file);
    seturl(fileURL)
  }
  return (
    <div>
      <Modal
        className={classes.modal}
        open={props.open}
        onRendered={getDocument}
        onClose={props.handleClose}
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
                <iframe
                  key={frameIdentifier}
                  src={url}
                  frameBorder="0"
                  style={{ style: "overflow:hidden;height:100%;width:100%", width: '100%', height: '80vh' }}
                />
              </GridItem>
            </GridContainer>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
