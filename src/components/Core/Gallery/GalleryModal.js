import React, { useState, useEffect } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentDisplay:{
      display: 'flex',
      justifyContent: 'center',
      marginTop: '2.5em'
    }
  }));



export default function GalleryModal(props) {
    const { open, alt, src, handleClose, imagesURLs, linkImage} = props;
    const [urlAct, setUrlAct] = useState()
    const classes = useStyles();
    const settings = {
      arrows: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return(
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
          <Fade in={open}>
            
              
                  <GridContainer>
                      <GridItem className={classes.contentDisplay}   xs={12} sm={12} md={12} lg={12}>
                      <img alt="Alter " src={linkImage}  />
                    </GridItem>
                  </GridContainer>
              
          </Fade>
      </Modal>
        </>
    )
}