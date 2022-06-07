import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes


// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Avatar from '@material-ui/core/Avatar';
import styles from "./SectionCoberturasStyle.js";

const useStyles = makeStyles(styles);

export default function SectionCoberturas(props) {
  const { title, description,image,derecha} = props;
  const classes = useStyles();

  const useStylesAvatar = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1)
      },
      marginBottom: "60px"
    },
    small: {
      width: theme.spacing(5),
      height: theme.spacing(5),
      boxShadow: "-5px 3px 11px 3px rgb(153, 153, 153)"
    },
    large: {
      width: theme.spacing(25),
      height: theme.spacing(25),
      boxShadow: "unset"
    },
    p: {
      textAlign: 'justify',
    },
    toSmallView: {
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "80px"
    },
    viewLarge: {
      "@media (max-width: 768px)": {
        display: "none"
      }
    },
    viewSmall: {
      "@media (min-width: 768px)": {
        display: "none"
      }
    },
    media: {
      height: 140,
    },
    dSized14: {
      textAlign: 'justify',
      fontSize: "14px!important",
    }
  }));
  const classesAvatar = useStylesAvatar();
  return (
    <>
      <div className={classesAvatar.viewLarge}>
        <div className={classesAvatar.root}>
            {!props.derecha &&<Avatar alt={title} src={image} className={classesAvatar.large} variant="square" />}
             <div className={classes.descriptionWrapper}>
               <h4 className={classes.title}>{title}</h4>
               <div className={classes.description}>
                 {/*<ReactMarkdown className={classesAvatar.p} source={description} />*/}
                 <div  className={classesAvatar.dSized14} dangerouslySetInnerHTML={{ __html: description }}/>
               </div>
             </div>
           {props.derecha &&<Avatar alt={title} src={image} className={classesAvatar.large} variant="square" />}
         </div>
      </div>
      <div className={classesAvatar.viewSmall}>
        <div className={classesAvatar.root + " " + classesAvatar.toSmallView}>
      {!props.derecha &&<Avatar alt={title} src={image} className={classesAvatar.large}  variant="square" />}
          {props.derecha &&<Avatar alt={title} src={image} className={classesAvatar.large} variant="square" />}
          <div className={classes.descriptionWrapper}>
            <h4 className={classes.title}>{title}</h4>
            <div className={classes.description}>
              {/*<ReactMarkdown className={classesAvatar.p} source={description} />*/}
              <div  className={classesAvatar.dSized14} dangerouslySetInnerHTML={{ __html: description }}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

SectionCoberturas.propTypes = {
  image: PropTypes.string,
  derecha: PropTypes.bool,
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
};
