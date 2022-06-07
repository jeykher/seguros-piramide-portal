import React, { useState, useEffect } from 'react'
import { initAxiosInterceptors } from 'utils/axiosConfig'
import { useDialog } from 'context/DialogContext'
import { useLoading } from 'context/LoadingContext'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import PdfViewer from '../Portal/Views/Digitization/PdfViewer'
import LandingPage from '../LandingPageMaterial/Layout/LandingPage'
import queryString from 'query-string'
import TemplateBlank from 'LandingPageMaterial/Layout/TemplateBlank'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import {navigate} from 'gatsby'

export default function DocumentView(props) {
    const params_url = queryString.parse(props.location.search)
    const dialog = useDialog();
    const loading = useLoading();
    const [pdfUrl, setPdfUrl] = useState(null);
    const [msgError, setMsgError] = useState(null)

    async function getDocuments(hash) {
        const params = { p_hash: hash }
        try {
          const response = await Axios.post('/dbo/documents/get_document_by_hash', params)
          if (response.data.p_doc_params.p_doc_params) {
            handleSelectList(response.data.p_doc_params)
          }
        } catch (e) {
          console.log("Error: ", e)
          navigate('/')
        }
      }

    async function handleSelectList(reg) {
      let url = '/dbo/workflow_inbox/get_document_blob/get_blob/p_cur_doc/BLOB_FILE'
      let params = ''
      let paramsConfig = ''
      let type_data = ''
      if (typeof (reg.p_doc_params.p_json_params) !== 'undefined') {
        paramsConfig = reg.p_doc_params.p_params_config
        params = { p_json_params: JSON.stringify(reg.p_doc_params.p_json_params), responseContentType: "application/pdf" }
        url = '/dbo/'+paramsConfig.nameServiceSettings+'/'+paramsConfig.servicePath+'/get_blob/'+paramsConfig.cursorName+'/'+paramsConfig.blobName
        type_data = reg.p_doc_params.p_json_params
      } else {
        params = { p_doc_values: JSON.stringify(reg.p_doc_params.p_doc_values), responseContentType: "application/pdf" }
        type_data = reg.p_doc_params.p_doc_values;
      }
      const response = await Axios.post(url, params, {
          responseType: 'arraybuffer',
          responseEncoding: 'binary'
      })
      toBlob(response.data, type_data.content_type)
    }

    function toBlob(buffer, contentType) {
        const file = new Blob([buffer], { type: contentType})
        const fileURL = URL.createObjectURL(file)
        setPdfUrl(null)
        setMsgError(null)
        setPdfUrl(fileURL)
    }

    useEffect(() => {
        initAxiosInterceptors(dialog,loading)
        getDocuments(params_url.id)
    }, [])

    return (
      <>
        <LandingPage noLinks noRrss noFooter noChatBot noDial>
          <GridContainer style={{minHeight:'80vh', backgroundColor: '#a9a9a9'}}>
              <GridItem xs={12} style={{ marginTop:'75px' }}>
                  { pdfUrl && <PdfViewer pdfUrl={pdfUrl}/>}
              </GridItem>
          </GridContainer>
        </LandingPage>
      </>
    )
}
