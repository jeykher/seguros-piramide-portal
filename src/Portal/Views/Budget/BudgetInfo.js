import React, { Fragment } from 'react'
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import InfoArea from "components/material-kit-pro-react/components/InfoArea/InfoAreaBudget.js";
import Phone from "@material-ui/icons/Phone";
import AppsIcon from '@material-ui/icons/Apps';
import Hidden from '@material-ui/core/Hidden';


export default function BudgetInfo(props) {
    const { info } = props
    return (
        <Fragment>
            <GridItem xs={12} sm={4} md={4} align={'center'}>
                <InfoArea
                    icon={AppsIcon}
                    title={`Cotización Número: ${info[0].BUDGET_ID}`}
                    description={
                        <span>
                            {`Fecha: ${info[0].DATE_CREATION}`}
                            <br />{`Vence: ${info[0].EXPIRED_ON}`}
                        </span>
                    }
                    iconColor="primary"
                />
            </GridItem>
            <Hidden xsDown>
                {info[0].APPLICANT_EMAIL && <GridItem xs={12} sm={4} md={4}>
                    <InfoArea
                        icon={Phone}
                        title={info[0].APPLICANT_NAME}
                        description={
                            <span>
                                {info[0].APPLICANT_EMAIL}
                                <br />{info[0].APPLICANT_PHONE_NUMBER}
                            </span>
                        }
                        iconColor="primary"
                    />
                </GridItem>}
            </Hidden>
        </Fragment>
    )
}
