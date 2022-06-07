import React, { Fragment } from 'react'
import { statusPayColors } from 'utils/utils'
import Cardpanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem"
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import PolicyDetailsVehicle from './PolicyDetailsVehicle'
import PolicyDetailsPersons from './PolicyDetailsPersons'
import PolicyDetailsHome from './PolicyDetailsHome'
import PolicyReceipts from './PolicyReceipts'
import { statusRequerimentPending } from "utils/utils"

export default function PolicyGeneralInformation({ data, showDetails }) {
    return (
        <Fragment>
            <Cardpanel titulo="Información General" icon="article" iconColor="primary">
                <GridContainer>
                    <GridItem xs={12} sm={6} md={6}>
                        <h6><strong>Producto: </strong>{data.DESCPROD} </h6>
                        <h6><strong>Plan: </strong>{data.DESCPLAN} </h6>
                        <h6><strong>Numero: </strong> {data.NUMEROPOL}</h6>
                        <h6><strong>Certificado: </strong>{data.NUMCERT} </h6>
                        <h6><strong>Deducible: </strong>{data.MTODEDUCIBLE} </h6>
                        <h6><strong>Vigencia: </strong>{data.VIGENCIA} </h6>
                        <h6>
                            <strong>Recaudos: </strong>
                            <Badge color={statusRequerimentPending[data.RECAUDOSPEN].color}>{statusRequerimentPending[data.RECAUDOSPEN].title}</Badge>
                        </h6>
                        <h6>
                            <strong>Situación: </strong>
                            <Badge color={statusPayColors[data.ESTADO].color}>{data.ESTADO}</Badge>
                        </h6>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={6}>
                        <h6><strong>Asesor: </strong>{data.ASESOR} </h6>
                        <h6><strong>Contratante: </strong>{data.CONTRATANTE} </h6>
                        <h6><strong>Titular: </strong>{data.TITULAR} </h6>
                        <h6><strong>Tlf. Hab: </strong>{data.TELEFHAB} </h6>
                        <h6><strong>Tlf. Movil: </strong>{data.TELEFCEL} </h6>
                        <h6><strong>Email: </strong>{data.EMAIL} </h6>
                    </GridItem>
                </GridContainer>
            </Cardpanel>
            <PolicyReceipts policy_id={data.IDEPOL} certified_id={data.NUMCERT} />
            
            
            {showDetails && <Fragment>
                {data.CODAREA === '0002' && <PolicyDetailsVehicle policy_id={data.IDEPOL} certified_id={data.NUMCERT} />}
                {data.CODAREA === '0004' && <PolicyDetailsPersons policy_id={data.IDEPOL} certified_id={data.NUMCERT} />}
                {data.CODAREA === '0001' && <PolicyDetailsHome policy_id={data.IDEPOL} certified_id={data.NUMCERT} />}
            </Fragment>}
        </Fragment>
    )
}
