import React, { Fragment, useState } from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import GroupIcon from '@material-ui/icons/Group';
import IconButton from '@material-ui/core/IconButton'
import Icon from "@material-ui/core/Icon";
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles({
    list: {
        maxWidth: 600,
    }
});
export default function ChatList(props) {
    const classes = useStyles();
    const { chats, eventNewList, eventSelectList, setSelected } = props
    const [selectedIndex, setSelectedIndex] = useState();

    const handleListItemClick = (index, reg) => {
        setSelectedIndex(index);
        eventSelectList(reg)
    };

    return (
        <Fragment>
            <List className={classes.list}>
                {chats.map((reg, index) => (
                    <ListItem
                        key={index}
                        alignItems="flex-start"
                        onClick={() => handleListItemClick(index, reg)}
                        button
                        divider={true}
                        selected={selectedIndex === index || setSelected === index}
                    >
                        <ListItemAvatar>
                            <GroupIcon color="primary" fontSize="large" />
                        </ListItemAvatar>
                        <ListItemText
                            primary={reg.SUBJECT}
                            secondary={`${reg.AUTHOR} - ${reg.MESSAGE_DATE}`}
                        />
                    </ListItem>
                ))}
            </List>
            <div style={{ textAlign: 'left' }}>
                <Tooltip title="Crear un nuevo chat" placement="right-start" arrow>
                    <IconButton color="primary" onClick={eventNewList}>
                        <Icon style={{ fontSize: 35 }}>add_circle</Icon> 
                    </IconButton>
                </Tooltip>
            </div>
        </Fragment>
    )
}

