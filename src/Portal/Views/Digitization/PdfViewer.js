import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import styles from "../../Layout/Piramide/adminNavbarStyle"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Card from "components/material-kit-pro-react/components/Card/Card.js";
import CardBody from "components/material-kit-pro-react/components/Card/CardBody.js";
import { initAxiosInterceptors } from 'utils/axiosConfig'
import { useDialog } from 'context/DialogContext'
import { useLoading } from 'context/LoadingContext'
import Axios from 'axios'
import PropTypes from "prop-types";

const useStyles = makeStyles(styles)

export default function PdfViewer(props) {
  const classes = useStyles()
  const dialog = useDialog()
  const loading = useLoading()
  const [blobUrl, setBlobUrl] = useState(false)
  const [message, setMessage] = useState('Por favor espere un momento...')
  const { apiUrl, params, pdfUrl } = props

  function toBlob(buffer) {
    const pdfBlob = new Blob([buffer], { type: 'application/pdf' })
    const fileURL = URL.createObjectURL(pdfBlob);
    setBlobUrl(fileURL)
  }

  const getReport = async () => {
    if (pdfUrl && pdfUrl !== undefined) {
      setBlobUrl(pdfUrl)
    } else {
      const bodyParams = (params) ? params : {}
      try {
        const response = await Axios.post(apiUrl, bodyParams)
        toBlob(response.data)
        URL.revokeObjectURL(blobUrl)
      } catch (e) {
        setMessage('El documento no pudo ser cargado')
        setBlobUrl(null)
      }
    }
  }
  useEffect(() => {
    getReport()
  }, [])

  useEffect(() =>{
    initAxiosInterceptors(dialog,loading)
  },[])
  return (
    <>
      {
        blobUrl
          ? <iframe
            src={blobUrl}
            frameBorder="0"
            style={{ style: "overflow:hidden;height:100%;width:100%", width: '100%', height: '100vh' }}
          />
          : <GridContainer
            justify="center"
            className={classes.heightWait}
            direction="row"
            alignItems="center"
          >
            <GridItem xs={8} sm={6} md={4} lg={3} style={{ textAlign: "center" }}>
              <Card>
                <CardBody>
                  <h4 className={classes.cardTitle}>{message}</h4>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
      }
    </>
  );
}


PdfViewer.propTypes = {
  pdfUrl: PropTypes.string,
  apiUrl: PropTypes.string,
  params: PropTypes.object
};