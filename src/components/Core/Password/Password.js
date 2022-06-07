import React, { useState, Fragment } from 'react'
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Typography from '@material-ui/core/Typography';

export default function Password(props) {
    const { label, name, confirm, onChange, ...rest } = props
    const [showPassword, setshowPassword] = useState(false)

    let objValidPwd = { minLen: 'red', minLower: 'red', minUpper: 'red', minNum: 'red', minEsp: 'red' }
    const [validPwd, setValidPwd] = useState(objValidPwd)
    const minLower = new RegExp("^(?=.*[a-z])")
    const minUpper = new RegExp("^(?=.*[A-Z])")
    const minNum = new RegExp("^(?=.*[0-9])")
    const minEsp = new RegExp("^(?=.*[.!@#$%&*~])")
    const minLen = new RegExp("^(?=.{8,})")

    const handleClickShowPassword = () => {
        setshowPassword(!showPassword)
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    function onchangePwd(value) {
        objValidPwd.minLower = minLower.test(value) ? 'green' : 'red'
        objValidPwd.minUpper = minUpper.test(value) ? 'green' : 'red'
        objValidPwd.minNum = minNum.test(value) ? 'green' : 'red'
        objValidPwd.minEsp = minEsp.test(value) ? 'green' : 'red'
        objValidPwd.minLen = minLen.test(value) ? 'green' : 'red'
        setValidPwd(objValidPwd)
    }

    function ValidationPwd(){
        if(!confirm){
            return (
                <Typography variant="caption" display="block" gutterBottom>
                    Su clave debe tener al menos:
                    <span style={{ color: validPwd.minLen }}> 8 caracteres</span>
                    <span style={{ color: validPwd.minLower }}>, una minúscula</span>
                    <span style={{ color: validPwd.minUpper }}>, una mayúscula</span>
                    <span style={{ color: validPwd.minNum }}>, un número</span>
                    <span style={{ color: validPwd.minEsp }}>, un caracter especial</span>
                </Typography>
            )
        } else {
            return null
        }
    }

    return (
        <Fragment>
            <TextField
                label={label}
                name={name}
                {...rest}
                InputProps={{
                    id: "standard-adornment-password",
                    type: showPassword ? 'text' : 'password',
                    autoComplete:"new-password",
                    endAdornment:
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>,
                }}
                onChange={(e) => {
                    if (!confirm) onchangePwd(e.target.value)
                    onChange(e.target.value)
                }}
            />
            <ValidationPwd />
        </Fragment>
    )
}
