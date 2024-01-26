import dotenv from 'dotenv';
dotenv.config()


export default {
  port: process.env.PORT || 3000,
  mongo: {
    uri: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/tracking-data-handler'
  },
  redis: {
    uri: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  rabbit: {
    uri: process.env.RABBITMQ_URL || 'amqp://localhost',
    tracking_agent_trackingData: 'Tracking.Agent.TrackingData',
    tracking_agent_devices:'Tracking.Agent.Devices',
    tracking_agent_mangementData:'Tracking.Agent.ManagementData',
    tracking_service_syncManagementRequest:'TrackingService.ManagementDataRequest',
    trackng_service_sendDevices:'TrackingService.Devices',

  },
  otlp: {
    uri: process.env.OTLP_URL || 'http://127.0.0.1:4318'
  },
  socket: {
    auth_token: process.env.SOCKET_AUTH_TOKEN || 'wXpUSXnlp42JbFsnXN4lGWn6yGCBw8sV',
    uri:process.env.TRACKING_DATA_HANDLER_ADDRESS || 'http://localhost:8383',
  },
  common:{
    customerId:process.env.CUSTOMERID || '0000',
    tracking_managemen_address:process.env.TRACKING_MANAGEMENT_ADDRESS || 'http://localhost:5326/api/SyncData'

  }
};
