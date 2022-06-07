import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Button from 'components/material-kit-pro-react/components/CustomButtons/Button';
import ButtonM from '@material-ui/core/Button';
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import DeleteIcon from '@material-ui/icons/Delete';
import SlickCard from 'components/Core/Slick/SlickCard'
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import styles from "./stickyFooterCompareStyle";

const useStyles = makeStyles(styles);

export default function StickyFooterCompareOptions(props) {
    const { options, removeOption, editOption, checkOption, showOptionsBar, cleanOptionsBar, showCompareOptions } = props
    const classes = useStyles();
    return (
        <div className={classes.containerDiv}>
            {/*<CancelIcon color="secondary" className={props.classes.rigthIcon} onClick={(event) =>showOptionsBar(event)} />*/}
            <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={10} className={props.classes.textCenter}>                    
                    <SlickCard arrows={true} slidesToShow={4}>
                        {options.map((reg, index) => (
                            <Paper variant="outlined" elevation={3}>
                                {reg.plan_description}<br></br>
                                <small>Prima Total: {reg.budget_plan_particular_info.total_premium_amount}</small><br></br>
                                {index>0 && <IconButton aria-label="delete" onClick={(event) =>removeOption(event,index)}><DeleteIcon /></IconButton>}
                                <IconButton aria-label="edit" onClick={(event) =>editOption(event,index)}><EditIcon /></IconButton>
                                <Checkbox
                                    checked={reg.checked}
                                    color="primary"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                    onChange={(event) => checkOption(event,index)}
                                />                                           
                            </Paper>
                        ))}
                    </SlickCard>
                </GridItem>
                {options.length>1&&
                    <GridItem xs={12} sm={12} md={2} container direction="row" justify="center" alignItems="center">
                        <GridItem xs={6} sm={6} md={12} container direction="row" justify="center" alignItems="center">
                            <Button color="warning" round onClick={(event) =>showCompareOptions(event)}>Comparar</Button>
                        </GridItem>                          
                        <GridItem xs={6} sm={6} md={12} container direction="row" justify="center" alignItems="center">
                            <ButtonM color="primary" onClick={(event) =>cleanOptionsBar(event)}><DeleteIcon /> Limpiar</ButtonM>
                        </GridItem>                        
                    </GridItem>                 
                }
            </GridContainer>
        </div>
    )
}

