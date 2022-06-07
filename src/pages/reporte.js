import React, { useState, useEffect } from "react"
import classNames from "classnames"
import { makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button"
import LogoPiramide from "../../static/logo-piramides.svg"
import LogoOceanica from "../../static/oceanica_original.png"
import styles from "../Portal/Layout/Piramide/adminNavbarStyle"
import PdfViewer from '../Portal/Views/Digitization/PdfViewer'
import queryString from 'query-string'
import { Link } from "gatsby";
import { initAxiosInterceptors } from 'utils/axiosConfig'
import { useDialog } from 'context/DialogContext'
import { useLoading } from 'context/LoadingContext'

const useStyles = makeStyles(styles)
const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY

export default function ReportePage(props) {
  const params = queryString.parse(props.location.search)
  const classes = useStyles()
  const loading = useLoading()
  const dialog = useDialog()
  const [apiUrl, setApiUrl] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)

  const appBarClasses = classNames({
    [classes.appBar]: true,
    [classes.absolute]: true
  })

  function setInitialApiUrl() {
    if (params.id && params.id !== undefined) {
      setApiUrl(`reports/get/${params.id}`)
    } else if (params.reportRunId && params.reportRunId !== undefined) {
      setApiUrl(`reports/get_url_from_report_run_id/${params.reportRunId}`)
    } else if (params.urlReport && params.urlReport !== undefined) {
      setPdfUrl(Buffer.from(params.urlReport, 'base64').toString('utf-8'))
    }
  }

  useEffect(() => {
    initAxiosInterceptors(dialog, loading)
    setInitialApiUrl()
  }, [])

  return (
    <div className={classes.content}>
      <AppBar className={appBarClasses}>
        <Toolbar className={classes.container}>
          <div className={classes.flex}>
            <Button className={classes.button__logo} color="transparent">
              {(insuranceCompany == 'OCEANICA')
                ? <Link to="/"><img className={classes.logo} src={LogoOceanica} alt="Oceánica de Seguros" /></Link>
                : <Link to="/"><img className={classes.logo} src={LogoPiramide} alt="Pirámide Seguros" /></Link>
              }
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      {(apiUrl || pdfUrl) && <PdfViewer apiUrl={apiUrl} pdfUrl={pdfUrl} />}
    </div>
  );
}
