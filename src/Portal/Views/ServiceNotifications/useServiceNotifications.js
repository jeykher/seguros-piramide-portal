import Axios from "axios"

const useServiceNotifications = ()=> {
    // Method to get all service from dashboard
    const getDashboardService = async (masterID) => {
        try {
            const params = {P_MASTER_DASHBOARD_ID: masterID}
            const response = await Axios.post('/dbo/security/dashboards_to_json', params)
            return response.data.result
        }
        catch(error) {
            console.log(error)
        }
    }
    // Method to get all service type for scale
    const getPlacesAttention = async (service_type) => {
        try {
            let params = {
                p_service_type_for_scales_val: service_type
            }
            let response = await Axios.post('/dbo/health_claims/get_health_providers_list', params)
            return response.data.p_health_providers_list
        }
        catch(error) {
            console.log(error)
        }
    }
    // Returning hook properties & methods 
    return {
        getDashboardService,
        getPlacesAttention
    }
};

export default useServiceNotifications