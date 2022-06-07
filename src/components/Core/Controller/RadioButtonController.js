import React, { Fragment } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import { Controller } from "react-hook-form";
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from "@material-ui/core/Radio";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";

import styles from "components/material-dashboard-pro-react/components/customCheckboxRadioSwitch";
const useStyles = makeStyles(styles);

export default function RadioButtonController(props) {
    const classes = useStyles();
    const { objForm, name, values, onChange, required, erroMsg, ...rest } = props;
    const { errors, control } = objForm

    return (
        <Fragment>
            <Controller
                name={name}
                onChange={([event, value]) => {
                    onChange && onChange(value)
                    return value
                }}
                as={
                    <RadioGroup
                        {...rest}
                    >
                        {values.map(({ value, label }, index) => (
                            <FormControlLabel
                                key={index}
                                value={value}
                                label={label}
                                control={<Radio
                                    icon={<FiberManualRecord className={classes.radioUnchecked} />}
                                    checkedIcon={<FiberManualRecord className={classes.radioChecked} />}
                                    classes={{
                                        checked: classes.radio,
                                        root: classes.radioRoot
                                    }}
                                />}
                                classes={{
                                    label: classes.label,
                                    root: classes.labelRoot
                                }}
                            />
                        ))}
                    </RadioGroup>
                }
                control={control}
                rules={{ required: required !== undefined ? required : false }}
            />
            {errors[`${name}`] && <p style={{ color: "red" }}>{erroMsg || 'Debe indicar su respuesta'}</p>}
        </Fragment>
    )
}
