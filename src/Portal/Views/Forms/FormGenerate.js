import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import InputController from 'components/Core/Controller/InputController'
import NumberController from 'components/Core/Controller/NumberController'
import SelectSimpleAutoCompleteWithDataController from 'components/Core/Controller/SelectSimpleAutoCompleteWithDataController'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import DateTimeMaterialPickerController from 'components/Core/Controller/DateTimeMaterialPickerController'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import Icon from "@material-ui/core/Icon"
import CardPanel from 'components/Core/Card/CardPanel'
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import Axios from "axios"
import { makeStyles } from "@material-ui/core/styles"
import { cardTitle, grayColor } from "../../../components/material-kit-pro-react/material-kit-pro-react"
import SwitchGenerateController from "../../../components/Core/Controller/SwitchGenerateController"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import IconButton from "@material-ui/core/IconButton"

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  cardTitle,
  textCenter: {
    textAlign: "center",

  },
  labelForm: {color:'#0000008A',
    textTransform: 'capitalize',
    fontSize: "12px",

  }
}))

export default function FormGenerate(props) {
  const { onSubmit,title,icon,color,fields,buttonName,handleCLOB,dataLists,getListValues} = props
  const [lists, setLists] = useState(dataLists)
  const { handleSubmit, ...objForm} = useForm();
  const classes = useStyles()

  function reloadList(value, parameterId, dependentParameterId, parameterName) {
    if (dependentParameterId > 0 && value) {
      let copyForm = JSON.parse(JSON.stringify(objForm.getValues()))
      copyForm[parameterName] = value["VALUE"]
      getListValues(dependentParameterId, copyForm).then(result => {
          let copyList = JSON.parse(JSON.stringify(lists))
          let valuesArray = result.map((fila) => {
            return {
              VALUE: fila.CODE,
              NAME: fila.DESCRIPTION,
            }
          })
          copyList[dependentParameterId] = {
            id: dependentParameterId,
            values: valuesArray,
            inputValue: null,
          }

          copyList[parameterId].inputValue = value
          clearDependentList(dependentParameterId, copyList)

          setLists(copyList)
        },
      )
    } else if (dependentParameterId == 0 && value) {
      let copyList = JSON.parse(JSON.stringify(lists))
      copyList[parameterId].inputValue = value
      setLists(copyList)
    }
  }

  function clearDependentList(dependentParameterId, copyList) {
    let index = fields.findIndex(item => item.item_id === dependentParameterId)
    let item = fields[index]
    fields.forEach((controls, index) => {
      if (controls && controls.control_type == "LIST" &&
        (controls.dependent_list_group != undefined && controls.dependent_list_group == item.dependent_list_group && controls.dependent_list_level > item.dependent_list_level)) {
        copyList[controls.item_id] = {
          values: [],
        }
        objForm.setValue(controls.item_name, "")
      }
    })
    setLists(copyList)
  }


  async function onSubmitForm(dataform, e) {
    onSubmit(dataform)

  }


  return (
    <form onSubmit={handleSubmit(onSubmitForm)} noValidate>
      <CardPanel titulo={title} icon={icon} iconColor={color} >
        {fields.map((controls,index) => (
          (function() {
            if (controls.visible_in_form === "S") {
              switch (controls.control_type) {
                case "INPUT":
                  if (controls.data_type === "VARCHAR2") {
                    return (
                      <InputController
                        key={controls.item_id}
                        name={`${controls.item_name}`}
                        label={controls.label}
                        defaultValue={controls.item_value}
                        objForm={objForm}
                        required={controls.mandatory === "Y" ? true : false}
                        fullWidth
                      />
                    )
                  } else if (controls.data_type === "NUMBER") {
                    return (
                      <NumberController
                        key={controls.item_id}
                        label={controls.label}
                        name={`${controls.item_name}`}
                        defaultValue={controls.item_value}
                        objForm={objForm}
                        required={controls.mandatory === "Y" ? true : false}
                      />

                    )
                  } else if (controls.data_type === "DATETIME") {
                    return (

                      <DateTimeMaterialPickerController
                        objForm={objForm}
                        key={controls.item_id}
                        name={`${controls.item_name}`}
                        defaultValue={controls.item_value}
                        label={controls.label}
                        onChange={([selected]) => {
                          return selected
                        }}
                        required={controls.mandatory === "Y" ? true : false}
                      />

                    )
                  } else if (controls.data_type === "DATE") {
                    return (

                      <DateMaterialPickerController
                        objForm={objForm}
                        key={controls.item_id}
                        name={`${controls.item_name}`}
                        label={controls.label}
                        defaultValue={controls.item_value}
                        onChange={([selected]) => {
                          return selected
                        }}
                        required={controls.mandatory === "Y" ? true : false}
                        InputLabelProps={{ shrink: true }}
                      />

                    )
                  } else if (controls.data_type === "CLOB") {
                    return (
                      <>
                        <h6 className={classes.labelForm}>{controls.label}</h6>
                        <GridItem>
                          <IconButton onClick={(event) => handleCLOB(event, controls)}>
                            <Icon style={{ fontSize: 24 }} color={"primary"}>edit</Icon>
                          </IconButton>
                        </GridItem>
                      </>
                    )
                  }
                  break
                case "MULTILINE":
                  return (

                    <InputController
                      key={controls.item_id}
                      defaultValue={controls.item_value}
                      name={`${controls.item_name}`}
                      label={controls.label}
                      objForm={objForm}
                      required={controls.mandatory === "Y" ? true : false}
                      multiline
                      rows="4"
                      fullWidth

                    />

                  )
                  break
                case "LIST":
                  return (
                    <SelectSimpleAutoCompleteWithDataController
                      objForm={objForm}
                      key={controls.item_id}
                      name={`${controls.item_name}`}
                      label={controls.label}
                      defaultValue={controls.item_value}
                      array={lists && lists[controls.item_id] && lists[controls.item_id].values}
                      required={controls.mandatory === "Y" ? true : false}
                      inputValue={lists && lists[controls.item_id] && lists[controls.item_id].inputValue}
                      onChange={([e, value]) => {
                        reloadList(value, controls.item_id, controls.dependent_list_param_id, controls.item_name)
                        return value ? value["VALUE"] : null
                      }}
                    />
                  )
                  break
                case "SWITCH":
                  return (
                    <SwitchGenerateController
                      label={controls.label}
                      objForm={objForm}
                      name={`${controls.item_name}`}
                      defaultValue={controls.item_value===controls.value_true}
                    />

                  )
                  break
                default:
                  return null
              }
            }
          }())
        ))}
        <CardFooter>
          <GridContainer justify="center">
            <Button color="primary" type="submit">
              <Icon>description</Icon> {buttonName }
            </Button>
          </GridContainer>
        </CardFooter>
      </CardPanel>
    </form>
  )
}