import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';

import styles from "./noteMessageStyle";
const useStyles = makeStyles(styles);

export default function NoteMessage(props) {
    const { title, body, time, colorAuthor } = props
    const classes = useStyles();
    return (
        <div>
            <div className={`${classes.message} ${classes.received}`}>
                <div className={classes[colorAuthor]}><h6><strong>{title}</strong></h6></div>
                <Typography variant="body2" gutterBottom>{body}</Typography>
                <div className={classes.footermsj}>
                    <Typography variant="caption" display="block">{time}</Typography>
                </div>
            </div>
        </div>
    )
}
