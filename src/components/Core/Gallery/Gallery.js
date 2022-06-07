import React, { useState} from 'react'
import { makeStyles } from "@material-ui/core/styles";
import GalleryImage from './GalleryImage'
import GalleryModal from './GalleryModal'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"

const useStyles = makeStyles((theme) => ({
  expansionTitle: {
      fontSize: '0.7rem'
  }
}));

export default function Gallery(props) {
    const {imgUrls,galleryType} = props
    const [showModalImage,setShowModalImage] = useState(false);
    const [urlActualImage,setUrlActualImage] = useState();
    const classes = useStyles();

    const handleShowModalImage = () => {
      setShowModalImage(!showModalImage)
    }

    const openModal = (i) => {

      console.log(i)
      
      handleShowModalImage()
    }

    return(
      <>
        <GridContainer>
            {imgUrls &&
                    imgUrls.map((url, index) => {
                        return( 
                            <GridItem  key={index} xs={12} sm={12} md={4} lg={3}>
                                <GalleryImage className="gallery-thumbnail" src={url.ENLACE} alt={'Img numero ' + (index + 1) + '. ' + galleryType} key={index} showImage={openModal} />
                            </GridItem>
                        )           
                    })
                }
        </GridContainer>
        <GalleryModal linkImage={urlActualImage} open={showModalImage} handleClose={handleShowModalImage} imagesURLs={imgUrls} />
      </>
        
    )
}