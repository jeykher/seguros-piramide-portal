import React, { useState , useEffect} from 'react'
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';

export default function AmountFormatInput(props) {
    const { onChange, value, ...rest } = props
    const [val, setVal] = useState();

    useEffect(() => {
        setVal(value)
    }, [])

    return (
        <NumberFormat
            {...rest}
            id={rest.name}
            value={val}
            customInput={TextField}
            thousandSeparator={"."}
            decimalSeparator={","}
            decimalScale={2}
            fixedDecimalScale
            displayType={"input"}
            onValueChange={({value}) => {
                setVal(value);
                onChange && onChange(value);
            }}
            isNumericString
            prefix={rest.prefix}
        />
    )
}

