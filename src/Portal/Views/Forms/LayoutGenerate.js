import React, { Fragment, useEffect, useState } from "react"
import Axios from "axios"
import { Controller, useForm } from "react-hook-form"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import TablesManager from "../Manager/TablesManager"
import Icon from "@material-ui/core/Icon"
import InputController from "components/Core/Controller/InputController"
import { useDialog } from "context/DialogContext"
import { useUser } from "context/UserContext"
import { makeStyles } from "@material-ui/core/styles"
import FormGenerate from "./FormGenerate"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"

const useStyles = makeStyles((theme) => ({
  containerGrid: {
    padding: "0 20%",
  },
  containerTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    alignSelf: "flex-end",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    width: "75%",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 2, 2),
    height: '75%'
  },
}))

export default function LayoutGenerate({ location, layout_code }) {
  const [object, setObject] = useState(location.state.data)
  const [father, setFather] = useState(location.state.father)
  const [schemaForm, setschemaForm] = useState(null)
  const [lists, setLists] = useState(null)
  const [loadedForm, setLoadedForm] = useState(false)
  const [schemaName, setSchemaName] = useState(null)
  const [tableName, setTableName] = useState(null)
  const [viewEdit,setViewEdit]=useState(false)
  const [itemClobSelect,setItemClobSelect]=useState()
  const dialog = useDialog()

  const { homeUser } = useUser()
  const classes = useStyles()

  async function onSubmit(dataform, e) {
    if (schemaForm && schemaForm.InputParam) {
      schemaForm.InputParam.forEach((controls, index) => {
        if (controls.control_type==="INPUT" ||controls.control_type==="LIST" ) {
            if (controls.data_type === "NUMBER") {
              dataform[controls.item_name] = parseInt(dataform[controls.item_name])
            }
        }

        if (controls.visible_in_form !== "S")
          dataform[controls.item_name] = controls.data_type === "NUMBER" ? parseInt(controls.item_value) : controls.item_value

        if (controls.control_type === "SWITCH"){
          dataform[controls.item_name] = dataform[controls.item_name]? controls.value_true :controls.value_false
        }
      })

    }


    var params = {
      p_schema_name: schemaName,
      p_table_name: tableName,
      p_values: JSON.stringify(dataform),
      p_dml_operation: object !== null ? "UPDATE" : "INSERT",
    }

    await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/portal_admon/dml_executer`, params)
    dialog({
      variant: "info",
      catchOnCancel: false,
      title: "Información",
      description: "El registro fue actualizado exitosamente",
    })

  }
  async function getSchemaForm() {
    const params = {
      p_layout_code: layout_code,
      p_json_data: object !== null ? JSON.stringify(object) : null,
      p_filter: father !== null ? JSON.stringify(father) : null,
    }
    const jsonProfiles = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/portal_admon/get_layout_form`, params)
    setSchemaName(jsonProfiles.data.result.owner)
    setTableName(jsonProfiles.data.result.object_name)
    setschemaForm(jsonProfiles.data.result)
    setLoadedForm(true)

  }


  const convertArrayToObject = (array, key) => {
    const initialValue = {}
    return array.reduce((obj, item) => {
      let valuesArray = item.values.map((fila) => {
        return {
          VALUE: fila.CODE,
          NAME: fila.DESCRIPTION,
        }
      })
      return {
        ...obj,
        [item[key]]: {
          id: item.id,

          values: valuesArray,
          inputValue: item.inputValue?item.inputValue[0]:null
        },
      }
    }, initialValue)
  }

  function getLists() {
    const inputLists = schemaForm.InputParam.filter(inputParam => inputParam.control_type === "LIST")
    const postsLists = inputLists.map((controls, index) => {
      if (controls.dependent_list_level == 1) {
        const params = {
          p_item_id: controls.item_id,
          p_json_parameter: JSON.stringify(null),
        }
        return Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/portal_admon/get_layouts_item_values`, params)
          .then(res => (
            { id: controls.item_id, values: res.data.result,inputValue:res.data.result.filter(input=>(input.CODE==controls.item_value)).map((valor) => {
                return (
                  {VALUE:valor.CODE,NAME:valor.DESCRIPTION}
                )
              }) }
          ))
          .catch(e => console.error(e))
      } else {
        if(object===null){
          return { id: controls.item_id, values: [] }
        }else{
          const params = {
            p_item_id: controls.item_id,
            p_json_parameter: JSON.stringify(object),
          }
          return Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/portal_admon/get_layouts_item_values`, params)
            .then(res => (
              { id: controls.item_id, values: res.data.result,inputValue:res.data.result.filter(input=>(input.CODE==controls.item_value)).map((valor) => {
                  return (
                    {VALUE:valor.CODE,NAME:valor.DESCRIPTION}
                  )
                })}
            ))
            .catch(e => console.error(e))
        }
      }

    })
    Promise.all(postsLists).then(res => {

      if (res) {
        const obj = convertArrayToObject(res, "id")
        setLists(obj)
      }
    })
  }
  async function getListValues(itemId, formValues) {
    const params = {
      p_item_id: itemId,
      p_json_parameter: JSON.stringify(formValues),

    }
    const jsonListValues = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/portal_admon/get_layouts_item_values`, params)

    if (jsonListValues && jsonListValues.data && jsonListValues.data.result && jsonListValues.data.result.length > 0) {
      return jsonListValues.data.result
    } else {
      return []
    }
  }






  useEffect(() => {
    setLoadedForm(false)
    getSchemaForm()
  }, [layout_code])




  useEffect(() => {
    if (schemaForm) {
        getLists()
        setLoadedForm(true)
    }
  }, [schemaForm])

  function onBack(event) {
    window.history.back()
  }


  function handleCLOB(event, control) {
    setItemClobSelect(control)
    setViewEdit(true);
  }

  function handleClose() {
    setViewEdit(false);
  }


  return (
    <>
      {viewEdit && <EditClob itemSelect={itemClobSelect} object={object} handleClose={handleClose} /> }
      {
        (schemaForm && loadedForm && lists) &&
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={4}>
            <TablesManager schema={schemaName} jsonFather={schemaForm} dataFilter={object}/>
          </GridItem>
          <GridItem xs={12} sm={12} md={8} lg={8}>
               <FormGenerate onSubmit={onSubmit} title={schemaForm.title}
                            icon={"playlist_add_check"} color={"primary"} fields ={schemaForm.InputParam}
                            buttonName={"Actualizar"} object={object} handleCLOB={handleCLOB} dataLists={lists} getListValues={getListValues}/>
          </GridItem>
          <GridContainer justify="center">
            <Button onClick={onBack}><Icon>fast_rewind</Icon> Regresar</Button>
          </GridContainer>
        </GridContainer>

      }
    </>
  )
}


export function EditClob(props) {
  const {handleSubmit, ...objForm } = useForm()
  const classes = useStyles()
  const {itemSelect,object, handleClose } = props
  const dialog = useDialog()
  const [item,setItem]=useState()
  const [viewForm,setViewForm]=useState(false)

  async function getClobToEdit() {
    const params = {
      p_item_id: itemSelect.item_id,
      p_json_data: object !== null ? JSON.stringify(object) : null
    }
    const { data } = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/portal_admon/get_clob_to_edit`, params)
    setItem(data.result)
    setViewForm(true)

  }

  async function updateClob(query) {
    const params = {
      p_item_id: itemSelect.item_id,
      p_json_data: object !== null ? JSON.stringify(object) : null,
      p_clob_value: query,
    }

    const { data } = await Axios.post(`/dbo/portal_admon/update_clob`, params)
    dialog({
      variant: "info",
      catchOnCancel: false,
      resolve: () => handleClose(),
      title: "Información",
      description: `${itemSelect.label} se actualizó exitosamente`,
    })

    handleClose()

  }

  async function onSubmit(dataform, e) {
    e.preventDefault()
    try {
      updateClob(dataform.p_query);


    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getClobToEdit(itemSelect,object)

  }, [])

  return (<Modal
    className={classes.modal}
    open={true}
    onClose={handleClose}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{
      timeout: 500,
    }}
  >
    <Fade in={true}>
      <div className={classes.paper}>
        <h4>{itemSelect.label}</h4>
        { viewForm &&
        <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          <GridContainer justify='center'>
            <GridItem xs={12} md={12} sm={12} xl={12}>
               <InputController
                defaultValue={item && item}
                name={"p_query"}
                objForm={objForm}
                required={itemSelect.mandatory === "Y" ? true : false}
                multiline
                fullWidth
                rowsMax={20}
              />
            </GridItem>
            <Button color="success" type="submit" style={{ marginTop: 50 }}>
              <Icon>send</Icon> Actualizar
            </Button>
          </GridContainer>
        </form>}
      </div>
    </Fade>
  </Modal>)

}