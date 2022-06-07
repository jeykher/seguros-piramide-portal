import React from 'react'
import NumberFormat from 'react-number-format';
import Typography from '@material-ui/core/Typography';

export default function IdentificationFormatDisplay(props) {
    const {value, ...rest } = props
    return (
        <NumberFormat
        {...rest}
            id={rest.name}
            value={value}
            fullWidth
            displayType={"text"}
            decimalSeparator={","}
            thousandSeparator={"."}
            decimalScale={0}
        />
    )
}
