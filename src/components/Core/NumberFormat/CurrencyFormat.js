import React from 'react'
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';

export default function CurrencyFormat(props) {
    const { onChange, value, ...rest } = props
    const [val, setVal] = React.useState();
    return (
        <NumberFormat
            {...rest}
            value={val}
            customInput={TextField}
            fullWidth
            decimalSeparator={","} 
            thousandSeparator={"."}
            decimalScale={2} 
            onValueChange={target => {
                setVal(target.value);
                onChange(target.value);
            }}
            isNumericString   
            prefix={"$"}    
        />
    )
}

  