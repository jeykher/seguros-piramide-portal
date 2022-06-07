import React, { Fragment } from 'react'
import Axios from 'axios';
import { Link } from "gatsby";
import BudgetTitle from 'Portal/Views/Budget/BudgetTitle'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import MuiAlert from '@material-ui/lab/Alert'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import { getProfileCode } from 'utils/auth'

export default function BudgetResult(props) {
    const { objBudget } = props
    const { info } = objBudget

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />
    }

    async function onDownloadPayroll() {
        try {
            const data = { IDREPORTE: 5, IDEPOL: info[0].EMITED_NUMBER, NUMCERT: info[0].EMITED_CERT }
            const params = { p_params: JSON.stringify(data) }
            const response = await Axios.post('/dbo/general_policies/get_report', params)
            window.open(`/reporte?reportRunId=${response.data.p_url}`,"_blank");
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Fragment>
            <BudgetTitle title="Su póliza" />
            <GridContainer>
                <GridItem xs={12} sm={12} md={3} >
                </GridItem>
                <GridItem xs={12} sm={12} md={6} >
                    <GridItem xs={12} sm={12} md={12} className="sections30">
                        <Alert severity="success">{`¡Gracias por tu compra!`}</Alert>
                    </GridItem>
                    <GridContainer justify="center" className="sections30">
                        <Button color="primary" onClick={onDownloadPayroll}>
                            <Icon>cloud_download</Icon> Descarga tu cuadro póliza
                        </Button>
                    </GridContainer>
                    {getProfileCode() === undefined &&
                        <Fragment>
                            <GridContainer className="sections30" spacing={3}>
                                <GridItem xs={12} sm={12} md={12} >
                                    Registrate en nuestro portal y disfruta de todos los servicios que le brindamos sin moverse de su hogar
                                </GridItem>
                            </GridContainer>
                            <GridContainer justify="center" className="sections30">
                                <Link to={`/register`} >
                                    <Button color="primary" ><Icon>person_add_alt_1</Icon> Registrate</Button>
                                </Link>
                            </GridContainer>
                        </Fragment>}
                </GridItem>
            </GridContainer>
        </Fragment>
    )
}
