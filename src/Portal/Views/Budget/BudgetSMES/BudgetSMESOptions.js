import React from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';

export default function BudgetPatrimonialOptions(props) {
    const { options, classes, removeOption , editOption} = props;

    return (
        <GridContainer justify="center">
            {options.map((reg, index) => (
                <GridItem xs={3} className={props.classes.textCenter}>
                <Paper variant="outlined" elevation={3}> 
                    <h5>{reg.name}</h5>
                    <h6>Prima Total: {reg.total}</h6>
                    {index>0 && <IconButton aria-label="delete" onClick={(event) =>removeOption(event,index)}><DeleteIcon /></IconButton>}
                    <IconButton aria-label="edit" onClick={(event) =>editOption(event,index)}><EditIcon /></IconButton>
                    <Checkbox
                        defaultChecked
                        color="primary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />                    
                </Paper>
            </GridItem>
            ))}
        </GridContainer>
    )

}
