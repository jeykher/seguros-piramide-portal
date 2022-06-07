import React, {Fragment} from 'react'
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Icon from "@material-ui/core/Icon";
import Card from "components/material-dashboard-pro-react/components/Card/Card";
import CardHeader from 'components/material-dashboard-pro-react/components/Card/CardHeader';
import CardBody from 'components/material-dashboard-pro-react/components/Card/CardBody';
import CardIcon from 'components/material-dashboard-pro-react/components/Card/CardIcon';
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";

import styles from './sparePartsBudgetSummaryCardStyle'
const useStyles = makeStyles(styles);

export default function SparePartsBudgetSummaryCard(props) {

    const { cardTitle,
            numberSparePartsBudgets,
            piecesSummary,
            cardLink,
            returnParamNavigate,
            handleNavigation,
            collapse } = props
    const { handleSubmit, errors, control, ...rest } = useForm()
    const classes = useStyles();
    
    const [expanded,setExpanded] = React.useState(true);
    const handleCollapseCard = () =>{
        collapse && setExpanded(!expanded);
    }
    
    function onSubmit(data, e) {
        e.preventDefault();
        const completeLink = returnParamNavigate(cardLink)
        handleNavigation(completeLink, cardTitle)
    }

    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Card 
                collapse={collapse} 
                handleCollapseCard={handleCollapseCard}
                expanded={expanded}
                >
                <CardHeader color={props.color} icon>
                    <CardIcon color={props.iconcolor}>
                    <Icon>{props.icon}</Icon> 
                    </CardIcon>
                    <h5 className={classes.cardIconTitle}>{cardTitle}</h5>
                </CardHeader>
                <CardBody  expanded={expanded} >
                    
                    <GridContainer justifyContent="center">
                        <GridItem className = {classes.centerContent}  xs={12} sm={12} md={12} lg={12}>
                            <h2>{numberSparePartsBudgets}</h2>
                        </GridItem>
                        <GridItem className = {classes.centerContent}  xs={12} sm={12} md={12} lg={12}>
                            <h7>{piecesSummary}</h7>
                        </GridItem>
                    </GridContainer>
                    
                    <div className={classes.buttonAccion}>
                    <Button fullWidth color={props.iconcolor} type="submit" onClick={props.actionButton ? props.actionButton : undefined}>
                    {props.iconaccion && <Icon>{props.iconaccion}</Icon>}  {props.accion}
                    </Button>
                    </div>
                </CardBody>
                </Card>

            </form>
        </Fragment>
    )
}