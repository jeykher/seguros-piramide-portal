import React, { Fragment, useState, useEffect} from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Cardpanel from 'components/Core/Card/CardPanel'

export default function DocumentsOnLineList(props) {
    const {documents,eventSelectList} = props
    const [selectedIndex, setSelectedIndex] = useState();

    const handleListItemClick = (index,reg) => {
        setSelectedIndex(index);
        eventSelectList(reg)
    };

    return (
        <Cardpanel titulo="Documentos en Línea" icon="file_copy" iconColor="primary"> 
            <List>
                {documents.map((reg,index)=>(
                    <ListItem 
                        key={index} 
                        alignItems="flex-start" 
                        onClick={()=>handleListItemClick(index,reg)}
                        button
                        divider={true}
                        selected={selectedIndex === index}
                    >
                        <ListItemText
                            primary={reg.DESCRIPTION}
                        />
                    </ListItem>
                ))}
            </List>
        </Cardpanel>
    )
}
