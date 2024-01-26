import axios from 'axios';
import config from '../../config/config';
import httpsAgent from '../../config/axiosConfig';

export default function rabbitService() {
    const axiosInstance = axios.create({
        httpsAgent
    });

    async function getManagementData() {
        var data: any = { CustomerId: config.common.customerId };

        let result = null; 

        await axiosInstance.post(`${config.common.tracking_managemen_address}/SyncManagementData`,data)
            .then(response => {
                result = response.data;
            })
            .catch(error => {
                console.error(`Error: Cannot Connect To ManagementAddress! : ${config.common.tracking_managemen_address}/SyncManagementData`,
                error.message);
            });

        return result;
    }

    async function getModifierDevices(data: any) {
        let result = null;

        await axiosInstance.post(`${config.common.tracking_managemen_address}/ReceiveDevices`, data)
            .then(async response => {
                result = response.data;
            })
            .catch(error => {
                console.error(`Error: Cannot Connect To ManagementAddress!: ${config.common.tracking_managemen_address}/ReceiveDevices`,
                error.message);
            });

        return result;
    }



    return {
        getManagementData,
        getModifierDevices
    }
}
