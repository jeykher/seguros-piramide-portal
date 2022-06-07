import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";

const useStyles = makeStyles((theme) => ({
  imgThumbnail: { 
    maxWidth: '100%',
    borderRadius: '4px',
    marginBottom: '1.22em'
  }
}));

export default function InspectionGalleryImage(props) {
    const {alt,src,showImage, objImageURL} = props
    const classes = useStyles();

  return(
    <>
        <div >
            <img className={classes.imgThumbnail} alt={alt} src={src}   />
            <Button onClick={showImage(objImageURL)}> <Icon>open_in_full</Icon></Button>
        </div>
    </>
    
 )
}