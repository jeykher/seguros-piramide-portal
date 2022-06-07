import React, { useState, useEffect } from "react"
import Axios from "axios"
import { navigate } from "gatsby"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import UsersSearch from "./UsersSearch"
import UsersTable from "./UsersTable"
import { getIdentificationCustomer } from "utils/utils"
import { getProfileCode } from "utils/auth"
import { useForm } from "react-hook-form";

export default function ProfileUsers({ location }) {
  const index = "USER"
  const [usersList, setUsersList] = useState([])
  const { triggerValidation, getValues, ...objForm } = useForm()
  const [showForm, setShowForm] = useState(false)
  const [paramsSearch, setParamsSearch] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [profiles, setProfiles] = useState([]) 
  const [jsonParams, setJsonParams] = useState(null);
  const [showButton,setShowButton] = useState(false)
  const [checkboxArray,setCheckboxArray] = useState([])
  const [checkedAll,setCheckedAll] = useState(false);

  const handleCheckedAll = () => setCheckedAll(!checkedAll);
  
  async function onSubmit(data) {
    
    setIsLoading(true);
    
    const params = {
      p_portal_usernames: `${data[`p_portal_usernames_${index}`]}` === 'undefined' ? null : `${data[`p_portal_usernames_${index}`]}` === '' ? null : `${data[`p_portal_usernames_${index}`]}`,
      p_profile_id: `${data[`p_profile_${index}`]}` === 'undefined' ? null : `${data[`p_profile_${index}`]}` === '' ? null : `${data[`p_profile_${index}`]}`,
      p_identification_type: `${data[`p_identification_type_${index}`]}` === 'undefined' ? null : `${data[`p_identification_type_${index}`]}` === '' ? null : `${data[`p_identification_type_${index}`]}`,
      p_identification_number: `${data[`p_identification_number_${index}`]}` === 'undefined' ? null : `${data[`p_identification_number_${index}`]}` === '' ? null : `${data[`p_identification_number_${index}`]}`,
      p_name: `${data[`p_name_${index}`]}` === 'undefined' ? null : `${data[`p_name_${index}`]}` === '' ? null : `${data[`p_name_${index}`]}`,
      p_last_name: `${data[`p_last_name_${index}`]}` === 'undefined' ? null : `${data[`p_last_name_${index}`]}` === '' ? null : `${data[`p_last_name_${index}`]}`
    }
    
    const result = await Axios.post('/dbo/security/get_users_change_profile',params)
    setUsersList(result.data.result)
    setJsonParams(params)
    setIsLoading(false)
  }

  async function getUsers() {
    setIsLoading(true);
    const result = await Axios.post('/dbo/security/get_users_change_profile',jsonParams)
    setUsersList(result.data.result)
    result.data.result.length === 0 ? setShowButton(false) : setShowButton(true)
    setIsLoading(false)
  }

  const handleSearchUsers = () => {
    getUsers()     
  }

  const handleShowButton = (value) => {
     setShowButton(value)
  }

  const handleChecboxArray = (value) => {
    setCheckboxArray(value)
  }
  async function getProfiles() {
    const prod = await Axios.post('/dbo/toolkit/get_list_of_profiles')
    setProfiles(prod.data.p_cursor)
  }


  useEffect(() => {
    getProfiles();
  }, [])


  return (
    <GridContainer>
      <GridItem item xs={12} sm={12} md={3} lg={3}>
         <UsersSearch
          onSubmit={onSubmit}
          dataForm={objForm}
          index={index}
          profiles={profiles}
        />
      </GridItem>
       <GridItem item xs={12} sm={12} md={9} lg={9}>
         <UsersTable
          usersList={usersList}
          isLoading = {isLoading}
          profiles= {profiles}
          handleSearchUsers={handleSearchUsers}
          handleShowButton={handleShowButton}
          showButton={showButton}
          handleChecboxArray= {handleChecboxArray}
          checkboxArray={checkboxArray}
          handleCheckedAll={handleCheckedAll}
          checkedAll={checkedAll}          
        /> 
      </GridItem>  
    </GridContainer>
  )
}
