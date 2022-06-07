import React, {  useState, useEffect } from 'react'
import Axios from 'axios'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Cardpanel from 'components/Core/Card/CardPanel'
import Hidden from "@material-ui/core/Hidden"
import { downloadReportDocument } from 'utils/utils'
import { useDialog } from "context/DialogContext"
import { getProfileCode } from "utils/auth"

export default function PolicyReports({ data, policy_id, certified_id, area }) {
    const [selectedIndex, setSelectedIndex] = useState();
    const [reports, setReports] = useState([])
    const dialog = useDialog();

    async function handleListItemClick(index, reg) {
        if ((getProfileCode() === 'insurance_broker' || getProfileCode() === 'corporate') && area === 'PERSONAS') {
            const parameters = {
                p_insurance_broker_code: data.CODINTER
            }
            await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/budgets/get_valid_req`,parameters)
        }
        setSelectedIndex(index)
        const params = { p_params: JSON.stringify(reg) }
        const response = await Axios.post('/dbo/general_policies/get_report', params)
        window.open(`/reporte?reportRunId=${response.data.p_url}`,"_blank");
    }
    
    async function handleListItemClickMovil(index, reg) {
        if ((getProfileCode() === 'insurance_broker' || getProfileCode() === 'corporate') && area === 'PERSONAS') {
            const parameters = {
                p_insurance_broker_code: data.CODINTER
            }
            await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/budgets/get_valid_req`,parameters)
        }
        setSelectedIndex(index)        
        try {
            const params = { p_params: JSON.stringify(reg) }
            const response = await Axios.post('/dbo/general_policies/get_report', params)
            downloadReportDocument(
                null, 
                `reports/get_url_from_report_run_id/${response.data.p_url}`,
                reg.REPORTE,
                'application/pdf',
                'pdf',
                dialog
                ); 

        } catch (error) {
          console.error(error)
        }
    }

    useEffect(() => {
        async function getReports() {
            const params = { p_policy_id: policy_id, p_certified_id: certified_id }
            const response = await Axios.post('/dbo/general_policies/get_policy_report', params)
            setReports(response.data.c_reports)
        }
        getReports()
    }, [])

    return (
        <Cardpanel titulo="Documentos" icon="file_copy" iconColor="primary">
            <GridContainer>
                <GridItem xs={12} sm={12} md={12} lg={12}>

                    <List>
                        {reports.filter((r) => r.ACTIVO === 'S').map((reg, index) => (
                            <>
                                <Hidden mdUp>
                                    <ListItem
                                        key={index}
                                        alignItems="flex-start"
                                        onClick={() => handleListItemClickMovil(index, reg)}
                                        button
                                        divider={true}
                                        selected={selectedIndex === index}
                                    >
                                        <ListItemText
                                            primary={reg.REPORTE}
                                            secondary={reg.DETALLE}
                                        />
                                    </ListItem>
                                </Hidden>
                                <Hidden smDown>
                                    <ListItem
                                        key={index}
                                        alignItems="flex-start"
                                        onClick={() => handleListItemClick(index, reg)}
                                        button
                                        divider={true}
                                        selected={selectedIndex === index}
                                    >
                                        <ListItemText
                                            primary={reg.REPORTE}
                                            secondary={reg.DETALLE}
                                        />
                                    </ListItem>
                                </Hidden>
                            </>
                        ))}
                    </List>
                </GridItem>
            </GridContainer>
        </Cardpanel>
    )
}
