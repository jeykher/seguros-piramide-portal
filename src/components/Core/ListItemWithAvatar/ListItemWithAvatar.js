import React from "react"
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import styles from "./listItemWithAvatarStyle.js";

const useStyles = makeStyles(styles);

export default function ListItemWithAvatar(props) {
    const { theElement, elementKey, text, secondText } = props;
    const classes = useStyles()
    function onListItemClick(e) {
        if (props.onListItemClick) {
            props.onListItemClick(e);
        }
    }
    return (
        <ListItem button onClick={() => onListItemClick(theElement)} key={elementKey}>
            <ListItemAvatar>
                <Avatar className={classes.avatar}>
                   {props.children}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={text} secondary={secondText}/>
        </ListItem>
    )
}

ListItemWithAvatar.propTypes = {
    theElement: PropTypes.object,
    elementKey: PropTypes.string,
    text: PropTypes.string,
    secondText:PropTypes.string,
    onListItemClick: PropTypes.func
  };
