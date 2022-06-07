import React,{useState} from 'react'
import NoteMessage from 'components/Core/Notes/NoteMessage'
//import {setColors,getColors} from 'utils/colorsArray'

export default function Notes(props) {
    const {data} = props
    return (
        data.map((reg,index)=>(
            <NoteMessage
                key={index}
                title={reg.AUTHOR}
                body={reg.NOTE}
                time={reg.CREATION_DATE}
            />
        ))
    )
}
