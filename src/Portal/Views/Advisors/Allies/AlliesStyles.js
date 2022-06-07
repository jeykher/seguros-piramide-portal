import stylesCard from "components/Core/Card/cardPanelStyle"

const styles = theme =>  ({
  ...stylesCard,
  containerGrid: {
    padding: "0 1em !important",
  },
  containerTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  buttonNone:{
    display: 'none !important'
  },
  root: {
    '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: 200,
    },
  },
  container:{
    display: 'flex',
    alignItems: 'flex-end'
  },
  textCenter: {
    textAlign: "center",
    fontSize: "14px !important",
  },
  headerCenter: {
    backgroundColor: 'rgb(229, 229, 229)',
    textAlign: "center",
    fontSize: "14px !important",
  },
  textAdjustCenter:{
    textAlign: 'center',
    fontSize: "14px !important",
    width: '18%'
  },
  cleanButton:{
    padding: '0 0.8em'
  },
  marginSelect:{
    margin: '1em 0'
  },
  fullWidth:{
    width: '100% !important',
  }
  
});
export default styles;