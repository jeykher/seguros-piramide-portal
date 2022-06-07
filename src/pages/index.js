import React, {useEffect, useState} from "react"
import PresentationPage from 'LandingPageMaterial/Views/PresentationPage/PresentationPage'
import { initAxiosInterceptors } from 'utils/axiosConfig'
import { useDialog } from 'context/DialogContext'
import { useLoading } from 'context/LoadingContext'

export default function IndexMaterial () {
  const loading = useLoading()
  const dialog = useDialog()
  const [ready,setReady] = useState(false) 


  useEffect(() => {
  	initAxiosInterceptors(dialog,loading)
    setReady(true);
  },[])

  return (
  	<>
    {
    	ready && <PresentationPage/>   
    }
    </>
  )
}