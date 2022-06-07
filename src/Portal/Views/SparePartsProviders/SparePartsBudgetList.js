import React from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import Icon from "@material-ui/core/Icon";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";

export default function SparePartsBudgetList(props) {

    const { onBack,
            isLoading,
            arrayList, 
            arrayColumns, 
            cardListTitle} = props
    const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY    
    const colorStyle = insuranceCompany == 'OCEANICA' ? '#47C0B6': '#ED1C24';

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12} lg={12}>
                <CardPanel
                    titulo={cardListTitle}
                    icon="list_alt"
                    iconColor="primary"
                >
                    <TableMaterial
                        options={{
                            actionsColumnIndex: -1, pageSize: 10,sorting: false,
                        }}
                        columns={arrayColumns}
                        data={arrayList}
                        isLoading={isLoading}
                    />

                    <CardFooter>
                        <GridContainer justify="center">
                            <Button onClick={onBack}><Icon>fast_rewind</Icon> Ir al Inicio </Button>
                        </GridContainer>
                    </CardFooter>
                </CardPanel>
            </GridItem>
        </GridContainer>
    )
}
