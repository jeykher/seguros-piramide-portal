import React from "react"
import classNames from "classnames"
import { makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button"
import Logo from "../../static/logo-piramides.svg"
import styles from "../Portal/Layout/Piramide/adminNavbarStyle"
import PdfViewer from '../Portal/Views/Digitization/PdfViewer'

const useStyles = makeStyles(styles)

export default function PDFViewerInNewWindow(props) {
    const classes = useStyles()
    const appBarClasses = classNames({
        [classes.appBar]: true,
        [classes.absolute]: true
    })
    if (props.location && props.location !== undefined) {
        const { pdfUrl, apiUrl, params } = props.location
    } else {
        const { pdfUrl, apiUrl, params } = props
    }

    return (
        <div className={classes.content}>
            <AppBar className={appBarClasses}>
                <Toolbar className={classes.container}>
                    <div className={classes.flex}>
                        <Button href="#" className={classes.button__logo} color="transparent">
                            <img className={classes.logo} src={Logo} alt="Pirámide Seguros" />
                        </Button>
                    </div>
                </Toolbar>
            </AppBar >
            <PdfViewer pdfUrl={pdfUrl} apiUrl={apiUrl} params={params} />
        </div>

    );
}
