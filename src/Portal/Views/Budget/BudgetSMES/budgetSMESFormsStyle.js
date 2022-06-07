const budgetSMESFormStyle = (theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
    containerLargeTextInput: {
        margin: theme.spacing(1),
        width: '97% !important'
    },
    containerSelect: {
        margin: theme.spacing(1),
        width: '90% !important'
    },
    containerSelectAutoComplete: {
        margin: theme.spacing(1),
        width: '95% !important'
    }
});
  
  export default budgetSMESFormStyle;