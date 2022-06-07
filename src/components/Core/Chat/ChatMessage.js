import React,{Fragment} from 'react'
import { makeStyles } from "@material-ui/core/styles";
import CheckIcon from '@material-ui/icons/Check';
import Typography from '@material-ui/core/Typography';

import styles from "./chatMessageStyle";
const useStyles = makeStyles(styles);

export default function ChatMessage(props) {
    const {title,body,time,readed,type,colorAuthor} = props
    const classes = useStyles();

    function getReaded(){
        if(readed){
            return (
                <Fragment>
                    <CheckIcon className={classes.readed}/>
                    <CheckIcon className={classes.readed}/>
                </Fragment>
            )
        }else{
            return <CheckIcon className={classes.notreaded}/>
        }
    }

    return (
        <div>
            <div className={`${classes.message} ${classes[type]}`}>
                <div className={classes[colorAuthor]}><h6><strong>{title}</strong></h6></div>
                <Typography variant="body2" gutterBottom>{body}</Typography>  
                <div className={classes.footermsj}>
                    <Typography variant="caption" display="block">{time} {getReaded()}</Typography>                      
                </div>                                
            </div>
        </div>
    )
}
