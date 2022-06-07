import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function SelectSimple(props) {
    const { id, label, array, onChange, classNameForm, withoutLabel, updateWithDefaultValue, ...rest } = props
    const classes = useStyles();

    useEffect(() => {
        if (updateWithDefaultValue){
            onChange(rest.defaultValue) 
        } 
    }, [])


    return (
        <FormControl className={`${classes.formControl} ${classNameForm && classNameForm}`}>
            {!withoutLabel && <InputLabel id={label}>{label}</InputLabel>}
            <Select
                labelId={`label_${id}`}
                id={id}
                fullWidth
                {...rest}
                onChange={(event) => {
                    onChange && onChange(event.target.value)
                    return event.target.value
                }}
            >
                {!withoutLabel && <MenuItem key="" value="">{label}</MenuItem>}
                {array && array.map(opc => {
                    let obj = Object.entries(opc)
                    return (
                        <MenuItem key={obj[0][1]} value={obj[0][1]}>
                            {obj[1][1]}
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}
