const styles = theme =>  ({
  container:{
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  paddingSelect:{
    marginTop: '8.5px',
    [theme.breakpoints.down("sm")]: {
      marginBottom: '1em'
    }
  },
  containerTitle:{
    display: 'flex',
    alignItems: 'center'
  },
  containerJustify:{
    justifyContent: 'center',
    '&:hover':{
      cursor: 'pointer'
    }
  },
  colorIcon:{
    color: '#6b83a7'
  },
  marginIcon:{
    marginRight: '0.4em'
  },
  titleRowIcon:{
    marginLeft: '0.7em'
  },
  buttonBase:{
    color: '#f50057',
    "@media (max-width: 1400px)": {
      fontSize: '0.680rem'
    }
  },
  fontBold:{
    fontWeight: 500
  },
  areasFontSize:{
    '& .MuiButton-textSizeSmall': {
      "@media (max-width: 530px)": {
        fontSize: '0.600rem'
      },
      "@media (max-width: 1400px)": {
        fontSize: '0.700rem'
      }
    },
  },
  textButton:{
    '& .MuiInputBase-root': {
      fontSize: '0.800rem',
    },
  }
});
export default styles;