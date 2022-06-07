import React, { useState, useEffect } from 'react'
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';

export default function NumberFormatFree(props) {
    const { onChange, value, ...rest } = props
    const [val, setVal] = useState();

    useEffect(() => {
        setVal(value)
    }, [])

    return (
        <NumberFormat
            {...rest}
            value={val}
            customInput={TextField}
            fullWidth
            onValueChange={target => {
                setVal(target.formattedValue);
                onChange && onChange(target.formattedValue);
            }}
        />
    )
}

