import React from 'react'
import NoteMessage from 'components/Core/Notes/NoteMessage'
//import {setColors,getColors} from 'utils/colorsArray'

export default function SparePartsObservations(props) {
    const {data} = props
    return (
        data.map((reg,index)=>(
            <NoteMessage
                key={index}
                title={reg.NOMUSR}
                body={reg.TEXTOBSER}
                time={reg.FECOBSER}
            />
        ))
    )
}
