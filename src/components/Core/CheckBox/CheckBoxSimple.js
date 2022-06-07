import React, { useState, useEffect } from 'react'
import Checkbox from "@material-ui/core/Checkbox";

export default function CheckBoxSimple(props) {
    const { onChange, value, checkedValue, uncheckedValue, ...rest } = props
    const [checked, setChecked] = useState((value === checkedValue));

    const handleChange = (event) => {
        let newValue
        setChecked(event.target.checked);
        (event.target.checked) ? newValue = checkedValue : newValue = uncheckedValue
        onChange && onChange(newValue);
    };

    useEffect(() => {
        setChecked((value === checkedValue))
    }, [])

    return (
        <Checkbox
        {...rest}
            checked={checked}
            onChange={handleChange}
        //inputProps={{ 'aria-label': 'primary checkbox' }}
        />
    )
}