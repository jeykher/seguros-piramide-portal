import React from 'react'
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';

export default function IdentificationFormat(props) {
    const { onChange, ...rest } = props
    
    return (
        <NumberFormat
            {...rest}
            customInput={TextField}
            fullWidth
            decimalSeparator={","}
            thousandSeparator={"."}
            decimalScale={0}
            onValueChange={({ value }) => {
                onChange && onChange(value);
            }}
            inputProps={{
                maxLength: 15,
            }}
            format={props.format&&props.format}
            isNumericString
        />
    )
}

