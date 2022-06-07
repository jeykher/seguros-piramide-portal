import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import { Controller } from "react-hook-form";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Check from "@material-ui/icons/Check";

import styles from "components/material-dashboard-pro-react/components/customCheckboxRadioSwitch";
const useStyles = makeStyles(styles);

export default function CheckBoxController(props) {
    const classes = useStyles();
    const { objForm, label, name, onChange, classLabel,  ...rest } = props;
    const { control } = objForm

    return (
        <div className={classes.checkboxAndRadio}>
            <FormControlLabel
                label={label}
                key={name}
                control={
                    <Controller
                        as={<Checkbox />}
                        {...rest}
                        control={control}
                        name={name}
                        onChange={([event, value]) => {
                            onChange && onChange(value)
                            return value ? 'S' : 'N'
                        }}
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                            checked: classes.checked,
                            root: classes.checkRoot
                        }}
                        defaultValue='N'
                    />
                }
                classes={{
                    label: classLabel === undefined ? classes.label : classes[classLabel],
                    root: classes.labelRoot
                }}
            />
        </div>
    )
}
