import React,{useState, useEffect} from 'react'
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import styles from "./customSelectStyle";
const useStyles = makeStyles(styles);

export default function SelectMultiple(props) {
    const { name, label, arrayValues, idvalue, descrip, onChange, arraySelected } = props
    const classes = useStyles();
    const [multipleSelect, setMultipleSelect] = useState([]);

    const handleMultiple = (event) => {
        setMultipleSelect(event.target.value);
        onChange && onChange(event.target.value)
    };

    useEffect(()=>{
        arraySelected && setMultipleSelect(arraySelected)
    },[arraySelected])

    return (
        <FormControl fullWidth className={classes.selectFormControl}>
            <InputLabel htmlFor={`id_${name}`} className={classes.selectLabel}>{label}</InputLabel>
            <Select
                multiple
                value={multipleSelect}
                onChange={handleMultiple}
                MenuProps={{ className: classes.selectMenu }}
                classes={{ select: classes.select }}
                inputProps={{
                    name: name,
                    id: `id_${name}`
                }}
            >
                <MenuItem disabled classes={{ root: classes.selectMenuItem }}> {label}</MenuItem>
                {arrayValues.map((reg,index) =>(
                    <MenuItem
                        key={index}
                        classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelectedMultiple }}
                        value={reg[idvalue]}
                    >
                        {reg[descrip]}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
