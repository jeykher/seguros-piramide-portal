import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Button from 'components/material-kit-pro-react/components/CustomButtons/Button';
import ButtonM from '@material-ui/core/Button';
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import DeleteIcon from '@material-ui/icons/Delete';
import SlickCard from 'components/Core/Slick/SlickCard'
import PlansCardPays from '../Plans/PlansCardPays'

import styles from "./stickyFooterCompareStyle";
const useStyles = makeStyles(styles);

export default function StickyFooterCompare(props) {
    const { onShowCompare, objCompare, objBudget } = props
    const { plansCompare, countCompare, handleCleanCompare, handleRemoveCompare } = objCompare
    const classes = useStyles();
    return (
        <div className={classes.containerDiv}>
            <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={10}>
                    <div className={classes.containerContent} >
                        <div className={classes.compareProduct}>
                            <SlickCard arrows={true} slidesToShow={4}>
                                {plansCompare.map((plan, index) => (
                                    <PlansCardPays
                                        key={index}
                                        objBudget={objBudget}
                                        index={index}
                                        plan={plan}
                                        onRemove={handleRemoveCompare}
                                        showMount={false}
                                        onShowCompare={onShowCompare}
                                    />
                                ))}
                            </SlickCard>
                        </div>
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={2} container direction="row" justify="center" alignItems="center">
                    <GridItem xs={6} sm={6} md={12} container direction="row" justify="center" alignItems="center">
                        <Button color="warning" round onClick={onShowCompare}>{`Comparar (${countCompare})`}</Button>
                    </GridItem>
                    <GridItem xs={6} sm={6} md={12} container direction="row" justify="center" alignItems="center">
                        <ButtonM color="primary" onClick={handleCleanCompare}><DeleteIcon />Limpiar</ButtonM>
                    </GridItem>
                </GridItem>
            </GridContainer>
        </div>
    )
}

