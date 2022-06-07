import React,{useEffect} from 'react'
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';

export default function PhoneMobileFormat(props) {
    const { onChange, value, ...rest } = props
    const [val, setVal] = React.useState();

    useEffect(() => {
        setVal(value)
    }, [])

    return (
        <NumberFormat
            {...rest}
            value={val}
            customInput={TextField}
            fullWidth
            format="(####) ###-####" 
            mask="_"    
            type='tel' 
            onValueChange={target => {
                setVal(target.value);
                onChange(target.value);
            }}
            isNumericString
        />
    )
}

  