import React from 'react'
import ControlInput from './ControlInput'

export default function FormControl(props) {
    const {schemaForm} = props
    return (
        schemaForm.map((schemaControl) => (                
            (function() {
                switch (schemaControl.control_type) {
                    case 'INPUT':
                        if(schemaControl.data_type==="VARCHAR2"){
                            return (<ControlInput {...schemaControl}/>)
                        }
                    break;
                }
            }())
        ))
    )
}
