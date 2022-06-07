import React, { Fragment, useState, useEffect} from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import DescriptionIcon from '@material-ui/icons/Description';
import Cardpanel from 'components/Core/Card/CardPanel'

export default function DocumentsLists(props) {
    const {documents,eventSelectList} = props
    const [selectedIndex, setSelectedIndex] = useState();

    const handleListItemClick = (index,reg) => {
        setSelectedIndex(index);
        eventSelectList(reg)
    };

    return (
        <Cardpanel titulo="Documentos Archivados" icon="file_copy" iconColor="primary"> 
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
                        {/*<ListItemAvatar>
                            <DescriptionIcon color="primary" fontSize="large"/>
                        </ListItemAvatar>*/}
                        <ListItemText
                            primary={reg.document_description}
                            secondary={reg.document_date}
                        />
                    </ListItem>
                ))}
            </List>
        </Cardpanel>
    )
}
