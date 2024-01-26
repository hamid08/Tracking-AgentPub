import redisConnection from "./connection";


export default function TrackingDataRepositoryRedis() {

  if (!redisConnection.connection)
    redisConnection.connect();
  const redisClient = redisConnection.connection;

  async function checkTracker(imei: any) {
    try {
      const trackerInfoRedis = await redisClient.hGetAll(`Tracker_${imei}`);
      if (trackerInfoRedis == null || trackerInfoRedis == undefined || trackerInfoRedis.data == null || trackerInfoRedis.data == '') {
        console.log(`Not Found Tracker_${imei} In Redis`)
        return false;
      }

      return true;

    }
    catch (err) {
      console.log(`Not Found Tracker_${imei} In Redis`)
      return false;
    }

  };




  return {
    checkTracker
  }
}
