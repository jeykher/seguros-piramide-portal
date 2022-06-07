import { useEffect, useState } from "react"
import Axios from "axios"

export  function useIpClient() {
  const [ip,setIp]=useState(null)
  async function getIp(){
    const { data } = await Axios.get(`https://api.ipify.org/?format=json`)
    setIp(data.ip)
  }
  useEffect(() => {
    getIp();
  })

  return ip

}