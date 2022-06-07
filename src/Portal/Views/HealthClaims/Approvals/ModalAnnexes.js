import React, { useEffect, useState, Fragment} from "react"
import { Dialog, DialogContent, Fade, TextField, Backdrop, Modal, Zoom, Tooltip, Icon } from "@material-ui/core";
import Axios from "axios"
import { makeStyles } from "@material-ui/core/styles"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import CardPanel from "components/Core/Card/CardPanel"
import styles from "components/Core/Card/cardPanelStyle"


const useStyles = makeStyles((theme) => ({
    ...styles,
    hideContent: {
      display: "none"
    },
    showContent: {
      display: "block"
    },
    GridItem: {
        padding: '2px 5px !important'
    },
    notesContent: {
        backgroundColor: 'grey', 
        margin: '4px 0', 
        padding: '0 4px', 
        fontSize: 11, 
        borderRadius: 2, 
        color: '#fff',
        fontWeight: 500,
    },
    detailNote: {
        padding: "0 10px",
        textAlign:"justify",
        width: "100%"
    }
  })
)

const ModalAnnexes = ({preAdmissionId,complementId,handleClose, openModal}) => {
    const [anexos, setAnexos] = useState([])
    const [note, setNote] = useState({})
    const [isDetail, setIsDetail] = useState(false)
    const [maxWidth, setMaxWidth] = useState('md')
    const classes = useStyles()

    const getNoteDetail = async(data) => {
        const params = {
            npIdepol: data.IDEPOL,
            npNumcert: data.NUMCERT,
            cpCodramocert: data.CODRAMOCERT,
            npIdeaseg: data.IDEASEG,
            cpCodAnexo: data.CODANEXO,
            cpOrigen: data.ORIGEN
        }
        const res = await Axios.post('/dbo/health_claims/get_annexes_detail', params)
        console.log(res.data.p_cursor)
        setIsDetail(true)
        setMaxWidth('lg')
        let TEXTOANEXO = ""
        let CODANEXO = res.data.p_cursor[0].CODANEXO
        for(var item in res.data.p_cursor[0]){
            if(item !== 'CODANEXO' && res.data.p_cursor[0][item] !== null){
                TEXTOANEXO += res.data.p_cursor[0][item]
            }
        }
        console.log("TEXTOANEXO: ", TEXTOANEXO)
        setNote({
            CODANEXO,
            TEXTOANEXO,
            nombre: data.DESCANEXO
        })
    }

    useEffect(() => {
        const handleData = async() => {
            const params = {
                npIdepreadmin : preAdmissionId,
                npNumliquid : complementId
            }
            const res = await Axios.post('/dbo/health_claims/get_annexes', params)
            console.log(res.data.p_cursor)
            setAnexos(res.data.p_cursor)
        }
        handleData()
    },[])

    return (
        <Dialog
          open={openModal}
          onClose={() => handleClose(false)} 
          maxWidth={maxWidth}
          className={openModal?classes.showContent:classes.hideContent}
          >
          {
            openModal &&
            <DialogContent className={classes.tab}>
                <CardPanel titulo={!isDetail?"Documentos":note.nombre} icon="file_copy" iconColor="primary">
                    {
                        isDetail?
                        <GridContainer justify='' style={{marginTop: 10 }}>
                            <div id="detailNote" className={classes.detailNote} dangerouslySetInnerHTML={{__html: note.TEXTOANEXO}}>
                            {/* ConvertStringToHtml(note.TEXTOANEXO) */}
                            </div>
                            
                        </GridContainer>
                        :
                        <GridContainer justify="center"  style={{marginTop: 10 }}>
                            {
                                anexos.length > 0?
                                anexos.map((item, key) => (
                                    <GridItem key={key} className={classes.GridItem} xs={12} sm={12} md={6} lg={6}>
                                        <div className={classes.notesContent}>
                                            <div>
                                                {item.DESCANEXO}
                                            </div>
                                            <div>
                                                <Icon style={{cursor: "pointer"}} onClick={() => getNoteDetail(item)}>description</Icon>
                                            </div>
                                        </div>
                                    </GridItem>
                                ))
                                :
                                <GridItem xs={12} sm={12} md={12} lg={12}>
                                    No contiene Anexos
                                </GridItem>
                            }
                        </GridContainer>
                    }
                </CardPanel>
                <GridContainer justify="center" style={{marginTop: 5}}>
                    <Button onClick={() =>{!isDetail?handleClose(false):setIsDetail(false);setNote({});setMaxWidth('md')}}>
                        <Icon>fast_rewind</Icon> Regresar
                    </Button>
                    {/* <Button color="primary" onClick={() => handleOpenModalAnexos(false)}>
                        <Icon>send</Icon> Aceptar
                    </Button> */}
                </GridContainer>
            </DialogContent>
          }
        </Dialog>
    )
}

export default ModalAnnexes