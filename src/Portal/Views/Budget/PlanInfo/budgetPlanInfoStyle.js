const styles = {
  title:{
    "@media (min-width: 961px)": {
      height: '50px'
    },
    "@media (max-width: 768px)": {
      backgroundColor: '#F3F3F3',
    },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  containerData:{
    "@media (max-width: 768px)": {
      padding: '1em',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    height: '50px',
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerPayment:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    height: '30px',
    textTransform: 'Capitalize'
  },
  containerAmount: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '30px'
  },
  containerTitleColumn:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    fontSize: '1.1em',
    fontWeight: '700',
    "@media (max-width: 768px)": {
      display: 'none'
    }
  },
  titleResponsive:{
    display:'none',
    "@media (max-width: 768px)": {
      display: 'flex'
    },
  }
};

export default styles;