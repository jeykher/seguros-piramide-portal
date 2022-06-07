const PopUpStyle = {
    modalContainer: {
        zIndex: 10000, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        position: 'fixed', 
        justifyContent: 'center', 
        alignItems: 'center', 
        top: 0, 
        left: 0,
    },
    modalBody: {
        position: 'relative',
        width: "55%",
        backgroundColor:"white",
        boxShadow: '0 8px 6px -6px black',
        borderRadius:"5px ",

        "@media (max-width: 500px)": {
            justifyContent: 'center',
            width: "90%",
        }
    },
    btnClose: {
        position: 'absolute',
        top: 3,
        right: 4,
        width:"20px",
        color:'gray',
        cursor: 'pointer',
        "@media (max-width: 500px)": {
            top: 1,
            right: 1,
        }
    },
    modalImg: {
        width: '100%',
        objectFit: 'cover',
        height: 'auto',
        cursor: 'pointer',
        borderRadius:"5px 5px 0 0"
    },
    time: {
        color: 'black',
        textAlign: 'center',
        fontSize: '2rem',
        paddingTop: '0.5rem',
        marginTop:"-5px"
    },
    titleModal: {
        color:"black",
        fontSize:"20px",
        fontWeight:"800",
        textAlign:"center",
        marginTop:"20px"
    },
    containerbtn : {
        display:"flex",
        alignItems:"center",
        justifyContent:"center"
    },
    btn: {
        borderRadius:"4px",
        border:"none",
        color:"white",
        fontSize:"15px",
        width:"90px",
        height:"25px",
        alignContent:"center",
        alignItems:"center"
    },
    btnLabel: {
        color:"white",
        padding:"2px",
        "&:hover":{
            textDecoration:"none",
            color:"white",
        }
    }
}

export default PopUpStyle;