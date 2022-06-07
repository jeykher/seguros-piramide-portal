import React, { useState, useEffect} from 'react'
import { makeStyles } from "@material-ui/core/styles";
import InspectionGalleryImage from './InspectionGalleryImage'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import SlickCard from 'components/Core/Slick/SlickCard'

const useStyles = makeStyles((theme) => ({
  expansionTitle: {
      fontSize: '0.7rem'
  },
  contentDisplay:{
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2.5em'
  }
}));

export default function Gallery(props) {
    const {imgUrls} = props
    const [urlActualImage,setUrlActualImage] = useState(null);
    const classes = useStyles();

    const putActualImage = (value) =>{
        console.log('EXC')
        setUrlActualImage(value)
    }


    useEffect(() => {
        if (urlActualImage == null && imgUrls.length > 0) {
            setUrlActualImage(imgUrls[0])
        }
    }, [])

    useEffect(() => {
        if(urlActualImage !== null){
            console.log('Revisar')
        }
    }, [urlActualImage])

    return(
      <>
        {urlActualImage ? 
        <GridContainer>
            <GridItem className={classes.contentDisplay}   xs={12} sm={12} md={12} lg={12}>
                <img alt="Alter " src={urlActualImage.ENLACE}  />
            </GridItem>
        </GridContainer>:null}
        <SlickCard arrows={true} slidesToShow={8}>
            {imgUrls &&
                    imgUrls.map((url, index) => {
                        return( 
                            
                            <InspectionGalleryImage className="gallery-thumbnail" 
                                                    src={url.ENLACE} 
                                                    alt={'Img numero ' + (index + 1) } 
                                                    key={index} 
                                                    objImageURL={url} 
                                                    showImage={putActualImage}
                                                     />
                            
                        )           
                    })
                }
        </SlickCard>

      </>
        
    )
}