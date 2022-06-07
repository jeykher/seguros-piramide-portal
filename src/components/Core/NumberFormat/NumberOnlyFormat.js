import React from 'react'
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';

export default function NumberOnlyFormat(props) {
    const { onChange, value, ...rest } = props
    const [val, setVal] = React.useState(value);
    return (
        <NumberFormat
            {...rest}
            value={val}
            customInput={TextField}
            fullWidth
            onValueChange={target => {
                setVal(target.value);
                onChange(target.value);
            }}
            decimalScale={0} 
            isNumericString
        />
    )
}
