import React from 'react'
import NumberFormat from 'react-number-format';

export default function AmountFormat(props) {
    const { onChange, value, ...rest } = props
    return (
        <NumberFormat
            {...rest}
            id={rest.name}
            value={value}
            thousandSeparator={"."}
            decimalSeparator={","}
            decimalScale={2}
            fixedDecimalScale
            displayType={"text"}
            isNumericString
        />
    )
}

