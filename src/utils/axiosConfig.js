import Axios from "axios"
import { getToken, deleteToken } from "./auth"

export function initAxiosInterceptors(dialog, loading) {
  const token = getToken()
  Axios.defaults.baseURL = `${process.env.GATSBY_API_URL}/asg-api/`
  Axios.defaults.headers.common["Authorization"] = `bearer ${token}`

  Axios.interceptors.request.use(function (config) {
    loading(true)
    return config
  })

  Axios.interceptors.response.use(
    function (response) {
      loading(false)
      return response
    },
    function (error) {
      loading(false)
      console.log("error")
      console.log(error)
      if (error.response.status === 401) {
        deleteToken()
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Alerta",
          description: error.response.data,
          onSubmit: () => (window.location = "/login"),
        })
        return Promise.reject(error)
      } else if (error.response.status === 504) {
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Alerta",
          description:
            "Ocurrió un problema al momento de procesar su transacción por favor intente nuevamente o refresque su navegador.",
        })
      } else if (error.response.status === 502) {
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Alerta",
          description: "Ocurrió un problema con la conexión por favor refresque su navegador."
        })

      } else if (error.response.status === 413) {
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Alerta",
          description: "El archivo que intenta subir supera el tamaño máximo permitido.",
        })
      } else {
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Alerta",
          description: error.response.data,
        })
        return Promise.reject(error)
      }
    }
  )
}
