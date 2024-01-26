import trackingDataRepositoryRedis from '../../frameworks/database/redis/trackingDataRepositoryRedis';
import mqConnection from '../../frameworks/services/rabbitMQ/connection';
import generator from '../utils/generator';
import config from '../../config/config';


function convertTrackingDataToOld(locations: any) {
    var customerTerminalNo = '';

    var trackingRequestData: any = [];

    locations.forEach((element: any) => {
        customerTerminalNo = element.customerTerminalNo;

        trackingRequestData.push({
            Id: generator().generateObjectId(),
            IMEI: element.imei,
            TerminalNo: element.deviceTerminalNo,
            IdentifyNo: element.deviceIdentity,
            TrakingData: [
                {
                    IMEI: element.imei,
                    Time: element.trafficDate,
                    Milliseconds: null,
                    Latitude: element.latitude,
                    Longitude: element.longitude,
                    Altitude: element.altitude,
                    Speed: element.speed,
                    Angle: element.angle,
                    SatelliteCount: element.satelliteCount,
                    Priority: 0,
                    TerminalNo: element.deviceTerminalNo,
                    IdentifyNo: element.deviceIdentity,
                    Metadata: element.metaData
                }

            ]
        });
    });

    var webAPI_Tracking_Request = {
        TerminalNo: customerTerminalNo,
        Data: trackingRequestData
    }

    return webAPI_Tracking_Request;
}

export default function socketService() {

    const _redisRepository = trackingDataRepositoryRedis();

    async function handelTrackingData(data: any) {

        let acceptList: Array<string> = [];
        let rejectList: Array<string> = [];
        let defaultResult: object = { acceptList, rejectList };

        //Check Is Not Null Locations
        if (data == null || data.locations.length < 1) return defaultResult;

        //CheckIMEI For Save
        var trackerInfo = await _redisRepository.checkTracker(data.latestLocation.imei);
        if (!trackerInfo) return defaultResult;

        // just send to rabbitMq
        mqConnection.sendToQueue(config.rabbit.tracking_agent_trackingData,convertTrackingDataToOld(data.locations));

        acceptList = data.locations.filter((location: any) => location.hasOwnProperty('code'))
            .map((location: any) => location.code);
 
        return { acceptList, rejectList }; 
    } 

    return {
        handelTrackingData 
    }
} 