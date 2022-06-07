

const trafficStyle = () => ({
  containerLight:{
    display: 'flex',
    width: '35px',
    justifyContent: 'center',
    flexDirection:'column',
    alignItems: 'center',
    background: 'black',
    padding: '0.30em',
    marginLeft: '1.5em'
  },
  circleRed:{
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'red',
    margin: '0.15em 0'
  },
  circleOrange:{
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'orange',
    margin: '0.15em 0'
  },
  circleGreen:{
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'green',
    margin: '0.15em 0'
  },
  containerCircle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center'
  },
  containerToolbar:{
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '1em 0.5em',
    alignItems: 'center'
  },
  buttons:{
    height: '40px'
  }
});

export default trafficStyle;