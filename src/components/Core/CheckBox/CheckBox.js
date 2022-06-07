import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Check from "@material-ui/icons/Check";

import styles from "components/material-dashboard-pro-react/components/customCheckboxRadioSwitch";
const useStyles = makeStyles(styles);

export default function CheckBox(props) {
    const classes = useStyles();
    const { label, name, classLabel, ...rest } = props;
    return (
        <div className={classes.checkboxAndRadio}>
            <FormControlLabel
                label={label}
                key={name}
                control={
                    <Checkbox
                        {...rest}
                        name={name}
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                            checked: classes.checked,
                            root: classes.checkRoot
                        }}
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
