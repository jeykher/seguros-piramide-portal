import React from "react";
import defaultImage from "../../img/default-avatar.png";
import Axios from 'axios'
import Icon from "@material-ui/core/Icon"
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import { useDialog } from 'context/DialogContext'
import { useUser } from 'context/UserContext'

const useStyles = makeStyles((theme) => ({
  pictureContainer:{
    position: "relative",
    cursor: "pointer",
    textAlign: "center",
    display: 'flex',
    flexDirection: 'column'
  },
  pictureSrc:{
    width: '100%'
  },
  icon:{
    color: 'white',
    backgroundColor: '#cccccc',
    height: '32px',
    width: '32px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    transition: 'all 0.2s'
  },
  picture: {
    width: '124px',
    height: '124px',
    backgroundColor: '#999999',
    border: '4px solid #cccccc',
    color: '#ffffff',
    borderRadius: '50%',
    margin: '5px auto',
    overflow: 'hidden',
    transition: 'all  0.2s',
    "& input":{
      cursor: 'pointer',
      display: 'block',
      height: '100%',
      left: '0',
      opacity: '0 !important',
      position: 'absolute',
      top: "0",
      width: '100%'
    },
    "&:hover":{
      borderColor: theme.palette.primary.main,
      "& $icon":{
        backgroundColor: theme.palette.primary.main
      }
    }
  },
}));




export default function PictureUpload() {
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(defaultImage);
  const dialog = useDialog()
  const classes = useStyles();
  const {profilePictureUser, handleProfilePictureUser} = useUser()

  const checkSizeFile = (fileSize) =>{
    const mbSize = Math.round((fileSize/1024));
    return mbSize <= 1024 ? true: false
  }

  const handleImageChange = e => {
    e.preventDefault();
    const regexType = /(jpg|jpeg|png)$/i;
    let reader = new FileReader();
    let newFile = e.target.files[0];
    const typeFile = newFile && newFile.type.split('/').pop().toLowerCase();
    const fileSize = newFile && newFile.size;
    if(regexType.exec(typeFile)){
      if(checkSizeFile(fileSize)){
        reader.onloadend = () => {
          setImagePreviewUrl(reader.result);
          handleSubmit(newFile,reader.result);
        };
        if (newFile) {
          reader.readAsDataURL(newFile);
        }
      }else{
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Alerta",
          description: "Tamaño máximo superado. Por favor intente subir otra imagen con menor tamaño."
        })        
      }
    }else{
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "Extension de imagen no admitida. Por favor verifique la imagen que se desea subir."
      })
    }
  };


  const handleSubmit = async (newFile,image64) => {
    const dataForm = new FormData();
    dataForm.append('picture', newFile);
    const { data } = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/upload_picture_profile`,dataForm);
    if(data === 'salved'){
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "",
        description: "¡Imagen actualizada exitosamente!"
      })
    }
    handleProfilePictureUser(image64)
  };

  React.useEffect( () =>{
    const getPreviewUrl = async () =>{
      const picture = profilePictureUser
      if(picture){
        setImagePreviewUrl(picture)
      }
    }    
    
    getPreviewUrl();
  },[])
  return (
    <GridContainer justify="center">
        <GridItem xs={12} md={5}>
          <div className={classes.pictureContainer}>
            <div className={classes.picture}>
              <div className={classes.icon}><Icon>photo_camera</Icon></div>
              <img src={imagePreviewUrl} className={classes.pictureSrc} alt="profile-upload" />
              <input type="file" onChange={e => handleImageChange(e)} accept="image/*" title="" />
            </div>
            <Typography variant="caption"><strong>Tamaño máximo:</strong> 1Mb</Typography>
            <Typography variant="caption"><strong>Formatos admitidos:</strong> JPEG, PNG, JPG</Typography>
          </div>
      </GridItem>
    </GridContainer>
  );
}
