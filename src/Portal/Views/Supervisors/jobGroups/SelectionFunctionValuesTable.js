import React,{useState,useEffect} from "react"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"


const SelectionFunctionValuesTable = props => {
  const {listValues, titleGroup,programId,handleListSelectedValues} = props

  const [listConfigValues,setListConfigValues] = useState([])

  const handleSelection = (data) => {
    handleListSelectedValues(data,programId)
  }



  const handleInitialSelected = () => {
    const resultFinal = listValues.map((element,index) => {
      return {
        ...element,
      tableData: {
        id: index,
        checked: element.configured === "TRUE" ? true : false
      }
      }
    })
    setListConfigValues(resultFinal)
  }


  useEffect(() => {
    if(listValues.length > 0){
      handleInitialSelected();
    }
    
  },[listValues])

  return (
    <GridItem xs={12}>
      <TableMaterial
        options={{
          pageSize: 5,
          search: true,
          toolbar: true,
          draggable: false,
          selection: true,
          headerStyle: {
            backgroundColor: "#ffa726",
            textAlign: "center",
            color: '#fff'
          },
        }}
        columns={[
          {
            title: titleGroup,
            field: "description_value",
          }
        ]}
        data={listConfigValues}
        onSelectionChange={(data) => {
          handleSelection(data)
        }}
      />
    </GridItem>
  )
}

export default SelectionFunctionValuesTable