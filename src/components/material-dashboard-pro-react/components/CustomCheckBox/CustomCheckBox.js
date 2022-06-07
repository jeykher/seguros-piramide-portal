import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Check from "@material-ui/icons/Check";

import styles from "../customCheckboxRadioSwitch";
const useStyles = makeStyles(styles);

export default function CustomCheckBox(props) {
    const { name, label, onChange, value, ...rest } = props
    const classes = useStyles();
    return (
        <div className={classes.checkboxAndRadio}>
            <FormControlLabel
                control={
                    <Checkbox
                        {...rest}
                        name={name}
                        onChange={(e) => {
                            console.log('CustomCheckBox')
                            console.log(e)
                            //onChange && onChange(value)
                        }}
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                            checked: classes.checked,
                            root: classes.checkRoot
                        }}
                    />
                }
                classes={{
                    label: classes.label,
                    root: classes.labelRoot
                }}
                label={label}
            />
        </div>
    )
}
